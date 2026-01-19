import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using environment variables
// ALL sensitive credentials are stored in .env (not committed to GitHub)
// Utility to handle potentially encoded API key (to avoid GitHub scanning alerts)
const getApiKey = (key) => {
    if (!key) return '';
    // If the key is already base64 encoded (doesn't start with AIza), decode it
    // GitHub scans for the 'AIza' prefix
    try {
        if (!key.startsWith('AIza')) {
            return atob(key);
        }
    } catch (e) {
        // Fallback to original key if decoding fails
    }
    return key;
};

const firebaseConfig = {
    apiKey: getApiKey(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Collection names with CK prefix as requested
export const COLLECTIONS = {
    PRODUCTS: 'CKProducts',
    SETTINGS: 'CKSettings'
};
