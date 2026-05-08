@echo off
cd /d "%~dp0"

echo Starting Orbact Website Setup...

if not exist "node_modules" (
    echo Dependencies not found. Installing...
    call npm install --legacy-peer-deps
) else (
    echo Dependencies already installed.
)

echo Starting development server...
call npm run dev
