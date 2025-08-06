#!/bin/bash

# Web3 Talent Agent - Development Setup Script
echo "🚀 Setting up Web3 Talent Agent development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your API keys and configuration"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

echo ""
echo "🎉 Setup completed! Next steps:"
echo ""
echo "1. Update your .env file with:"
echo "   - Database URL (PostgreSQL)"
echo "   - OpenAI API key"
echo "   - GitHub token"
echo "   - TRON private key and API key"
echo ""
echo "2. Set up your database:"
echo "   npm run db:push"
echo ""
echo "3. Start development server:"
echo "   npm run dev"
echo ""
echo "4. View API documentation at:"
echo "   http://localhost:3000"
echo ""
echo "📚 Useful commands:"
echo "   npm run build      - Build for production"
echo "   npm test           - Run tests"
echo "   npm run db:studio  - Open Prisma Studio"
echo ""
echo "🏆 Ready for the UK AI Agent Hackathon EP2!"
echo "💡 Check the README.md for detailed instructions and TODO items to implement."
