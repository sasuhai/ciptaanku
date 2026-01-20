import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Edit3, Save, Camera, RefreshCw } from 'lucide-react';

const ProductManager = ({ products, onUpdate, onClose, sortOrder, onSortChange }) => {
    const [editingId, setEditingId] = useState(null);
    const [refreshingId, setRefreshingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        purpose: '',
        category: 'Website',
        url: '',
        accent: '#007aff',
        createdDate: new Date().toISOString().split('T')[0] // Today's date
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            onUpdate(products.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
        } else {
            onUpdate([...products, { ...formData, id: `product-${Date.now()}` }]);
        }
        resetForm();
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            purpose: '',
            category: 'Website',
            url: '',
            accent: '#007aff',
            createdDate: new Date().toISOString().split('T')[0]
        });
    };

    const startEdit = (product) => {
        setEditingId(product.id);
        setFormData({ ...product });
    };

    const handleDelete = (id) => {
        if (confirm('Delete this product?')) {
            onUpdate(products.filter(p => p.id !== id));
        }
    };

    const handleRefreshScreenshot = async (product) => {
        setRefreshingId(product.id);
        try {
            // Use a direct screenshot URL that works without JSON parsing
            // This creates a cache-busted URL that will force a fresh screenshot
            const timestamp = Date.now();
            const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(product.url)}&screenshot=true&meta=false&embed=screenshot.url&force=true&t=${timestamp}`;

            // Test if the URL is valid by trying to load it
            const testImg = new Image();
            testImg.crossOrigin = "anonymous";

            await new Promise((resolve, reject) => {
                testImg.onload = () => resolve(true);
                testImg.onerror = () => reject(new Error('Failed to load screenshot'));
                testImg.src = screenshotUrl;
            });

            // If we get here, the image loaded successfully
            // Update product with new screenshot URL
            const updatedProducts = products.map(p =>
                p.id === product.id
                    ? {
                        ...p,
                        screenshotUrl: screenshotUrl,
                        lastScreenshotUpdate: new Date().toISOString()
                    }
                    : p
            );
            onUpdate(updatedProducts);

            // Log success (thumbnail update is visual feedback)
            console.log(`✅ Screenshot refreshed for ${product.name}`);
        } catch (error) {
            console.error('Error refreshing screenshot:', error);
            alert('❌ Error refreshing screenshot. The API might be temporarily unavailable.');
        } finally {
            setRefreshingId(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(12, 12, 12, 0.95)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-md)'
            }}
        >
            <div style={{
                width: '100%',
                maxWidth: '1000px',
                height: '80vh',
                background: 'var(--surface-color)',
                borderRadius: '24px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                boxShadow: '0 50px 100px rgba(0,0,0,0.5)'
            }}>
                {/* Form Section */}
                <div style={{ padding: 'var(--space-lg)', borderRight: '1px solid var(--border-color)' }}>
                    <header style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </header>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        <div className="input-group">
                            <label>Name</label>
                            <input
                                type="text" required value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Product Name"
                            />
                        </div>
                        <div className="input-group">
                            <label>Purpose / Pitch</label>
                            <input
                                type="text" required value={formData.purpose}
                                onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                                placeholder="One-line purpose"
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                            <div className="input-group">
                                <label>Category</label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option>Website</option>
                                    <option>Web App</option>
                                    <option>AI Tool</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Accent Color</label>
                                <input
                                    type="color" value={formData.accent}
                                    onChange={e => setFormData({ ...formData, accent: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Live URL</label>
                            <input
                                type="url" required value={formData.url}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://yourwork.com"
                            />
                        </div>
                        <div className="input-group">
                            <label>Created Date</label>
                            <input
                                type="date"
                                required
                                value={formData.createdDate || new Date().toISOString().split('T')[0]}
                                onChange={e => setFormData({ ...formData, createdDate: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            {editingId ? <><Save size={18} /> Update Product</> : <><Plus size={18} /> Add Product</>}
                        </button>
                        {editingId && <button type="button" onClick={resetForm} className="btn-secondary">Cancel Edit</button>}
                    </form>
                </div>

                {/* List Section */}
                <div style={{ padding: 'var(--space-lg)', overflowY: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Product Lab Inventory</h3>
                        <button
                            onClick={() => onSortChange(sortOrder === 'date' ? 'random' : 'date')}
                            style={{
                                padding: '6px 12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                letterSpacing: '0.05em'
                            }}
                        >
                            {sortOrder === 'date' ? '📅 DATE' : '🎲 RANDOM'}
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {products.map(p => (
                            <div key={p.id} style={{
                                padding: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '12px',
                                border: editingId === p.id ? `1px solid ${p.accent}` : '1px solid transparent'
                            }}>
                                {/* Screenshot Thumbnail */}
                                <div style={{
                                    width: '80px',
                                    height: '45px',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    background: `linear-gradient(135deg, ${p.accent}22, ${p.accent}44)`,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    flexShrink: 0,
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {refreshingId === p.id ? (
                                        <div style={{
                                            fontSize: '0.6rem',
                                            color: '#fff',
                                            opacity: 0.6,
                                            fontWeight: 600
                                        }}>
                                            LOADING...
                                        </div>
                                    ) : (
                                        <img
                                            src={p.thumbnail || p.screenshotUrl || `https://api.microlink.io/?url=${encodeURIComponent(p.url)}&screenshot=true&meta=false&embed=screenshot.url`}
                                            alt={p.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = `<div style="font-size: 0.5rem; color: #fff; opacity: 0.4; text-align: center;">${p.category}</div>`;
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Product Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: 600, marginBottom: '4px' }}>{p.name}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.url}</p>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <button
                                        onClick={() => handleRefreshScreenshot(p)}
                                        className="icon-btn"
                                        disabled={refreshingId === p.id}
                                        style={{
                                            color: refreshingId === p.id ? '#34c759' : '#007aff',
                                            opacity: refreshingId === p.id ? 0.6 : 1
                                        }}
                                        title="Refresh Screenshot"
                                    >
                                        <RefreshCw size={16} className={refreshingId === p.id ? 'spinning' : ''} />
                                    </button>
                                    <button onClick={() => startEdit(p)} className="icon-btn"><Edit3 size={16} /></button>
                                    <button onClick={() => handleDelete(p.id)} className="icon-btn" style={{ color: '#ff3b30' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .input-group label { display: block; font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 4px; text-transform: uppercase; }
        .input-group input, .input-group select { 
          width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color);
          border-radius: 8px; color: white; font-size: 0.9rem;
        }
        .btn-primary { 
          margin-top: 10px; padding: 14px; background: var(--accent-color); color: white; border: none; 
          border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600;
        }
        .btn-secondary { background: none; border: 1px solid var(--border-color); color: white; padding: 10px; border-radius: 8px; margin-top: 5px; cursor: pointer; }
        .icon-btn { background: none; border: none; color: white; cursor: pointer; opacity: 0.6; transition: 0.2s; }
        .icon-btn:hover { opacity: 1; }
        .icon-btn:disabled { cursor: not-allowed; }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
        </motion.div>
    );
};

export default ProductManager;
