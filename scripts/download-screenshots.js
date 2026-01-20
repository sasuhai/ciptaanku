import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTIONS = {
    PRODUCTS: 'CKProducts'
};

// Create thumbnails directory if it doesn't exist
const thumbnailsDir = path.join(__dirname, '../public/thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
    console.log('✅ Created thumbnails directory');
}

async function downloadScreenshot(url, productId) {
    try {
        console.log(`📸 Capturing screenshot for: ${url}`);

        // Use screenshot.one - free, reliable, no API key needed
        const imageUrl = `https://api.screenshotone.com/take?url=${encodeURIComponent(url)}&viewport_width=1280&viewport_height=720&device_scale_factor=1&format=png&block_ads=true&block_cookie_banners=true&block_trackers=true`;

        console.log(`🌐 Downloading screenshot...`);
        const imageResponse = await fetch(imageUrl);

        if (!imageResponse.ok) {
            console.error(`❌ Failed to download (${imageResponse.status}): ${url}`);
            return null;
        }

        const buffer = await imageResponse.arrayBuffer();

        // Save to file
        const filename = `${productId}.png`;
        const filepath = path.join(thumbnailsDir, filename);
        fs.writeFileSync(filepath, Buffer.from(buffer));

        const fileSize = (buffer.byteLength / 1024).toFixed(1);
        console.log(`✅ Saved ${filename} (${fileSize} KB)`);
        return `/thumbnails/${filename}`;
    } catch (error) {
        console.error(`❌ Error downloading screenshot for ${url}:`, error.message);
        return null;
    }
}

async function downloadAllScreenshots() {
    try {
        console.log('🚀 Starting screenshot download process...\n');

        // Get all products from Firebase
        const productsRef = collection(db, COLLECTIONS.PRODUCTS);
        const snapshot = await getDocs(productsRef);

        if (snapshot.empty) {
            console.log('⚠️  No products found in Firebase');
            return;
        }

        console.log(`📦 Found ${snapshot.size} products\n`);

        let successCount = 0;
        let failCount = 0;

        // Process each product
        for (const docSnapshot of snapshot.docs) {
            const product = docSnapshot.data();
            const productId = docSnapshot.id;

            console.log(`\n--- Processing: ${product.name} ---`);

            // Download screenshot
            const thumbnailPath = await downloadScreenshot(product.url, productId);

            if (thumbnailPath) {
                // Update Firebase with thumbnail path
                await updateDoc(doc(db, COLLECTIONS.PRODUCTS, productId), {
                    thumbnail: thumbnailPath
                });
                console.log(`✅ Updated Firebase with thumbnail path`);
                successCount++;
            } else {
                failCount++;
            }

            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('\n' + '='.repeat(50));
        console.log('🎉 Screenshot download complete!');
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Failed: ${failCount}`);
        console.log('='.repeat(50));

        // Exit after completion
        process.exit(0);
    } catch (error) {
        console.error('❌ Error in download process:', error);
        process.exit(1);
    }
}

// Run the script
downloadAllScreenshots();
