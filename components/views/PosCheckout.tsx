'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ScanLine, Plus, Package, ArrowRight, X, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, money, Product } from '@/components/providers/AppProvider';

export function PosCheckout() {
  const { 
    products, setProducts,
    sales, setSales,
    movements, setMovements,
    cart, setCart,
    scan, setScan,
    scannerLive, setScannerLive,
    setActive,
    setNotice
  } = useAppStore();

  const scannerRef = useRef<HTMLVideoElement>(null);
  const [cameraStatus, setCameraStatus] = useState<'starting' | 'live' | 'blocked'>('starting');

  useEffect(() => {
    if (!scannerLive) return;
    
    let isMounted = true;
    let controls: any;

    setCameraStatus('starting');
    const videoElement = scannerRef.current;
    if (!videoElement) {
        setCameraStatus('blocked');
        return;
    }

    let lastScanTime = 0;
    let lastScanText = '';

    import('@zxing/browser').then(({ BrowserMultiFormatReader }) => {
      if (!isMounted) return;
      const reader = new BrowserMultiFormatReader();
      
      reader.decodeFromConstraints(
        { audio: false, video: { facingMode: 'environment' } },
        videoElement,
        (result, error) => {
          if (result) {
            const text = result.getText();
            const now = Date.now();
            if (text !== lastScanText || now - lastScanTime > 2000) {
              setScan(text);
              setNotice(`Scanned: ${text}`);
              lastScanText = text;
              lastScanTime = now;
            }
          }
        }
      ).then(c => {
         controls = c;
         if (isMounted) setCameraStatus('live');
         else controls.stop();
      }).catch(err => {
         console.error('Camera access error:', err);
         if (isMounted) setCameraStatus('blocked');
      });
    }).catch(err => {
        console.error('Failed to load @zxing/browser:', err);
        if (isMounted) setCameraStatus('blocked');
    });

    return () => {
      isMounted = false;
      if (controls) {
        controls.stop();
      }
    };
  }, [scannerLive, setScan, setNotice]);

  const scanResults = products.filter((product) =>
    `${product.name} ${product.sku}`.toLowerCase().includes(scan.toLowerCase()),
  );
  
  const cartTotal = cart.reduce((sum, product) => sum + product.price, 0);

  const addToCart = (product: Product) => {
    if (!product.stock) {
      setNotice(`${product.name} is out of stock.`);
      return;
    }
    setCart((previous) => [...previous, product]);
    setNotice(`${product.name} added to bill.`);
    setScan('');
  };

  const completeSale = (method: string) => {
    if (!cart.length) return;
    const invoice = `MZN-${2408 + sales.length}`;
    setSales((previous) => [
      { id: Date.now(), invoice, items: cart.length, total: cartTotal, method, time: 'Just now' },
      ...previous,
    ]);
    setProducts((previous) =>
      previous.map((product) =>
        cart.some((item) => item.id === product.id) ? { ...product, stock: product.stock - 1 } : product
      ),
    );
    setMovements((previous) => [{ id: Date.now(), item: cart[0].name, kind: 'Sold', quantity: -cart.length, date: 'Today', by: invoice }, ...previous]);
    setCart([]);
    setNotice(`${invoice} completed via ${method}.`);
  };

  return (
    <section className="pos-layout">
      <motion.section 
        className="panel scanner-panel"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="panel-heading">
          <div>
            <span className="section-number">CASHIER 01 / LIVE SCANNER</span>
            <h2>Scan & sell<span className="orange">.</span></h2>
          </div>
          <button className={`register-open scan-toggle ${scannerLive ? 'on' : ''}`} onClick={() => setScannerLive(!scannerLive)}>
            <i />{scannerLive ? 'Scanner live' : 'Start scanner'}
          </button>
        </div>
        
        {scannerLive && (
          <div className="scanner-viewport">
            <video ref={scannerRef} className="scanner-video" autoPlay playsInline muted />
            <div className="scan-corner top-left" />
            <div className="scan-corner top-right" />
            <div className="scan-corner bottom-left" />
            <div className="scan-corner bottom-right" />
            <div className="scanner-overlay">
              <ScanLine size={34} />
              <strong>{cameraStatus === 'live' ? 'Waiting for scan' : cameraStatus === 'blocked' ? 'Camera unavailable' : 'Starting camera'}</strong>
              <span>{cameraStatus === 'blocked' ? 'Use the manual barcode field below.' : 'Point the camera at a product barcode.'}</span>
            </div>
          </div>
        )}
        
        <label className="scan-field">
          <ScanLine size={19} />
          <input
            autoFocus
            value={scan}
            onChange={(event) => setScan(event.target.value)}
            placeholder="Scan QR or search SKU / product"
          />
          <kbd>⌘ K</kbd>
        </label>
        
        <AnimatePresence>
          {scan && (
            <motion.div 
              className="scan-results"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {scanResults.length ? (
                scanResults.map((product) => (
                  <motion.button key={product.id} onClick={() => addToCart(product)} whileHover={{ x: 4 }}>
                    <span className={`product-swatch ${product.tone}`}><Package size={15} /></span>
                    <span>
                      <strong>{product.name}</strong>
                      <small>{product.sku} · {product.stock} in stock</small>
                    </span>
                    <b>{money(product.price)}</b>
                  </motion.button>
                ))
              ) : (
                <p className="muted">No matching product found.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="quick-products">
          <div className="quick-heading">
            <span>Quick add</span>
            <button onClick={() => setActive('Products')}>Browse stock <ArrowRight size={14} /></button>
          </div>
          <div className="quick-grid">
            {products.slice(0, 4).map((product, i) => (
              <motion.button 
                key={product.id} 
                onClick={() => addToCart(product)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className={`product-swatch ${product.tone}`}><Package size={16} /></span>
                <strong>{product.name}</strong>
                <small>{money(product.price)}</small>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>
      
      <motion.section 
        className="panel cart-panel"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="panel-heading">
          <div>
            <span className="section-number">CURRENT BILL</span>
            <h2>Cart<span className="orange">.</span></h2>
          </div>
          <span className="pill">{cart.length} items</span>
        </div>
        
        {cart.length ? (
          <div className="cart-items">
            <AnimatePresence>
              {cart.map((product, index) => (
                <motion.div 
                  className="cart-row" 
                  key={`${product.id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div>
                    <strong>{product.name}</strong>
                    <small>{money(product.price)} · 1 unit</small>
                  </div>
                  <span>{money(product.price)}</span>
                  <button onClick={() => setCart((previous) => previous.filter((_, i) => i !== index))} aria-label="Remove item">
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="empty-cart">
            <ScanLine size={28} />
            <strong>Ready for the next scan</strong>
            <span>Scan a QR or choose a quick add.</span>
          </div>
        )}
        
        <div className="bill-total">
          <span>Subtotal <strong>{money(cartTotal)}</strong></span>
          <span>VAT <strong>{money(Math.round(cartTotal * 0.05))}</strong></span>
          <b>Total <span>{money(cartTotal + Math.round(cartTotal * 0.05))}</span></b>
        </div>
        
        <div className="payment-grid">
          <motion.button className="btn outline" onClick={() => completeSale('bKash')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>bKash / Nagad</motion.button>
          <motion.button className="btn outline" onClick={() => completeSale('Card')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}><CreditCard size={17} /> Card</motion.button>
          <motion.button className="btn primary" onClick={() => completeSale('Cash')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Take cash</motion.button>
        </div>
      </motion.section>
    </section>
  );
}
