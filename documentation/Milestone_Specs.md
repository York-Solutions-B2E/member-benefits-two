# 5-Day Member Benefits Dashboard Development Plan

## Project Overview
Build a healthcare member benefits dashboard with React frontend, Spring Boot backend, and PostgreSQL database. Focus on backend-first development with comprehensive testing and API documentation.

---

## Day 1: Project Setup, Database Schema & Core Domain Models
### Morning: Project Initialization (2-3 hours)
- [x] Create Spring Boot project with Maven/Gradle
- [x] Add dependencies:
  - Spring Web Starter
  - Spring Data JPA
  - Spring Security (OAuth2 Resource Server)
  - PostgreSQL Driver
  - Lombok
  - Validation
  - Springdoc OpenAPI (Swagger)
  - Flyway (database migrations)
- [x] Configure `application.yml` with:
  - Database connection settings
  - JPA/Hibernate configuration
  - Google OIDC configuration (issuer, audience)
  - Server port and context path
- [x] Set up project structure:
  ```
  src/main/java/com/memberbenefits/
  ├── config/
  ├── domain/
  ├── repository/
  ├── service/
  ├── controller/
  ├── dto/
  └── exception/
  ```

### Afternoon: Database Schema & Domain Models (3-4 hours)
- [x] Create JPA entities based on specification:
  - **Enums**: `ClaimStatus`, `AccumulatorType`, `NetworkTier`, `PlanType`
  - **Core entities**: `User`, `Member`, `Address` (embeddable), `Plan`, `Enrollment`, `Accumulator`, `Provider`, `Claim`, `ClaimLine`, `ClaimStatusEvent`
- [ ] Add JPA annotations, relationships, and indexes
- [ ] Create Flyway migration script (`V1__initial_schema.sql`)
- [ ] Write SQL seed script (`V2__seed_data.sql`) with test data:
  - 1 user (Google OIDC mapping)
  - 1 member with profile info
  - 1 active plan (Gold PPO)
  - 2-3 providers (River Clinic, City Imaging Center, Prime Hospital)
  - 12-15 claims with varying statuses
  - Claim lines with realistic CPT codes
  - Status history events
  - Accumulator data (deductible, OOP max)

### Evening: Repository Layer (2-3 hours)
- [ ] Create Spring Data JPA repositories for all entities
- [ ] Add custom query methods for Claims filtering:
  - Filter by status (multi-select)
  - Filter by date range
  - Filter by provider name (text search)
  - Filter by claim number (exact match)
- [ ] Add pagination support to ClaimsRepository
- [ ] Test database connectivity and seed data loading
- [ ] Verify all relationships work correctly

**Deliverable:** Working database schema with seed data, all JPA entities and repositories

---

## Day 2: Security Configuration & Core Business Services
### Morning: OAuth2 Security Setup (3-4 hours)
- [ ] Configure Spring Security OAuth2 Resource Server for Google OIDC JWT validation
- [ ] Implement JWT token validation:
  - Verify issuer (`https://accounts.google.com`)
  - Validate audience (client ID)
  - Configure JWKs endpoint for key rotation
- [ ] Create `SecurityConfig` with:
  - Protected endpoints configuration
  - CORS configuration for React frontend
  - Security matchers for public vs protected routes
- [ ] Implement user mapping:
  - Extract `sub` and `email` from JWT token
  - Map to `User` entity (create if not exists)
  - Link to `Member` entity
- [ ] Create `@CurrentUser` annotation and resolver for controller access

### Afternoon: Service Layer Implementation (3-4 hours)
- [ ] **AuthService**:
  - Handle user lookup/creation from OIDC token
  - Get current member information
  - Validate user permissions
- [ ] **DashboardService**:
  - Fetch active plan information
  - Get accumulator data (deductible, OOP max)
  - Retrieve recent 5 claims for dashboard
- [ ] **ClaimService**:
  - Get claims with server-side filtering
  - Implement pagination (default 10, max 25)
  - Get claim detail with lines and status history
  - Handle sorting by processed/received date (desc)
- [ ] **MemberService**:
  - Get member profile information
  - Get enrollment details
  - Validate member access to claims

### Evening: DTOs & Mapping (2-3 hours)
- [ ] Create response DTOs for all API endpoints:
  - `DashboardResponse`
  - `ClaimSummaryResponse`
  - `ClaimDetailResponse`
  - `AccumulatorResponse`
  - `UserResponse`
- [ ] Implement DTO mappers (manual mapping or MapStruct)
- [ ] Add validation annotations to DTOs
- [ ] Create custom exception classes:
  - `ResourceNotFoundException`
  - `UnauthorizedException`
  - `ValidationException`

**Deliverable:** Complete service layer with security, business logic, and DTOs

---

## Day 3: REST API Controllers & Swagger Documentation

### Morning: Controller Implementation (3-4 hours)
- [ ] **AuthController**:
  - `GET /api/auth/me` - Get current user and member info
- [ ] **DashboardController**:
  - `GET /api/dashboard` - Active plan, accumulators, recent claims
