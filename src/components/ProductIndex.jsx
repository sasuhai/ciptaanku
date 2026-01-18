import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProductIndex = ({ products, onSelectProduct, activeId }) => {
    return (
        <div className="container" style={{ paddingTop: 'var(--space-xl)' }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px', // Thin grid lines
                background: 'var(--border-color)',
                border: '1px solid var(--border-color)'
            }}>
                {products.map((product, index) => (
                    <ProductRow
                        key={product.id}
                        product={product}
                        index={index}
                        isActive={activeId === product.id}
                        onClick={() => onSelectProduct(product)}
                    />
                ))}
            </div>
        </div>
    );
};

const ProductRow = ({ product, index, isActive, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            style={{
                background: 'var(--bg-color)',
                padding: 'var(--space-lg)',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr 150px',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: 'var(--transition-smooth)'
            }}
        >
            <motion.div
                initial={false}
                animate={{ background: isHovered || isActive ? 'var(--accent-color)' : 'transparent' }}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '5px'
                }}
            />

            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-heading)' }}>
                0{index + 1}
            </span>

            <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{product.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{product.category}</p>
            </div>

            <div style={{
                opacity: isHovered || isActive ? 1 : 0,
                transform: isHovered || isActive ? 'translateX(0)' : 'translateX(20px)',
                transition: 'var(--transition-smooth)'
            }}>
                <p style={{ fontSize: '1rem', maxWidth: '300px' }}>{product.purpose}</p>
            </div>

            <div style={{ textAlign: 'right' }}>
                <motion.span
                    animate={{ x: isHovered ? 10 : 0 }}
                    style={{ fontSize: '1.5rem' }}
                >
                    →
                </motion.span>
            </div>
        </motion.div>
    );
};

export default ProductIndex;
