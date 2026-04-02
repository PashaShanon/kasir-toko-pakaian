# Vercel Deployment Script for Windows
# Usage: powershell -ExecutionPolicy Bypass -File deploy-to-vercel.ps1

Write-Host "🚀 Vercel Deployment Helper" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "🔍 Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = $null -ne (Get-Command vercel -ErrorAction SilentlyContinue)

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host "📋 Deployment Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  BACKEND DEPLOYMENT" -ForegroundColor Yellow
Write-Host "   cd backend\API-TokoPakaian" -ForegroundColor Gray
Write-Host "   vercel --prod" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  FRONTEND DEPLOYMENT" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   vercel --prod" -ForegroundColor Gray
Write-Host ""

$deploy = Read-Host "🔧 Do you want to deploy now? (y/n)"

if ($deploy -eq 'y' -or $deploy -eq 'Y') {
    
    $deployBackend = Read-Host "Deploy Backend first? (y/n)"
    if ($deployBackend -eq 'y' -or $deployBackend -eq 'Y') {
        Write-Host "📦 Deploying Backend..." -ForegroundColor Yellow
        Push-Location "backend\API-TokoPakaian"
        
        vercel --prod
        
        Write-Host "✅ Backend deployed!" -ForegroundColor Green
        Pop-Location
    }
    
    $deployFrontend = Read-Host "Deploy Frontend? (y/n)"
    if ($deployFrontend -eq 'y' -or $deployFrontend -eq 'Y') {
        Write-Host "🎨 Deploying Frontend..." -ForegroundColor Yellow
        Push-Location "frontend"
        
        vercel --prod
        
        Write-Host "✅ Frontend deployed!" -ForegroundColor Green
        Pop-Location
    }
    
    Write-Host ""
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Set Environment Variables in Vercel Dashboard" -ForegroundColor Gray
    Write-Host "   2. Verify database connection" -ForegroundColor Gray
    Write-Host "   3. Test the live application" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📖 For detailed guide, see: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
