# Architecture Decision Records (ADRs)

> Companion to `IMPLEMENTATION_PLAN.md`.  
> Each ADR captures the context, decision, and consequences so future contributors understand *why* choices were made, not just what they are.

---

## ADR-001 · Frontend never calls Fake Store API directly

**Status:** Accepted

**Context:**  
The assignment explicitly requires the frontend to be decoupled from the data source. The Fake Store API is a third-party service that could be swapped for a real database or internal catalogue service later.

**Decision:**  
All Fake Store API calls are made exclusively from the Express backend. The frontend talks only to `/api/*` on the Express server.

**Consequences:**
- ✅ The data source can be replaced without touching frontend code.
- ✅ API keys or credentials (if added later) stay server-side only.
- ✅ Server-side filtering, shaping, and business rules are centralised.
- ⚠️ Adds an extra network hop in development; negligible in practice.

---

## ADR-002 · Product Provider / Adapter Pattern

**Status:** Accepted

**Context:**  
Business logic must not be tied to Fake Store API specifics (URL, response shape, pagination). The service layer should work identically regardless of where products come from.

**Decision:**  
Define an `IProductProvider` TypeScript interface:

```typescript
interface IProductProvider {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
  getCategories(): Promise<string[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
}
```

`FakeStoreProvider` implements this interface. Services receive the provider via constructor injection.

**Consequences:**
- ✅ Services are testable with a simple stub object — no HTTP mocking needed.
- ✅ Swapping to a real DB requires implementing the interface only.
- ✅ Multiple providers (e.g., internal + Fake Store) can coexist during migration.
- ⚠️ Slight boilerplate; acceptable for the value delivered.

---

## ADR-003 · Email Sender Abstraction

**Status:** Accepted

**Context:**  
The assignment requires an email-provider abstraction to support future email integration. No real email sending is needed for the MVP.

**Decision:**  
Define an `IEmailSender` interface:

```typescript
interface IEmailSender {
  send(options: EmailOptions): Promise<void>;
}
```

`ConsoleEmailSender` implements it by logging to stdout. The active sender is selected via `EMAIL_PROVIDER` environment variable in a factory function.

**Consequences:**
- ✅ Demonstrates architectural thinking without requiring a real mail server.
- ✅ Switching to Nodemailer, AWS SES, or SendGrid requires only a new class + env change.
- ✅ No secrets needed in the demo environment.

---

## ADR-004 · Thin Route Handlers — Service Layer Pattern

**Status:** Accepted

**Context:**  
Express route handlers can quickly accumulate business logic, making routes hard to test and logic hard to reuse.

**Decision:**  
Route handlers do exactly three things:
1. Parse and validate the request (Zod).
2. Call the appropriate service method.
3. Return the response (or forward to error middleware).

All business logic (featured product selection, search filtering, enquiry dispatch) lives in the service layer.

**Consequences:**
- ✅ Services are independently unit-testable without an HTTP server.
- ✅ Logic is reusable across routes (e.g., a future WebSocket or CLI interface).
- ✅ Route handlers are small and readable.

---

## ADR-005 · Server-Side Search (String Filter)

**Status:** Accepted

**Context:**  
Fake Store API does not expose a search endpoint. The assignment requires search by matching text.

**Decision:**  
`ProductService.search(query)` fetches all products from the provider and filters them server-side using a case-insensitive `includes` check on `title` and `description`.

**Consequences:**
- ✅ Works without any additional infrastructure.
- ✅ Search logic is isolated in one method and easily unit-tested.
- ⚠️ Not scalable to large catalogues (full scan on every request).
- ✅ Acceptable because Fake Store has ~20 products and the architecture note in ADR-002 shows how to swap to a real search engine later.

**Future evolution:**  
Replace the filter with an `ISearchProvider` that delegates to Elasticsearch or Postgres full-text search, keeping `ProductService` interface unchanged.

---

## ADR-006 · Featured Products = First Five

**Status:** Accepted

**Context:**  
The home page must show exactly five featured products. No curation mechanism exists in Fake Store API.

**Decision:**  
`ProductService.getFeatured()` calls `getAllProducts()` and returns `products.slice(0, 5)`. The backend enforces the count — the frontend always receives exactly five items or an error.

**Consequences:**
- ✅ Deterministic and fast.
- ✅ Count enforcement is in one testable method.
- ⚠️ Not semantically "featured" — products are arbitrary.
- ✅ A `FEATURED_PRODUCT_IDS` env variable or database table can replace this later without any route/frontend changes.

---

## ADR-007 · TanStack Query for Frontend State

**Status:** Accepted

**Context:**  
The frontend needs to fetch, cache, and display server data across multiple pages. Options considered: `useEffect + useState`, Redux Toolkit Query, SWR, TanStack Query.

**Decision:**  
Use TanStack Query (React Query v5).

**Rationale:**
- Purpose-built for async server state.
- Built-in loading, error, and stale states eliminate boilerplate.
- Automatic background refetching keeps UI fresh.
- Declarative query key invalidation is simpler than Redux reducers for read-heavy UIs.
- No global store setup needed — `QueryClient` is minimal.

**Consequences:**
- ✅ Pages are concise — logic lives in custom hooks.
- ✅ Caching reduces calls to backend during navigation.
- ✅ `staleTime: 5 * 60 * 1000` avoids redundant fetches for category lists.
- ⚠️ Teams unfamiliar with TanStack Query have a small learning curve.

---

## ADR-008 · Zod for Validation (Backend and Config)

