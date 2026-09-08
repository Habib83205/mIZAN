'use client';

import React from 'react';
import { ChevronRight, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppStore } from '@/components/providers/AppProvider';

export function TopHeader() {
  const { active, setActive, setModal, profileName } = useAppStore();

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <SidebarTrigger className="mobile-menu" />
        <span>Operations</span>
        <ChevronRight size={14} />
        <motion.strong
          key={active}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {active}
        </motion.strong>
      </div>
      <div className="topbar-right">
        <span className="demo-label live-label">
          <i />
          Register open
        </span>
        <motion.button
          className="header-icon"
          aria-label="Notifications"
          onClick={() => setModal('notifications')}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell size={18} />
          <b>3</b>
        </motion.button>
        <motion.button 
          className="header-profile" 
          onClick={() => setActive('Profile Settings')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="avatar top-avatar">
            {profileName.split(' ').map((part) => part[0]).join('').slice(0, 2)}
          </span>
          <span>{profileName.split(' ')[0]}</span>
        </motion.button>
      </div>
    </header>
  );
}

