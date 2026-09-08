'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ShoppingBag, WalletCards, Package, AlertTriangle, ScanLine, Truck, Search, Download, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { money, useAppStore } from '@/components/providers/AppProvider';

const compareData = {
  'August 2026': [36, 52, 44, 68, 56, 73, 66],
  'July 2026': [29, 45, 50, 46, 62, 55, 70],
  'June 2026': [25, 39, 34, 49, 45, 59, 54],
};

type CompareMonth = keyof typeof compareData;

function LineComparison({ month, setMonth }: { month: CompareMonth; setMonth: (value: CompareMonth) => void }) {
  const values = compareData[month];
  const points = values.map((value, index) => `${index * 52 + 8},${112 - value}`).join(' ');

  return (
    <>
      <motion.section 
        className="panel compare-panel"
        whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(28,28,28,.055)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="panel-heading">
          <div>
            <span className="section-number">01 / SALES COMPARISON</span>
            <h2>Growth against last month<span className="orange">.</span></h2>
          </div>
          <span className="growth-pill"><ArrowUpRight size={14} />+18.4%</span>
        </div>
        <div className="compare-controls">
          {(Object.keys(compareData) as CompareMonth[]).map((option) => (
            <button
              key={option}
              className={month === option ? 'selected' : ''}
              onClick={() => setMonth(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="line-chart-wrap">
          <svg viewBox="0 0 320 130" role="img" aria-label={`Sales compared with ${month}`}>
            <path className="line-grid" d="M8 20H320M8 66H320M8 112H320" />
            <polyline className="line-previous" points="8,93 60,88 112,96 164,77 216,84 268,68 320,74" />
            <motion.polyline 
              className="line-current" 
              points={points}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <circle className="line-dot" cx="320" cy={112 - values[6]} r="4" />
          </svg>
          <div className="line-labels">
            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
          </div>
        </div>
        <div className="line-legend">
          <span><i className="current-dot" /> September 2026</span>
          <span><i className="previous-dot" /> {month}</span>
          <strong>৳184,260 total sales</strong>
        </div>
      </motion.section>
      
      <div className="secondary-dashboard-grid">
        <YearlySales />
        <IncomeExpense />
      </div>
    </>
  );
}

function YearlySales() {
  const values = [18, 30, 22, 43, 36, 65, 61, 92, 86, 96];
  const points = values.map((value, index) => `${index * 31 + 8},${112 - value}`).join(' ');

  return (
    <motion.section 
      className="panel yearly-panel"
      whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(28,28,28,.055)" }}
    >
      <div className="panel-heading">
        <div>
          <span className="section-number">02 / LONG VIEW</span>
          <h2>Yearly sales<span className="orange">.</span></h2>
        </div>
        <span className="pill">2026</span>
      </div>
      <div className="yearly-chart">
        <svg viewBox="0 0 290 130" role="img" aria-label="Yearly sales trend">
          <path className="line-grid" d="M8 20H290M8 66H290M8 112H290" />
          <motion.polyline 
            className="yearly-line" 
            points={points}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <polygon className="yearly-area" points={`8,112 ${points} 287,112`} />
        </svg>
        <div className="year-labels">
          <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
        </div>
      </div>
      <div className="yearly-total">
        <span>Sales so far</span>
        <strong>৳184,260</strong>
      </div>
    </motion.section>
  );
}

function IncomeExpense() {
  return (
    <div className="income-expense">
      <motion.section 
        className="panel mini-chart-card"
        whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(28,28,28,.055)" }}
      >
        <div className="mini-card-head">
          <strong>Incomes</strong>
          <span>Weekly⌄</span>
        </div>
        <div className="pie income-pie" />
        <div className="mini-legend">
          <span><i className="legend-green" />Electronics</span>
          <span><i className="legend-yellow" />Accessories</span>
          <span><i className="legend-dark" />Software</span>
          <span><i className="legend-sage" />Maintenance</span>
        </div>
      </motion.section>
      
      <motion.section 
        className="panel mini-chart-card"
        whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(28,28,28,.055)" }}
      >
        <div className="mini-card-head">
          <strong>Expenses</strong>
          <span>Weekly⌄</span>
        </div>
        <div className="pie expense-pie">
          <b>Total<br />100%</b>
        </div>
        <div className="mini-legend">
          <span><i className="legend-yellow" />Marketing</span>
          <span><i className="legend-green" />Salaries</span>
          <span><i className="legend-red" />Office rent</span>
          <span><i className="legend-sage" />Logistics</span>
        </div>
      </motion.section>
    </div>
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

  return (
    <>
      <StatsAndActions />
      <LineComparison month={compareMonth} setMonth={setCompareMonth} />
    </>
  );
}