- [ ] **ClaimController**:
  - `GET /api/claims` - Paginated, filtered claims list
    - Query parameters: status, startDate, endDate, provider, claimNumber, page, size
  - `GET /api/claims/{claimNumber}` - Claim detail with lines and status history
- [ ] Add proper HTTP status codes and response headers
- [ ] Implement request validation with `@Valid`

### Afternoon: Error Handling & Validation (2-3 hours)
- [ ] Implement `@ControllerAdvice` for global exception handling
- [ ] Add proper HTTP status codes and error response format
- [ ] Create standardized error response structure:
  ```json
  {
    "timestamp": "2024-01-15T10:30:00Z",
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed",
    "path": "/api/claims",
    "details": [...]
  }
  ```
- [ ] Add field-level validation messages
- [ ] Handle security exceptions and unauthorized access

### Evening: Swagger/OpenAPI Configuration (2-3 hours)
- [ ] Configure Springdoc OpenAPI for Swagger UI
- [ ] Add API documentation annotations:
  - `@Operation` for endpoint descriptions
  - `@ApiResponse` for response documentation
  - `@Schema` for request/response models
- [ ] Configure OAuth2 security scheme in Swagger for JWT testing
- [ ] Document all request/response models and query parameters
- [ ] Test all endpoints via Swagger UI at `/swagger-ui.html`
- [ ] Create example JWT token for testing

**Deliverable:** Complete REST API with Swagger documentation and error handling

---

## Day 4: Automated Testing (Backend)

### Morning: Repository & Service Tests (3-4 hours)
- [ ] Set up test configuration:
  - H2 in-memory database for unit tests
  - Testcontainers PostgreSQL for integration tests
- [ ] **Repository Tests**:
  - Test custom query methods (filtering, pagination)
  - Test relationships and cascading operations
  - Test edge cases (empty results, invalid parameters)
- [ ] **Service Layer Tests**:
  - Mock repositories with Mockito
  - Test business logic and data transformation
  - Test filtering and pagination logic
  - Test edge cases and error scenarios
  - Test authentication and authorization logic

### Afternoon: Controller Integration Tests (3-4 hours)
- [ ] Use `@SpringBootTest` and `MockMvc` for integration tests
- [ ] **AuthController Tests**:
  - Test with mocked JWT authentication
  - Test unauthorized access scenarios
  - Test user creation from OIDC token
- [ ] **DashboardController Tests**:
  - Test response structure and data accuracy
  - Test with different member scenarios
- [ ] **ClaimController Tests**:
  - Test filtering with various parameter combinations
  - Test pagination functionality
  - Test claim detail retrieval
  - Test error responses and validation
- [ ] Verify HTTP status codes and response formats
- [ ] Test CORS configuration

### Evening: Test Coverage & Refinement (2-3 hours)
- [ ] Run test coverage report (JaCoCo)
- [ ] Aim for 70%+ coverage on service and controller layers
- [ ] Add missing test cases for edge scenarios
- [ ] Create test data builders for consistent test setup
- [ ] Document test setup and execution in README
- [ ] Set up CI/CD pipeline configuration (GitHub Actions)

**Deliverable:** Comprehensive test suite with good coverage

---

## Day 5: API Testing, Documentation & Frontend Prep

### Morning: Manual API Testing & Refinement (3-4 hours)
- [ ] Create Postman collection for all endpoints (alternative to Swagger)
- [ ] Test complete user flows:
  - Authentication flow with Google OIDC token
  - Dashboard data retrieval and accuracy
  - Claims filtering with various combinations
  - Claim detail with all related data
- [ ] Verify response times and query optimization
- [ ] Add database indexes if needed for performance
- [ ] Test pagination with larger datasets
- [ ] Validate error handling scenarios

### Afternoon: Additional Seed Data & Scenarios (2-3 hours)
- [ ] Enhance SQL seed script with diverse test scenarios:
  - Claims in all statuses (Submitted, In Review, Processed, Paid, Denied)
  - Various date ranges spanning multiple months
  - Different providers and specialties
  - Edge cases (denied claims, zero responsibility, high amounts)
  - Multiple claim lines per claim
- [ ] Create optional admin endpoints for programmatic data creation
- [ ] Test pagination with 50+ claims
- [ ] Verify accumulator calculations are correct

### Evening: Documentation & Frontend Integration Prep (3-4 hours)
- [ ] Complete comprehensive README with:
  - Project overview and tech stack
  - Prerequisites (Java 17, PostgreSQL 13+, Maven/Gradle)
  - Setup instructions step-by-step
  - Google OIDC configuration steps
  - Database migration and seeding instructions
  - Running the application
  - Running tests
  - API documentation link (Swagger)
- [ ] Document API contracts for frontend team:
  - Request/response schemas
  - Authentication requirements
  - Error handling patterns
  - CORS configuration
- [ ] Create environment variables documentation
- [ ] Prepare CORS configuration for React frontend
- [ ] Document deployment considerations

**Deliverable:** Production-ready backend with complete documentation, ready for frontend integration

