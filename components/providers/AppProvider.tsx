'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorder: number;
  price: number;
  tone: string;
};

export type Sale = {
  id: number;
  invoice: string;
  items: number;
  total: number;
  method: string;
  time: string;
};

export type Movement = {
  id: number;
  item: string;
  kind: 'Received' | 'Sold' | 'Adjusted';
  quantity: number;
  date: string;
  by: string;
};

export type Modal =
  | 'product'
  | 'scan'
  | 'stock'
  | 'close'
  | 'profile'
  | 'notifications'
  | 'receive'
  | 'help'
  | null;

export const money = (n: number) => `৳${n.toLocaleString('en-US')}`;

const productsSeed: Product[] = [
  { id: 1, sku: 'MZN-101', name: 'Linen co-ord set', category: 'Clothing', stock: 24, reorder: 10, price: 2450, tone: 'peach' },
  { id: 2, sku: 'MZN-114', name: 'Pearl drop earrings', category: 'Accessories', stock: 8, reorder: 12, price: 780, tone: 'lavender' },
  { id: 3, sku: 'MZN-128', name: 'Rose everyday tote', category: 'Bags', stock: 31, reorder: 8, price: 1250, tone: 'sage' },
  { id: 4, sku: 'MZN-132', name: 'Satin slip dress', category: 'Clothing', stock: 5, reorder: 10, price: 3200, tone: 'butter' },
  { id: 5, sku: 'MZN-145', name: 'Soft square scarf', category: 'Accessories', stock: 18, reorder: 8, price: 690, tone: 'sky' },
];

const salesSeed: Sale[] = [
  { id: 1, invoice: 'MZN-2407', items: 2, total: 3230, method: 'bKash', time: '10:42 AM' },
  { id: 2, invoice: 'MZN-2406', items: 1, total: 1250, method: 'Cash', time: '10:18 AM' },
  { id: 3, invoice: 'MZN-2405', items: 3, total: 5140, method: 'Card', time: '09:56 AM' },
];

const movementsSeed: Movement[] = [
  { id: 1, item: 'Linen co-ord set', kind: 'Received', quantity: 12, date: '07 Sep 2026', by: 'Noor Textiles' },
  { id: 2, item: 'Pearl drop earrings', kind: 'Sold', quantity: -3, date: '07 Sep 2026', by: 'MZN-2405' },
  { id: 3, item: 'Rose everyday tote', kind: 'Received', quantity: 8, date: '06 Sep 2026', by: 'Maya Crafts' },
  { id: 4, item: 'Satin slip dress', kind: 'Adjusted', quantity: -1, date: '06 Sep 2026', by: 'Stock count' },
];

interface AppContextType {
  active: string;
  setActive: (val: string) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  movements: Movement[];
  setMovements: React.Dispatch<React.SetStateAction<Movement[]>>;
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
  scan: string;
  setScan: (val: string) => void;
  scannerLive: boolean;
  setScannerLive: (val: boolean) => void;
  query: string;
  setQuery: (val: string) => void;
  modal: Modal;
  setModal: (val: Modal) => void;
  notice: string;
  setNotice: (val: string) => void;
  profileName: string;
  setProfileName: (val: string) => void;
  profileRole: string;
  setProfileRole: (val: string) => void;
  productEntryMode: 'scan' | 'manual';
  setProductEntryMode: (val: 'scan' | 'manual') => void;
  shopName: string;
  setShopName: (val: string) => void;
  shopLocation: string;
  setShopLocation: (val: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState('Overview');
  const [products, setProducts] = useState<Product[]>(productsSeed);
  const [sales, setSales] = useState<Sale[]>(salesSeed);
  const [movements, setMovements] = useState<Movement[]>(movementsSeed);
  const [cart, setCart] = useState<Product[]>([]);
  const [scan, setScan] = useState('');
  const [scannerLive, setScannerLive] = useState(true);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<Modal>(null);
  const [notice, setNotice] = useState('');
  
  // Profile settings
  const [profileName, setProfileName] = useState('Maliha Khan');
  const [profileRole, setProfileRole] = useState('Store manager');
  
  // Shop settings
  const [shopName, setShopName] = useState('Mezan Supershop');
  const [shopLocation, setShopLocation] = useState('Gulshan, Dhaka');

  const [productEntryMode, setProductEntryMode] = useState<'scan' | 'manual'>('scan');

  return (
    <AppContext.Provider
      value={{
        active, setActive,
        products, setProducts,
        sales, setSales,
        movements, setMovements,
        cart, setCart,
        scan, setScan,
        scannerLive, setScannerLive,
        query, setQuery,
        modal, setModal,
        notice, setNotice,
        profileName, setProfileName,
        profileRole, setProfileRole,
        productEntryMode, setProductEntryMode,
        shopName, setShopName,
        shopLocation, setShopLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}

