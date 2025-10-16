from pathlib import Path

content = """# 14-Day MVP Build Plan (Frontend / Backend / Database)

## Day 1 — Repos, environments, and contracts

**Frontend**
- Create React app skeleton with Router; routes: `/login`, `/`, `/claims`, `/claims/:claimNumber`.
- App shell: header placeholder (product name), route scaffolds.

**Backend**
- Spring Boot skeleton; modules: `api`, `domain`, `infra`.
- Add Spring Web + Validation; create empty controllers for `/api/auth`, `/api/dashboard`, `/api/claims`.

**Database**
- Dockerized Postgres; create `docker-compose.yml`.
- Add Flyway/Liquibase; create baseline migration (schema version table only).

**Outcome / DoD**
- `docker compose up` starts Postgres; both apps run locally; FE can call a placeholder `GET /api/health` (200).

---

## Day 2 — OIDC plumbing (no local passwords)

**Frontend**
- Integrate OIDC client (e.g., `oidc-client-ts`): “Continue with Google” button.
- Guarded routes; auth callback handling; sign-out clears session.

**Backend**
- Configure **OAuth2 Resource Server** (JWT) with issuer/JWKs; 401 for missing/invalid token.
- Add `/api/health` (permitAll).

**Database**
- None.

**Outcome / DoD**
- Unauthed hits to `/api/*` → 401. Clicking “Continue with Google” completes code flow and FE stores tokens; protected routes load only when authenticated.

---

## Day 3 — Domain schema + seed data

**Frontend**
- None (prepare mock DTO types for compile-time).

**Backend**
- Implement entities + JPA repos for: **User, Member, Plan, Enrollment, Accumulator, Provider, Claim, ClaimLine, ClaimStatusEvent** (DTOs separate from entities).
- Add `AuthMappingService`: map `iss/sub/email` → `User` on first request; link to a seeded `Member`.

**Database**
- Migration V1: tables for entities above; enums for `AccumulatorType`, `NetworkTier`, `ClaimStatus`.
- Migration V2 seed:
  - 1 user→member, 1 plan, 1 enrollment (active period), **in-network** accumulators, 2–3 providers,
  - 8–15 claims with lines + status history.

**Outcome / DoD**
- Hitting `/api/auth/me` (authed) returns current user + basic member info from DB mapping.

---

## Day 4 — Dashboard API

**Frontend**
- Define `DashboardResponse` type (plan, accumulators in-network, last 5 claims).

**Backend**
- Service + controller for `GET /api/dashboard`:
  - Active plan + coverage, **Deductible**/**OOP Max** (in-network) from accumulators,
  - Recent 5 claims (id/number, status, memberResponsibility, provider, dates).
- Enforce member scoping in service/repo.

**Database**
- Indexes: `claims(received_date desc)`, `claims(member_id)`.

**Outcome / DoD**
- Swagger/OpenAPI shows the response schema + example; sample call returns seeded values.

---

## Day 5 — Dashboard UI

**Frontend**
- Build Dashboard: **Plan card**, two progress bars (used/limit) for Deductible & OOP Max, **Recent Claims** (5) with link to detail; **View All Claims** CTA.
- Loading skeletons + error toasts; date/currency formatting.

**Backend**
- Add ETag/Cache-Control (optional) for `/api/dashboard`.

**Database**
- None.

**Outcome / DoD**
- Signed-in user loads Dashboard end-to-end with live API; clicking a recent claim routes to detail.

---

## Day 6 — Claims List API (filters + paging)

**Frontend**
- Define list DTO + filter model (status[], startDate, endDate, provider text, claimNumber exact, page, size).

**Backend**
- Implement `GET /api/claims?status=&startDate=&endDate=&provider=&claimNumber=&page=&size=`:
  - Multi-status (OR), date range, `provider ILIKE`, exact claim #, **server-side pagination** (default 10, max 25).
- Repository specs/criteria queries; validate params; return page metadata.

**Database**
- Indexes: `claims(status)`, `claims(service_start_date)`, `claims(provider_id)`, `claims(claim_number unique)`.

**Outcome / DoD**
- Curl tests confirm filters combine correctly; empty results return empty page with total=0.

---

## Day 7 — Claims List UI

**Frontend**
- Data grid with columns: Claim #, Service Dates, Provider, Status, **Member Responsibility**.
- Filter bar: multi-select status, date range, provider search, claim #; **URL-synced state**; pagination controls.

**Backend**
- 400 on invalid query params; integration test for a combined filter (e.g., Status=Processed + date window).

**Database**
- None.

**Outcome / DoD**
- From Dashboard, **View All Claims** opens list with server data; filters/pagination behave and persist via URL.

---

## Day 8 — Claim Detail API (totals + timeline)

**Frontend**
- Define `ClaimDetailResponse`: header, **status history timeline**, financial summary (billed/allowed/planPaid/memberResponsibility), lines table.

**Backend**
- `GET /api/claims/{claimNumber}`:
  - Join provider + lines + status events (ordered),
  - Validate: summary totals == sum(lines) in service layer; 404 if not found.

**Database**
- Index: `claim_status_events(claim_id, occurred_at)`.
- Check constraint examples (optional): money ≥ 0.

**Outcome / DoD**
- Example claim returns coherent totals; events in chronological order.

---

## Day 9 — Claim Detail UI

**Frontend**
- Layout: header block, **visual timeline**, summary card, line-items table (CPT, desc, billed, allowed, deductible/copay/coinsurance, plan paid, you owe).
- “Back to Claims” restores prior filters/page (via URL state).

**Backend**
- Add lightweight response caching (optional) for detail.

**Database**
- None.

**Outcome / DoD**
- Navigating from list → detail → back preserves state; numbers are correctly formatted; totals match sum of lines.

---

## Day 10 — Auth hardening & sign-out

**Frontend**
- Global 401/403 interceptor → re-auth flow; refresh token handling if available from IDP.
- Implement **Sign out** that clears tokens and hits IDP end-session (if supported).

**Backend**
- Add `/actuator/health`; request logging with correlation ID header passthrough.

**Database**
- None.

**Outcome / DoD**
- Full session lifecycle is smooth: sign-in, refresh (if enabled), sign-out → back to login; protected routes verify redirect.

---

## Day 11 — Packaging & local prod run

**Frontend**
- Production build; Nginx (or Vite preview) container; env-driven API base URL.

**Backend**
- Container image with runtime profile; externalize OIDC config and DB creds.

**Database**
- Ensure Flyway/Liquibase runs on start; provide `.env` for compose.

**Outcome / DoD**
- One-shot `docker compose up` brings **frontend + backend + postgres**; app works via http://localhost.

---

## Day 12 — Tests & QA sweep

**Frontend**
- React Testing Library:
  - Route guarding (redirect unauth),
  - Claims List filter + pagination,
  - Claim Detail rendering of totals & timeline.

**Backend**
- MVC tests for `/api/dashboard`, `/api/claims`, `/api/claims/{claimNumber}`;
- Repository tests for filter combinations.

**Database**
- Add a couple of “edge” rows in seeds (no matches; future dates) for test coverage.

**Outcome / DoD**
- All tests green; screenshots for acceptance doc.

---

## Day 13 — Docs & polish

**Frontend**
- Update README usage notes; link to OIDC setup, routes, and environment variables.

**Backend**
- Finalize OpenAPI with request/response schemas + examples.

**Database**
- “Data dictionary” section in README describing core tables and relationships.

**Outcome / DoD**
- New dev can configure OIDC (issuer, client, redirect URIs), run seeds, and sign in within minutes.

---

## Day 14 — Acceptance checks + buffer

**Frontend**
- Fix any UI nits (a11y labels, keyboard focus on route change, skeleton timings).

**Backend**
- HTTP caching headers on read endpoints (light); ensure pagination caps.

**Database**
- Verify indices are present; EXPLAIN on the heaviest list query.

**Outcome / DoD**
- Pass the spot-check acceptance tests listed in the spec (sign-in → dashboard; list filters; detail totals; redirect unauth).

---

## Notes on “connecting pieces”
- **Scope guardrails**: exactly **Login (OIDC), Dashboard, Claims List, Claim Detail**; keep payloads tight and list endpoints paginated.
- **Security model**: FE initiates OIDC; BE validates JWT; **map OIDC `sub` to User→Member** and enforce per-member reads.
- **Non-functional**: controller→service→repo layering; money as decimals; dates/times normalized; default page size 10, max 25; UTC in DB, localized in UI.
"""

path = Path("/mnt/data/14_Day_MVP_Build_Plan.md")
path.write_text(content)
path
