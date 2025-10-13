#!/bin/bash
echo "Starting Member Benefits Dashboard with Docker Compose..."
echo "Building and starting all services..."
docker-compose up --build

echo "Services started!"
echo "Backend API: http://localhost:8080"
echo "Swagger UI: http://localhost:8080/swagger-ui.html"
echo " Database: localhost:5432"
echo "Frontend: http://localhost:3000 (when ready)"