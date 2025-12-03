# Agent Instructions

This document provides comprehensive guidance for AI code assistants working with this SAWA Framework project.

## Table of Contents

1. [Workspace Orientation](#workspace-orientation)
2. [Project Initialization](#project-initialization)
3. [Beads Issue Tracking](#beads-issue-tracking)
4. [Development Workflow](#development-workflow)
5. [Version Management](#version-management)
6. [Session Protocols](#session-protocols)

## Workspace Orientation

### Directory Structure

This project uses the SAWA Framework structure:

- **Project Space** (root level): Application code, configuration, and active project files
- **`.workspace/`**: Assistant-agnostic shared resources (scripts, configs, docs)
- **`.cursor/`**: Cursor-specific rules and guidance
- **`.claude/`**: Claude-specific rules and guidance

### Key Files

- `CHANGELOG.md`: Human-readable release notes for each version
- `package.json`: Project metadata and version (authoritative SemVer source)
- `doap.json`: Central metadata source (single source of truth)
- `AGENTS.md`: This file - agent instructions

### Shared Resources

**`.workspace/scripts/`**: Shared automation

- `version-bump.sh`: Semantic versioning management
- `doap-sync.sh`: File synchronization with doap.json
- `init-beads.sh`: Beads initialization (optional)
- `deploy-to-arweave.sh`: Arweave deployment
- `backup-to-protocol-land.sh`: Repository backup

**`.workspace/config/`**: Shared tool configurations

- `version-bump.conf`: Version bump customization
- `deploy.config.js`: Deployment configuration

**`.workspace/docs/`**: Project documentation

- `ref/`: Reference documentation (beads, DOAP, etc.)
- `arch/`: Architecture documentation
- `temp/`: Temporary planning documents

### Conventions

**Conventional Commits → SemVer:**

- `fix:` → PATCH (0.0.x)
- `feat:` → MINOR (0.x.0)
- `BREAKING CHANGE` or `!` → MAJOR (x.0.0)
- `docs/style/refactor/test/chore` → PATCH (non-breaking)

**Git Tags:**

- Tag releases as `vX.Y.Z`

**CHANGELOG:**

- Maintain one section per release
- Use subsections: Added, Changed, Fixed, Removed, Security
- Version must match `package.json`

### Orientation Steps

When starting work on this project:

1. Read this file (`AGENTS.md`) completely
2. Scan `.workspace/scripts/` and `.workspace/config/` for available tools
3. Review assistant-specific rules (`.cursor/rules/`, `.claude/`)
4. Check `package.json` for scripts, tooling, and version
5. Review `CHANGELOG.md` and recent tags/commits for context
6. Scan app entry points (`src/` tree) and build scripts
7. **If beads is initialized**: Run `bd onboard` and review beads workflow below
8. Follow project rules (005a for initialization, 005b for updates, 027 for beads)

## Project Initialization

### Initialization Workflow (Rule 005a)

When initializing a new project from this template:

1. **Collect Project Information**: Replace DOAP.json placeholders
2. **Set Default Values**: Use sensible defaults for optional fields
3. **Replacement Process**: Update doap.json, package.json, index.html
4. **Validation**: Ensure all placeholders replaced, JSON valid, URLs formatted
5. **Post-Initialization**:
   - Run `.workspace/scripts/doap-sync.sh` to sync all files
   - Test build process: `npm run build`
   - Verify script integration
   - Update README.md with project-specific information
   - Initialize git repository if not already done
   - Create initial commit
   - **Optional**: Initialize beads (see Beads section below)

See `.cursor/rules/005a_project_initialization.mdc` for complete details.

## Beads Issue Tracking

This project optionally uses [beads](https://github.com/steveyegge/beads) for issue tracking and task management. Beads provides long-term memory and dependency-aware task management for AI coding agents.

### Initialization

**If beads is not yet initialized:**

```bash
.workspace/scripts/init-beads.sh
bd onboard
```

This will:

- Create `.beads/` directory at project root
- Set up git merge driver for JSONL files
- Configure git hooks (if accepted)
- Start daemon for auto-sync

### Workflow

#### Finding Ready Work

Start each session by checking for ready work:

```bash
bd ready --json
```

This shows issues with no open blockers, sorted by priority.

#### Creating Issues

When you discover bugs, TODOs, or follow-up tasks, create issues:

```bash
# Basic issue
bd create "Fix bug in auth flow" -t bug -p 1 --json

# With description and labels
bd create "Add OAuth support" -d "Implement OAuth2 flow" -t feature -p 2 -l backend,security --json

# Link discovered work to parent
bd dep add <new-issue-id> <parent-issue-id> --type discovered-from
```

#### Managing Work

Update issue status as you work:

```bash
# Start working on an issue
bd update <issue-id> --status in_progress --json

# Close completed work
bd close <issue-id> --reason "Implemented" --json
```

#### Dependency Management

- **blocks**: Hard blocker (prevents work from starting)
- **discovered-from**: Work discovered during implementation
- **related**: Soft relationship between issues

Only `blocks` dependencies affect ready work detection.

### Quick Reference

```bash
# Find ready work
bd ready --json

# List all issues
bd list --json

# Show issue details
bd show <issue-id> --json

# Create issue
bd create "Title" -t bug -p 0 --json

# Update issue
bd update <issue-id> --status in_progress --json

# Close issue
bd close <issue-id> --reason "Completed" --json

# View dependency tree
bd dep tree <issue-id>

# Sync with git
bd sync
```

### Best Practices

- Always use `--json` flag for programmatic access
- Proactively create issues for discovered problems
- Use priority 0 (P0) for broken builds or critical bugs
- Link discovered work back to parent issues using `discovered-from` dependency
- Sync issues before ending sessions to prevent lost work

### Documentation

For complete beads documentation, see:

- `.workspace/docs/ref/beads-documentation.md` - Full API reference
- `.workspace/docs/ref/beads-workflow-integration.md` - Workflow integration guide
- `.cursor/rules/027_beads.mdc` - Cursor-specific workflow guidance
- [Official Beads Documentation](https://github.com/steveyegge/beads) - Upstream docs

## Development Workflow

### Daily Session Workflow

1. **Start Session**:

   - If beads initialized: `bd ready --json` to find available work
   - Review recent commits and CHANGELOG for context
   - Check for in-progress work

2. **During Work**:

   - Create issues for discovered problems immediately
   - Link discovered work with `discovered-from` dependencies
   - Update issue status as work progresses

3. **End Session** (see Session Protocols below)

### Code Quality

- Run `npm run typecheck` before committing
- Run `npm run lint` to check code style
- Run `npm run build` to verify production build
- File P0 issues if builds are broken

## Version Management

### Version Update Workflow (Rule 005b)

When preparing a release:

1. **Change Analysis**:

   - `git status`, `git diff --stat`, examine key files
   - **If beads initialized**: `bd list --status closed --updated-after <last-release-date> --json`

2. **Impact Assessment**:

   - Categorize changes (breaking/feature/fix/maintenance)
   - **If beads initialized**: Use issue types to inform version decision
   - **If beads initialized**: Create release epic: `bd create --from-template epic "Release vX.Y.Z" -p 1 --json`

3. **Version Decision**: Apply highest impact rule (MAJOR > MINOR > PATCH)

4. **Version Management**:

   - Run `.workspace/scripts/version-bump.sh [patch|minor|major]`
   - Updates doap.json, package.json, index.html

5. **Architecture Docs**: Update `.workspace/docs/arch/*.md` for the new version

6. **File Sync**: Run `.workspace/scripts/doap-sync.sh`

7. **Commit A**: Conventional commit for bump + docs updates

   - **If beads initialized**: Update release epic with commit SHA
   - **If beads initialized**: Close issues included in release

8. **Capture Metadata**: `BUMP_SHA=$(git rev-parse --short HEAD)`, `BUMP_DATE=$(git show -s --format=%cI HEAD)`

9. **CHANGELOG Update**:

   - Update CHANGELOG.md referencing `BUMP_SHA` and using `BUMP_DATE`
   - **If beads initialized**: Use `bd list --status closed --json` for issue details

10. **Commit B & Release**:
    - Commit changelog → tag vX.Y.Z → push with tags
    - **If beads initialized**: Close release epic and sync: `bd sync`

See `.cursor/rules/005b_project_update.mdc` for complete details.

## Session Protocols

### Session Ending Protocol

Before ending your session, follow this protocol:

1. **File/update issues for remaining work**

   - Create issues for discovered bugs, TODOs, and follow-up tasks
   - Close completed issues and update status for in-progress work
   - **If beads initialized**: Use `bd create` and `bd close` commands

2. **Run quality gates (if applicable)**

   - Tests, linters, builds - only if code changes were made
   - File P0 issues if builds are broken

3. **Sync the issue tracker (if beads initialized)**

   - Run `bd sync` to ensure local and remote issues merge safely
   - Handle git conflicts thoughtfully (sometimes accepting remote and re-importing)
   - Goal: clean reconciliation where no issues are lost

4. **Verify clean state**

   - All changes committed and pushed
   - No untracked files remain
   - `git status` shows clean working tree

5. **Choose next work**
   - **If beads initialized**: Provide `bd ready --json` output for next session
   - Provide a formatted prompt for the next session with context
   - Note any blockers or dependencies

### Best Practices

- Use `.workspace/` for shared, assistant-agnostic assets
- Keep assistant-specific rules/config in their respective directories (`.cursor/`, `.claude/`)
- Prefer hooks/config over editing shared scripts directly
- Keep documentation up to date in `.workspace/docs/` and cross-reference from assistant-specific docs
- Always use `--json` flag with beads commands for programmatic access
- Proactively create issues for discovered problems
- Sync beads before ending sessions to prevent lost work

## Related Documentation

- `.workspace/docs/ref/beads-workflow-integration.md` - Complete beads workflow integration
- `.cursor/rules/005a_project_initialization.mdc` - Project initialization workflow
- `.cursor/rules/005b_project_update.mdc` - Version update workflow
- `.cursor/rules/027_beads.mdc` - Beads usage standards
- `.workspace/QUICKSTART.md` - Human quick start guide (not for agents)
