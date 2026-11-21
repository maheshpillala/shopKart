# shopKart — Product Catalogue MVP

A full-stack product catalogue built with React + Express, powered by the [Fake Store API](https://fakestoreapi.com).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, React Router v6, TanStack Query, Tailwind CSS |
| Backend | Node.js, Express, TypeScript, Zod |
| Data | Fake Store API (proxied through backend) |
| Testing | Vitest, React Testing Library, Supertest, MSW |
| Dev infra | Docker + Docker Compose |

## Features

- 🏠 Home page with exactly **5 featured products**
- 🗂️ **Category navigation** and category product listing
- 🔍 **Search** products by title or description
- 📦 **Product detail** page with full information
- 📬 **Enquiry form** with client + server validation
- ✅ **Thank-you** confirmation page
- 📧 Email provider abstraction (console adapter for MVP)

## Quick Start

### Option A — Docker Compose (recommended)

```bash
docker compose up
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api/health

### Option B — Run locally

**Backend:**
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**Frontend (new terminal):**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Running Tests

**Backend:**
```bash
cd backend
npm test
# with coverage:
npm run test:coverage
```

**Frontend:**
```bash
cd frontend
npm test
# with coverage:
npm run test:coverage
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/products/featured` | 5 featured products |
| `GET` | `/api/products` | All products (optional `?q=` search) |
| `GET` | `/api/products/:id` | Single product |
| `GET` | `/api/categories` | All categories |
| `GET` | `/api/categories/:name/products` | Products in category |
| `POST` | `/api/enquiries` | Submit enquiry |

## Project Structure

```
shopKart/
├── backend/          Express API + services + tests
├── frontend/         React SPA + components + tests
├── docker-compose.yml
├── IMPLEMENTATION_PLAN.md
└── DECISIONS.md      Architecture decision records
```

## Architecture Highlights

- **Frontend never calls Fake Store directly** — all data flows through Express
- **IProductProvider interface** — swap data source without touching routes or services
- **IEmailSender interface** — plug in Nodemailer / AWS SES via one env variable
- **Thin route handlers** — all business logic lives in the service layer
- **Zod validation** — request bodies and env vars validated at runtime

## Environment Variables

### Backend (`backend/.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port |
| `FAKE_STORE_BASE_URL` | `https://fakestoreapi.com` | Data source |
| `EMAIL_PROVIDER` | `console` | Email adapter (`console`) |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |

### Frontend (`frontend/.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `""` | API base URL (empty = same origin via Vite proxy) |