---

## Key Files to Create

### Configuration Files
- `pom.xml` or `build.gradle` - Maven/Gradle dependencies
- `src/main/resources/application.yml` - Application configuration
- `src/main/resources/db/migration/V1__initial_schema.sql` - Database schema
- `src/main/resources/db/migration/V2__seed_data.sql` - Test data
- `src/main/java/com/memberbenefits/config/SecurityConfig.java` - OAuth2 security
- `src/main/java/com/memberbenefits/config/OpenApiConfig.java` - Swagger configuration

### Domain Layer
- `src/main/java/com/memberbenefits/domain/enums/` - All enums
- `src/main/java/com/memberbenefits/domain/entity/` - All JPA entities
- `src/main/java/com/memberbenefits/domain/embeddable/Address.java` - Embeddable address

### Repository Layer
- `src/main/java/com/memberbenefits/repository/` - Spring Data JPA repositories

### Service Layer
- `src/main/java/com/memberbenefits/service/` - Business logic services
- `src/main/java/com/memberbenefits/dto/` - Request/Response DTOs
- `src/main/java/com/memberbenefits/mapper/` - DTO mappers

### Controller Layer
- `src/main/java/com/memberbenefits/controller/` - REST controllers
- `src/main/java/com/memberbenefits/exception/` - Exception handling
- `src/main/java/com/memberbenefits/security/` - Security utilities

### Testing
- `src/test/java/com/memberbenefits/repository/` - Repository tests
- `src/test/java/com/memberbenefits/service/` - Service tests
- `src/test/java/com/memberbenefits/controller/` - Controller integration tests
- `src/test/resources/` - Test configuration and data

---

## Testing Strategy

### Unit Tests (JUnit 5 + Mockito)
- **Service Layer**: Mock repositories, test business logic
- **Focus Areas**: Filtering, pagination, data transformation, validation
- **Coverage Target**: 80%+ for service layer

### Integration Tests (Spring Boot Test + MockMvc)
- **Controller Layer**: Test full request/response cycle
- **Database**: Use Testcontainers PostgreSQL
- **Authentication**: Mock JWT tokens for testing
- **Verification**: JSON responses, HTTP status codes, error handling

### Manual API Testing (Swagger UI + Postman)
- **Interactive Testing**: During development and validation
- **OAuth2 Testing**: JWT token validation
- **User Flows**: Complete end-to-end scenarios
- **Performance**: Response time validation

---

## Success Criteria

### Day 1 Success Criteria
- ✅ Spring Boot project created with all dependencies
- ✅ Database schema created with all tables and relationships
- ✅ Seed data loaded successfully with realistic test scenarios
- ✅ All JPA entities and repositories functional

### Day 2 Success Criteria
- ✅ OAuth2 JWT authentication working with Google
- ✅ User mapping from OIDC token to User/Member entities
- ✅ All service layer methods implemented and tested
- ✅ DTOs created with proper validation

### Day 3 Success Criteria
- ✅ All REST endpoints functional and documented in Swagger
- ✅ Error handling working correctly
- ✅ API documentation complete with examples
- ✅ Swagger UI accessible and functional

### Day 4 Success Criteria
- ✅ 70%+ test coverage on services and controllers
- ✅ All unit and integration tests passing
- ✅ Test data builders and utilities created
- ✅ CI/CD pipeline configured

### Day 5 Success Criteria
- ✅ All endpoints tested manually via Swagger/Postman
- ✅ Performance acceptable (< 500ms for list queries)
- ✅ Complete documentation for frontend integration
- ✅ CORS configured for React frontend
- ✅ Ready for frontend development

---

## Risk Mitigation

### Technical Risks
- **OAuth2 Configuration Complexity**: Start with simple JWT validation, add complexity gradually
- **Database Performance**: Add indexes early, monitor query performance
- **Test Data Quality**: Create realistic seed data with edge cases

### Timeline Risks
- **Scope Creep**: Stick to core 4 screens, defer nice-to-haves
- **Testing Time**: Focus on critical path testing, add comprehensive tests later
- **Documentation**: Use templates and examples to speed up documentation

### Dependencies
- **Google OIDC Setup**: Have fallback test JWT tokens ready
- **PostgreSQL**: Use Docker for consistent environment
- **Frontend Integration**: Document API contracts early for parallel development

---

## Next Steps (Days 6+)

After completing the backend:
1. **Frontend Setup**: Create React project with routing and authentication
2. **UI Components**: Build the 4 screens (Login, Dashboard, Claims List, Claim Detail)
3. **Integration**: Connect frontend to backend APIs
4. **Testing**: Add React Testing Library tests
5. **Deployment**: Set up Docker containers and deployment pipeline

---

## Daily Standup Questions

Each day, review:
1. What was completed yesterday?
2. What is planned for today?
3. Are there any blockers or risks?
4. Is the timeline still on track?

---

*This plan provides a structured approach to building a production-ready backend for the Member Benefits Dashboard, with emphasis on testing, documentation, and frontend integration preparation.*
