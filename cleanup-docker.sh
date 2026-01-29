#!/bin/bash

# Bhadli Kavya - Docker Cleanup Script
# This script removes all Docker containers, images, and volumes created by this project

set -e

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║        🧹  BHADLI KAVYA - DOCKER CLEANUP                 ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    exit 1
fi

# Warning message
echo "⚠️  WARNING: This will remove all Docker resources for this project:"
echo "   • Containers (bhadli-kavya-backend, bhadli-kavya-frontend)"
echo "   • Images (bhadli-kavya-backend, bhadli-kavya-frontend)"
echo "   • Volumes (backend_uploads, backend_cache, db_data)"
echo "   • Networks (bhadli-kavya_bhadli-network)"
echo ""
echo "   Your code and .env files will NOT be affected."
echo ""

# Ask for confirmation
read -p "   Do you want to continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]] && [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cleanup cancelled."
    exit 0
fi

echo "🔧 Starting cleanup process..."
echo ""

# Get disk space before cleanup
echo "📊 Checking current Docker disk usage..."
docker system df
echo ""

# Step 1: Stop and remove containers
echo "🛑 Stopping and removing containers..."
docker-compose down --remove-orphans 2>/dev/null || true
echo "   ✅ Containers stopped and removed"
echo ""

# Step 2: Remove Docker volumes
echo "🗑️  Removing Docker volumes..."
docker volume rm bhadli-kavya_backend_uploads 2>/dev/null || echo "   ⚠️  backend_uploads volume not found (may not exist)"
docker volume rm bhadli-kavya_backend_cache 2>/dev/null || echo "   ⚠️  backend_cache volume not found (may not exist)"
docker volume rm bhadli-kavya_db_data 2>/dev/null || echo "   ⚠️  db_data volume not found (may not exist)"
echo "   ✅ Volumes removed"
echo ""

# Step 3: Remove Docker images
echo "🖼️  Removing Docker images..."
docker rmi bhadli-kavya-backend:latest 2>/dev/null || echo "   ⚠️  backend image not found"
docker rmi bhadli-kavya-frontend:latest 2>/dev/null || echo "   ⚠️  frontend image not found"
echo "   ✅ Images removed"
echo ""

# Step 4: Remove Docker network
echo "🌐 Removing Docker network..."
docker network rm bhadli-kavya_bhadli-network 2>/dev/null || echo "   ⚠️  Network not found (may not exist)"
echo "   ✅ Network removed"
echo ""

# Step 5: Remove dangling images and build cache (optional)
echo "🧹 Cleaning up dangling images and build cache..."
docker image prune -f > /dev/null 2>&1 || true
echo "   ✅ Dangling images cleaned"
echo ""

# Get disk space after cleanup
echo "📊 Docker disk usage after cleanup:"
docker system df
echo ""

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║              ✅  CLEANUP COMPLETED!                      ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "✅ All Docker resources for Bhadli Kavya have been removed!"
echo ""
echo "📝 Your source code and configuration files are safe:"
echo "   • backend/ folder - intact"
echo "   • frontend/ folder - intact"
echo "   • .env file - intact"
echo "   • docker-compose.yml - intact"
echo ""
echo "🔄 To start the project again, simply run:"
echo "   ./start-docker.sh"
echo ""
echo "💡 TIP: For complete Docker cleanup (all projects), run:"
echo "   docker system prune -a --volumes"
echo ""