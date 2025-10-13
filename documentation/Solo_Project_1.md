
# Member Benefits Dashboard — **4‑Screen Assessment Spec (2‑Week Scope, Federated Auth)**

**Core tech stack:** React (frontend), Java + Spring Boot (backend), Postgres (database)  
**Authentication:** **Federated via OIDC** (e.g., **Google**) or another preferred IDP (Okta/Auth0/Azure AD). The app **does not manage passwords**; authentication is delegated to the IDP.

> **Goal:** Build a focused member portal with exactly **four screens**: **Login (Federated)**, **Dashboard**, **Claims List**, and **Claim Detail**.  
> Emphasis on clean data modeling, REST APIs, server‑side filtering/pagination, and a clear UI. Keep the code production‑style but right‑sized for a two‑week effort.

---

## 1) Domain Background (Healthcare Claims 101 — Short Primer)

### Core Concepts
- **Member:** Person enrolled in a health plan. May have dependents (out of scope for core).
- **Provider:** Clinic or clinician who renders care.
- **Plan:** The product the member is enrolled in (e.g., PPO/HMO) with cost‑share rules.
- **Claim:** A bill submitted by a provider; contains one or more **Claim Lines** (procedures/services).
- **EOB (Explanation of Benefits):** Statement explaining how the claim was adjudicated.
- **Accumulators:** Running totals of a member’s financial responsibility against plan limits (e.g., **Deductible** and **Out‑of‑Pocket Maximum**).

### Simplified Processing Flow
1. Member receives care → provider submits claim.  
2. Claim is **adjudicated** against plan rules: allowed amount is calculated; cost shares (copay, coinsurance, deductible) are applied.  
3. Claim reaches a status (e.g., **Submitted → In Review → Processed → Paid/Denied**).  
4. Member responsibility and accumulators update; an EOB may be generated.

### Why build a new dashboard?
**Legacy pain** (what the hypothetical client has today):
- Fragmented systems → inconsistent totals between pages.
- No robust filtering or sorting → members cannot find specific visits.
- Non‑responsive UI with accessibility gaps.
- Batched PDFs only (EOB) and little inline explanation of totals.

**New approach** (what you’ll build):
- Unified domain model (claims, lines, accumulators, provider, plan) serviced by simple REST APIs.
- Fast, filterable **Claims List** with server‑side pagination.
- Clear **Dashboard** with accumulator progress + recent claims.
- Modern, responsive UI with basic accessibility and proper error handling.
- **Federated auth (OIDC)** to offload identity & session security to a trusted provider.

---

## 2) Application Scope (Exactly 4 Screens)

- **S1:** Login (**Federated/OIDC**)  
- **S2:** Dashboard  
- **S3:** Claims List  
- **S4:** Claim Detail  

> **Global UI (not a separate screen):** App header with product name, member name, and **Sign out**; a simple top nav or breadcrumb to reach **Dashboard** and **Claims**.

---

## 3) Screen Specifications (User Story, Acceptance Criteria, ASCII Mockup)

### S1) Login (Federated/OIDC)
**User Story**  
As a member, I want to sign in with my organization/Google account so only I can view my claims.

**Acceptance Criteria**
- AC1: The login view provides a **“Continue with Google”** (or chosen IDP) action that starts the **OIDC Authorization Code Flow** (no email/password fields rendered by the app).  
- AC2: On successful IDP callback, the app stores the session/token and routes the user to **Dashboard**.  
- AC3: On authentication error, show a non‑blocking inline message and allow retry.  
- AC4: Protected routes redirect unauthenticated users to the **OIDC sign‑in**.  
- AC5: **Sign out** clears tokens and, if supported, calls the IDP **end‑session** endpoint, then returns to the login view.

**ASCII Mockup**
```
+-----------------------------------+
|  Member Benefits Dashboard        |
+-----------------------------------+
| [  Continue with Google  ]        |
|                                   |
| (Error: Authentication failed)    |
+-----------------------------------+
```

---

### S2) Dashboard
**User Story**  
As a member, I want to see my plan and accumulators with recent claims so I can understand my status at a glance.

