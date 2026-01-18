import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Edit3, Save } from 'lucide-react';

const ProductManager = ({ products, onUpdate, onClose, sortOrder, onSortChange }) => {
    const [editingId, setEditingId] = useState(null);
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
                                border: editingId === p.id ? `1px solid ${p.accent}` : '1px solid transparent'
                            }}>
                                <div>
                                    <p style={{ fontWeight: 600 }}>{p.name}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{p.url}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
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
      `}</style>
        </motion.div>
    );
};

export default ProductManager;
