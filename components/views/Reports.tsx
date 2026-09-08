'use client';

import React from 'react';
import { Download, Check, AlertTriangle, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/components/providers/AppProvider';

export function Reports() {
  const { setNotice } = useAppStore();

  return (
    <motion.section 
      className="reports-grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.section 
        className="panel report-card"
        whileHover={{ y: -5, boxShadow: '0 12px 28px rgba(28,28,28,.055)' }}
      >
        <span className="section-number">TODAY / 07 SEP</span>
        <h2>Daily close<span className="orange">.</span></h2>
        <div className="report-big">৳18,640</div>
        <div className="report-lines">
          <span>Cash sales <b>৳12,680</b></span>
          <span>Card sales <b>৳3,420</b></span>
          <span>bKash sales <b>৳2,540</b></span>
          <span>Total orders <b>31</b></span>
        </div>
        <motion.button
          className="btn primary"
          onClick={() => setNotice('Daily report downloaded.')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download size={16} />
          Download report
        </motion.button>
      </motion.section>
      
      <motion.section 
        className="panel report-card"
        whileHover={{ y: -5, boxShadow: '0 12px 28px rgba(28,28,28,.055)' }}
      >
        <span className="section-number">SHIFT CHECKLIST</span>
        <h2>Ready to close?<span className="orange">.</span></h2>
        <div className="check-list">
          <span><Check size={15} />Cash drawer counted</span>
          <span><Check size={15} />Digital payments matched</span>
          <span><Check size={15} />Low stock reviewed</span>
          <span className="pending"><AlertTriangle size={15} />Print end-of-day receipt</span>
        </div>
        <motion.button
          className="btn"
          onClick={() => setNotice('End-of-day receipt sent to printer.')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Printer size={16} />
          Print summary
        </motion.button>
      </motion.section>
    </motion.section>
  );
}