**Status:** Accepted

**Context:**  
Input validation and config loading need runtime type safety. Options: Joi, Yup, Zod.

**Decision:**  
Use Zod for:
- Request body validation in route handlers.
- Environment variable validation in `config.ts`.
- Type inference (`z.infer<typeof schema>`) to keep types DRY.

**Rationale:**  
Zod is TypeScript-first — inferred types are always in sync with schemas. It has no runtime dependencies and excellent error messages out of the box.

**Consequences:**
- ✅ Shared source of truth for shape and type.
- ✅ 422 responses include structured field-level errors.
- ✅ Invalid environment variables fail fast at startup.
- ⚠️ Slightly heavier than a manual validation approach; acceptable.

---

## ADR-009 · No Database for MVP

**Status:** Accepted

**Context:**  
Enquiries need to be processed but not persisted. Adding a database (PostgreSQL, SQLite) requires extra Docker services, migrations, and setup time.

**Decision:**  
Enquiries are validated, passed to `IEmailSender.send()`, and acknowledged. No persistence layer. The 2–3 hour time-box does not warrant a database.

**Consequences:**
- ✅ Significantly reduces setup complexity.
- ✅ Keeps docker-compose minimal (frontend + backend only).
- ⚠️ Enquiries are lost after process restart.
- ✅ Adding persistence later = implement a `EnquiryRepository`, inject it into `EnquiryService` — no route changes.

---

## ADR-010 · Docker Compose for Local Development

**Status:** Accepted

**Context:**  
The assignment requires Docker as a dependency. Teams should be able to run the full stack with one command.

**Decision:**  
`docker-compose.yml` defines two services:
- `backend` — Node 20 Alpine, listens on port `4000`
- `frontend` — Node 20 Alpine, Vite dev server on port `5173`

Both mount source directories as volumes so hot-reload works inside containers.

**Consequences:**
- ✅ `docker compose up` starts the full stack.
- ✅ No dependency on locally-installed Node version.
- ⚠️ Volume mounts on macOS can be slower than native; `delegated` mount mode mitigates this.

---

## ADR-011 · MSW for Frontend Test Mocking

**Status:** Accepted

**Context:**  
Frontend tests need to simulate API responses without spinning up the Express server. Options: `vi.mock` on the fetch client, MSW, Axios mock adapter.

**Decision:**  
Use Mock Service Worker (MSW) in browser-intercept mode (via `msw/node` for Vitest + jsdom).

**Rationale:**
- Intercepts at the network level — components use real `fetch` calls, making tests more faithful.
- Handlers are reusable between test files.
- Easy to simulate error states (network errors, 404s, 422s).

**Consequences:**
- ✅ Tests exercise the full component → hook → fetch → parse chain.
- ✅ One handler definition serves multiple test files.
- ⚠️ Slightly more setup than `vi.mock`; pays off in test realism.

---

## ADR-012 · Typed API Contracts (No Code Generation)

**Status:** Accepted

**Context:**  
Frontend and backend need to agree on response shapes. Options: OpenAPI + code generation, tRPC, manual shared types, GraphQL.

**Decision:**  
Manually define TypeScript interfaces in `frontend/src/types/api.types.ts` that mirror the Zod-inferred backend types. No code generation tooling is added.

**Rationale:**  
The API surface is small (7 endpoints, 2–3 types). Code generation setup (OpenAPI spec, generators) would consume more time than it saves within the 2–3 hour time-box.

**Future evolution:**  
- Extract shared types into a `packages/shared` workspace package.
- Or adopt tRPC / OpenAPI generation once the API surface grows.

**Consequences:**
- ✅ Zero tooling overhead.
- ⚠️ Frontend and backend types can drift if not kept in sync manually.
- ✅ Acceptable risk given the small surface area and time-box constraint.

---

## ADR-013 · Enquiry Form Validation Strategy

**Status:** Accepted

**Context:**  
The enquiry form needs validation. Options: browser-native HTML5, controlled React state, React Hook Form, Formik + Yup.

**Decision:**  
Use controlled React component state with manual validation for the MVP. No form library is added.

**Rationale:**  
The form has four fields (name, email, message, hidden productId). A form library adds a dependency and learning surface not warranted at this scale.

**Future evolution:**  
Adopt React Hook Form + Zod resolver when forms grow in complexity.

**Consequences:**
- ✅ No extra dependency.
- ✅ Full control over validation messages and UX.
- ⚠️ More verbose than a form library for large forms.
- ✅ Acceptable for 4 fields.

---

## Summary Table

| ADR | Decision | Key benefit |
|-----|----------|-------------|
| 001 | Backend proxies Fake Store | Frontend decoupled from data source |
| 002 | IProductProvider interface | Swap data source with no service changes |
| 003 | IEmailSender interface | Real email = new class + env change only |
| 004 | Thin route handlers | Business logic is testable in isolation |
| 005 | Server-side string search | No extra infrastructure; scalable via interface |
| 006 | slice(0,5) for featured | Deterministic; replaceable via config |
| 007 | TanStack Query | Declarative caching, loading, error states |
| 008 | Zod validation | DRY types; structured error responses |
| 009 | No database | Keeps MVP scope and time-box in check |
| 010 | Docker Compose | One-command local stack |
| 011 | MSW for frontend tests | Tests exercise real fetch path |
| 012 | Manual shared types | Zero tooling overhead for small API surface |
| 013 | Controlled form state | No form library needed for 4 fields |

---

*Document version 1.0 — ready for review.*
