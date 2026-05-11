# Deploy Orbact V2 Supabase Edge Functions

Write-Host "`nDeploying Orbact Edge Functions..." -ForegroundColor Cyan

if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "Supabase CLI not found. Install it with: npm install -g supabase" -ForegroundColor Red
    exit 1
}

supabase functions deploy chat
if ($LASTEXITCODE -ne 0) { exit 1 }

supabase functions deploy contact
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`nDeployment complete." -ForegroundColor Green
Write-Host "Remember to set server-only secrets:" -ForegroundColor Yellow
Write-Host "supabase secrets set GROQ_API_KEY=your_key" -ForegroundColor White
Write-Host "supabase secrets set CONTACT_WEBHOOK_URL=https://your-webhook-url" -ForegroundColor White
