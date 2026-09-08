'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ShoppingBag, WalletCards, Package, AlertTriangle, ScanLine, Truck, Search, Download, ArrowRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { money, useAppStore } from '@/components/providers/AppProvider';

const compareData = {
  'August 2026': [36, 52, 44, 68, 56, 73, 66],
  'July 2026': [29, 45, 50, 46, 62, 55, 70],
  'June 2026': [25, 39, 34, 49, 45, 59, 54],
};

type CompareMonth = keyof typeof compareData;

function SalesBars({ month, setMonth }: { month: CompareMonth; setMonth: (value: CompareMonth) => void }) {
  const values = compareData[month];
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];
  const [hovered, setHovered] = useState(6);
  
  return (
    <motion.section className="panel compare-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <div className="panel-heading">
        <div>
          <span className="section-number">01 / SALES COMPARISON</span>
          <h2>Sales against {month}<span className="orange">.</span></h2>
        </div>
        <span className="growth-pill"><ArrowUpRight size={14} />+18.4%</span>
      </div>
      <div className="compare-controls">
        {(Object.keys(compareData) as CompareMonth[]).map((option) => (
          <button key={option} className={month === option ? 'selected' : ''} onClick={() => setMonth(option)}>
            {option}
          </button>
        ))}
      </div>
      <div className="bar-chart-summary">
        <strong>{money(184260)}</strong>
        <span>Current period sales<br /><small>{labels[hovered]} selected</small></span>
      </div>
      <div className="interactive-bars" role="img" aria-label={`Sales for ${month}`}>
        <div className="interactive-axis">
          <span>৳40k</span><span>৳20k</span><span>৳0</span>
        </div>
        <div className="interactive-plot">
          <div className="bar-grid-lines"><i /><i /><i /></div>
          <div className="interactive-bar-list">
            {values.map((value, index) => (
              <button key={`${month}-${index}`} className={hovered === index ? 'hovered' : ''} onMouseEnter={() => setHovered(index)} onFocus={() => setHovered(index)} onClick={() => setHovered(index)} aria-label={`${labels[index]} sales ${money(value * 500)}`}>
                <span className="interactive-bar" style={{ height: `${value}%` }} />
                <span>{labels[index]}</span>
                <em>{money(value * 500)}</em>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="bar-chart-legend">
        <span><i />{month}</span>
        <strong>{labels[hovered]} · {money(values[hovered] * 500)}</strong>
      </div>
    </motion.section>
  );
}

function StatsAndActions() {
  const { products, setActive, setModal } = useAppStore();
  const lowStock = products.filter((product) => product.stock <= product.reorder);

  return (
    <>
      <section className="stats-grid">
        {[
          { name: 'Today’s sales', value: money(18640), icon: ShoppingBag, foot: '31 transactions', cls: 'balance-card' },
          { name: 'Cash in drawer', value: money(12680), icon: WalletCards, foot: '৳5,960 digital' },
          { name: 'Items sold', value: '34', icon: Package, foot: 'Across 27 orders' },
          { name: 'Low stock', value: String(lowStock.length).padStart(2, '0'), icon: AlertTriangle, foot: 'Need attention', cls: 'warning-card' },
        ].map(({ name, value, icon: Icon, foot, cls }, i) => (
          <motion.article 
            className={`stat-card ${cls || ''}`} 
            key={name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(28,28,28,.055)' }}
          >
            <div className="stat-label">
              {name}
              <Icon size={19} />
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-foot">
              <span>{foot}</span>
              {cls && <ArrowUpRight size={17} />}
            </div>
          </motion.article>
        ))}
      </section>

      <section className="quick-actions">
        <div>
          <span className="section-number">QUICK ACTIONS</span>
          <h2>Keep the day moving<span className="orange">.</span></h2>
        </div>
        <div className="quick-action-grid">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActive('POS / Checkout')}>
            <ScanLine size={19} />
            <span><strong>New sale</strong><small>Scan and bill</small></span>
            <ArrowRight size={15} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setModal('receive')}>
            <Truck size={19} />
            <span><strong>Receive stock</strong><small>Add incoming units</small></span>
            <ArrowRight size={15} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActive('Products')}>
            <Search size={19} />
            <span><strong>Check stock</strong><small>Query availability</small></span>
            <ArrowRight size={15} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActive('Reports')}>
            <Download size={19} />
            <span><strong>Daily close</strong><small>Sales and cash</small></span>
            <ArrowRight size={15} />
          </motion.button>
        </div>
      </section>
    </>
  );
}

export function Overview() {
  const [compareMonth, setCompareMonth] = useState<CompareMonth>('August 2026');
  const { sales, setActive } = useAppStore();

  return (
    <>
      <StatsAndActions />
      <SalesBars month={compareMonth} setMonth={setCompareMonth} />
      <motion.section className="panel activity-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="panel-heading">
          <div>
            <span className="section-number">02 / THE EVERYDAY DETAILS</span>
            <h2>Recent sales<span className="orange">.</span></h2>
          </div>
          <button className="text-button" onClick={() => setActive('POS / Checkout')}>
            New sale
            <Plus size={16} />
          </button>
        </div>
        <div className="table-scroll">
          <table className="ledger">
            <thead>
              <tr>
                <th>INVOICE</th>
                <th>ITEMS</th>
                <th>PAYMENT</th>
                <th>TIME</th>
                <th className="amount">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <motion.tr key={sale.id} whileHover={{ backgroundColor: '#f4f5ef' }}>
                  <td><strong>{sale.invoice}</strong></td>
                  <td>{sale.items}</td>
                  <td>{sale.method}</td>
                  <td className="muted">{sale.time}</td>
                  <td className="amount"><strong>{money(sale.total)}</strong></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </>
  );
}
