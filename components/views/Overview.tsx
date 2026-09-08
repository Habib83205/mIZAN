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

function YearlySales() {
  const values = [18, 30, 22, 43, 36, 65, 61, 92, 86, 96];
  const points = values
    .map((value, index) => `${index * 31 + 8},${112 - value}`)
    .join(' ');
  return (
    <motion.section className="panel yearly-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
      <div className="panel-heading">
        <div>
          <span className="section-number">02 / LONG VIEW</span>
          <h2>
            Yearly sales<span className="orange">.</span>
          </h2>
        </div>
        <span className="pill">2026</span>
      </div>
      <div className="yearly-chart">
        <svg viewBox="0 0 290 130" role="img" aria-label="Yearly sales trend">
          <path className="line-grid" d="M8 20H290M8 66H290M8 112H290" />
          <polyline className="yearly-line" points={points} />
          <polygon className="yearly-area" points={`8,112 ${points} 287,112`} />
        </svg>
        <div className="year-labels">
          <span>Jan</span>
          <span>Mar</span>
          <span>May</span>
          <span>Jul</span>
          <span>Sep</span>
          <span>Nov</span>
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
    <motion.div className="income-expense" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
      <section className="panel mini-chart-card">
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
      </section>
      <section className="panel mini-chart-card">
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
      </section>
    </motion.div>
  );
}

function DailySales() {
  const [filter, setFilter] = useState<'7 days' | '3 days'>('7 days');
  const [selectedDay, setSelectedDay] = useState(6);
  
  const allValues = [12000, 15000, 9000, 22000, 18000, 25000, 31000];
  const allLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const values = filter === '7 days' ? allValues : allValues.slice(-3);
  const labels = filter === '7 days' ? allLabels : allLabels.slice(-3);
  const maxVal = Math.max(...values, 5000);
  
  // Adjust selectedDay when filter changes to prevent out-of-bounds
  React.useEffect(() => {
    if (filter === '3 days' && selectedDay > 2) {
      setSelectedDay(2);
    } else if (filter === '7 days' && selectedDay <= 2) {
      setSelectedDay(selectedDay + 4); // roughly map to same day
    }
  }, [filter]);

  return (
    <motion.section className="panel spending-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
      <div className="panel-heading">
        <div>
          <span className="section-number">01 / DAILY PERFORMANCE</span>
          <h2>Daily Sales<span className="orange">.</span></h2>
        </div>
        <div className="compare-controls" style={{ margin: 0 }}>
          <button className={filter === '7 days' ? 'selected' : ''} onClick={() => setFilter('7 days')}>7 days</button>
          <button className={filter === '3 days' ? 'selected' : ''} onClick={() => setFilter('3 days')}>3 days</button>
        </div>
      </div>
      
      <div className="chart-info">
        <strong>{money(values[selectedDay] || 0)}</strong>
        <span>Sales on {labels[selectedDay]}<br/><span className="muted">Daily performance</span></span>
      </div>
      
      <div className="chart" role="group" aria-label={`Daily sales for last ${filter}`}>
        <div className="chart-axis">
          <span>{money(maxVal)}</span>
          <span>{money(maxVal / 2)}</span>
          <span>৳0</span>
        </div>
        <div className="plot">
          <div className="grid-lines"><i/><i/><i/></div>
          <div className="bars">
            {values.map((value, i) => (
              <button key={i} className={`bar-column ${selectedDay === i ? 'selected' : ''}`} onClick={() => setSelectedDay(i)}>
                <span className="bar" style={{ height: `${(value / maxVal) * 100}%` }} />
                <span className="bar-label">{labels[i]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="chart-footer">
        <span><i style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', display: 'inline-block' }} />Daily sales</span>
        <span>A clearer picture of daily trends.</span>
      </div>
    </motion.section>
  );
}

export function Overview() {
  const [compareMonth, setCompareMonth] = useState<CompareMonth>('August 2026');
  const { sales, setActive, setModal } = useAppStore();

  return (
    <>
      <div className="overview-grid">
        <SalesBars month={compareMonth} setMonth={setCompareMonth} />
        <StatsAndActions />
      </div>
      
      <div className="overview-grid" style={{ marginTop: '24px', gridTemplateColumns: '1fr' }}>
        <DailySales />
      </div>

      <div className="secondary-dashboard-grid" style={{ display: 'grid', marginTop: '24px' }}>
        <YearlySales />
        <IncomeExpense />
      </div>

      <motion.section className="panel activity-panel" style={{ marginTop: '24px' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <div className="panel-heading">
          <div>
            <span className="section-number">03 / THE EVERYDAY DETAILS</span>
            <h2>Recent sales<span className="orange">.</span></h2>
          </div>
          <button className="text-button" onClick={() => setActive('Reports')}>
            View all
            <ArrowUpRight size={16} />
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
              {sales.slice(0, 5).map((sale) => (
                <tr key={sale.id}>
                  <td><strong>{sale.invoice}</strong></td>
                  <td>{sale.items}</td>
                  <td>{sale.method}</td>
                  <td className="muted">{sale.time}</td>
                  <td className="amount"><strong>{money(sale.total)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </>
  );
}
