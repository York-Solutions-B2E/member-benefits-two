# Member Benefits Insurance Platform

A full-stack healthcare member benefits dashboard application that allows healthcare providers and members to view claims, benefits, and coverage information in real-time.

## Tech Stack

- **Backend**: Java 20, Spring Boot 3.5.6, Spring Security, PostgreSQL
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose
- **Authentication**: OAuth2 (Google)

## Prerequisites

Before starting, ensure you have the following installed:

- **Docker** (version 20.10 or later) and Docker Compose
- **Git** for cloning the repository
- **Java 20** (for local backend development)
- **Node.js 18+** (for local frontend development)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd member-benefits-two
```

### 2. Environment Setup

The project uses Docker Compose for easy setup. No additional configuration is required as all environment variables are pre-configured in `docker-compose.yml`.

### 3. Start the Application

#### Using Docker (Recommended)

Run the provided startup script:

```bash
./start-docker.sh
```

Or manually:

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database on port 5432
- Start the backend API on port 8080
- Start the frontend on port 3000
- Run database migrations automatically

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- Database: localhost:5432

### 4. Stop the Application

```bash
./stop-docker.sh
```

Or manually:

```bash
docker-compose down
```

To also remove database data:

```bash
docker-compose down -v
```

## Local Development Setup

### Backend Development

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Ensure Java 20 is installed and set as JAVA_HOME

3. Start the database:
   ```bash
   docker-compose up postgres -d
   ```

4. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Development

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Running Tests
Test are minimal as I tried playing around with them to get familiar with testing libraries. Did not complete testing feats.
### Frontend Tests

```bash
cd frontend
npm install  # If not already done
npm test -- --watchAll=false --verbose
```

### Backend Tests

```bash
cd backend

# Set Java 20 as JAVA_HOME (Windows PowerShell)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-20"

# Run all tests
./mvnw test
```

**Expected Output:**
```bash
[INFO] Tests run: 9, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

## Connecting to the Database

### Access PostgreSQL via Docker

```bash
# Find your PostgreSQL container
docker ps

# Connect to the database
docker-compose exec postgres psql -U postgres -d member_benefits_db
```

### Database Credentials

- **Host**: localhost
- **Port**: 5432
- **Database**: member_benefits_db
- **Username**: postgres
- **Password**: password