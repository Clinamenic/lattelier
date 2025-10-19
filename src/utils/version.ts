// Version utility for dynamic version display
// This reads the version from package.json at build time

import packageJson from '../../package.json';

export const APP_VERSION = packageJson.version;

// Helper to format version for display
export const getVersionDisplay = (): string => {
    return `v${APP_VERSION}`;
};

// Helper to get version info for debugging
export const getVersionInfo = () => {
    return {
        version: APP_VERSION,
        display: getVersionDisplay(),
        buildTime: new Date().toISOString(),
    };
};