**Acceptance Criteria**
- AC1: Show **active plan** (name, network) and **coverage period**.
- AC2: Show **Deductible** and **OOP Max** progress (used vs. limit) for in‑network.
- AC3: Show **Recent Claims** (latest 5) with status and member responsibility.
- AC4: Clicking a recent claim opens **Claim Detail**.
- AC5: **View All Claims** navigates to **Claims List**.

**ASCII Mockup**
```
+--------------------------------------------------------------------------------+
| Dashboard                               [ John Smith ]               (Sign out)|
+-------------------+--------------------------------+---------------------------+
| Active Plan       | Accumulators                   | Recent Claims             |
| • Gold PPO        | Deductible:  $300 / $1500      | #C-10421  Processed $45   |
| • Network: Prime  | OOP Max:    $1200 / $6000      | #C-10405  Denied   $0    |
| • Coverage 2025   | [=====-----]   [===-------]    | #C-10398  Paid     $120  |
|                                                   | #C-10375  In Review $—   |
|                                                   | #C-10312  Paid     $60   |
+-------------------+--------------------------------+---------------------------+
| [ View All Claims ]                                                            
+--------------------------------------------------------------------------------+
```

---

### S3) Claims List
**User Story**  
As a member, I want to filter and browse my claims so I can find the visit I’m looking for.

**Acceptance Criteria**
- AC1: Table columns: **Claim #**, **Service Dates**, **Provider**, **Status**, **Member Responsibility**.
- AC2: Filters: **Status** (multi‑select), **Date Range**, **Provider (text)**, **Claim # (exact)**.
- AC3: Default sort by **processed/received date (desc)**.
- AC4: **Server‑side pagination** (page size 10; selector 10/25).
- AC5: Clicking a row opens **Claim Detail**.
- AC6: Empty state when no matches are found.

**ASCII Mockup**
```
+--------------------------------------------------------------------------------+
| Claims                         [ John Smith ]                        (Sign out)|
+--------------------------------------------------------------------------------+
| Filters: [Status v] [ Date Range ▼ ] [Provider ____] [Claim # ____] (Search)  |
+--------------------------------------------------------------------------------+
| #C-10421 | 08/29–08/29 | River Clinic      | Processed | $45.00 | [View ▸]    |
| #C-10405 | 08/20–08/20 | City Imaging Ctr  | Denied    | $0.00  | [View ▸]    |
| #C-10398 | 08/09–08/09 | Prime Hospital    | Paid      | $120.00| [View ▸]    |
| ...                                                                            |
+--------------------------------------------------------------------------------+
| Page 1 of 5     [10 v] per page         ◂ Prev     1  2  3  ...   Next ▸      |
+--------------------------------------------------------------------------------+
```

---

### S4) Claim Detail
**User Story**  
As a member, I want to see a claim’s status and financial breakdown so I can understand what I owe and why.

**Acceptance Criteria**
- AC1: Header shows **Claim #**, **Status**, **Service Dates**, **Provider**.
- AC2: **Status timeline** shows key states with timestamps.
- AC3: **Financial summary**: Total Billed, Allowed, Plan Paid, Member Responsibility.
- AC4: **Line items**: CPT/description, billed, allowed, deductible, copay, coinsurance, plan paid, member responsibility.
- AC5: **Back** returns to **Claims List** and preserves filters/page (if feasible).
- AC6: (Stretch) **Download EOB** link (mock PDF) when available.

**ASCII Mockup**
```
+--------------------------------------------------------------------------------+
| Claim #C-10421     Provider: River Clinic       Service: 08/29–08/29           |
| Status: Processed   [Submitted]—[In Review]—[Processed]—[Paid]                  |
+--------------------------------------------------------------------------------+
| Financial Summary                                                               
| • Total Billed:          $300.00                                                
| • Allowed Amount:        $200.00                                                
| • Plan Paid:             $155.00                                                
| • Member Responsibility:  $45.00                                                
+--------------------------------------------------------------------------------+
| Line Items                                                                    |
| CPT   | Description               | Billed | Allowed | Ded | Copay | Coins | You|
| 99213 | Office Visit, Est Pt      | 150.00 | 100.00  | 0  | 25.00 | 10.00 |15  |
| 81002 | Urinalysis                | 150.00 | 100.00  | 0  | 0.00  | 10.00 |10  |
+--------------------------------------------------------------------------------+
| [ ← Back to Claims ]                           (Stretch) [ Download EOB PDF ]   |
+--------------------------------------------------------------------------------+
```

