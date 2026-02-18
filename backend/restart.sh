#!/bin/bash

# Campus Resource Management System - Backend Restart Script
# This script stops any running backend and starts it with proper environment variables

echo "🛑 Stopping any running backend processes..."
pkill -f "spring-boot:run" 2>/dev/null || true
sleep 2

echo "🔧 Loading environment variables from .env file..."
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded"
else
    echo "❌ .env file not found!"
    exit 1
fi

echo "🚀 Starting backend with HikariCP optimized for Supabase..."
echo "📊 Connection pool settings:"
echo "   - Max pool size: 5"
echo "   - Min idle: 2"
echo "   - Max lifetime: 10 minutes"
echo "   - Keepalive: 30 seconds"
echo ""
echo "🌐 Backend will be available at: http://localhost:8080"
echo "📚 API docs at: http://localhost:8080/swagger-ui/index.html"
echo ""
echo "Press Ctrl+C to stop the backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

mvn spring-boot:run
