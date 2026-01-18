import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ShowcaseStage = ({ products, activeProduct, onSelectProduct, sortOrder, onSortChange }) => {
    const laptopContainerRef = useRef(null);
    const mobileContainerRef = useRef(null);
    const [laptopScale, setLaptopScale] = useState(1);
    const [mobileScale, setMobileScale] = useState(1);

    const [maskedImage, setMaskedImage] = useState(null);

    useEffect(() => {
        const processImage = async () => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = "/office_mockup.jpg";
            await new Promise(resolve => img.onload = resolve);

            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Green screen removal (Chromakey) - Targeted ONLY at the bright screens
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Very specific check for the high-intensity green used in the screens
                // This avoids hitting the darker/muddier green reflections on the keyboard
                if (g > 100 && g > r * 1.5 && g > b * 1.5) {
                    data[i + 3] = 0; // Set alpha to 0 (transparent)
                }
            }

            ctx.putImageData(imageData, 0, 0);
            setMaskedImage(canvas.toDataURL());
        };

        processImage();
    }, []);

    useEffect(() => {
        const updateScales = () => {
            if (laptopContainerRef.current) {
                const width = laptopContainerRef.current.offsetWidth;
                setLaptopScale(width / 1440);
            }
            if (mobileContainerRef.current) {
                const width = mobileContainerRef.current.offsetWidth;
                setMobileScale(width / 402);
            }
        };

        const observer = new ResizeObserver(updateScales);
        if (laptopContainerRef.current) observer.observe(laptopContainerRef.current);
        if (mobileContainerRef.current) observer.observe(mobileContainerRef.current);
        updateScales();

        return () => observer.disconnect();
    }, [activeProduct]);

    // Sort products based on sortOrder
    const sortedProducts = React.useMemo(() => {
        if (sortOrder === 'date') {
            return [...products].sort((a, b) => {
                const dateA = new Date(a.createdDate || '2026-01-01');
                const dateB = new Date(b.createdDate || '2026-01-01');
                return dateB - dateA; // Newest first
            });
        } else {
            // Random shuffle
            return [...products].sort(() => Math.random() - 0.5);
        }
    }, [products, sortOrder]);

    return (
        <section style={{
            minHeight: '150vh', // Increased to show cards that extend below
            width: '100%',
            background: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-xl) 0',
            paddingBottom: 'calc(var(--space-xl) + 200px)', // Extra padding for cards
            position: 'relative',
            overflow: 'hidden' // Restore to enable iframe scrolling
        }}>
            <div style={{
                textAlign: 'left',
                marginBottom: '20px',
                zIndex: 10,
                width: '100%',
                maxWidth: '1280px',
                paddingLeft: 'var(--space-xl)',
                marginLeft: 'auto',
                marginRight: 0
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeProduct.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 style={{ fontSize: '0.7rem', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.2em' }}>
                            {activeProduct.name.toUpperCase()}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px' }}>
                            <span style={{ width: '40px', height: '1px', background: activeProduct.accent }}></span>
                            <p style={{ color: activeProduct.accent, fontWeight: 600, letterSpacing: '0.2em', fontSize: '0.7rem' }}>
                                {activeProduct.category.toUpperCase()} // PRODUCT LAB SESSION
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* INTEGRATED OFFICE MOCKUP - LAYERED APPROACH */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1280px', // Reduced by 20% from 1600px
                aspectRatio: '16/9',
                zIndex: 5,
                marginLeft: 'auto', // Align to right
                marginRight: 0,
                backgroundImage: 'url("/office_mockup.jpg")',
                backgroundSize: 'cover',
                boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
                overflow: 'visible', // Changed from 'hidden' to show carousel cards
                // Smooth blend ONLY on the left side, sharp on the right. Fade increased to 25%
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%)',
                maskImage: 'linear-gradient(to right, transparent, black 25%)'
            }}>
                {/* IFRAMES ARE PLACED BEHIND THE MASKED IMAGE */}

                {/* LAPTOP SCREEN CONTAINER */}
                <div
                    style={{
                        position: 'absolute',
                        top: '21.43%',
                        left: '22.26%',
                        width: '51.37%',
                        height: '50.37%',
                        background: '#000',
                        zIndex: 1
                    }}
                >
                    <div
                        ref={laptopContainerRef}
                        style={{ width: '100%', height: '100%', position: 'relative' }}
                    >
                        <div style={{
                            width: '1440px',
                            height: '900px',
                            transform: `scale(${laptopScale})`,
                            transformOrigin: 'top left',
                        }}>
                            <iframe
                                src={activeProduct.url}
                                title={activeProduct.name}
                                style={{ width: '1440px', height: '900px', border: 'none', background: '#fff' }}
                            />
                        </div>
                    </div>
                </div>

                {/* IPHONE SCREEN CONTAINER */}
                <div
                    style={{
                        position: 'absolute',
                        top: '37.65%',
                        left: '79.59%',
                        width: '13.78%',
                        height: '44.67%',
                        background: '#000',
                        zIndex: 2
                    }}
                >
                    <div
                        ref={mobileContainerRef}
                        style={{ width: '100%', height: '100%', position: 'relative' }}
                    >
                        <div style={{
                            width: '402px',
                            height: '874px',
                            transform: `scale(${mobileScale})`,
                            transformOrigin: 'top left',
                        }}>
                            <iframe
                                src={activeProduct.url}
                                title={`${activeProduct.name} Mobile`}
                                style={{ width: '402px', height: '874px', border: 'none', background: '#fff' }}
                            />
                        </div>
                    </div>
                </div>

                {/* THE MASKED IMAGE (TOP LAYER) */}
                {maskedImage && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${maskedImage})`,
                        backgroundSize: 'cover',
                        zIndex: 4,
                        pointerEvents: 'none' // Allow clicks to pass through to iframes
                    }} />
                )}
            </div>

            {/* INFINITE SCROLLING PRODUCT CAROUSEL - BELOW IMAGE */}
            <div style={{
                width: '100%',
                marginTop: '60px',
                overflow: 'hidden', // Enable for mask effect
                zIndex: 10,
                WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
                maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)'
            }}>
                <div
                    className="product-scroll-track"
                    style={{
                        display: 'flex',
                        gap: '16px',
                        width: 'max-content'
                    }}
                >
                    {/* Double the products for infinite scroll effect */}
                    {[...sortedProducts, ...sortedProducts].map((p, index) => (
                        <motion.div
                            key={`${p.id}-${index}`}
                            onClick={() => onSelectProduct(p)}
                            whileHover={{
                                scale: 1.05,
                                y: -5
                            }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: '204px',
                                flexShrink: 0,
                                cursor: 'pointer',
                                opacity: activeProduct.id === p.id ? 1 : 0.9,
                                transition: 'opacity 0.3s ease',
                                background: 'rgba(0, 0, 0, 0.6)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '16px',
                                border: activeProduct.id === p.id
                                    ? `2px solid ${p.accent}`
                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: activeProduct.id === p.id
                                    ? `0 0 30px ${p.accent}44, 0 10px 40px rgba(0,0,0,0.5)`
                                    : '0 10px 30px rgba(0,0,0,0.3)'
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                height: '115px',
                                width: '100%',
                                background: '#000',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: '1280px',
                                    height: '720px',
                                    transform: 'scale(0.159375)',
                                    transformOrigin: 'top left',
                                    pointerEvents: 'none'
                                }}>
                                    <iframe
                                        src={p.url}
                                        title={p.name}
                                        style={{
                                            width: '1280px',
                                            height: '720px',
                                            border: 'none',
                                            background: '#fff'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{
                                padding: '12px',
                                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                                background: '#ffffff'
                            }}>
                                <p style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    color: '#000000',
                                    letterSpacing: '0.1em',
                                    marginBottom: '6px'
                                }}>
                                    {p.name.toUpperCase()}
                                </p>
                                <p style={{
                                    fontSize: '0.6rem',
                                    color: '#555555',
                                    lineHeight: '1.5',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {p.purpose}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>


            <style>{`
                .product-scroll-track {
                    animation: scroll-products 30s linear infinite;
                }

                .product-scroll-track:hover {
                    animation-play-state: paused;
                }

                @keyframes scroll-products {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-50%);
                    }
                }

                .btn-view-live:hover {
                    background: ${activeProduct.accent}22 !important;
                    border-color: ${activeProduct.accent} !important;
                }
            `}</style>
        </section >
    );
};

export default ShowcaseStage;
