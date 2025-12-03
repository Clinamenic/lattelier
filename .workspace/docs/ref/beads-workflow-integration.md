# Beads Workflow Integration with SAWA Framework

**Version:** 1.0.0  
**Last Updated:** 2025-12-01  
**Status:** Reference Documentation

## Overview

This document explains how beads issue tracking integrates with the SAWA Framework's project initialization (005a) and version update (005b) workflows. Beads provides issue tracking and task management throughout the entire project lifecycle, from initialization through version updates and releases.

## Table of Contents

1. [Integration Points](#integration-points)
2. [Project Initialization Integration](#project-initialization-integration)
3. [Version Update Integration](#version-update-integration)
4. [Complete Integrated Workflow](#complete-integrated-workflow)
5. [Key Integration Patterns](#key-integration-patterns)
6. [Best Practices](#best-practices)
7. [Benefits](#benefits)

## Integration Points

### 1. Project Initialization (005a) → Beads Setup

Beads integrates as an optional step in the post-initialization phase, after git is initialized and the initial commit is made.

### 2. Version Updates (005b) → Beads Issue Tracking

Beads provides issue tracking throughout the version update process, from change analysis through release completion.

## Project Initialization Integration

### Standard Initialization Flow (005a)

1. **Collect Project Information** (DOAP.json placeholders)
2. **Set Default Values**
3. **Replacement Process** (update doap.json, package.json, index.html)
4. **Validation Checklist**
5. **Post-Initialization**:
   - Run `doap-sync.sh`
   - Test build process
   - Verify script integration
   - Update README.md
   - Initialize git repository
   - Create initial commit
   - **Optional: Initialize beads** ← Integration point

### Beads Integration in Initialization

**Step 7 (Post-Initialization):**
```bash
# After git is initialized and initial commit is made
.workspace/scripts/init-beads.sh
```

**What happens:**
- Creates `.beads/` directory at project root
- Sets up git merge driver for JSONL files
- Configures git hooks (if accepted)
- Starts daemon for auto-sync
- Agent runs `bd onboard` to get integration instructions

**Initial Issues Created:**
After initialization, the agent can create initial project setup issues:

```bash
# Create epic for initial project setup
bd create --from-template epic "Project Initialization" -p 1 --json

# Create tasks for remaining setup work
bd create "Complete DOAP.json metadata" -t task -p 2 --json
bd create "Set up deployment configuration" -t task -p 2 --json
bd create "Write initial documentation" -t task -p 3 --json

# Link tasks to epic
bd dep add <task-id-1> <epic-id> --type parent-child
bd dep add <task-id-2> <epic-id> --type parent-child
bd dep add <task-id-3> <epic-id> --type parent-child
```

**Benefits:**
- Tracks remaining initialization tasks
- Provides clear next steps for development
- Maintains context across sessions
- Links initialization work to project structure

## Version Update Integration

### Standard Update Flow (005b)

1. **Change Analysis**: `git status`, `git diff --stat`, examine key files
2. **Impact Assessment**: Categorize changes (breaking/feature/fix/maintenance)
3. **Version Decision**: Apply highest impact rule (MAJOR > MINOR > PATCH)
4. **Version Management**: Run `version-bump.sh [patch|minor|major]`
5. **Architecture Docs**: Update `.workspace/docs/arch/*.md`
6. **File Sync**: Run `doap-sync.sh`
7. **Optional**: `npm install` (update package-lock.json)
8. **Commit A**: Conventional commit for bump + docs updates
9. **Capture metadata**: `BUMP_SHA`, `BUMP_DATE`
10. **Documentation**: Update CHANGELOG.md
11. **Commit B & Release**: Commit changelog → tag vX.Y.Z → push with tags

### Beads Integration in Version Updates

**Before Step 1 (Change Analysis):**
```bash
# Check for ready work that should be included in this release
bd ready --json

# Review issues that are in_progress
bd list --status in_progress --json

# Check for P0 issues that must be addressed
bd list --priority 0 --status open --json
```

**During Step 2 (Impact Assessment):**
```bash
# Create issues for discovered problems during analysis
bd create "Fix build error in production build" -t bug -p 0 --json
bd create "Update architecture docs for new feature" -t task -p 2 --json
```

**After Step 3 (Version Decision):**
```bash
# Create epic for the release
bd create --from-template epic "Release vX.Y.Z" -p 1 --json

# Link completed issues to release epic
bd dep add <completed-issue-1> <release-epic-id> --type related
bd dep add <completed-issue-2> <release-epic-id> --type related
```

**After Step 8 (Commit A):**
```bash
# Update release epic with commit reference
bd update <release-epic-id> --notes "Bump commit: $BUMP_SHA" --json

# Close issues that were completed in this release
bd close <issue-id-1> --reason "Released in vX.Y.Z (refs $BUMP_SHA)" --json
bd close <issue-id-2> --reason "Released in vX.Y.Z (refs $BUMP_SHA)" --json
```

**After Step 11 (Tag & Push):**
```bash
# Sync beads issues to git (ensures release tracking is committed)
bd sync

# Update release epic status
bd update <release-epic-id> --status closed --notes "Tagged: vX.Y.Z, Pushed: $(date -u +%Y-%m-%d)" --json
```

## Complete Integrated Workflow

### Phase 1: Project Initialization

```
User: "Initialize this project with name 'MyApp'"

Agent (following 005a):
1. Collects project information
2. Replaces DOAP.json placeholders
3. Runs doap-sync.sh
4. Tests build
5. Initializes git
6. Creates initial commit
7. [Optional] Runs init-beads.sh
   → Creates .beads/ directory
   → Agent runs bd onboard
8. Creates initial project setup epic
9. Creates tasks for remaining setup work
10. Syncs beads: bd sync
```

### Phase 2: Development Cycle

```
Agent (each session):
1. bd ready --json → Finds available work
2. bd update <id> --status in_progress --json
3. Implements feature/fix
4. Discovers related work → bd create "..." --json
5. Links discovered work: bd dep add <new> <current> --type discovered-from
6. Completes work → bd close <id> --reason "..." --json
7. bd sync → Syncs to git
```

### Phase 3: Version Update Preparation

```
Agent (preparing for release):
1. bd ready --json → Reviews what's ready to release
2. bd list --status in_progress --json → Checks in-progress work
3. Decides: "Ready for v0.2.0 release"
4. Creates release epic: bd create --from-template epic "Release v0.2.0" -p 1
5. Links completed issues to epic
6. Proceeds with 005b workflow
```

### Phase 4: Version Update (005b)

```
Agent (following 005b):
1. Change Analysis
   → bd list --status closed --updated-after 2025-11-01 --json
   → Reviews what was completed

2. Impact Assessment
   → Categorizes: "feat: new auth system" → MINOR
   → bd create "Release v0.2.0" --from-template epic -p 1

3. Version Decision: minor

4. Version Management
   → .workspace/scripts/version-bump.sh minor
   → Version: 0.1.0 → 0.2.0

5. Architecture Docs
   → Updates .workspace/docs/arch/*.md
   → bd create "Update arch docs for v0.2.0" -t task -p 2 --json

6. File Sync
   → .workspace/scripts/doap-sync.sh

7. Commit A
   → git commit -m "chore(release): bump version to 0.2.0"
   → BUMP_SHA=$(git rev-parse --short HEAD)

8. CHANGELOG Update
   → Updates CHANGELOG.md with completed issues
   → References: bd list --status closed --json

9. Commit B & Release
   → git commit -m "docs(changelog): release 0.2.0"
   → git tag v0.2.0
   → git push && git push --tags

10. Beads Release Tracking
    → bd close <release-epic-id> --reason "Released v0.2.0 (refs $BUMP_SHA)" --json
    → bd close <issue-1> --reason "Released in v0.2.0" --json
    → bd close <issue-2> --reason "Released in v0.2.0" --json
    → bd sync
```

## Example: Complete Release Cycle

### Starting Point
- Current version: 0.1.0
- Open issues: 3 features, 2 bugs
- Last release: 2025-11-15

### Development Phase
```bash
# Agent works on issues
bd ready --json
→ Finds: bd-a1b2 "Add user authentication"

bd update bd-a1b2 --status in_progress --json
# ... implements auth ...

bd create "Add OAuth support" -t feature -p 2 --json
bd dep add <oauth-id> bd-a1b2 --type discovered-from

bd close bd-a1b2 --reason "Basic auth implemented" --json
bd close <oauth-id> --reason "OAuth implemented" --json
```

### Release Preparation
```bash
# Agent prepares for release
bd list --status closed --updated-after 2025-11-15 --json
→ Finds: 2 features, 1 bug completed

bd create --from-template epic "Release v0.2.0" -p 1 --json
→ Creates: bd-rel-001

bd dep add bd-a1b2 bd-rel-001 --type related
bd dep add <oauth-id> bd-rel-001 --type related
```

### Version Update (005b)
```bash
# Follow 005b workflow
.workspace/scripts/version-bump.sh minor  # 0.1.0 → 0.2.0
.workspace/scripts/doap-sync.sh

git commit -m "chore(release): bump version to 0.2.0"
BUMP_SHA=$(git rev-parse --short HEAD)

# Update CHANGELOG.md referencing completed issues
# (Agent uses bd list --status closed --json to get issue details)

git commit -m "docs(changelog): release 0.2.0"
git tag v0.2.0
git push && git push --tags
```

### Release Completion
```bash
# Close release tracking
bd update bd-rel-001 --status closed --notes "Released v0.2.0 (refs $BUMP_SHA)" --json
bd sync
```

## Key Integration Patterns

### Pattern 1: Issue-Driven Development

**Workflow:**
1. Create issues for planned work (epics, features, bugs)
2. Use `bd ready --json` to find next work
3. Update status as work progresses
4. Link discovered work with `discovered-from` dependency
5. Close issues when complete
6. Link completed issues to release epics

**Benefits:**
- Clear work tracking
- Dependency awareness
- No lost context between sessions

### Pattern 2: Release Tracking

**Workflow:**
1. Create release epic before version bump
2. Link completed issues to release epic
3. Reference commit SHA in release epic notes
4. Close release epic after tagging
5. Use release epic to generate CHANGELOG entries

**Benefits:**
- Traceability from issues to releases
- Automatic CHANGELOG generation support
- Clear release scope

### Pattern 3: Change Analysis Integration

**Workflow:**
1. Before version bump: `bd list --status closed --updated-after <last-release-date> --json`
2. Categorize closed issues (feat/fix/docs)
3. Use issue types to determine version bump (MINOR if features, PATCH if fixes)
4. Reference issues in CHANGELOG.md

**Benefits:**
- Data-driven version decisions
- Comprehensive change tracking
- Better release notes

## Best Practices

### 1. Issue Creation Timing
- **During initialization**: Create setup tasks
- **During development**: Create issues for discovered work immediately
- **Before release**: Create release epic and link completed issues
- **After release**: Review and close release epic

### 2. Dependency Management
- Use `discovered-from` for work found during implementation
- Use `blocks` for hard blockers
- Use `related` for release tracking
- Use `parent-child` for epics and tasks

### 3. Release Integration
- Always create release epic before version bump
- Link completed issues to release epic
- Reference commit SHA in release epic notes
- Use closed issues to inform CHANGELOG.md

### 4. Sync Timing
- Sync before ending sessions: `bd sync`
- Sync after version bumps: `bd sync`
- Sync after releases: `bd sync`
- Handle git conflicts carefully when syncing

## Benefits of Integration

1. **Traceability**: Every release can reference the issues it includes
2. **Context Preservation**: Work history maintained across sessions
3. **Data-Driven Decisions**: Use issue types to inform version bumps
4. **Comprehensive Tracking**: From initialization through releases
5. **Automated Workflow**: Beads syncs with git automatically
6. **Dependency Awareness**: Know what's ready vs blocked

## Quick Reference

### Initialization Workflow
```bash
# After git init and initial commit
.workspace/scripts/init-beads.sh
bd onboard
bd create --from-template epic "Project Initialization" -p 1 --json
```

### Development Workflow
```bash
# Start session
bd ready --json

# Work on issue
bd update <id> --status in_progress --json

# Discover work
bd create "..." --json
bd dep add <new-id> <current-id> --type discovered-from

# Complete work
bd close <id> --reason "..." --json
bd sync
```

### Release Workflow
```bash
# Prepare release
bd list --status closed --updated-after <date> --json
bd create --from-template epic "Release vX.Y.Z" -p 1 --json
bd dep add <issue> <release-epic> --type related

# Version bump (005b)
.workspace/scripts/version-bump.sh minor
# ... follow 005b workflow ...

# Complete release
bd close <release-epic> --reason "Released vX.Y.Z (refs $SHA)" --json
bd close <issue-1> --reason "Released in vX.Y.Z" --json
bd sync
```

## Related Documentation

- `.workspace/docs/ref/beads-documentation.md` - Complete beads API reference
- `.cursor/rules/005a_project_initialization.mdc` - Project initialization workflow
- `.cursor/rules/005b_project_update.mdc` - Version update workflow
- `.cursor/rules/027_beads.mdc` - Beads usage standards
- `AGENTS.md` - Agent instructions for beads usage

## Summary

Beads integrates seamlessly with SAWA Framework workflows:

- **Initialization (005a)**: Optional beads setup after git initialization
- **Development**: Issue-driven work tracking throughout development
- **Version Updates (005b)**: Release tracking and change analysis integration
- **Releases**: Complete traceability from issues to releases

The integration is non-invasive (beads is optional) but provides powerful tracking and memory capabilities when used. This enables agents to manage complex, multi-session work with dependency tracking and persistent memory across the entire project lifecycle.

