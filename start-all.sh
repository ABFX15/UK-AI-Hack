#!/bin/bash

# Web3 Talent Agent - Full Stack Startup Script
echo "🚀 Starting Web3 Talent Agent (TypeScript + Python AI Services)..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down services..."
    if [ ! -z "$TS_PID" ]; then
        kill $TS_PID 2>/dev/null
    fi
    if [ ! -z "$AI_PID" ]; then
        kill $AI_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if required environment files exist
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please update .env with your actual API keys and database URL"
fi

if [ ! -f ai-service/.env ]; then
    echo "⚠️  No AI service .env file found. Copying from .env.example..."
    cp ai-service/.env.example ai-service/.env
    echo "📝 Please update ai-service/.env with your actual API keys"
fi

# Start AI Service (Python)
echo "🤖 Starting AI Service..."
cd ai-service
if [ ! -d .venv ]; then
    echo "📦 Installing AI service dependencies..."
    uv sync
fi

# Start AI service in background
uv run python main.py &
AI_PID=$!
echo "✅ AI Service started (PID: $AI_PID) on http://localhost:8000"

# Return to main directory
cd ..

# Start TypeScript Backend
echo "🔧 Starting TypeScript Backend..."

# Install dependencies if needed
if [ ! -d node_modules ]; then
    echo "📦 Installing TypeScript dependencies..."
    npm install
fi

# Build TypeScript
echo "🏗️  Building TypeScript project..."
npm run build

# Start TypeScript service in background
npm start &
TS_PID=$!
echo "✅ TypeScript Backend started (PID: $TS_PID) on http://localhost:3000"

echo ""
echo "🎉 All services are now running!"
echo ""
echo "📋 Service Status:"
echo "   🤖 AI Service:        http://localhost:8000"
echo "   🔧 TypeScript API:    http://localhost:3000"
echo "   📊 Health Check:      http://localhost:8000/health"
echo "   📚 AI API Docs:       http://localhost:8000/docs"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Wait for either service to exit
wait $TS_PID $AI_PID
