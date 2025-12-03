#!/bin/bash
# Beads initialization script for SAWA Framework template
# This script initializes beads issue tracking at the project root

set -e

# Get the project root (parent of .workspace)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$PROJECT_ROOT"

# Check if bd is installed
if ! command -v bd &> /dev/null; then
    echo "Error: 'bd' command not found. Please install beads first:"
    echo "  npm install -g @beads/bd"
    echo "  or"
    echo "  curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash"
    exit 1
fi

# Check if beads is already initialized
if [ -d ".beads" ] && [ -f ".beads/metadata.json" ]; then
    echo "Beads is already initialized in this project."
    echo "Run 'bd info' to check status."
    exit 0
fi

echo "Initializing beads issue tracking..."

# Initialize beads (quiet mode for non-interactive use)
bd init --quiet

# Verify initialization
if [ -f ".beads/metadata.json" ]; then
    echo "✓ Beads initialized successfully"
    echo ""
    echo "Next steps:"
    echo "1. Review .beads/README.md for beads documentation"
    echo "2. If AGENTS.md exists, ensure it includes beads onboarding instructions"
    echo "3. Run 'bd onboard' to get integration instructions for your AI agent"
    echo ""
    echo "Quick commands:"
    echo "  bd ready          # Show ready work"
    echo "  bd list           # List all issues"
    echo "  bd create \"Task\" # Create a new issue"
else
    echo "Error: Beads initialization may have failed. Check .beads/ directory."
    exit 1
fi

