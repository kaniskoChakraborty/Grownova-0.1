#!/usr/bin/env bash
set -e

echo "======================================================================"
echo "   GROWNOVA - ONE OPERATING SYSTEM FOR INDIAN BUSINESSES"
echo "======================================================================"
echo ""

echo "[1/3] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo ""
    echo "[ERROR] Node.js is not found on your system!"
    echo "Please download and install Node.js from: https://nodejs.org/"
    echo ""
    exit 1
fi
echo "Found Node.js: $(node -v)"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/frontend"

echo "[2/3] Checking frontend dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Dependencies not found. Installing packages... (This only happens on first run)"
    npm install
else
    echo "Dependencies already verified!"
fi
echo ""

echo "[3/3] Starting GrowNova and opening browser..."
(
  sleep 2
  if command -v open &> /dev/null; then
    open "http://localhost:5173"
  elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:5173"
  fi
) &

echo "======================================================================"
echo "  GrowNova is LIVE!"
echo "  - Main Landing Page:  http://localhost:5173"
echo "  - Sign In / Sign Up:  http://localhost:5173/auth"
echo ""
echo "  Press Ctrl + C in this terminal to stop the server at any time."
echo "======================================================================"
echo ""

npm run dev
