'use client';
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Boxes,
  Calculator,
  Check,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Download,
  LayoutDashboard,
  Package,
  Plus,
  Printer,
  ReceiptText,
  ScanLine,
  Search,
  Settings2,
  ShoppingBag,
  Store,
  Tags,
  Truck,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorder: number;
  price: number;
  tone: string;
};
type Sale = {
  id: number;
  invoice: string;
  items: number;
  total: number;
  method: string;
  time: string;
};
type Movement = {
  id: number;
  item: string;
  kind: 'Received' | 'Sold' | 'Adjusted';
  quantity: number;
  date: string;
  by: string;
};
type Modal =
  | 'product'
  | 'scan'
  | 'stock'
  | 'close'
  | 'profile'
  | 'notifications'
  | 'receive'
  | 'help'
  | null;
const money = (n: number) => `৳${n.toLocaleString('en-US')}`;
const productsSeed: Product[] = [
  {
    id: 1,
    sku: 'MZN-101',
    name: 'Linen co-ord set',
    category: 'Clothing',
    stock: 24,
    reorder: 10,
    price: 2450,
    tone: 'peach',
  },
  {
    id: 2,
    sku: 'MZN-114',
    name: 'Pearl drop earrings',
    category: 'Accessories',
    stock: 8,
    reorder: 12,
    price: 780,
    tone: 'lavender',
  },
  {
    id: 3,
    sku: 'MZN-128',
    name: 'Rose everyday tote',
    category: 'Bags',
    stock: 31,
    reorder: 8,
    price: 1250,
    tone: 'sage',
  },
  {
    id: 4,
    sku: 'MZN-132',
    name: 'Satin slip dress',
    category: 'Clothing',
    stock: 5,
    reorder: 10,
    price: 3200,
    tone: 'butter',
  },
  {
    id: 5,
    sku: 'MZN-145',
    name: 'Soft square scarf',
    category: 'Accessories',
    stock: 18,
    reorder: 8,
    price: 690,
    tone: 'sky',
  },
];
const salesSeed: Sale[] = [
  {
    id: 1,
    invoice: 'MZN-2407',
    items: 2,
    total: 3230,
    method: 'bKash',
    time: '10:42 AM',
  },
  {
    id: 2,
    invoice: 'MZN-2406',
    items: 1,
    total: 1250,
    method: 'Cash',
    time: '10:18 AM',
  },
  {
    id: 3,
    invoice: 'MZN-2405',
    items: 3,
    total: 5140,
    method: 'Card',
    time: '09:56 AM',
  },
];
const movementsSeed: Movement[] = [
  { id: 1, item: 'Linen co-ord set', kind: 'Received', quantity: 12, date: '07 Sep 2026', by: 'Noor Textiles' },
  { id: 2, item: 'Pearl drop earrings', kind: 'Sold', quantity: -3, date: '07 Sep 2026', by: 'MZN-2405' },
  { id: 3, item: 'Rose everyday tote', kind: 'Received', quantity: 8, date: '06 Sep 2026', by: 'Maya Crafts' },
  { id: 4, item: 'Satin slip dress', kind: 'Adjusted', quantity: -1, date: '06 Sep 2026', by: 'Stock count' },
];
const nav = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'POS / Checkout', icon: ScanLine },
  { label: 'Products', icon: Package },
  { label: 'Stock movements', icon: Boxes },
  { label: 'Reports', icon: ReceiptText },
];
const compareData = {
  'August 2026': [36, 52, 44, 68, 56, 73, 66],
  'July 2026': [29, 45, 50, 46, 62, 55, 70],
  'June 2026': [25, 39, 34, 49, 45, 59, 54],
};
type CompareMonth = keyof typeof compareData;

