# 🚀 Quick Developer Guide

## Setup & Run (3 Steps)

```bash
# 1. Copy environment file and update with your credentials
cp .env.example .env

# 2. Start the application
./start-docker.sh

# 3. Access the application
# Frontend: http://localhost:8081
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Cleanup (When Done)

```bash
# Remove all Docker containers and images to free up space
./cleanup-docker.sh
```

## Useful Commands

```bash
docker-compose logs -f          # View all logs
docker-compose logs -f backend  # View backend logs only
docker-compose ps               # Check service status
docker-compose restart          # Restart all services
```

---

**That's it! Simple and clean.** 
