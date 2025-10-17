# Arweave Deployment Guide for Lattelier

## Overview

Lattelier is designed to be deployed to Arweave's permaweb for permanent, decentralized hosting. This guide explains the deployment process and configuration.

## Prerequisites

1. **Arweave Wallet**
   - Create an Arweave wallet at [arweave.app](https://arweave.app)
   - Fund your wallet with AR tokens (approximately 0.001-0.01 AR per deployment)
   - Save your wallet JSON file to `.workspace/config/wallet.json`

2. **Arkb CLI Tool**
   ```bash
   npm install -g arkb
   ```

## Deployment Methods

### Method 1: NPM Scripts (Recommended)

The easiest way to deploy using pre-configured scripts:

```bash
# Production deployment (includes confirmation prompt)
npm run deploy

# Development deployment (no confirmation)
npm run deploy:dev

# Quick deployment (minimal logging)
npm run deploy:quick
```

### Method 2: Direct Script Execution

For more control, run the scripts directly:

```bash
# Full deployment with all features
./.workspace/scripts/deploy-to-arweave.sh --prod

# Development deployment
./.workspace/scripts/deploy-to-arweave.sh --dev

# Quick deployment
./.workspace/scripts/quick-deploy.sh
```

### Method 3: Manual Deployment

For complete control over the deployment process:

```bash
# 1. Build the application
npm run build

# 2. Deploy with arkb
arkb deploy dist/ --wallet .workspace/config/wallet.json

# 3. Optional: Add custom tags
arkb deploy dist/ \
  --wallet .workspace/config/wallet.json \
  --tag App-Name Lattelier \
  --tag App-Version 0.1.0 \
  --tag Category design-tools
```

## Deployment Configuration

### Config File: `.workspace/config/deploy.config.js`

This file contains the deployment configuration:

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

### Build Output

Vite builds the application to the `dist/` directory:

```
dist/
├── index.html              # Entry point
├── assets/
│   ├── index-[hash].js     # Application code (~217 KB gzipped)
│   ├── index-[hash].css    # Styles (~4 KB gzipped)
│   └── vite.svg            # Default favicon
└── (other static assets)
```

## Deployment Process

The deployment script performs these steps:

1. **Pre-deployment Checks**
   - Verifies wallet file exists
   - Checks wallet balance (optional)
   - Validates package.json

2. **Build**
   - Runs `npm run build`
   - Verifies `dist/` directory was created
   - Estimates deployment cost

3. **Upload**
   - Uploads `dist/` folder to Arweave
   - Adds metadata tags for discoverability
   - Generates transaction ID

4. **Post-deployment**
   - Saves deployment info to `deployments.json`
   - Provides Arweave URLs
   - Optionally opens in browser

## Deployment Costs

Approximate costs (as of 2025):
- **Small deployment** (~300 KB): ~0.001 AR
- **Medium deployment** (~1 MB): ~0.003 AR
- **Lattelier** (~250 KB gzipped): ~0.001 AR

Costs scale linearly with data size. Arweave storage is a one-time payment for permanent hosting.

## Accessing Your Deployment

After deployment, your app will be accessible at:

```
https://arweave.net/[TRANSACTION_ID]
```

Example:
```
https://arweave.net/abc123...xyz789
```

### Alternative Gateways

You can also access via:
- `https://[TRANSACTION_ID].arweave.net`
- `https://arweave.dev/[TRANSACTION_ID]`
- `https://ar.io/[TRANSACTION_ID]`

## ArNS (Arweave Name System)

For a human-readable URL, you can register an ArNS name:

1. Visit [ar.io](https://ar.io)
2. Register your desired name (e.g., `lattelier`)
3. Point it to your transaction ID
4. Access via: `https://lattelier.ar.io`

## Deployment History

All deployments are logged to `.workspace/config/deployments.json`:

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

## Troubleshooting

### Wallet Issues

**Problem**: "Wallet file not found"
- **Solution**: Ensure wallet.json is saved to `.workspace/config/wallet.json`

**Problem**: "Insufficient balance"
- **Solution**: Fund your wallet at [arweave.app](https://arweave.app) or use a faucet for testnet

### Build Issues

**Problem**: "Build directory not found"
- **Solution**: Ensure `npm run build` completes successfully
- Check for TypeScript errors with `npm run typecheck`

**Problem**: "TypeScript compilation failed"
- **Solution**: Run `npm run lint` to identify issues

### Deployment Issues

**Problem**: "arkb command not found"
- **Solution**: Install globally with `npm install -g arkb`

**Problem**: "Deployment timed out"
- **Solution**: Check your internet connection and retry
- The script includes automatic retry logic

## Best Practices

1. **Test Locally First**
   - Always run `npm run preview` after building
   - Verify all features work as expected

2. **Use Development Deployments**
   - Test with `npm run deploy:dev` before production
   - Development deployments are tagged separately

3. **Version Control**
   - Commit all changes before deploying
   - Tag releases with git: `git tag v0.1.0`

4. **Monitor Costs**
   - Check wallet balance regularly
   - Review deployment history

5. **Keep Wallet Secure**
   - Never commit wallet.json to git
   - Backup wallet file securely
   - Use separate wallets for dev/prod if desired

## Security

The `.gitignore` file is configured to never commit:
- `.workspace/config/wallet.json` - Your Arweave wallet
- `.workspace/config/deployments.json` - Deployment history
- `dist/` - Build output

Always verify these files are not staged before committing!

## Next Steps

1. Fund your Arweave wallet
2. Run a test deployment: `npm run deploy:dev`
3. Verify the deployment works
4. Deploy to production: `npm run deploy`
5. Share your permanent Arweave URL!

## Resources

- [Arweave Documentation](https://docs.arweave.org)
- [Arkb CLI Tool](https://github.com/textury/arkb)
- [AR.IO Gateway](https://ar.io)
- [ArDrive Web App](https://ardrive.io)
- [Arweave Wallet](https://arweave.app)

