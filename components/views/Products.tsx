'use client';

import React from 'react';
import { Package, Plus, AlertTriangle, Check, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore, money, Product } from '@/components/providers/AppProvider';

function ProductRow({ product, index }: { product: Product, index: number }) {
  const { setCart, setNotice, setProducts } = useAppStore();

  const handleAdd = () => {
    if (!product.stock) {
      setNotice(`${product.name} is out of stock.`);
      return;
    }
    setCart((prev) => [...prev, product]);
    setNotice(`${product.name} added to bill.`);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setNotice(`${product.name} deleted successfully.`);
    }
  };

  return (
    <motion.tr 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01, backgroundColor: '#f4f5ef' }}
    >
      <td>
        <div className="product-name">
          <span className={`product-swatch ${product.tone}`}>
            <Package size={16} />
          </span>
          <div>
            <strong>{product.name}</strong>
            <small>{product.sku}</small>
          </div>
        </div>
      </td>
      <td>{product.category}</td>
      <td>
        <strong>{product.stock}</strong> <span className="muted">units</span>
      </td>
      <td>{money(product.price)}</td>
      <td className="amount">
        {product.stock <= product.reorder ? (
          <span className="stock-status low">
            <AlertTriangle size={13} />
            Low stock
          </span>
        ) : (
          <span className="stock-status">
            <Check size={13} />
            Healthy
          </span>
        )}
      </td>
      <td>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <motion.button className="mini-add" onClick={handleAdd} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Plus size={14} />
            Add
          </motion.button>
          <motion.button 
            className="mini-add" 
            style={{ color: '#dc2626', borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}
            onClick={handleDelete} 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            title="Delete Product"
          >
            <Trash2 size={14} />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
}

export function Products() {
  const { products, query, setQuery, setModal } = useAppStore();
  
  const filtered = products.filter((product) =>
    `${product.name} ${product.sku} ${product.category}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <motion.section 
      className="panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="panel-heading">
        <div>
          <span className="section-number">INVENTORY DIRECTORY</span>
          <h2>Products & stock<span className="orange">.</span></h2>
        </div>
        <span className="pill">{products.length} products</span>
      </div>
      <div className="table-tools" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
        <label className="search-field" style={{ flex: 1 }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, SKU..."
          />
          <kbd>/</kbd>
        </label>
        <button
          className="btn primary small-btn"
          onClick={() => setModal('product')}
        >
          <Plus size={15} />
          Add product
        </button>
      </div>
      <div className="table-scroll">
        <table className="ledger">
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>CATEGORY</th>
              <th>IN STOCK</th>
              <th>PRICE</th>
              <th className="amount">STATUS</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((product, i) => (
              <ProductRow key={product.id} product={product} index={i} />
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