---

## 4) Data Model (Define as Java Classes — **No SQL in spec**)

> Implement with JPA/Hibernate (or similar). Monetary amounts as `BigDecimal`. Dates as `LocalDate`; timestamps as `OffsetDateTime`/`Instant`. Keep it minimal but complete for the 4 screens.

### Enums
```java
public enum ClaimStatus { SUBMITTED, IN_REVIEW, PROCESSED, PAID, DENIED }
public enum AccumulatorType { DEDUCTIBLE, OOP_MAX }
public enum NetworkTier { IN_NETWORK, OUT_OF_NETWORK }
public enum PlanType { HMO, PPO, EPO, HDHP }
```

### Core Entities

**User** (updated for federated auth; no password storage)
```java
class User {
  UUID id;
  String authProvider;     // e.g., "google", "okta"
  String authSub;          // OIDC subject ("sub"), unique per provider
  String email;            // from ID token
  OffsetDateTime createdAt;
  OffsetDateTime updatedAt;
}
```

**Member**
```java
class Member {
  UUID id;
  UUID userId;           // FK -> User
  String firstName;
  String lastName;
  LocalDate dateOfBirth;
  String email;          // optional profile display
  String phone;          // optional profile display
  Address mailingAddress; // optional embedded/owned
  List<Enrollment> enrollments; // one active for current plan year
}
```

**Address (Embeddable)**
```java
class Address {
  String line1;
  String line2;
  String city;
  String state;
  String postalCode;
}
```

**Plan**
```java
class Plan {
  UUID id;
  String name;         // e.g., "Gold PPO"
  PlanType type;       // PPO/HMO/...
  String networkName;  // e.g., "Prime"
  Integer planYear;    // e.g., 2025
}
```

**Enrollment**
```java
class Enrollment {
  UUID id;
  UUID memberId;
  UUID planId;
  LocalDate coverageStart;
  LocalDate coverageEnd;
  Boolean active;
  List<Accumulator> accumulators;
}
```

**Accumulator**
```java
class Accumulator {
  UUID id;
  UUID enrollmentId;
  AccumulatorType type;       // DEDUCTIBLE or OOP_MAX
  NetworkTier tier;           // IN_NETWORK/OUT_OF_NETWORK
  BigDecimal limitAmount;     // e.g., 1500.00
  BigDecimal usedAmount;      // e.g., 300.00
}
```

**Provider**
```java
class Provider {
  UUID id;
  String name;
  String specialty;
  Address address;
  String phone;
}
```

**Claim**
```java
class Claim {
  UUID id;
  String claimNumber;         // human-friendly key for UI
  UUID memberId;
  UUID providerId;
  LocalDate serviceStartDate;
  LocalDate serviceEndDate;
  LocalDate receivedDate;
  ClaimStatus status;
  BigDecimal totalBilled;
  BigDecimal totalAllowed;
  BigDecimal totalPlanPaid;
  BigDecimal totalMemberResponsibility;
  List<ClaimLine> lines;
  List<ClaimStatusEvent> statusHistory;
  OffsetDateTime updatedAt;
}
```

**ClaimLine**
```java
class ClaimLine {
  UUID id;
  UUID claimId;
  Integer lineNumber;         // 1..n
  String cptCode;             // e.g., "99213"
  String description;
  BigDecimal billedAmount;
  BigDecimal allowedAmount;
  BigDecimal deductibleApplied;
  BigDecimal copayApplied;
  BigDecimal coinsuranceApplied;
  BigDecimal planPaid;
  BigDecimal memberResponsibility;
}
```

