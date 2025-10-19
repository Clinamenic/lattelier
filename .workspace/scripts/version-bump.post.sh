#!/bin/bash

# Post-hook for version bump script
# This script runs after the version has been bumped in package.json
# It ensures the version display in the app is updated

set -euo pipefail

VERSION_TYPE=$1
NEW_VERSION=$2

echo "Post-hook: Version bumped to $NEW_VERSION"

# The version utility automatically reads from package.json at build time,
# so no additional updates are needed for the version display.
# The version will be updated automatically when the app is rebuilt.

echo "Version display will be updated automatically on next build"
