'use client';

import React, { FormEvent } from 'react';
import { Store, MapPin, Receipt, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/components/providers/AppProvider';

export function ShopSettings() {
  const { shopName, setShopName, shopLocation, setShopLocation, setNotice } = useAppStore();

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setShopName(String(data.get('name')));
    setShopLocation(String(data.get('location')));
    setNotice('Shop details updated.');
  };

  return (
    <motion.section 
      className="panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      <div className="panel-heading">
        <div>
          <span className="section-number">STORE CONFIGURATION</span>
          <h2>Shop Settings<span className="orange">.</span></h2>
        </div>
      </div>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <label className="form-field">
          <span>Store Name</span>
          <div className="input-with-icon">
            <Store size={16} />
            <input name="name" defaultValue={shopName} required />
          </div>
        </label>
        
        <label className="form-field">
          <span>Location / Branch</span>
          <div className="input-with-icon">
            <MapPin size={16} />
            <input name="location" defaultValue={shopLocation} required />
          </div>
        </label>

        <label className="form-field">
          <span>Tax Rate (%)</span>
          <div className="input-with-icon">
            <Receipt size={16} />
            <input type="number" name="tax" defaultValue={5} min={0} max={100} />
          </div>
        </label>

        <label className="form-field">
          <span>Currency</span>
          <select name="currency" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
            <option value="BDT">BDT (৳)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </label>

        <motion.button 
          type="submit" 
          className="btn primary" 
          style={{ alignSelf: 'flex-start', marginTop: '10px' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save size={16} />
          Save Configuration
        </motion.button>
      </form>
    </motion.section>
  );
}

