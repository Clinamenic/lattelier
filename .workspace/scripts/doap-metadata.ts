import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

interface DOAPMetadataOptions {
    doapPath: string
}

export function doapMetadataPlugin(options: DOAPMetadataOptions): Plugin {
    let doapData: any = null

    return {
        name: 'doap-metadata',
        writeBundle() {
            // Copy doap.json to dist directory after build is complete
            try {
                const distPath = path.join(process.cwd(), 'dist')
                const doapDestPath = path.join(distPath, 'doap.json')

                // Ensure dist directory exists
                if (!fs.existsSync(distPath)) {
                    fs.mkdirSync(distPath, { recursive: true })
                }

                // Copy doap.json to dist
                fs.copyFileSync(options.doapPath, doapDestPath)
                console.log(`📄 Copied doap.json to dist directory for public access`)
            } catch (error) {
                console.warn('Warning: Could not copy doap.json to dist directory:', error)
            }
        },
        transformIndexHtml: {
            enforce: 'pre',
            transform(html: string) {
                try {
                    // Read DOAP data
                    if (!doapData) {
                        const doapPath = path.resolve(options.doapPath)
                        if (!fs.existsSync(doapPath)) {
                            console.warn(`DOAP file not found at ${doapPath}`)
                            return html
                        }
                        doapData = JSON.parse(fs.readFileSync(doapPath, 'utf-8'))
                    }

                    // Extract metadata with fallbacks for placeholders
                    const projectName = doapData.name || '{{PROJECT_NAME}}'
                    const projectDescription = doapData.description || '{{PROJECT_DESCRIPTION}}'
                    const projectVersion = doapData.version || '{{PROJECT_VERSION}}'
                    const authorName = doapData.author?.name || '{{AUTHOR_NAME}}'
                    const projectUrl = doapData.url || doapData.homepage || '{{PROJECT_URL}}'

                    // Get keywords as comma-separated string
                    const keywords = Array.isArray(doapData.keywords)
                        ? doapData.keywords.join(', ')
                        : '{{KEYWORDS}}'

                    // Get latest deployment info
                    const deployments = doapData.deployments || []
                    const latestDeployment = deployments.length > 0 ? deployments[0] : {}
                    const deploymentVersion = latestDeployment.version || projectVersion
                    const deploymentDate = latestDeployment.deploymentDate || new Date().toISOString()

                    // Replace placeholders
                    let transformedHtml = html
                        .replace(/\{\{PROJECT_NAME\}\}/g, projectName)
                        .replace(/\{\{PROJECT_DESCRIPTION\}\}/g, projectDescription)
                        .replace(/\{\{PROJECT_VERSION\}\}/g, projectVersion)
                        .replace(/\{\{AUTHOR_NAME\}\}/g, authorName)
                        .replace(/\{\{PROJECT_URL\}\}/g, projectUrl)
                        .replace(/\{\{KEYWORDS\}\}/g, keywords)
                        .replace(/\{\{DEPLOYMENT_VERSION\}\}/g, deploymentVersion)
                        .replace(/\{\{DEPLOYMENT_DATE\}\}/g, deploymentDate)

                    return transformedHtml
                } catch (error) {
                    console.warn('Warning: Could not process DOAP metadata:', error)
                    return html
                }
            }
        }
    }
}
