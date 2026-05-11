#!/bin/bash

# Navigate to the script's directory
cd "$(dirname "$0")"

echo "Starting Orbact Website Setup..."

# Check if node_modules exists to decide whether to install dependencies
if [ ! -d "node_modules" ]; then
    echo "Dependencies not found. Installing..."
    npm install
else
    echo "Dependencies already installed."
fi

echo "Starting development server..."
npm run dev
