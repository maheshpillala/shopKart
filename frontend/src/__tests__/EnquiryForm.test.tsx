import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EnquiryForm } from '../components/forms/EnquiryForm'

function renderForm(productId = 1) {
  return render(
    <MemoryRouter>
      <EnquiryForm productId={productId} />
    </MemoryRouter>
  )
}

describe('EnquiryForm', () => {
  it('renders all form fields and submit button', () => {
    renderForm()
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send enquiry/i })).toBeInTheDocument()
  })

  it('shows validation errors when form is submitted empty', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: /send enquiry/i }))

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/valid email/i)).toBeInTheDocument()
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument()
    })
  })

  it('shows email validation error for invalid email', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText(/your name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email')
    await user.type(screen.getByLabelText(/message/i), 'This is a long enough message')
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument()
    })
  })

  it('clears field error when user starts typing', async () => {
    const user = userEvent.setup()
    renderForm()

    // Trigger validation
    await user.click(screen.getByRole('button', { name: /send enquiry/i }))
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
    })

    // Start typing in name field — error should clear
    await user.type(screen.getByLabelText(/your name/i), 'J')
    await waitFor(() => {
      expect(screen.queryByText(/name must be at least 2 characters/i)).not.toBeInTheDocument()
    })
  })
})