function Navigation({
  active,
  change,
  open,
}: {
  active: string;
  change: (value: string) => void;
  open: (modal: Exclude<Modal, null>) => void;
}) {
  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar className="mess-sidebar">
      <div className="brand">
        <span className="brand-mark">
          m<span>•</span>
        </span>
        <span>
          mezan<span className="orange">.</span>
        </span>
      </div>
      <div className="house-label">
        <span className="house-icon">
          <Store size={19} />
        </span>
        <div>
          <strong>Mezan Supershop</strong>
          <small>Gulshan, Dhaka</small>
        </div>
      </div>
      <div className="nav-label">OPERATIONS</div>
      <nav className="main-nav" aria-label="Main navigation">
        {nav.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={active === label ? 'active' : ''}
            onClick={() => {
              change(label);
              setOpenMobile(false);
            }}
          >
            <Icon size={18} />
            {label}
            {active === label && <span className="nav-dot" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="side-note">
          <span className="little-star">✳</span>
          <p>
            Small shop.
            <br />
            Smart systems.
          </p>
          <small>Everything in its right place.</small>
        </div>
        <button className="help-button" onClick={() => open('help')}>
          <CircleHelp size={18} />
          Quick guide
          <ArrowUpRight size={16} />
        </button>
        <button
          className="profile profile-button"
          onClick={() => open('profile')}
        >
          <span className="avatar">MK</span>
          <div>
            <strong>Maliha Khan</strong>
            <small>Store manager</small>
          </div>
          <Settings2 size={16} />
        </button>
      </div>
    </Sidebar>
  );
}
function ProductRow({
  product,
  add,
}: {
  product: Product;
  add?: (product: Product) => void;
}) {
  return (
    <tr>
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
        {add && (
          <button className="mini-add" onClick={() => add(product)}>
            <Plus size={14} />
            Add
          </button>
        )}
      </td>
    </tr>
  );
}
function ProductTable({
  products,
  add,
}: {
  products: Product[];
  add?: (product: Product) => void;
}) {
  return (
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
          {products.map((product) => (
            <ProductRow key={product.id} product={product} add={add} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
function MovementTable({ movements }: { movements: Movement[] }) { return <div className="table-scroll"><table className="ledger"><thead><tr><th>ITEM</th><th>ACTIVITY</th><th>QUANTITY</th><th>DATE</th><th className="amount">UPDATED BY</th></tr></thead><tbody>{movements.map((movement) => <tr key={movement.id}><td><strong>{movement.item}</strong></td><td><span className={`movement-type ${movement.kind.toLowerCase()}`}>{movement.kind}</span></td><td className={movement.quantity > 0 ? 'quantity-in' : 'quantity-out'}>{movement.quantity > 0 ? '+' : ''}{movement.quantity}</td><td className="muted">{movement.date}</td><td className="amount">{movement.by}</td></tr>)}</tbody></table></div>; }
function SalesBars({ month, setMonth }: { month: CompareMonth; setMonth: (value: CompareMonth) => void }) { const values = compareData[month]; const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']; const [hovered, setHovered] = useState(6); return <section className="panel compare-panel"><div className="panel-heading"><div><span className="section-number">01 / SALES COMPARISON</span><h2>Sales against {month}<span className="orange">.</span></h2></div><span className="growth-pill"><ArrowUpRight size={14} />+18.4%</span></div><div className="compare-controls">{(Object.keys(compareData) as CompareMonth[]).map((option) => <button key={option} className={month === option ? 'selected' : ''} onClick={() => setMonth(option)}>{option}</button>)}</div><div className="bar-chart-summary"><strong>{money(184260)}</strong><span>Current period sales<br /><small>{labels[hovered]} selected</small></span></div><div className="interactive-bars" role="img" aria-label={`Sales for ${month}`}><div className="interactive-axis"><span>৳40k</span><span>৳20k</span><span>৳0</span></div><div className="interactive-plot"><div className="bar-grid-lines"><i /><i /><i /></div><div className="interactive-bar-list">{values.map((value, index) => <button key={`${month}-${index}`} className={hovered === index ? 'hovered' : ''} onMouseEnter={() => setHovered(index)} onFocus={() => setHovered(index)} onClick={() => setHovered(index)} aria-label={`${labels[index]} sales ${money(value * 500)}`}><span className="interactive-bar" style={{ height: `${value}%` }} /><span>{labels[index]}</span><em>{money(value * 500)}</em></button>)}</div></div></div><div className="bar-chart-legend"><span><i />{month}</span><strong>{labels[hovered]} · {money(values[hovered] * 500)}</strong></div></section>; }
function LineComparison({
  month,
  setMonth,
}: {
  month: CompareMonth;
  setMonth: (value: CompareMonth) => void;
}) {
  const values = compareData[month];
  const points = values
    .map((value, index) => `${index * 52 + 8},${112 - value}`)
    .join(' ');
  return (
    <>
      <section className="panel compare-panel">
        <div className="panel-heading">
          <div>
            <span className="section-number">01 / SALES COMPARISON</span>
            <h2>
              Growth against last month<span className="orange">.</span>
            </h2>
          </div>
          <span className="growth-pill">
            <ArrowUpRight size={14} />
            +18.4%
          </span>
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
          <svg
            viewBox="0 0 320 130"
            role="img"
            aria-label={`Sales compared with ${month}`}
          >
            <path className="line-grid" d="M8 20H320M8 66H320M8 112H320" />
            <polyline
              className="line-previous"
              points="8,93 60,88 112,96 164,77 216,84 268,68 320,74"
            />
            <polyline className="line-current" points={points} />
            <circle className="line-dot" cx="320" cy={112 - values[6]} r="4" />
          </svg>
          <div className="line-labels">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>
        <div className="line-legend">
          <span>
            <i className="current-dot" />
            September 2026
          </span>
          <span>
            <i className="previous-dot" />
            {month}
          </span>
          <strong>৳184,260 total sales</strong>
        </div>
      </section>
      <div className="secondary-dashboard-grid">
        <YearlySales />
        <IncomeExpense />
      </div>
    </>
  );
}
function YearlySales() {
  const values = [18, 30, 22, 43, 36, 65, 61, 92, 86, 96];
  const points = values
    .map((value, index) => `${index * 31 + 8},${112 - value}`)
    .join(' ');
  return (
    <section className="panel yearly-panel">
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
    </section>
  );
}
function IncomeExpense() {
  return (
    <div className="income-expense">
      <section className="panel mini-chart-card">
        <div className="mini-card-head">
          <strong>Incomes</strong>
          <span>Weekly⌄</span>
        </div>
        <div className="pie income-pie" />
        <div className="mini-legend">
          <span>
            <i className="legend-green" />
            Electronics
          </span>
          <span>
            <i className="legend-yellow" />
            Accessories
          </span>
          <span>
            <i className="legend-dark" />
            Software
          </span>
          <span>
            <i className="legend-sage" />
            Maintenance
          </span>
        </div>
      </section>
      <section className="panel mini-chart-card">
        <div className="mini-card-head">
          <strong>Expenses</strong>
          <span>Weekly⌄</span>
        </div>
        <div className="pie expense-pie">
          <b>
            Total
            <br />
            100%
          </b>
        </div>
        <div className="mini-legend">
          <span>
            <i className="legend-yellow" />
            Marketing
          </span>
          <span>
            <i className="legend-green" />
            Salaries
          </span>
          <span>
            <i className="legend-red" />
            Office rent
          </span>
          <span>
            <i className="legend-sage" />
            Logistics
          </span>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState('Overview');
  const [products, setProducts] = useState(productsSeed);
  const [sales, setSales] = useState(salesSeed);
  const [movements, setMovements] = useState(movementsSeed);
  const [cart, setCart] = useState<Product[]>([]);
  const [scan, setScan] = useState('');
  const [scannerLive, setScannerLive] = useState(true);
  const [query, setQuery] = useState('');
  const [compareMonth, setCompareMonth] = useState<CompareMonth>('August 2026');
  const [modal, setModal] = useState<Modal>(null);
  const [notice, setNotice] = useState('');
  const [profileName, setProfileName] = useState('Maliha Khan');
  const [profileRole, setProfileRole] = useState('Store manager');
  const [productEntryMode, setProductEntryMode] = useState<'scan' | 'manual'>('scan');
  const cameraRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<HTMLVideoElement>(null);
  const [cameraStatus, setCameraStatus] = useState<'starting' | 'live' | 'blocked'>('starting');
  useEffect(() => {
    const handleQuickAction = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest('.quick-actions button');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      const label = button.textContent || '';
      setActive('Overview');
      if (label.includes('New sale')) setModal('scan');
      else if (label.includes('Receive stock')) setModal('receive');
      else if (label.includes('Check stock')) setModal('stock');
      else if (label.includes('Daily close')) setModal('close');
      else setModal('help');
    };
    document.addEventListener('click', handleQuickAction, true);
    return () => document.removeEventListener('click', handleQuickAction, true);
  }, []);
  useEffect(() => {
    if (modal !== 'scan' && !(active === 'POS / Checkout' && scannerLive)) return;
    let isMounted = true;
    let controls: any;

    setCameraStatus('starting');
    const videoElement = modal === 'scan' ? cameraRef.current : scannerRef.current;

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
            // Prevent duplicate scans within 2 seconds
            if (text !== lastScanText || now - lastScanTime > 2000) {
              setScan(text);
              if (modal === 'scan') {
                setNotice('Barcode/QR detected. Confirm the product below.');
              } else {
                setNotice(`Scanned: ${text}`);
              }
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
  }, [modal, active, scannerLive]);
  const lowStock = products.filter(
    (product) => product.stock <= product.reorder,
  );
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
  const filtered = products.filter((product) =>
    `${product.name} ${product.sku} ${product.category}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
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
      {
        id: Date.now(),
        invoice,
        items: cart.length,
        total: cartTotal,
        method,
        time: 'Just now',
      },
      ...previous,
    ]);
    setProducts((previous) =>
      previous.map((product) =>
        cart.some((item) => item.id === product.id)
          ? { ...product, stock: product.stock - 1 }
          : product,
      ),
    );
    setMovements((previous) => [{ id: Date.now(), item: cart[0].name, kind: 'Sold', quantity: -cart.length, date: '07 Sep 2026', by: invoice }, ...previous]);
    setCart([]);
    setNotice(`${invoice} completed via ${method}.`);
  };
  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setProfileName(String(data.get('name')));
    setProfileRole(String(data.get('role')));
    setModal(null);
    setNotice('Profile updated successfully.');
  };
  const receiveStock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const sku = String(data.get('sku') || '')
      .trim()
      .toLowerCase();
    const quantity = Number(data.get('quantity'));
    const match = products.find((product) => product.sku.toLowerCase() === sku);
    if (!match || !Number.isInteger(quantity) || quantity < 1) {
      setNotice('Use a valid SKU and receiving quantity.');
      return;
    }
    setProducts((previous) =>
      previous.map((product) =>
        product.id === match.id
          ? { ...product, stock: product.stock + quantity }
          : product,
      ),
    );
    setMovements((previous) => [{ id: Date.now(), item: match.name, kind: 'Received', quantity, date: '07 Sep 2026', by: 'Stock receiving' }, ...previous]);
    setModal(null);
    setNotice(`${quantity} units received for ${match.name}.`);
  };
  const saveProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const sku = String(data.get(productEntryMode === 'scan' ? 'barcode' : 'sku') || '').trim();
    const stock = Number(data.get('stock'));
    const price = Number(data.get('price'));
    if (!name || !sku || !Number.isInteger(stock) || stock < 0 || !Number.isFinite(price) || price <= 0) {
      setNotice('Complete the product name, code, stock, and price.');
      return;
    }
    if (products.some((product) => product.sku.toLowerCase() === sku.toLowerCase())) {
      setNotice('That barcode or SKU is already in inventory.');
      return;
    }
    setProducts((previous) => [
      {
        id: Date.now(),
        sku,
        name,
        category: String(data.get('category') || 'Clothing'),
        stock,
        reorder: 8,
        price,
        tone: 'peach',
      },
      ...previous,
    ]);
    setModal(null);
    setNotice(`${name} added to inventory.`);
  };
  const titles: Record<string, string> = {
    Overview: 'Your shop, in one view',
    'POS / Checkout': 'Make every checkout easy',
    Products: 'Everything on your shelves',
    'Stock movements': 'Every change, accounted for',
    Reports: 'The numbers behind the day',
  };
  const open = (value: Exclude<Modal, null>) => setModal(value);
  return (
    <SidebarProvider style={{ '--sidebar-width': '238px' } as CSSProperties}>
      <Navigation active={active} change={setActive} open={open} />
      <div className="app-main">
        <header className="topbar">
          <div className="breadcrumb">
            <SidebarTrigger className="mobile-menu" />
            <span>Operations</span>
            <ChevronRight size={14} />
            <strong>{active}</strong>
          </div>
          <div className="topbar-right">
            <span className="demo-label live-label">
              <i />
              Register open
            </span>
            <button
              className="header-icon"
              aria-label="Notifications"
              onClick={() => open('notifications')}
            >
              <Bell size={18} />
              <b>3</b>
            </button>
            <button className="header-profile" onClick={() => open('profile')}>
              <span className="avatar top-avatar">
                {profileName
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              <span>{profileName.split(' ')[0]}</span>
            </button>
          </div>
        </header>
        <main className="workspace">
          <section className="page-heading">
            <div>
              <p className="eyebrow">
                <span />
                MONDAY, 07 SEPTEMBER 2026
              </p>
              <h1>
                {titles[active]}
                <span className="orange">.</span>
              </h1>
              <p className="heading-description">
                Sales, cash, and stock clarity for the people running the shop.
              </p>
            </div>
            <button
              className="btn primary"
              onClick={() =>
                setActive(active === 'Products' ? 'Products' : 'POS / Checkout')
              }
            >
              <ScanLine size={17} />
              {active === 'Products' ? 'Add product' : 'Open checkout'}
            </button>
          </section>
          {notice && (
            <output className="notice">
              <Check size={17} />
              {notice}
              <button aria-label="Dismiss" onClick={() => setNotice('')}>
                <X size={16} />
              </button>
            </output>
          )}
          <div className="period-row">
            <span>
              <Tags size={16} />
              Today at Mezan <span className="period-dot">·</span> 07 Sep 2026
            </span>
            <button
              className="text-button"
              onClick={() => setActive('Reports')}
            >
              <ReceiptText size={15} />
              Daily report
            </button>
          </div>
          {active === 'Overview' && (
            <>
              <section className="stats-grid">
                {[
                  {
                    name: 'Today’s sales',
                    value: money(18640),
                    icon: ShoppingBag,
                    foot: '31 transactions',
                    cls: 'balance-card',
                  },
                  {
                    name: 'Cash in drawer',
                    value: money(12680),
                    icon: WalletCards,
                    foot: '৳5,960 digital',
                  },
                  {
                    name: 'Items sold',
                    value: '34',
                    icon: Package,
                    foot: 'Across 27 orders',
                  },
                  {
                    name: 'Low stock',
                    value: String(lowStock.length).padStart(2, '0'),
                    icon: AlertTriangle,
                    foot: 'Need attention',
                    cls: 'warning-card',
                  },
                ].map(({ name, value, icon: Icon, foot, cls }) => (
                  <article className={`stat-card ${cls || ''}`} key={name}>
                    <div className="stat-label">
                      {name}
                      <Icon size={19} />
                    </div>
                    <div className="stat-value">{value}</div>
                    <div className="stat-foot">
                      <span>{foot}</span>
                      {cls && <ArrowUpRight size={17} />}
                    </div>
                  </article>
                ))}
              </section>
              <section className="quick-actions">
                <div>
                  <span className="section-number">QUICK ACTIONS</span>
                  <h2>
                    Keep the day moving<span className="orange">.</span>
                  </h2>
                </div>
                <div className="quick-action-grid">
                  <button onClick={() => setActive('POS / Checkout')}>
                    <ScanLine size={19} />
                    <span>
                      <strong>New sale</strong>
                      <small>Scan and bill</small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                  <button onClick={() => open('receive')}>
                    <Truck size={19} />
                    <span>
                      <strong>Receive stock</strong>
                      <small>Add incoming units</small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                  <button onClick={() => setActive('Products')}>
                    <Search size={19} />
                    <span>
                      <strong>Check stock</strong>
                      <small>Query availability</small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                  <button onClick={() => setActive('Reports')}>
                    <Download size={19} />
                    <span>
                      <strong>Daily close</strong>
                      <small>Sales and cash</small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </section>
              <SalesBars month={compareMonth} setMonth={setCompareMonth} />
              <section className="panel activity-panel">
                <div className="panel-heading">
                  <div>
                    <span className="section-number">
                      02 / THE EVERYDAY DETAILS
                    </span>
                    <h2>
                      Recent sales<span className="orange">.</span>
                    </h2>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setActive('POS / Checkout')}
                  >
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
                        <tr key={sale.id}>
                          <td>
                            <strong>{sale.invoice}</strong>
                          </td>
                          <td>{sale.items}</td>
                          <td>{sale.method}</td>
                          <td className="muted">{sale.time}</td>
                          <td className="amount">
                            <strong>{money(sale.total)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
          {active === 'POS / Checkout' && (
            <section className="pos-layout">
              <section className="panel scanner-panel">
                <div className="panel-heading">
                  <div>
                    <span className="section-number">
                      CASHIER 01 / LIVE SCANNER
                    </span>
                    <h2>
                      Scan & sell<span className="orange">.</span>
                    </h2>
                  </div>
                  <button
                    className={`register-open scan-toggle ${scannerLive ? 'on' : ''}`}
                    onClick={() => setScannerLive(!scannerLive)}
                  >
                    <i />
                    {scannerLive ? 'Scanner live' : 'Start scanner'}
                  </button>
                </div>
                {scannerLive && (
                  <div className="scanner-viewport">
                    <video ref={scannerRef} className="scanner-video" autoPlay playsInline muted />
                    <div className="scan-corner top-left" />
                    <div className="scan-corner top-right" />
                    <div className="scan-corner bottom-left" />
                    <div className="scan-corner bottom-right" />
                    <div className="scanner-overlay"><ScanLine size={34} /><strong>{cameraStatus === 'live' ? 'Waiting for scan' : cameraStatus === 'blocked' ? 'Camera unavailable' : 'Starting camera'}</strong><span>{cameraStatus === 'blocked' ? 'Use the manual barcode field below.' : 'Point the camera at a product barcode.'}</span></div>
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
                {scan && (
                  <div className="scan-results">
                    {scanResults.length ? (
                      scanResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => addToCart(product)}
                        >
                          <span className={`product-swatch ${product.tone}`}>
                            <Package size={15} />
                          </span>
                          <span>
                            <strong>{product.name}</strong>
                            <small>
                              {product.sku} · {product.stock} in stock
                            </small>
                          </span>
                          <b>{money(product.price)}</b>
                        </button>
                      ))
                    ) : (
                      <p className="muted">No matching product found.</p>
                    )}
                  </div>
                )}
                <div className="quick-products">
                  <div className="quick-heading">
                    <span>Quick add</span>
                    <button onClick={() => setActive('Products')}>
                      Browse stock <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="quick-grid">
                    {products.slice(0, 4).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                      >
                        <span className={`product-swatch ${product.tone}`}>
                          <Package size={16} />
                        </span>
                        <strong>{product.name}</strong>
                        <small>{money(product.price)}</small>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
              <section className="panel cart-panel">
                <div className="panel-heading">
                  <div>
                    <span className="section-number">CURRENT BILL</span>
                    <h2>
                      Cart<span className="orange">.</span>
                    </h2>
                  </div>
                  <span className="pill">{cart.length} items</span>
                </div>
                {cart.length ? (
                  <div className="cart-items">
                    {cart.map((product, index) => (
                      <div className="cart-row" key={`${product.id}-${index}`}>
                        <div>
                          <strong>{product.name}</strong>
                          <small>{money(product.price)} · 1 unit</small>
                        </div>
                        <span>{money(product.price)}</span>
                        <button
                          onClick={() =>
                            setCart((previous) =>
                              previous.filter((_, i) => i !== index),
                            )
                          }
                          aria-label="Remove item"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-cart">
                    <ScanLine size={28} />
                    <strong>Ready for the next scan</strong>
                    <span>Scan a QR or choose a quick add.</span>
                  </div>
                )}
                <div className="bill-total">
                  <span>
                    Subtotal <strong>{money(cartTotal)}</strong>
                  </span>
                  <span>
                    VAT <strong>{money(Math.round(cartTotal * 0.05))}</strong>
                  </span>
                  <b>
                    Total <strong>{money(Math.round(cartTotal * 1.05))}</strong>
                  </b>
                </div>
                <div className="pay-actions">
                  <button
                    className="btn primary"
                    disabled={!cart.length}
                    onClick={() => completeSale('Cash')}
                  >
                    <WalletCards size={16} />
                    Cash
                  </button>
                  <button
                    className="btn"
                    disabled={!cart.length}
                    onClick={() => completeSale('Card')}
                  >
                    <CreditCard size={16} />
                    Card
                  </button>
                  <button
                    className="btn"
                    disabled={!cart.length}
                    onClick={() => completeSale('bKash')}
                  >
                    <Check size={16} />
                    bKash
                  </button>
                </div>
              </section>
            </section>
          )}
          {active === 'Products' && (
            <section className="panel detail-panel">
              <div className="panel-heading">
                <div>
                  <span className="section-number">STOCK QUERY</span>
                  <h2>
                    Is it on the shelf?<span className="orange">.</span>
                  </h2>
                </div>
                <span className="pill">{products.length} products</span>
              </div>
              <div className="table-tools">
                <label className="search-field">
                  <Search size={16} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search name, SKU, category"
                  />
                </label>
                <button
                  className="btn primary small-btn"
                  onClick={() => open('product')}
                >
                  <Plus size={15} />
                  Add product
                </button>
              </div>
              <ProductTable products={filtered} add={addToCart} />
            </section>
          )}
          {active === 'Stock movements' && (
            <>
              <section className="movement-summary-grid">
                <article className="stat-card"><div className="stat-label">Received today<Truck size={19} /></div><div className="stat-value quantity-in">+20</div><div className="stat-foot"><span>Units added to shelves</span></div></article>
                <article className="stat-card"><div className="stat-label">Sold today<ShoppingBag size={19} /></div><div className="stat-value quantity-out">-08</div><div className="stat-foot"><span>Units moved through POS</span></div></article>
                <article className="stat-card"><div className="stat-label">Stock adjustments<Boxes size={19} /></div><div className="stat-value">01</div><div className="stat-foot"><span>Count corrections</span></div></article>
              </section>
              <section className="panel detail-panel movement-screen"><div className="panel-heading"><div><span className="section-number">INVENTORY AUDIT TRAIL</span><h2>Every change, accounted for<span className="orange">.</span></h2></div><button className="btn primary small-btn" onClick={() => open('receive')}><Plus size={15} />Receive stock</button></div><div className="movement-filters"><button className="selected">All activity</button><button>Received</button><button>Sold</button><button>Adjusted</button></div><MovementTable movements={movements} /></section>
            </>
          )}
          {active === 'Reports' && (
            <section className="reports-grid">
              <section className="panel report-card">
                <span className="section-number">TODAY / 07 SEP</span>
                <h2>
                  Daily close<span className="orange">.</span>
                </h2>
                <div className="report-big">৳18,640</div>
                <div className="report-lines">
                  <span>
                    Cash sales <b>৳12,680</b>
                  </span>
                  <span>
                    Card sales <b>৳3,420</b>
                  </span>
                  <span>
                    bKash sales <b>৳2,540</b>
                  </span>
                  <span>
                    Total orders <b>31</b>
                  </span>
                </div>
                <button
                  className="btn primary"
                  onClick={() => setNotice('Daily report downloaded.')}
                >
                  <Download size={16} />
                  Download report
                </button>
              </section>
              <section className="panel report-card">
                <span className="section-number">SHIFT CHECKLIST</span>
                <h2>
                  Ready to close?<span className="orange">.</span>
                </h2>
                <div className="check-list">
                  <span>
                    <Check size={15} />
                    Cash drawer counted
                  </span>
                  <span>
                    <Check size={15} />
                    Digital payments matched
                  </span>
                  <span>
                    <Check size={15} />
                    Low stock reviewed
                  </span>
                  <span className="pending">
                    <AlertTriangle size={15} />
                    Print end-of-day receipt
                  </span>
                </div>
                <button
                  className="btn"
                  onClick={() =>
                    setNotice('End-of-day receipt sent to printer.')
                  }
                >
                  <Printer size={16} />
                  Print summary
                </button>
              </section>
            </section>
          )}
          <footer className="footer">
            <span>
              MEZAN<span className="orange">.</span>
              <span className="footer-rule" />A calmer way to run retail.
            </span>
            <span>Mezan Supershop · Gulshan, Dhaka</span>
          </footer>
        </main>
      </div>
      <Dialog
        open={modal !== null}
        onOpenChange={(openState) => {
          if (!openState) setModal(null);
        }}
      >
        <DialogContent className="mess-dialog">
          <DialogTitle>
            {modal === 'scan'
              ? 'Scan a product.'
              : modal === 'stock'
              ? 'Check stock.'
              : modal === 'close'
                ? 'Daily close.'
                : modal === 'profile'
              ? 'Your profile.'
              : modal === 'notifications'
                ? 'Notifications.'
                : modal === 'receive'
                  ? 'Receive stock.'
                  : modal === 'product'
                    ? 'Add to the shelves.'
                    : 'A little help, less admin.'}
          </DialogTitle>
          <DialogDescription>
            {modal === 'scan'
              ? 'Keep the camera pointed at a product barcode or use the manual input below.'
              : modal === 'stock'
              ? 'Search live inventory availability before answering a customer.'
              : modal === 'close'
                ? 'Review the shift totals before closing the register.'
                : modal === 'profile'
              ? 'Keep the team details up to date.'
              : modal === 'notifications'
                ? 'Three things need your attention today.'
                : modal === 'receive'
                  ? 'Add incoming units to a product already in the catalog.'
                  : modal === 'product'
                    ? 'Create a product the cashier can find by SKU.'
                    : 'Your quick guide to Mezan Supershop.'}
          </DialogDescription>
          {modal === 'scan' ? (
            <div className="scan-dialog-flow">
              <div className="scan-dialog-camera">
                <div className="scan-corner top-left" />
                <div className="scan-corner top-right" />
                <div className="scan-corner bottom-left" />
                <div className="scan-corner bottom-right" />
                <video ref={cameraRef} className="scanner-video" autoPlay playsInline muted />
                <ScanLine size={34} />
                <strong>{scan ? 'Barcode detected' : 'Waiting for scan'}</strong>
                <small>{scan ? 'Confirm the product below.' : 'Point the camera at a product barcode.'}</small>
                <span className="scan-line-animation" />
              </div>
              <button className="btn primary scan-dialog-button" type="button" onClick={() => { setScan(products[0].sku); setNotice('Barcode detected. Confirm the product below.'); }}><ScanLine size={17} />{scan ? 'Scan again' : 'Start camera scan'}</button>
              {scan && <div className="scan-dialog-result">{scanResults.length ? scanResults.slice(0, 1).map((product) => <button key={product.id} type="button" onClick={() => { addToCart(product); setModal(null); }}><span className={`product-swatch ${product.tone}`}><Package size={15} /></span><span><strong>{product.name}</strong><small>{product.sku} · {product.stock} in stock</small></span><ArrowRight size={16} /></button>) : <span className="muted">No product found for this code.</span>}</div>}
              <div className="manual-scan-divider"><span>or enter manually</span></div>
              <form className="manual-scan-form" onSubmit={(event) => { event.preventDefault(); const value = String(new FormData(event.currentTarget).get('manualCode') || '').trim(); setScan(value); setNotice(value ? 'Code entered. Confirm the product below.' : 'Enter a barcode or SKU first.'); }}><label>Barcode / SKU<input name="manualCode" placeholder="e.g. MZN-101" autoComplete="off" /></label><button className="btn" type="submit">Find product<Search size={16} /></button></form>
            </div>
          ) : modal === 'stock' ? (
            <div className="stock-query-popup"><label className="search-field"><Search size={16} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product or SKU" /></label><div className="popup-stock-list">{filtered.slice(0, 5).map((product) => <div key={product.id}><span className={`product-swatch ${product.tone}`}><Package size={15} /></span><span><strong>{product.name}</strong><small>{product.sku} · {product.stock} units available</small></span><b className={product.stock <= product.reorder ? 'low-copy' : ''}>{product.stock <= product.reorder ? 'Reorder' : 'Available'}</b></div>)}{!filtered.length && <p className="muted">No product matches that query.</p>}</div></div>
          ) : modal === 'close' ? (
            <div className="close-popup"><div className="close-total"><span>Today’s net sales</span><strong>৳18,640</strong></div><div className="close-lines"><span>Cash drawer <b>৳12,680</b></span><span>Card & bKash <b>৳5,960</b></span><span>Transactions <b>31</b></span><span>Low-stock items <b>{lowStock.length}</b></span></div><button className="btn primary" onClick={() => { setModal(null); setNotice('Shift summary is ready to close.'); }}><Check size={16} />Confirm daily close</button></div>
          ) : modal === 'profile' ? (
            <form className="entry-form" onSubmit={saveProfile}>
              <label>
                Full name
                <input name="name" defaultValue={profileName} required />
              </label>
              <label>
                Role
                <input name="role" defaultValue={profileRole} required />
              </label>
              <button className="btn primary" type="submit">
                Save profile
                <Check size={16} />
              </button>
            </form>
          ) : modal === 'notifications' ? (
            <div className="notification-list">
              <p>
                <AlertTriangle size={17} />
                <span>
                  <strong>2 products are low in stock.</strong>
                  <small>
                    Pearl earrings and satin slip dress need a reorder.
                  </small>
                </span>
              </p>
              <p>
                <WalletCards size={17} />
                <span>
                  <strong>Cash drawer is ready to reconcile.</strong>
                  <small>৳12,680 expected at today’s close.</small>
                </span>
              </p>
              <p>
                <Truck size={17} />
                <span>
                  <strong>Incoming stock is due.</strong>
                  <small>Noor Textiles delivery is expected today.</small>
                </span>
              </p>
            </div>
          ) : modal === 'receive' ? (
            <form
              className="entry-form"
              onSubmit={receiveStock}
            >
              <label>
                Product SKU
                <input name="sku" required placeholder="e.g. MZN-101" />
              </label>
              <label>
                Units received
                <input
                  name="quantity"
                  required
                  type="number"
                  min="1"
                  placeholder="0"
                />
              </label>
              <button className="btn primary" type="submit">
                Confirm receiving
                <Check size={16} />
              </button>
            </form>
          ) : modal === 'help' ? (
            <div className="help-copy">
              <p>
                <strong>New sale</strong>
                <br />
                Start scanner mode, point the camera at a product QR, confirm
                the result, then collect payment.
              </p>
              <p>
                <strong>Quick actions</strong>
                <br />
                The Overview shortcuts open focused workflows without leaving the dashboard.
              </p>
              <p>
                <strong>Sales comparison</strong>
                <br />
                Choose any month in the line chart to compare its trend with the
                current month.
              </p>
            </div>
          ) : (
            <form className="entry-form product-entry-form" onSubmit={saveProduct}>
              <div className="entry-mode-tabs" role="tablist" aria-label="Product code entry mode">
                <button type="button" className={productEntryMode === 'scan' ? 'selected' : ''} onClick={() => setProductEntryMode('scan')}><ScanLine size={15} />Scan barcode</button>
                <button type="button" className={productEntryMode === 'manual' ? 'selected' : ''} onClick={() => setProductEntryMode('manual')}><Settings2 size={15} />Enter manually</button>
              </div>
              {productEntryMode === 'scan' ? <label>Barcode / QR code<input name="barcode" required autoFocus placeholder="Scan or type barcode" /><small className="field-hint"><ScanLine size={13} />Use a USB scanner or type the code manually.</small></label> : <label>SKU / product code<input name="sku" required autoFocus placeholder="e.g. MZN-160" /></label>}
              <label>Product name<input name="name" required placeholder="e.g. Cotton wrap blouse" /></label>
              <label>Category<select name="category" defaultValue="Clothing"><option>Clothing</option><option>Accessories</option><option>Bags</option><option>Shoes</option><option>Groceries</option></select></label>
              <div className="form-row"><label>Units<input name="stock" type="number" min="0" required placeholder="0" /></label><label>Price (৳)<input name="price" type="number" min="1" required placeholder="0" /></label></div>
              <button className="btn primary" type="submit">{productEntryMode === 'scan' ? 'Save scanned product' : 'Add manual product'}<Check size={16} /></button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
