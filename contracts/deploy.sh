#!/bin/bash

# Web3 Talent Agent - Quick Deploy Script
# This script sets up and deploys smart contracts to Circle Layer

set -e

echo "🚀 Web3 Talent Agent - Smart Contract Deployment"
echo "================================================="

# Check if we're in the contracts directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the contracts directory"
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your configuration before proceeding"
    echo "   Required: PRIVATE_KEY, CIRCLE_RPC_URL"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check required environment variables
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set in .env"
    exit 1
fi

if [ -z "$CIRCLE_RPC_URL" ]; then
    echo "❌ CIRCLE_RPC_URL not set in .env"
    exit 1
fi

echo "✅ Environment variables loaded"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Compile contracts
echo "🔨 Compiling smart contracts..."
npx hardhat compile

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed"
    exit 1
fi

echo "✅ Contracts compiled successfully"

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    echo "🔧 Please fix failing tests before deployment"
    exit 1
fi

echo "✅ All tests passed"

# Deploy to network
NETWORK=${1:-circle}
echo "🌐 Deploying to $NETWORK network..."

npx hardhat run scripts/deploy.js --network $NETWORK

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo "📄 Contract addresses saved to deployment.json"
    echo ""
    echo "Next steps:"
    echo "1. Update your backend config with contract addresses"
    echo "2. Update frontend environment variables"
    echo "3. Test the integration"
    echo ""
    echo "🔗 Useful commands:"
    echo "   npx hardhat verify <contract-address> --network $NETWORK"
    echo "   npx hardhat console --network $NETWORK"
else
    echo "❌ Deployment failed"
    exit 1
fi
