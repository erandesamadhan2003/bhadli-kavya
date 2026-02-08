#!/bin/bash

# Bhadli Kavya - Docker Startup Script
set -e

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║        🚀  BHADLI KAVYA - DOCKER STARTUP                 ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created."
    echo ""
fi

echo "🔧 Stopping any existing containers..."
docker-compose down --remove-orphans > /dev/null 2>&1 || true

echo ""
echo "📦 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║              ✅  SERVICES STARTED SUCCESSFULLY!          ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📍 ACCESS YOUR APPLICATION:"
echo ""
echo "   🌐 Frontend (Web App):"
echo "      → http://localhost:8081"
echo ""
echo "   ⚡ Backend (API Server):"
echo "      → http://localhost:8000"
echo ""
echo "   📚 API Documentation:"
echo "      → http://localhost:8000/docs"
echo ""
echo "   ☁️  Database:"
echo "      → Aiven Cloud MySQL (Managed)"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🛠️  USEFUL COMMANDS:"
echo ""
echo "   View logs (all):        docker-compose logs -f"
echo "   View backend logs:      docker-compose logs -f backend"
echo "   View frontend logs:     docker-compose logs -f frontend"
echo ""
echo "   Stop services:          docker-compose stop"
echo "   Restart services:       docker-compose restart"
echo "   Stop & remove all:      docker-compose down"
echo ""
echo "   Check status:           docker-compose ps"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "💡 TIP: Press Ctrl+C to stop watching logs"
echo ""
echo "🎉 Happy coding!"
echo ""
