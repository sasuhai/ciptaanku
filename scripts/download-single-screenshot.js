// Helper function to download a single screenshot
// Can be imported and used in the React app
export async function downloadSingleScreenshot(productId, productUrl) {
    try {
        console.log(`📸 Capturing screenshot for product: ${productId}`);

        // Use Microlink API
        const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(productUrl)}&screenshot=true&meta=false&embed=screenshot.url`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'success' && data.data.screenshot.url) {
            const imageUrl = data.data.screenshot.url;
            const thumbnailPath = `/thumbnails/${productId}.png`;

            // For client-side, we'll return the API URL
            // The actual download will be handled by the server script
            return {
                success: true,
                apiUrl: imageUrl,
                thumbnailPath: thumbnailPath,
                timestamp: new Date().toISOString()
            };
        } else {
            return { success: false, error: 'Failed to capture screenshot' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Node.js script version for CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
    const productId = process.argv[2];
    const productUrl = process.argv[3];

    if (!productId || !productUrl) {
        console.error('Usage: node download-single-screenshot.js <productId> <productUrl>');
        process.exit(1);
    }

    import('fs').then(fs => {
        import('path').then(path => {
            import('url').then(url => {
                const __filename = url.fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);

                downloadSingleScreenshot(productId, productUrl).then(async result => {
                    if (result.success) {
                        // Download and save the image
                        const imageResponse = await fetch(result.apiUrl);
                        const buffer = await imageResponse.arrayBuffer();

                        const thumbnailsDir = path.join(__dirname, '../public/thumbnails');
                        if (!fs.existsSync(thumbnailsDir)) {
                            fs.mkdirSync(thumbnailsDir, { recursive: true });
                        }

                        const filepath = path.join(thumbnailsDir, `${productId}.png`);
                        fs.writeFileSync(filepath, Buffer.from(buffer));

                        console.log(`✅ Screenshot saved: ${result.thumbnailPath}`);
                        process.exit(0);
                    } else {
                        console.error(`❌ ${result.error}`);
                        process.exit(1);
                    }
                });
            });
        });
    });
}
