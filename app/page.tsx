'use client';

import React, { CSSProperties } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Check, X, ScanLine, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AppProvider, useAppStore } from '@/components/providers/AppProvider';
import { Navigation } from '@/components/layout/Navigation';
import { TopHeader } from '@/components/layout/TopHeader';
import { PageTransition } from '@/components/layout/PageTransition';

import { Overview } from '@/components/views/Overview';
import { PosCheckout } from '@/components/views/PosCheckout';
import { Products } from '@/components/views/Products';
import { Movements } from '@/components/views/Movements';
import { Reports } from '@/components/views/Reports';
import { ProfileSettings } from '@/components/views/ProfileSettings';
import { ShopSettings } from '@/components/views/ShopSettings';

// Need to keep Dialog components here if they are still used
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

function AppShell() {
  const { active, notice, setNotice, modal, setModal, products, setProducts, setMovements, productEntryMode, setProductEntryMode } = useAppStore();

  const titles: Record<string, string> = {
    'Overview': 'Your shop, in one view',
    'POS / Checkout': 'Make every checkout easy',
    'Products': 'Everything on your shelves',
    'Stock movements': 'Every change, accounted for',
    'Reports': 'The numbers behind the day',
    'Profile Settings': 'Manage your account',
    'Shop Settings': 'Store configuration',
  };

  const handleReceiveStock = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const sku = String(data.get('sku') || '').trim().toLowerCase();
    const quantity = Number(data.get('quantity'));
    const match = products.find((product) => product.sku.toLowerCase() === sku);
    if (!match || !Number.isInteger(quantity) || quantity < 1) {
      setNotice('Use a valid SKU and receiving quantity.');
      return;
    }
    setProducts((prev) => prev.map((p) => p.id === match.id ? { ...p, stock: p.stock + quantity } : p));
    setMovements((prev) => [{ id: Date.now(), item: match.name, kind: 'Received', quantity, date: 'Today', by: 'Stock receiving' }, ...prev]);
    setModal(null);
    setNotice(`${quantity} units received for ${match.name}.`);
  };

  const saveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const sku = String(data.get(productEntryMode === 'scan' ? 'barcode' : 'sku') || '').trim();
    const stock = Number(data.get('stock'));
    const price = Number(data.get('price'));
    if (!name || !sku || !Number.isInteger(stock) || stock < 0 || !Number.isFinite(price) || price <= 0) {
      setNotice('Complete the product name, code, stock, and price.');
      return;
    }
    if (products.some((p) => p.sku.toLowerCase() === sku.toLowerCase())) {
      setNotice('That barcode or SKU is already in inventory.');
      return;
    }
    setProducts((prev) => [{ id: Date.now(), sku, name, category: String(data.get('category') || 'Clothing'), stock, reorder: 8, price, tone: 'peach' }, ...prev]);
    setModal(null);
    setNotice(`${name} added to inventory.`);
  };

  return (
    <SidebarProvider style={{ '--sidebar-width': '238px' } as CSSProperties}>
      <Navigation />
      <div className="app-main">
        <TopHeader />
        <main className="workspace">
          <section className="page-heading">
            <div>
              <p className="eyebrow"><span />MONDAY, 07 SEPTEMBER 2026</p>
              <h1>
                {titles[active] || active}
                <span className="orange">.</span>
              </h1>
              <p className="heading-description">
                Sales, cash, and stock clarity for the people running the shop.
              </p>
            </div>
          </section>

          <AnimatePresence>
            {notice && (
              <motion.output 
                className="notice"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Check size={17} />
                {notice}
                <button aria-label="Dismiss" onClick={() => setNotice('')}>
                  <X size={16} />
                </button>
              </motion.output>
            )}
          </AnimatePresence>

          <PageTransition>
            {active === 'Overview' && <Overview />}
            {active === 'POS / Checkout' && <PosCheckout />}
            {active === 'Products' && <Products />}
            {active === 'Stock movements' && <Movements />}
            {active === 'Reports' && <Reports />}
            {active === 'Profile Settings' && <ProfileSettings />}
            {active === 'Shop Settings' && <ShopSettings />}
          </PageTransition>

          <footer className="footer" style={{ marginTop: 'auto' }}>
            <span>MEZAN<span className="orange">.</span><span className="footer-rule" />A calmer way to run retail.</span>
            <span>Mezan Supershop · Gulshan, Dhaka</span>
          </footer>
        </main>
      </div>

      <Dialog open={modal !== null} onOpenChange={(open) => { if (!open) setModal(null); }}>
        <DialogContent className="mess-dialog">
          {modal === 'receive' && (
            <form className="entry-form" onSubmit={handleReceiveStock}>
              <DialogTitle>Receive incoming stock</DialogTitle>
              <DialogDescription>Add units to an existing product using its SKU.</DialogDescription>
              <label><span>Product SKU</span><input name="sku" required placeholder="e.g. MZN-101" autoFocus /></label>
              <label><span>Units received</span><input type="number" name="quantity" required placeholder="0" min="1" /></label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="text-button" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn primary">Receive stock</button>
              </div>
            </form>
          )}
          {modal === 'product' && (
            <form className="entry-form" onSubmit={saveProduct}>
              <DialogTitle>Add new product</DialogTitle>
              <DialogDescription>Create a new item in your inventory.</DialogDescription>
              <div className="entry-mode-tabs">
                <button type="button" className={productEntryMode === 'scan' ? 'selected' : ''} onClick={() => setProductEntryMode('scan')}>Scan Barcode</button>
                <button type="button" className={productEntryMode === 'manual' ? 'selected' : ''} onClick={() => setProductEntryMode('manual')}>Manual Entry</button>
              </div>
              <label><span>Product name</span><input name="name" required placeholder="e.g. Linen wrap skirt" autoFocus /></label>
              {productEntryMode === 'scan' ? (
                <label>
                  <span>Barcode</span>
                  <div className="scan-dialog-camera">
                    <ScanLine size={24} />
                    <div className="scan-line-animation" />
                  </div>
                  <input type="hidden" name="barcode" value="MZN-NEW" />
                  <div className="scan-dialog-result">
                    <button type="button"><Check size={14} /> <span>MZN-NEW detected</span></button>
                  </div>
                </label>
              ) : (
                <label><span>SKU / Code</span><input name="sku" required placeholder="e.g. MZN-150" /></label>
              )}
              <div className="form-row">
                <label><span>Starting stock</span><input type="number" name="stock" required placeholder="0" min="0" /></label>
                <label><span>Unit price</span><input type="number" name="price" required placeholder="0" min="1" /></label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="text-button" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn primary">Save product</button>
              </div>
            </form>
          )}
          {modal === 'help' && (
            <div>
              <DialogTitle>Quick guide</DialogTitle>
              <DialogDescription>How to use the Mezan operations system.</DialogDescription>
              <div className="help-content">
                <p><strong>Checking out:</strong> Go to POS, scan a barcode, and choose a payment method. The drawer and inventory update automatically.</p>
                <p><strong>Receiving stock:</strong> Use the Quick Action to add units to existing SKUs. This leaves an audit trail.</p>
                <p><strong>End of day:</strong> Go to Reports, verify the checklist, and print the daily summary.</p>
              </div>
              <div className="dialog-actions">
                <button className="btn primary" onClick={() => setModal(null)}>Understood</button>
              </div>
            </div>
          )}
          {modal === 'notifications' && (
            <div>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>Recent alerts and updates.</DialogDescription>
              <div className="notifications-list">
                <div className="notification-item"><strong>Low Stock Alert</strong><span>Satin slip dress is down to 5 units.</span></div>
                <div className="notification-item"><strong>System Update</strong><span>New vintage grain effect added!</span></div>
              </div>
              <div className="dialog-actions">
                <button className="btn primary" onClick={() => setModal(null)}>Close</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
