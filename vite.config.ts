import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        // Optimize for Arweave deployment
        target: 'es2015',
        minify: 'esbuild', // esbuild is faster and included with Vite
        // Source maps are large, disable for production
        sourcemap: false,
        // Chunk splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separate vendor chunks
                    'react-vendor': ['react', 'react-dom'],
                    'state-vendor': ['zustand', 'immer'],
                    'animation-vendor': ['gsap'],
                },
            },
        },
        // Asset handling
        assetsInlineLimit: 4096, // Inline small assets as base64
        chunkSizeWarningLimit: 1000,
    },
    // Use relative paths for Arweave deployment
    base: './',
})

