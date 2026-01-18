import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ onExplore }) => {
    return (
        <section style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            padding: '0 var(--space-md)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
                <h1 style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    lineHeight: 1,
                    marginBottom: 'var(--space-md)',
                    maxWidth: '1000px'
                }}>
                    Crafting <span style={{ color: 'var(--accent-color)' }}>Interactive</span> Digital Products
                </h1>
                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    color: 'var(--text-secondary)',
                    maxWidth: '600px',
                    margin: '0 auto var(--space-lg)'
                }}>
                    A experimental laboratory where code, design, and AI converge to build the next generation of web products.
                </p>

                <motion.button
                    onClick={onExplore}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--text-primary)',
                        padding: 'var(--space-sm) var(--space-lg)',
                        fontSize: '1rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        borderRadius: '100px',
                        transition: 'var(--transition-fast)'
                    }}
                >
                    Explore Work
                </motion.button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 2 }}
                style={{
                    position: 'absolute',
                    bottom: 'var(--space-md)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                }}
            >
                SCROLL TO ENTER
            </motion.div>
        </section>
    );
};

export default Hero;
