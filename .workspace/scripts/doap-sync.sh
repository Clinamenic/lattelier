#!/bin/bash

# DOAP Metadata Synchronization Script
# Syncs metadata from doap.json to other project files

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DOAP_JSON_PATH="$PROJECT_ROOT/doap.json"
PACKAGE_JSON_PATH="$PROJECT_ROOT/package.json"
README_PATH="$PROJECT_ROOT/README.md"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if doap.json exists
check_doap_json() {
    if [[ ! -f "$DOAP_JSON_PATH" ]]; then
        log_error "doap.json not found at $DOAP_JSON_PATH"
        log_info "Please create doap.json first"
        exit 1
    fi
    log_info "Found doap.json at $DOAP_JSON_PATH"
}

# Sync to package.json
sync_package_json() {
    if [[ ! -f "$PACKAGE_JSON_PATH" ]]; then
        log_warning "package.json not found, skipping sync"
        return
    fi

    log_info "Syncing metadata to package.json..."

    node -e "
        const fs = require('fs');
        const doapData = JSON.parse(fs.readFileSync('$DOAP_JSON_PATH', 'utf8'));
        const packageData = JSON.parse(fs.readFileSync('$PACKAGE_JSON_PATH', 'utf8'));

        // Sync basic metadata
        packageData.name = doapData.name || packageData.name;
        packageData.version = doapData.version || packageData.version;
        packageData.description = doapData.description || packageData.description;
        packageData.author = doapData.author?.name || packageData.author;
        packageData.homepage = doapData.homepage || doapData.url || packageData.homepage;
        packageData.repository = doapData.repository?.url || packageData.repository;

        // Write back to package.json
        fs.writeFileSync('$PACKAGE_JSON_PATH', JSON.stringify(packageData, null, 2));
    "

    log_success "Synced metadata to package.json"
}

# Sync to README.md (if needed)
sync_readme() {
    if [[ ! -f "$README_PATH" ]]; then
        log_warning "README.md not found, skipping sync"
        return
    fi

    log_info "README.md sync not implemented yet (manual update required)"
    log_info "Consider updating README.md with project metadata from doap.json"
}

# Main synchronization
main() {
    log_info "🔄 DOAP Metadata Synchronization"
    log_info "================================="

    # Check prerequisites
    check_doap_json

    # Sync to all target files
    sync_package_json
    sync_readme

    log_success "🎉 Metadata synchronization complete!"
    log_info "All project files have been updated with metadata from doap.json"
}

# Run main function
main "$@"


