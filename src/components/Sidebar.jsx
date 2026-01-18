import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, Beaker, Settings, LayoutGrid, Moon, Sun } from 'lucide-react';

const NavItem = ({ icon: Icon, label, href, onClick, isActive }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            href={href}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                transition: 'var(--transition-fast)',
                cursor: 'pointer',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
            }}
        >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 20 }}
                        exit={{ opacity: 0, x: 10 }}
                        style={{
                            position: 'absolute',
                            left: '100%',
                            padding: '6px 14px',
                            background: 'rgba(15, 15, 15, 0.9)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '10px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            color: 'white',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                            zIndex: 1001,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        }}
                    >
                        {label}
                    </motion.div>
                )}
            </AnimatePresence>

            {isActive && (
                <motion.div
                    layoutId="active-indicator"
                    style={{
                        position: 'absolute',
                        left: '-12px',
                        width: '4px',
                        height: '20px',
                        background: 'var(--accent-color)',
                        borderRadius: '0 4px 4px 0',
                        boxShadow: '0 0 15px var(--accent-color)',
                    }}
                />
            )}
        </a>
    );
};

const Sidebar = ({ onOpenManager, activeProduct, theme, onThemeToggle }) => {
    const [activeTab, setActiveTab] = useState('home');

    const handleLiveSiteClick = () => {
        if (activeProduct?.url) {
            window.open(activeProduct.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed',
                left: '24px',
                top: '24px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                alignItems: 'center',
            }}
        >
            {/* LOGO AREA */}
            <div style={{
                width: '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                color: 'var(--accent-color)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}>
                <LayoutGrid size={24} strokeWidth={2.5} />
            </div>

            {/* THEME TOGGLE */}
            <button
                onClick={onThemeToggle}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                    marginBottom: '12px'
                }}
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* NAV DOCK */}
            <nav style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }}>
                <NavItem
                    icon={Home}
                    label="HOME"
                    href="#"
                    isActive={activeTab === 'home'}
                    onClick={() => setActiveTab('home')}
                />
                <NavItem
                    icon={Briefcase}
                    label="WORK"
                    href="#work"
                    isActive={activeTab === 'work'}
                    onClick={() => setActiveTab('work')}
                />
                <NavItem
                    icon={Beaker}
                    label="LAB"
                    href="#showcase"
                    isActive={activeTab === 'lab'}
                    onClick={() => setActiveTab('lab')}
                />

                <div style={{ height: '1px', background: 'var(--border-color)', margin: '8px 4px' }} />

                <NavItem
                    icon={Settings}
                    label="MANAGE"
                    onClick={onOpenManager}
                    isActive={false}
                />
            </nav>

            {/* LIVE SITE BUTTON - APPLE LIQUID GLASS STYLE */}
            <motion.button
                onClick={handleLiveSiteClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    borderRadius: '100px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: activeProduct?.accent || 'var(--accent-color)',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    transition: 'var(--transition-fast)'
                }}
            >
                <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#34c759',
                    boxShadow: '0 0 10px #34c759'
                }} />
                LIVE SITE
            </motion.button>
        </motion.aside>
    );
};

export default Sidebar;