**ClaimStatusEvent**
```java
class ClaimStatusEvent {
  UUID id;
  UUID claimId;
  ClaimStatus status;
  OffsetDateTime occurredAt;
  String note;                // optional
}
```

*(Stretch model — optional)*
```java
class Document {
  UUID id;
  String fileName;
  String mimeType;     // "application/pdf"
  String storagePath;  // e.g., "/static/eobs/C-10421.pdf"
  UUID memberId;
  UUID claimId;        // for EOB, nullable otherwise
  OffsetDateTime uploadedAt;
}
```

---

## 5) Minimal API Surface (Guidance)

> Keep payloads small and tailored to the screens. Use pagination on list endpoints.

- **Auth (Federated/OIDC)**
  - **No local login/logout endpoints.** Frontend initiates OIDC; backend is an **OAuth2 Resource Server** validating JWT access tokens (issuer, audience, JWKs).  
  - `GET /api/auth/me` → current user + member basic info (derived from token + DB mapping).

- **Dashboard**
  - `GET /api/dashboard` → active plan, accumulators (in‑network), recent claims (5)

- **Claims**
  - `GET /api/claims?status=&startDate=&endDate=&provider=&claimNumber=&page=&size=`
  - `GET /api/claims/{claimNumber}` → detail with lines + statusHistory
  - *(Stretch)* `GET /api/claims/{claimNumber}/eob` → PDF

---

## 6) Nice‑to‑Haves / Stretch Goals

- **Automated Tests**
  - Backend: JUnit + Spring Test for services/controllers/repos.
  - Frontend: React Testing Library for table filtering, routing, and detail view.

- **Dockerization**
  - Containerize **frontend**, **backend**, and **postgres**; provide `docker-compose.yml` for local run.

- **GraphQL Endpoint**
  - Add GraphQL with queries like `member(id)`, `claims(...)`, and `claim(claimNumber)`.
  - Swap **Dashboard** and **Claim Detail** data fetches to GraphQL while keeping REST for auth.

- **Performance & UX**
  - HTTP caching headers on read endpoints; skeleton loaders; optimistic UI for minor updates (if any).

- **Security (updated)**
  - Configure Spring Security **OAuth2 Resource Server** (JWT).  
  - Map **OIDC `sub`** (and provider) to your `User` and associated `Member`; enforce per‑member data access.  
  - No password storage or hashing in the app; identity is externalized to the IDP.

- **Accessibility**
  - Keyboard navigation, focus management on route change, aria‑labels and error associations.

- **Observability**
  - Health endpoint, basic request logging, correlation IDs.

---

## 7) Non‑Functional Expectations

- Clean layering (controller → service → repo), DTOs for API payloads.
- Seed script/migration for: one user/member (mapped by `authSub`), one plan/enrollment, accumulators, 8–15 claims (with lines), 2–3 providers.
- Pagination defaults: size **10**, max **25**.
- Time zones: store UTC; present in user’s local in UI.
- Formatting: currency two decimals; dates `MM/DD/YYYY`.

---

## 8) Deliverables

- **README** with setup/run instructions and **OIDC configuration** (issuer URL, client ID, redirect URI), plus directions for using Google or an alternative IDP.  
- **Frontend (React)** with the 4 screens above and routing.  
- **Backend (Spring Boot)** with minimal REST (and optional GraphQL).  
- **Postgres** schema via ORM/migrations; migration files checked in.  
- *(Optional)* Docker Compose to run everything locally.  
- Tests and/or screenshots of passing tests where implemented.

---

## 9) Acceptance Test Ideas (Spot‑Checks)

- **Sign in via IDP (e.g., Google)** → app lands on Dashboard; refresh preserves session.  
- Dashboard shows the expected accumulators and top 5 recent claims.  
- Claims List filter by **Status=Processed** + date range returns expected rows; pagination works.  
- Claim Detail totals equal the sum of line items; status timeline shows ordered history.  
- *(Stretch)* EOB download returns a PDF for that claim.  
- Unauthenticated users are redirected to IDP sign‑in from protected routes.

---

**End of 4‑Screen Spec (Federated Auth)**
