#!/bin/bash

# Build script for Vercel deployment
echo "Starting build process for M.Pump Calc..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "Installing dependencies..."
yarn install

# Create production build
echo "Creating production build..."
yarn build

echo "Build completed successfully!"