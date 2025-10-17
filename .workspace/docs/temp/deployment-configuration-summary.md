# Arweave Deployment Configuration Summary

## Overview

Lattelier is now fully configured for permanent deployment to Arweave's permaweb. All scripts, configurations, and documentation are in place for a streamlined deployment workflow.

## What Was Configured

### 1. Deployment Scripts

#### `.workspace/scripts/deploy-to-arweave.sh`
- **Full-featured production deployment script**
- Wallet validation and balance checking
- Automated build process
- Cost estimation
- Deployment tagging with metadata
- Deployment history logging
- Browser auto-open after deployment
- Production confirmation prompt

**Updates:**
- Changed branding from "Glyph Potluck" to "Lattelier"
- Updated metadata tags:
  - App-Name: Lattelier
  - Category: design-tools (was font-tools)
  - Keywords: lattice,grid,distortion,pattern,design,generative,art

#### `.workspace/scripts/quick-deploy.sh`
- **Streamlined deployment for rapid iteration**
- Minimal logging for speed
- Automatic build and deploy
- Error handling for missing files

**Updates:**
- Removed placeholder HTML generation
- Expects working app with package.json
- Builds before deploying
- Simplified output for quick testing

### 2. Configuration Files

#### `.workspace/config/deploy.config.js`
JavaScript configuration for deployment metadata:

```javascript
{
  walletPath: 'wallet.json',
  buildDir: 'dist',
  buildCommand: 'npm run build',
  appName: 'Lattelier',
  description: 'Professional lattice distortion and pattern generation tool',
  arnsName: 'lattelier', // For future ArNS registration
  tags: [
    { name: 'App-Name', value: 'Lattelier' },
    { name: 'App-Version', value: '0.1.0' },
    { name: 'Content-Type', value: 'text/html' },
    { name: 'App-Type', value: 'web-app' },
    { name: 'Category', value: 'design-tools' },
    { name: 'Keywords', value: 'lattice,grid,distortion,pattern,design,generative,art' }
  ]
}
```

#### `.workspace/config/wallet.json.example`
Template file showing the structure of an Arweave wallet:
- Provides clear guidance for users
- Never commit the actual wallet.json

### 3. Build Optimization

#### `vite.config.ts`
Optimized Vite configuration for Arweave deployment:

**Key Features:**
- `base: './'` - Relative paths for proper asset loading on Arweave
- `target: 'es2015'` - Wide browser compatibility
- `minify: 'esbuild'` - Fast, efficient minification
- `sourcemap: false` - Smaller deployment size
- **Chunk splitting:**
  - `react-vendor`: React + React DOM (141 KB → 45 KB gzipped)
  - `state-vendor`: Zustand + Immer (3.6 KB → 1.6 KB gzipped)
  - `animation-vendor`: GSAP (empty, reserved for future use)
  - `index`: Application code (73 KB → 17 KB gzipped)
- `assetsInlineLimit: 4096` - Inline small assets as base64

**Build Output:**
```
dist/index.html                    0.67 kB │ gzip:  0.37 kB
dist/assets/index-[hash].css      18.88 kB │ gzip:  4.11 kB
dist/assets/state-vendor-[hash].js  3.64 kB │ gzip:  1.60 kB
dist/assets/index-[hash].js        73.55 kB │ gzip: 17.24 kB
dist/assets/react-vendor-[hash].js 141.07 kB │ gzip: 45.28 kB

Total gzipped: ~68 KB
```

This is an excellent size for Arweave deployment (small and efficient).

### 4. NPM Scripts

#### `package.json`
Added convenient deployment commands:

```json
{
  "scripts": {
    "deploy": ".workspace/scripts/deploy-to-arweave.sh --prod",
    "deploy:dev": ".workspace/scripts/deploy-to-arweave.sh --dev",
    "deploy:quick": ".workspace/scripts/quick-deploy.sh"
  }
}
```

**Usage:**
- `npm run deploy` - Production deployment with confirmation
- `npm run deploy:dev` - Development deployment (no confirmation)
- `npm run deploy:quick` - Quick deployment for rapid testing

### 5. Security Configuration

#### `.gitignore`
Added Arweave-specific exclusions:

```gitignore
# Arweave deployment (NEVER commit wallet or deployment history)
.workspace/config/wallet.json
.workspace/config/deployments.json
```

**Protected files:**
- `wallet.json` - Your Arweave wallet (contains private keys)
- `deployments.json` - Deployment history (may contain sensitive info)

### 6. Documentation

#### `.workspace/docs/temp/arweave-deployment-guide.md`
Comprehensive deployment guide including:
- Prerequisites and setup
- Three deployment methods (NPM scripts, direct scripts, manual)
- Configuration reference
- Build output explanation
- Deployment process walkthrough
- Cost estimates
- Accessing deployments
- ArNS registration guide
- Troubleshooting common issues
- Best practices
- Security considerations
- Resources and links

#### `README.md`
Updated deployment section:
- Highlights automated deployment (npm scripts)
- Lists prerequisites clearly
- Shows manual deployment option
- Links to comprehensive guide
- Alternative deployment tools

## Deployment Workflow

### Prerequisites

