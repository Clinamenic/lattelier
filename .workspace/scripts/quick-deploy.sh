#!/bin/bash

# Quick Deployment Script for Development Iterations
# Usage: ./quick-deploy.sh

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Quick Deploy Lattelier to Arweave${NC}"
echo "========================================"

cd "$PROJECT_ROOT"

# Build the app
if [[ ! -f "package.json" ]]; then
    echo -e "${RED}❌ No package.json found in project root${NC}"
    exit 1
fi

echo -e "${BLUE}Building Lattelier...${NC}"
npm run build

if [[ ! -d "dist" ]]; then
    echo -e "${RED}❌ Build failed - no dist/ directory found${NC}"
    exit 1
fi

# Deploy directly with arkb for maximum speed
echo -e "${GREEN}Deploying to Arweave with arkb...${NC}"
arkb deploy dist --wallet .workspace/config/wallet.json --auto-confirm

echo -e "${GREEN}✅ Quick deployment complete!${NC}"
