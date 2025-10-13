#!/bin/bash
echo "Stopping Member Benefits Dashboard..."
docker-compose down

echo "Cleaning up volumes..."
# Uncomment to remove database data
# docker-compose down -v