// Arweave deployment configuration for Lattelier
const path = require('path');

module.exports = {
  // Wallet configuration
  walletPath: path.join(__dirname, 'wallet.json'),
  
  // Build configuration
  buildDir: 'dist',
  buildCommand: 'npm run build',
  
  // Deployment settings
  appName: 'Lattelier',
  description: 'Professional lattice distortion and pattern generation tool',
  
  // ArNS configuration (optional)
  arnsName: 'lattelier', // Reserve this name for later
  
  // Tags for discovery
  tags: [
    { name: 'App-Name', value: 'Lattelier' },
    { name: 'App-Version', value: process.env.npm_package_version || '0.1.0' },
    { name: 'Content-Type', value: 'text/html' },
    { name: 'App-Type', value: 'web-app' },
    { name: 'Category', value: 'design-tools' },
    { name: 'Keywords', value: 'lattice,grid,distortion,pattern,design,generative,art' }
  ],
  
  // Deployment options
  options: {
    // Automatically open the deployed app after upload
    openAfterDeploy: true,
    
    // Show verbose output during deployment
    verbose: true,
    
    // Retry failed uploads
    retryAttempts: 3
  }
};
