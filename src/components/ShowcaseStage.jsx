import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ShowcaseStage = ({ products, activeProduct, onSelectProduct, sortOrder, onSortChange }) => {
    const laptopContainerRef = useRef(null);
    const mobileContainerRef = useRef(null);
    const [laptopScale, setLaptopScale] = useState(1);
    const [mobileScale, setMobileScale] = useState(1);
    const [theme, setTheme] = useState('dark');
    const [randomKey, setRandomKey] = useState(0);

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

    // Detect theme changes
    useEffect(() => {
        const detectTheme = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            setTheme(currentTheme);
        };

        detectTheme();

        // Watch for theme attribute changes
        const observer = new MutationObserver(detectTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    // Update random key on mount to force new shuffle on page refresh
    useEffect(() => {
        setRandomKey(Math.random());
    }, [sortOrder]);



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
            // Fisher-Yates shuffle for proper randomization
            const shuffled = [...products];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }
    }, [products, sortOrder, randomKey]);

    // Theme-aware colors
    const bgColor = theme === 'light' ? '#f5f5f7' : '#0a0a0a';
    const cardBgColor = theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)';
    const cardBorderColor = theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    const masonryBg = theme === 'light' ? '#ffffff' : '#fcfbf9';
    const masonryTextColor = theme === 'light' ? '#1a1918' : '#1a1918';
    const masonryItemBg = theme === 'light' ? '#f5f5f5' : '#1a1a1a';

    return (
        <section style={{
            minHeight: '150vh',
            width: '100%',
            background: bgColor,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-xl) 0',
            paddingBottom: 'calc(var(--space-xl) + 200px)',
            position: 'relative',
            overflow: 'hidden'
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
                                background: cardBgColor,
                                backdropFilter: 'blur(20px)',
                                borderRadius: '16px',
                                border: activeProduct.id === p.id
                                    ? `2px solid ${p.accent}`
                                    : `1px solid ${cardBorderColor}`,
                                boxShadow: activeProduct.id === p.id
                                    ? `0 0 30px ${p.accent}44, 0 10px 40px ${theme === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.5)'}`
                                    : `0 10px 30px ${theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)'}`
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
                                borderTop: `1px solid ${cardBorderColor}`,
                                background: theme === 'light' ? '#f8f8f8' : '#ffffff'
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

                /* Masonry Gallery Styles */
                .masonry-item {
                    break-inside: avoid;
                    margin-bottom: 1rem;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.8s ease-out;
                }

                .masonry-item.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .masonry-item-inner {
                    position: relative;
                    overflow: hidden;
                    border-radius: 2px;
                    cursor: pointer;
                    background: ${masonryItemBg};
                }

                .masonry-item-inner img,
                .masonry-item-inner iframe {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: grayscale(10%);
                    transition: all 0.7s ease-out;
                }

                .masonry-item:hover .masonry-item-inner img,
                .masonry-item:hover .masonry-item-inner iframe {
                    filter: grayscale(0%);
                    transform: scale(1.05);
                }
            `}</style>

            {/* MASONRY GALLERY SECTION */}
            <main style={{
                minHeight: '100vh',
                width: '100%',
                maxWidth: '1800px',
                margin: '0 auto',
                padding: '128px 24px 96px',
                background: masonryBg,
                zIndex: 20,
                position: 'relative'
            }}>
                <div style={{
                    columns: window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1,
                    gap: '16px',
                    columnGap: '16px'
                }}>
                    {sortedProducts.map((product, index) => {
                        // Define varying aspect ratios for visual interest
                        const aspectRatios = ['3/4', '1/1', '2/3', '4/3', '3/5', '16/9', '3/4', '4/5', '1/1', '2/3'];
                        const aspectRatio = aspectRatios[index % aspectRatios.length];

                        return (
                            <div
                                key={product.id}
                                className="masonry-item visible"
                                onClick={() => onSelectProduct(product)}
                                style={{
                                    display: 'inline-block',
                                    width: '100%',
                                    marginBottom: '16px'
                                }}
                            >
                                <div
                                    className="masonry-item-inner"
                                    style={{
                                        aspectRatio: aspectRatio,
                                        position: 'relative'
                                    }}
                                >
                                    <iframe
                                        src={product.url}
                                        title={product.name}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            border: 'none',
                                            background: '#fff',
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </div>
                                <div style={{
                                    marginTop: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    paddingBottom: '8px',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <p style={{
                                        fontSize: '11px',
                                        color: masonryTextColor,
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {product.name} — {product.category}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </section >
    );
};

export default ShowcaseStage;
