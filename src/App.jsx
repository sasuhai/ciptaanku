import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, onSnapshot, doc, setDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import Hero from './components/Hero';
import ProductIndex from './components/ProductIndex';
import ShowcaseStage from './components/ShowcaseStage';
import Sidebar from './components/Sidebar';
import ProductManager from './components/ProductManager';

const DEFAULT_PRODUCTS = [
  {
    id: 'product-1',
    name: 'NeoStream',
    purpose: 'Next-gen streaming experience for creative assets.',
    category: 'Web App',
    url: 'https://example.com/neostream',
    thumbnail: '/thumbnails/neostream.png',
    accent: '#ff3b30',
    createdDate: '2026-01-15'
  },
  {
    id: 'product-2',
    name: 'Zenith AI',
    purpose: 'Intelligent design companion for spatial computing.',
    category: 'AI Tool',
    url: 'https://example.com/zenith',
    thumbnail: '/thumbnails/zenithai.png',
    accent: '#34c759',
    createdDate: '2026-01-10'
  },
  {
    id: 'product-3',
    name: 'Lumina',
    purpose: 'High-end editorial platform for digital fashion.',
    category: 'Website',
    url: 'https://example.com/lumina',
    thumbnail: '/thumbnails/lumina.png',
    accent: '#af52de',
    createdDate: '2026-01-18'
  }
];

function App() {
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('date'); // 'date' or 'random'
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const settingsLoadedRef = useRef(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.style.setProperty('--bg-color', '#f5f5f7');
      document.documentElement.style.setProperty('--surface-color', '#ffffff');
      document.documentElement.style.setProperty('--text-primary', '#1d1d1f');
      document.documentElement.style.setProperty('--text-secondary', '#6e6e73');
      document.documentElement.style.setProperty('--border-color', 'rgba(0,0,0,0.1)');
    } else {
      document.documentElement.style.setProperty('--bg-color', '#0a0a0a');
      document.documentElement.style.setProperty('--surface-color', 'rgba(28, 28, 30, 0.8)');
      document.documentElement.style.setProperty('--text-primary', '#f5f5f7');
      document.documentElement.style.setProperty('--text-secondary', '#86868b');
      document.documentElement.style.setProperty('--border-color', 'rgba(255,255,255,0.1)');
    }
  }, [theme]);

  // Initialize Firebase data on first load
  useEffect(() => {
    const initializeData = async () => {
      try {
        const productsRef = collection(db, COLLECTIONS.PRODUCTS);
        const snapshot = await getDocs(productsRef);

        // If no products in Firebase, seed with defaults
        if (snapshot.empty) {
          console.log('Initializing Firebase with default products...');
          for (const product of DEFAULT_PRODUCTS) {
            await setDoc(doc(db, COLLECTIONS.PRODUCTS, product.id), product);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Firebase data:', error);
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Load sortOrder from Firebase on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'app'));
        if (settingsDoc.exists()) {
          const settings = settingsDoc.data();
          console.log('📥 Loaded settings from Firebase:', settings);
          if (settings.sortOrder) {
            setSortOrder(settings.sortOrder);
          }
        } else {
          console.log('📄 No settings document found, using defaults');
        }
        settingsLoadedRef.current = true;
      } catch (error) {
        console.error('Error loading settings:', error);
        settingsLoadedRef.current = true;
      }
    };

    loadSettings();
  }, []);

  // Save sortOrder to Firebase when it changes
  useEffect(() => {
    const saveSettings = async () => {
      try {
        console.log('💾 Saving sortOrder to Firebase:', sortOrder);
        await setDoc(doc(db, COLLECTIONS.SETTINGS, 'app'), {
          sortOrder: sortOrder,
          updatedAt: new Date().toISOString()
        });
        console.log('✅ Settings saved successfully');
      } catch (error) {
        console.error('❌ Error saving settings:', error);
      }
    };

    // Only save after settings have been loaded from Firebase
    if (settingsLoadedRef.current && sortOrder) {
      saveSettings();
    }
  }, [sortOrder]);

  // Real-time listener for products collection
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTIONS.PRODUCTS),
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProducts(productsData);

        // Update active product if it was modified or deleted
        if (activeProduct) {
          const current = productsData.find(p => p.id === activeProduct.id);
          if (current) {
            setActiveProduct(current);
          } else if (productsData.length > 0) {
            setActiveProduct(productsData[0]);
          } else {
            setActiveProduct(null);
          }
        } else if (productsData.length > 0) {
          setActiveProduct(productsData[0]);
        }
      },
      (error) => {
        console.error('Error listening to products:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handler to update products (called from ProductManager)
  const handleUpdateProducts = async (updatedProducts) => {
    try {
      // Get current products from Firebase
      const productsRef = collection(db, COLLECTIONS.PRODUCTS);
      const snapshot = await getDocs(productsRef);
      const currentIds = snapshot.docs.map(doc => doc.id);
      const updatedIds = updatedProducts.map(p => p.id);

      // Delete removed products
      const deletedIds = currentIds.filter(id => !updatedIds.includes(id));
      for (const id of deletedIds) {
        await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
      }

      // Add or update products
      for (const product of updatedProducts) {
        await setDoc(doc(db, COLLECTIONS.PRODUCTS, product.id), product);
      }
    } catch (error) {
      console.error('Error updating products:', error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        onOpenManager={() => setIsManagerOpen(true)}
        activeProduct={activeProduct}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <main>
        <Hero onExplore={() => document.getElementById('showcase').scrollIntoView({ behavior: 'smooth' })} />

        <section id="showcase">
          {isLoading ? (
            <div className="container section-padding" style={{ textAlign: 'center' }}>
              <h2>Loading Product Lab...</h2>
            </div>
          ) : products.length > 0 && activeProduct ? (
            <ShowcaseStage
              products={products}
              activeProduct={activeProduct}
              onSelectProduct={setActiveProduct}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
          ) : (
            <div className="container section-padding" style={{ textAlign: 'center' }}>
              <h2>No products lab yet.</h2>
              <button onClick={() => setIsManagerOpen(true)}>Initialize Lab</button>
            </div>
          )}
        </section>

        <AnimatePresence>
          {isManagerOpen && (
            <ProductManager
              products={products}
              onUpdate={handleUpdateProducts}
              onClose={() => setIsManagerOpen(false)}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="container section-padding" style={{ opacity: 0.5, fontSize: '0.8rem', textAlign: 'center' }}>
        <p>© 2026 PRODUCT LAB. CRAFTED WITH PRECISION.</p>
      </footer>
    </div>
  );
}

export default App;
