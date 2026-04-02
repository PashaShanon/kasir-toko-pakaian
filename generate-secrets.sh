#!/bin/bash

# Script untuk generate random secrets untuk environment variables
# Usage: bash generate-secrets.sh

echo "🔐 Generating Secrets for Vercel Deployment"
echo "==========================================="
echo ""

# Generate JWT_SECRET
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET:"
echo "$JWT_SECRET"
echo ""

# Generate REFRESH_TOKEN_SECRET
REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)
echo "REFRESH_TOKEN_SECRET:"
echo "$REFRESH_TOKEN_SECRET"
echo ""

echo "==========================================="
echo "✅ Copy secrets di atas ke Vercel Environment Variables"
echo ""
echo "Backend Environment Variables:"
echo "- JWT_SECRET: $JWT_SECRET"
echo "- REFRESH_TOKEN_SECRET: $REFRESH_TOKEN_SECRET"
