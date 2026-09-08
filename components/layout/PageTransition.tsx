'use client';

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/components/providers/AppProvider';

const variants = {
  initial: { opacity: 0, y: 15, filter: 'blur(4px)' },
  enter: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1], // ease-out
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    filter: 'blur(2px)',
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export function PageTransition({ children }: { children: ReactNode }) {
  const { active } = useAppStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

