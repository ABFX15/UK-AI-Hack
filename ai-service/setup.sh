#!/bin/bash

# AI Service Setup Script
echo "🤖 Setting up Web3 Talent AI Service..."

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "❌ uv is not installed. Please install it first:"
    echo "   curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# Navigate to AI service directory
cd "$(dirname "$0")"

echo "📦 Installing Python dependencies with uv..."
uv sync

echo "📋 Copying environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please update .env with your actual API keys"
fi

echo "🔧 Installing additional dependencies for AI services..."
# Install textblob corpora
uv run python -c "
try:
    import nltk
    print('NLTK already installed')
except ImportError:
    import subprocess
    subprocess.run(['uv', 'add', 'nltk'])
    import nltk
    nltk.download('punkt')
    nltk.download('vader_lexicon')
    print('NLTK data downloaded')
"

echo "✅ AI Service setup complete!"
echo ""
echo "🚀 To start the AI service:"
echo "   cd ai-service"
echo "   uv run python main.py"
echo ""
echo "📝 Don't forget to:"
echo "   1. Update .env with your API keys"
echo "   2. Start Redis server (if using caching)"
echo "   3. Update your TypeScript backend to use AI service endpoints"
