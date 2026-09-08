'use client';

import React, { useState } from 'react';
import { Truck, ShoppingBag, Boxes } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/components/providers/AppProvider';

export function Movements() {
  const { movements } = useAppStore();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? movements : movements.filter(m => m.kind === filter);

  return (
    <>
      <section className="movement-summary-grid">
        {[
          { label: 'Received today', value: '+20', icon: Truck, cls: 'quantity-in', foot: 'Units added to shelves' },
          { label: 'Sold today', value: '-08', icon: ShoppingBag, cls: 'quantity-out', foot: 'Units moved through POS' },
          { label: 'Stock adjustments', value: '01', icon: Boxes, cls: '', foot: 'Count corrections' },
        ].map((stat, i) => (
          <motion.article 
            key={stat.label} 
            className="stat-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(28,28,28,.055)' }}
          >
            <div className="stat-label">{stat.label}<stat.icon size={19} /></div>
            <div className={`stat-value ${stat.cls}`}>{stat.value}</div>
            <div className="stat-foot"><span>{stat.foot}</span></div>
          </motion.article>
        ))}
      </section>

      <motion.section 
        className="panel movement-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
      <div className="panel-heading">
        <div>
          <span className="section-number">AUDIT TRAIL</span>
          <h2>Stock movements<span className="orange">.</span></h2>
        </div>
        <div className="movement-filters">
          {['All', 'Received', 'Sold', 'Adjusted'].map((opt) => (
            <motion.button 
              key={opt}
              className={filter === opt ? 'active' : ''}
              onClick={() => setFilter(opt)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="table-scroll">
        <table className="ledger">
          <thead>
            <tr>
              <th>ITEM</th>
              <th>ACTIVITY</th>
              <th>QUANTITY</th>
              <th>DATE</th>
              <th className="amount">UPDATED BY</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((movement, i) => (
                <motion.tr 
                  key={movement.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ backgroundColor: '#f4f5ef' }}
                >
                  <td><strong>{movement.item}</strong></td>
                  <td>
                    <span className={`movement-type ${movement.kind.toLowerCase()}`}>
                      {movement.kind}
                    </span>
                  </td>
                  <td className={movement.quantity > 0 ? 'quantity-in' : 'quantity-out'}>
                    {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                  </td>
                  <td className="muted">{movement.date}</td>
                  <td className="amount">{movement.by}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.section>
    </>
  );
}
