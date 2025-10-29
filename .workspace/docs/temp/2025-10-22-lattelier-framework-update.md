# Lattelier Framework Update to Starter-Permadapp Standards

**Created:** 2025-10-22T19:46:06Z  
**Status:** Planning Phase  
**Target:** Update lattelier to match starter-permadapp framework

## Baseline Knowledge

### Current Lattelier State
- **Project Type**: Professional web-based lattice distortion and pattern generation tool
- **Version**: 0.3.0 (active development)
- **Framework**: React + TypeScript + Vite
- **Deployment**: Arweave via existing scripts
- **Workspace**: Has `.workspace/` directory with config and scripts
- **Rules**: Has cursor rules but may be outdated

### Missing Framework Components
- **doap.json**: No DOAP metadata file (primary source of truth)
- **Metadata Integration**: No HTML metadata injection from DOAP
- **Updated Scripts**: Deployment scripts may not match new framework
- **Backup System**: No protocol.land backup integration
- **File Synchronization**: No doap-sync.sh script

### Existing Assets to Preserve
- **Source Code**: Complete React application with components
- **Styles**: CSS architecture with semantic styling
- **Configuration**: Existing workspace config and deployment setup
- **Documentation**: Current README.md and QUICKSTART.md
- **Dependencies**: All current package.json dependencies

## Type Definitions

### DOAP.json Structure
```typescript
interface LattelierDOAP {
  "@context": string[];
  "@type": "SoftwareApplication";
  name: "Lattelier";
  description: "Professional web-based lattice distortion and pattern generation tool";
  version: string;
  author: Person;
  repository: SoftwareSourceCode;
  deployments: WebSite[];
  backupHistory: BackupRecord[];
}
```

### Required Scripts
```typescript
interface RequiredScripts {
  "doap-metadata.ts": "Vite plugin for metadata injection";
  "doap-sync.sh": "File synchronization script";
  "backup-to-protocol-land.sh": "Repository backup script";
  "deploy-to-arweave.sh": "Updated deployment script";
  "version-bump.sh": "Updated version management";
}
```

## Implementation Order

### Phase 1: DOAP.json Creation
1. **Create doap.json**
   - Extract metadata from package.json
   - Add comprehensive project information
   - Include current deployment history
   - Set up placeholder structure for future updates

2. **Update HTML Metadata**
   - Modify index.html with metadata placeholders
   - Add SEO, Open Graph, and Twitter Card tags
   - Include project information and deployment metadata

### Phase 2: Vite Plugin Integration
3. **Create doap-metadata.ts Plugin**
   - Copy from starter-permadapp template
   - Configure for lattelier-specific metadata
   - Test metadata injection during build

4. **Update vite.config.ts**
   - Add doap-metadata plugin
   - Ensure proper build configuration
   - Test metadata injection

### Phase 3: Script Updates
5. **Update Deployment Script**
   - Integrate doap.json as primary metadata source
   - Add deployment tracking to doap.json
   - Update metadata output and URLs

6. **Create doap-sync.sh**
   - Copy from starter-permadapp template
   - Configure for lattelier project structure
   - Test file synchronization

7. **Update version-bump.sh**
   - Integrate with doap.json as primary source
   - Sync version changes across all files
   - Test version management workflow

### Phase 4: Backup System Integration
8. **Create backup-to-protocol-land.sh**
   - Copy from starter-permadapp template
   - Configure for lattelier workspace structure
   - Test backup functionality

9. **Update doap.json Template**
   - Add backupHistory array structure
   - Include backup metadata fields
   - Test backup record creation

### Phase 5: Rule Updates
10. **Update Cursor Rules**
    - Update 005a_project_initialization.mdc
    - Update 005b_project_update.mdc
    - Update 005c_project_deploy.mdc
    - Add 005d_project_backup.mdc
    - Ensure compatibility with new framework

### Phase 6: Documentation Updates
11. **Update QUICKSTART.md**
    - Add DOAP.json initialization section
    - Include metadata synchronization steps
    - Add backup system documentation

12. **Update README.md**
    - Add DOAP.json template system section
    - Include public metadata access information
    - Update deployment and backup instructions

## Integration Points

### DOAP.json Integration
- **Primary Source**: All project metadata in doap.json
- **Version Management**: Semantic versioning in doap.json
- **Deployment Tracking**: Deployment history in doap.json
- **Backup History**: Comprehensive backup records

### Build System Integration
- **Vite Plugin**: Metadata injection during build
- **HTML Head**: SEO and social media tags
- **Public Access**: doap.json bundled with deployment
- **Metadata URLs**: Accessible via Arweave deployment

### Workflow Integration
- **Initialization**: DOAP.json setup and placeholder replacement
- **Updates**: Version management via doap.json
- **Deployment**: Arweave deployment with metadata tracking
- **Backup**: Protocol.land backup with history

## Success Criteria

### Functional Requirements
- **DOAP.json Created**: Complete project metadata in doap.json
- **Metadata Injection**: HTML head populated from doap.json
- **Script Integration**: All scripts use doap.json as primary source
- **Backup System**: Protocol.land backup functionality
- **File Sync**: doap-sync.sh working correctly

### Compatibility Requirements
- **Existing Code**: No breaking changes to React application
- **Dependencies**: All current dependencies preserved
- **Configuration**: Existing workspace config maintained
- **Deployment**: Current deployment process enhanced, not replaced

### Framework Requirements
- **Rule Compatibility**: All cursor rules updated and compatible
- **Documentation**: QUICKSTART.md and README.md updated
- **Workflow**: Seamless integration with existing development workflow
- **Metadata**: Public metadata access via Arweave deployment

## Risk & Rollback

### Primary Risks
- **Breaking Changes**: Modifications to existing build process
- **Metadata Conflicts**: DOAP.json vs package.json inconsistencies
- **Script Dependencies**: New scripts may have missing dependencies
- **Deployment Issues**: Changes to deployment process

### Mitigation Strategies
- **Incremental Updates**: Implement changes step by step
- **Backup First**: Create backup before making changes
- **Testing**: Test each component before integration
- **Rollback Plan**: Keep original files for rollback

### Rollback Plan
- **Original Scripts**: Maintain copies of original deployment scripts
- **Package.json**: Keep original package.json structure
- **Vite Config**: Preserve original vite.config.ts
- **Documentation**: Revert to original documentation if needed

## Questions for Clarification

1. **DOAP.json Content**: Should we extract all metadata from package.json or start fresh?

2. **Deployment History**: How should we handle existing deployment records in the new system?

3. **Backup Strategy**: Should we create an initial backup after framework update?

4. **Rule Updates**: Are there any lattelier-specific rules that need special handling?

5. **Testing Strategy**: How should we test the updated framework without breaking existing functionality?

6. **Migration Timeline**: Should this be done incrementally or as a complete update?

7. **Documentation**: Should we preserve existing documentation or replace with framework documentation?

8. **Dependencies**: Are there any additional dependencies needed for the new framework components?


