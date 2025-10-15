# Memeber Benefits Insurance Platform

Description Here

## Project Setup


## Running Tests
**Frontend Tests**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies first (if not already done)
npm install

# Run tests in non-watch mode
npm test -- --watchAll=false --verbose
```
**Backend Tests**
```bash
# Navigate to backend directory
cd backend

# Set Java 20 as the JAVA_HOME (if not already set)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-20"

# Run all tests
./mvnw.cmd test
```

**Expected Outputs**
```bash
[INFO] Tests run: 9, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

## Connecting To Docker & Database
**Access PostgreSQL Database via Docker**
```bash
# Find your PostgreSQL container
docker ps
# Using docker-compose
docker-compose exec postgres psql -U postgres -d member_benefits_db
```