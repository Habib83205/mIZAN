'use client';

import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  Package,
  Boxes,
  ReceiptText,
  Store,
  CircleHelp,
  Settings2,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Sidebar, useSidebar } from '@/components/ui/sidebar';
import { useAppStore } from '@/components/providers/AppProvider';

const nav = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'POS / Checkout', icon: ScanLine },
  { label: 'Products', icon: Package },
  { label: 'Stock movements', icon: Boxes },
  { label: 'Reports', icon: ReceiptText },
];

export function Navigation() {
  const { active, setActive, setModal, shopName, shopLocation, profileName, profileRole } = useAppStore();
  const { setOpenMobile } = useSidebar();

  const handleNav = (label: string) => {
    setActive(label);
    setOpenMobile(false);
  };

  return (
    <Sidebar className="mess-sidebar">
      <div className="brand">
        <span className="brand-mark">
          m<span>•</span>
        </span>
        <span>
          mezan<span className="orange">.</span>
        </span>
      </div>
      
      <motion.button 
        className="house-label" 
        onClick={() => handleNav('Shop Settings')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <span className="house-icon">
          <Store size={19} />
        </span>
        <div style={{ textAlign: 'left' }}>
          <strong>{shopName}</strong>
          <small>{shopLocation}</small>
        </div>
      </motion.button>
      
      <div className="nav-label">OPERATIONS</div>
      <nav className="main-nav" aria-label="Main navigation">
        {nav.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={active === label ? 'active' : ''}
            onClick={() => handleNav(label)}
          >
            <Icon size={18} />
            {label}
            {active === label && (
              <motion.span 
                layoutId="activeNavDot"
                className="nav-dot" 
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>
      
      <div className="sidebar-bottom">
        <div className="side-note">
          <span className="little-star">✳</span>
          <p>
            Small shop.<br />Smart systems.
          </p>
          <small>Everything in its right place.</small>
        </div>
        
        <motion.button 
          className="help-button" 
          onClick={() => setModal('help')}
          whileHover={{ x: 3 }}
        >
          <CircleHelp size={18} />
          Quick guide
          <ArrowUpRight size={16} />
        </motion.button>
        
        <motion.button
          className={`profile profile-button ${active === 'Profile Settings' ? 'active-profile' : ''}`}
          onClick={() => handleNav('Profile Settings')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ width: '100%', border: 'none', cursor: 'pointer' }}
        >
          <span className="avatar">
            {profileName.split(' ').map((part) => part[0]).join('').slice(0, 2)}
          </span>
          <div style={{ textAlign: 'left' }}>
            <strong>{profileName}</strong>
            <small>{profileRole}</small>
          </div>
          <Settings2 size={16} />
        </motion.button>
      </div>
    </Sidebar>
  );
}
