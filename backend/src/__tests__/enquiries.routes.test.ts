import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { IEmailSender } from '../email/email.sender';

const mockEmailSender: IEmailSender = {
  send: async () => {},
};

const app = createApp({ emailSender: mockEmailSender });

describe('POST /api/enquiries', () => {
  it('returns 201 with id and submittedAt for valid body', async () => {
    const res = await request(app).post('/api/enquiries').send({
      productId: 1,
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Is this product available in blue?',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toMatch(/^enq_/);
    expect(res.body.data.submittedAt).toBeDefined();
  });

  it('returns 422 for invalid email', async () => {
    const res = await request(app).post('/api/enquiries').send({
      productId: 1,
      name: 'Jane Doe',
      email: 'not-an-email',
      message: 'Is this product available in blue?',
    });
    expect(res.status).toBe(422);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email' }),
      ])
    );
  });

  it('returns 422 for missing name (too short)', async () => {
    const res = await request(app).post('/api/enquiries').send({
      productId: 1,
      name: 'J',
      email: 'jane@example.com',
      message: 'Is this product available in blue?',
    });
    expect(res.status).toBe(422);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'name' }),
      ])
    );
  });

  it('returns 422 when name is missing entirely', async () => {
    const res = await request(app).post('/api/enquiries').send({
      productId: 1,
      email: 'jane@example.com',
      message: 'Is this product available in blue?',
    });
    expect(res.status).toBe(422);
    expect(res.body.error).toBe('Validation failed');
  });
});