1. **Install arkb:**
   ```bash
   npm install -g arkb
   ```

2. **Get Arweave wallet:**
   - Visit [arweave.app](https://arweave.app)
   - Create wallet and save JSON file
   - Fund wallet with AR tokens (~0.001-0.01 AR needed)

3. **Save wallet:**
   ```bash
   # Save your wallet.json to:
   .workspace/config/wallet.json
   ```

### Deployment Process

#### Option 1: Automated (Recommended)

```bash
# Production deployment
npm run deploy
```

This will:
1. Check wallet exists and has balance
2. Build the application (`npm run build`)
3. Estimate deployment cost
4. Ask for confirmation (production only)
5. Upload to Arweave
6. Save deployment info
7. Open in browser

#### Option 2: Quick Deploy (Development)

```bash
# Fast deployment for testing
npm run deploy:quick
```

This will:
1. Build the application
2. Deploy immediately to Arweave
3. Minimal logging

#### Option 3: Manual

```bash
# 1. Build
npm run build

# 2. Deploy
arkb deploy dist/ --wallet .workspace/config/wallet.json
```

## Deployment Metadata

Every deployment includes these Arweave tags:

```javascript
{
  'App-Name': 'Lattelier',
  'App-Version': '0.1.0', // From package.json
  'Content-Type': 'text/html',
  'App-Type': 'web-app',
  'Category': 'design-tools',
  'Keywords': 'lattice,grid,distortion,pattern,design,generative,art',
  'Environment': 'production' // or 'development'
}
```

These tags make Lattelier:
- **Discoverable** in Arweave app directories
- **Categorized** properly for search
- **Versioned** for tracking deployments
- **Identifiable** as a web application

## Cost Analysis

**Current Build Size:**
- Uncompressed: ~235 KB
- Gzipped: ~68 KB

**Estimated Deployment Cost:**
- At ~0.00001 AR per KB
- ~68 KB × 0.00001 AR = **~0.00068 AR**
- At $30/AR: **~$0.02 USD per deployment**

**Cost-Saving Optimizations:**
- Chunk splitting prevents re-uploading unchanged vendor code
- Minification reduces bundle size
- Asset inlining reduces HTTP requests
- No source maps in production

## Future Enhancements

### ArNS Registration
Once deployed, you can register a human-readable name:

1. Visit [ar.io](https://ar.io)
2. Register `lattelier.arweave.dev` or `lattelier.ar.io`
3. Point to your transaction ID
4. Access via friendly URL

### Deployment History
Deployments will be logged to:
```
.workspace/config/deployments.json
```

Format:
```json
{
  "deployments": [
    {
      "timestamp": "2025-10-17T05:55:00Z",
      "version": "0.1.0",
      "environment": "prod",
      "transactionId": "abc123...xyz789",
      "url": "https://arweave.net/abc123...xyz789"
    }
  ]
}
```

### CI/CD Integration
Future potential to automate deployments:
- GitHub Actions workflow
- Deploy on git tag creation
- Automated version bumping
- Deployment notifications

## Verification Checklist

✅ **Deployment Scripts**
- ✅ deploy-to-arweave.sh updated with Lattelier branding
- ✅ quick-deploy.sh streamlined for rapid iteration
- ✅ Both scripts executable (`chmod +x`)

✅ **Configuration**
- ✅ deploy.config.js updated with correct metadata
- ✅ vite.config.ts optimized for Arweave
- ✅ wallet.json.example created as template

✅ **Security**
- ✅ wallet.json excluded from git
- ✅ deployments.json excluded from git
- ✅ Sensitive files documented in .gitignore

✅ **NPM Scripts**
- ✅ `npm run deploy` - production
- ✅ `npm run deploy:dev` - development
- ✅ `npm run deploy:quick` - quick test

✅ **Documentation**
- ✅ Comprehensive deployment guide created
- ✅ README updated with deployment instructions
- ✅ Prerequisites clearly documented

✅ **Build Optimization**
- ✅ Chunk splitting configured
- ✅ Minification enabled (esbuild)
- ✅ Source maps disabled
- ✅ Relative paths configured
- ✅ Total size optimized (~68 KB gzipped)

✅ **Testing**
- ✅ Build process verified (`npm run build`)
- ✅ Output size confirmed
- ✅ All chunks generated correctly

## Next Steps

1. **Fund Arweave Wallet**
   - Visit [arweave.app](https://arweave.app)
   - Transfer AR tokens to wallet

2. **Test Deployment**
   - Run `npm run deploy:dev` for first test
   - Verify app loads on Arweave gateway

3. **Production Deployment**
   - Run `npm run deploy`
   - Share permanent URL

4. **Optional: ArNS Registration**
   - Register friendly name at [ar.io](https://ar.io)
   - Point to transaction ID

## Resources

- [Arweave Documentation](https://docs.arweave.org)
- [Arkb CLI Tool](https://github.com/textury/arkb)
- [AR.IO Gateway](https://ar.io)
- [Arweave Wallet](https://arweave.app)
- [ArNS Documentation](https://docs.ar.io)

---

**Lattelier is now ready for permanent, decentralized deployment to the Arweave permaweb! 🚀**

