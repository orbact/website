#!/bin/bash

# Navigate to the script's directory
cd "$(dirname "$0")"

echo "Starting Orbact Website Setup..."

# Check if node_modules exists to decide whether to install dependencies
if [ ! -d "node_modules" ]; then
    echo "Dependencies not found. Installing..."
    # Using legacy-peer-deps to resolve conflicts with React 19
    npm install --legacy-peer-deps
else
    echo "Dependencies already installed."
fi

echo "Starting development server..."
npm run dev
