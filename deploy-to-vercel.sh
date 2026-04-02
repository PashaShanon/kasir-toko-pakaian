#!/bin/bash

# Vercel Deployment Script
# Usage: bash deploy-to-vercel.sh

echo "🚀 Vercel Deployment Helper"
echo "=============================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📋 Deployment Steps:"
echo ""
echo "1️⃣  BACKEND DEPLOYMENT"
echo "   cd backend/API-TokoPakaian"
echo "   vercel --prod"
echo ""
echo "2️⃣  FRONTEND DEPLOYMENT"
echo "   cd frontend"
echo "   vercel --prod"
echo ""

read -p "🔧 Do you want to deploy now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    
    # Backend deployment
    read -p "Deploy Backend first? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Deploying Backend..."
        cd backend/API-TokoPakaian
        vercel --prod
        BACKEND_URL=$(vercel ls --json | grep -o '"url":"[^"]*' | cut -d'"' -f4 | tail -1)
        echo "✅ Backend deployed: $BACKEND_URL"
        cd ../../
    fi
    
    # Frontend deployment
    read -p "Deploy Frontend? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🎨 Deploying Frontend..."
        cd frontend
        
        # Update .env with backend URL
        if [ ! -z "$BACKEND_URL" ]; then
            echo "VITE_API_URL=$BACKEND_URL/api" > .env.production
            echo "⚙️  Updated frontend .env with backend URL"
        fi
        
        vercel --prod
        cd ../
    fi
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Set Environment Variables in Vercel Dashboard"
    echo "   2. Verify database connection"
    echo "   3. Test the live application"
fi

echo ""
echo "📖 For detailed guide, see: DEPLOYMENT_GUIDE.md"
