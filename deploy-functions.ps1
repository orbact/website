# Deploy Supabase Edge Functions

Write-Host "`n🚀 Deploying Supabase Edge Functions..." -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# Check if Supabase CLI is installed
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Supabase CLI not found!" -ForegroundColor Red
    Write-Host "`nInstall it with:" -ForegroundColor Yellow
    Write-Host "npm install -g supabase" -ForegroundColor White
    exit 1
}

# Check if logged in
Write-Host "`n1️⃣  Checking authentication..." -ForegroundColor Yellow
$loginCheck = supabase projects list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Supabase" -ForegroundColor Red
    Write-Host "`nPlease login first:" -ForegroundColor Yellow
    Write-Host "supabase login" -ForegroundColor White
    exit 1
}

Write-Host "✅ Authenticated" -ForegroundColor Green

# Deploy chat function
Write-Host "`n2️⃣  Deploying chat function..." -ForegroundColor Yellow
supabase functions deploy chat --no-verify-jwt

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "`n" + "=" * 50 -ForegroundColor Gray
    Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to Supabase Dashboard → Edge Functions" -ForegroundColor White
    Write-Host "2. Add environment variable: GEMINI_API_KEY" -ForegroundColor White
    Write-Host "3. Test the chatbot!" -ForegroundColor White
    Write-Host "`n🎉 All done!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Deployment failed" -ForegroundColor Red
    Write-Host "Check the error message above" -ForegroundColor Yellow
    exit 1
}
