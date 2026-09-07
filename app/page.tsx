'use client';
import { useEffect, useState, type FormEvent, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight, ArrowRight, Plus, LayoutDashboard, Utensils, Users, Receipt, BedDouble, Building2, ChevronRight, CalendarDays, Download, Coffee, Sun, Moon, CircleHelp, Check, Wallet, X } from 'lucide-react';
import { Sidebar, SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';

type Expense = { id: number; title: string; category: string; by: string; date: string; amount: number };
type Member = { id: number; name: string; room: string; meals: number; paid: number; due: number };
const initialExpenses: Expense[] = [
  { id: 1, title: 'Weekly grocery run', category: 'Groceries', by: 'Tanvir Ahmed', date: '07 Sep 2026', amount: 3250 },
  { id: 2, title: 'Vegetables & fresh produce', category: 'Groceries', by: 'Rafiul Islam', date: '06 Sep 2026', amount: 840 },
  { id: 3, title: 'Gas cylinder refill', category: 'Utilities', by: 'Habib Nabil', date: '05 Sep 2026', amount: 1450 },
  { id: 4, title: 'Rice, lentils & cooking oil', category: 'Groceries', by: 'Tanvir Ahmed', date: '04 Sep 2026', amount: 4260 },
  { id: 5, title: 'Eggs & breakfast supplies', category: 'Groceries', by: 'Rafiul Islam', date: '03 Sep 2026', amount: 1640 },
  { id: 6, title: 'Chicken & fish', category: 'Groceries', by: 'Tanvir Ahmed', date: '02 Sep 2026', amount: 2400 },
  { id: 7, title: 'Pantry essentials', category: 'Groceries', by: 'Habib Nabil', date: '01 Sep 2026', amount: 1820 },
];
const initialMembers: Member[] = [
  { id: 1, name: 'Habib Nabil', room: '101', meals: 19, paid: 3000, due: 0 },
  { id: 2, name: 'Tanvir Ahmed', room: '101', meals: 20, paid: 2500, due: 500 },
  { id: 3, name: 'Rafiul Islam', room: '102', meals: 18, paid: 3000, due: 0 },
  { id: 4, name: 'Sakib Hasan', room: '102', meals: 17, paid: 2000, due: 1000 },
  { id: 5, name: 'Mehedi Hasan', room: '103', meals: 19, paid: 2500, due: 500 },
  { id: 6, name: 'Arif Rahman', room: '103', meals: 18, paid: 3000, due: 0 },
  { id: 7, name: 'Fahim Ahmed', room: '104', meals: 20, paid: 2000, due: 1000 },
  { id: 8, name: 'Naim Hossain', room: '104', meals: 18, paid: 3000, due: 0 },
  { id: 9, name: 'Ashik Mahmud', room: '105', meals: 19, paid: 2500, due: 500 },
  { id: 10, name: 'Samiul Haque', room: '105', meals: 18, paid: 3000, due: 0 },
  { id: 11, name: 'Rahat Khan', room: '106', meals: 20, paid: 2000, due: 1000 },
  { id: 12, name: 'Imran Hossain', room: '106', meals: 18, paid: 2500, due: 500 },
];
const money = (n: number) => `৳${n.toLocaleString('en-US')}`;
const nav = [{ label: 'Overview', icon: LayoutDashboard }, { label: 'Meal tracker', icon: Utensils }, { label: 'Members', icon: Users }, { label: 'Expenses', icon: Receipt }, { label: 'Rooms', icon: BedDouble }];
const initials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('');
function Navigation({ active, change, help }: { active: string; change: (v: string) => void; help: () => void }) {
 const { setOpenMobile } = useSidebar();
 return <Sidebar className="mess-sidebar"><a className="brand" href="/" aria-label="Mess Avengers overview"><span className="brand-mark">m<span>•</span></span><span>mess<br/>avengers<span className="orange">.</span></span></a>
 <div className="house-label"><span className="house-icon"><Building2 size={20}/></span><div><strong>Avengers House</strong><small>Dhanmondi, Dhaka</small></div></div>
 <div className="nav-label">WORKSPACE</div><nav className="main-nav" aria-label="Main navigation">{nav.map(({label, icon: Icon}) => <button key={label} aria-current={active === label ? 'page' : undefined} className={active === label ? 'active' : ''} onClick={() => {change(label);setOpenMobile(false);}}><Icon size={18}/>{label}{active === label && <span className="nav-dot"/>}</button>)}</nav>
 <div className="sidebar-bottom"><div className="side-note"><span className="little-star">✳</span><p>Good roommates.<br/>Great systems.</p><small>A little less mess, every day.</small></div><button className="help-button" onClick={help}><CircleHelp size={18}/>Quick guide<ArrowUpRight size={16}/></button><div className="profile"><span className="avatar">HN</span><div><strong>Habib Nabil</strong><small>Mess manager</small></div><span className="manager-dot"/></div></div></Sidebar>;
}
export default function Home() {
 const [active, setActive] = useState('Overview');
 const [expenses, setExpenses] = useState(initialExpenses);
 const [members, setMembers] = useState(initialMembers);
 const [modal, setModal] = useState<'expense'|'member'|'meal'|'help'|null>(null);
 const [notice, setNotice] = useState('');
 const [mealCounts, setMealCounts] = useState([10,12,11]);
 const [selectedDay, setSelectedDay] = useState(6);
 const [tableTab, setTableTab] = useState('expenses');
 useEffect(() => {
  const context = (document as Document & {modelContext?: {registerTool: (tool: {name: string; title: string; description: string; inputSchema: object; annotations: object; execute: (input: unknown) => unknown}, options: {signal: AbortSignal}) => void | Promise<void>}}).modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  try { void Promise.resolve(context.registerTool({name:'start_meal_count_update',title:'Open today’s meal count editor',description:'Open the September 7 meal editor in the Mess Avengers demo. This starts editing only; the user must save the form to update counts.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute(input:unknown){if(!input || typeof input!=='object' || Array.isArray(input) || Object.keys(input).length)throw new Error('Expected an empty object.');flushSync(()=>setModal('meal'));return {status:'editor_open',saved:false};}}, {signal:lifecycle.signal})).catch(()=>{}); } catch { /* Unsupported registration leaves the standard interface usable. */ }
  return () => lifecycle.abort();
 }, []);
 const totalExpenses = expenses.reduce((a,e)=>a+e.amount,0);
 const totalPaid = members.reduce((a,m)=>a+m.paid,0);
 const totalDue = members.reduce((a,m)=>a+m.due,0);
 const totalMeals = members.reduce((a,m)=>a+m.meals,0);
 const occupied = new Set(members.map(m=>m.room)).size;
 const week = Array.from({length:7},(_,i)=>expenses.filter(e=>e.date===`${String(i+1).padStart(2,'0')} Sep 2026`).reduce((a,e)=>a+e.amount,0));
 const titles: Record<string,string> = { Overview: 'Your mess, in order', 'Meal tracker': 'Every meal counts', Members: 'Meet your people', Expenses: 'Know where it goes', Rooms: 'A place for everyone' };
 function saveForm(e: FormEvent<HTMLFormElement>) {
  e.preventDefault(); const data = new FormData(e.currentTarget);
  if (modal === 'expense') { const title=String(data.get('title')).trim(); const amount=Number(data.get('amount')); if(!title || amount<=0 || !Number.isFinite(amount)) return;
   setExpenses(prev=>[{id:Date.now(),title,category:'Groceries',by:'Habib Nabil',date:'07 Sep 2026',amount},...prev]);setNotice(`${title} added to expenses.`);
  } else if (modal === 'member') {const name=String(data.get('name')).trim();const room=String(data.get('room')).trim();if(!name||!room)return;setMembers(prev=>[...prev,{id:Date.now(),name,room,meals:0,paid:0,due:3000}]);setNotice(`${name} added to your mess.`);
  } else if (modal === 'meal') {const counts=['breakfast','lunch','dinner'].map(k=>Number(data.get(k)));if(counts.some(n=>!Number.isInteger(n)||n<0||n>members.length))return;setMealCounts(counts);setNotice('Today’s meal counts updated.');}
  setModal(null);
 }
 function exportReport() {
  const csv = ['Description,Category,Paid by,Date,Amount (BDT)', ...expenses.map(e=>[e.title,e.category,e.by,e.date,e.amount].map(v=>`"${String(v).replace(/"/g,'""').replace(/^[=+@-]/,"'$&")}"`).join(','))].join('\r\n');
  const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='mess-avengers-september-expenses.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('September expense report downloaded.');
 }
 function ExpenseTable(){return <Table className="ledger"><TableHeader><TableRow><TableHead>EXPENSE</TableHead><TableHead>PAID BY</TableHead><TableHead>DATE</TableHead><TableHead className="amount">AMOUNT</TableHead></TableRow></TableHeader><TableBody>{(active==='Overview'?expenses.slice(0,4):expenses).map(e=><TableRow key={e.id}><TableCell><div className="expense-name"><span className="expense-icon">{e.category==='Utilities'?<Building2 size={17}/>:<Receipt size={17}/>}</span><div><strong>{e.title}</strong><small>{e.category}</small></div></div></TableCell><TableCell>{e.by}</TableCell><TableCell className="muted">{e.date}</TableCell><TableCell className="amount"><strong>{money(e.amount)}</strong></TableCell></TableRow>)}</TableBody></Table>}
 function MemberTable(){return <Table className="ledger"><TableHeader><TableRow><TableHead>MEMBER</TableHead><TableHead>ROOM</TableHead><TableHead>DEPOSIT</TableHead><TableHead className="amount">DUES</TableHead></TableRow></TableHeader><TableBody>{(active==='Overview'?members.slice(0,4):members).map(m=><TableRow key={m.id}><TableCell><div className="expense-name"><span className="avatar small-avatar">{initials(m.name)}</span><strong>{m.name}</strong></div></TableCell><TableCell>{m.room}</TableCell><TableCell>{money(m.paid)}</TableCell><TableCell className="amount">{m.due?money(m.due):<span className="paid-status"><Check size={13}/>Settled</span>}</TableCell></TableRow>)}</TableBody></Table>}
 return <SidebarProvider style={{'--sidebar-width':'238px'} as CSSProperties}>
 <Navigation active={active} change={setActive} help={()=>setModal('help')}/>
 <div className="app-main"><header className="topbar"><div className="breadcrumb"><SidebarTrigger className="mobile-menu"/><span>Workspace</span><ChevronRight size={14}/><strong>{active}</strong></div><div className="topbar-right"><span className="demo-label">Demo workspace</span><span className="topbar-divider"/><span className="month-top">September 2026</span><span className="avatar top-avatar">HN</span></div></header>
 <main className="workspace"><section className="page-heading"><div><p className="eyebrow"><span/>MONDAY, 07 SEPTEMBER 2026</p><h1>{titles[active]}<span className="orange">.</span></h1><p className="heading-description">{active==='Overview'?'A clear picture of your home. More time for the people in it.':active==='Meal tracker'?'Keep the kitchen in sync with everyone at the table.':active==='Members'?'Roommates, contributions, and balances — together.':active==='Expenses'?'Every shared expense, accounted for.':'Your house at a glance. One community.'}</p></div><button className="btn primary" onClick={()=>setModal(active==='Members'||active==='Rooms'?'member':active==='Meal tracker'?'meal':'expense')}><Plus size={17}/>{active==='Members'||active==='Rooms'?'Add member':active==='Meal tracker'?'Update meals':'Add expense'}</button></section>
 {notice&&<div className="notice" role="status"><Check size={17}/>{notice}<button aria-label="Dismiss notification" onClick={()=>setNotice('')}><X size={16}/></button></div>}
 <div className="period-row"><span><CalendarDays size={16}/>September overview <span className="period-dot">·</span> 01–07 Sep</span><button className="text-button" onClick={exportReport}><Download size={15}/>Export report</button></div>
 <section className="stats-grid" aria-label="Monthly summary">
 {[{name:'Mess balance',value:money(totalPaid-totalExpenses),icon:Wallet,foot:`${money(totalPaid)} deposited`,cls:'balance-card'}, {name:'Total expenses',value:money(totalExpenses),icon:Receipt,foot:'Groceries & household essentials'}, {name:'Meal rate',value:money(Number((expenses.filter(e=>e.category==='Groceries').reduce((a,e)=>a+e.amount,0)/totalMeals).toFixed(2))),icon:Utensils,foot:`Food cost / ${totalMeals} meals`}, {name:'Active members',value:String(members.length).padStart(2,'0'),icon:Users,foot:`${occupied} rooms occupied`}].map(({name,value,icon:Icon,foot,cls})=><article key={name} className={`stat-card ${cls||''}`}><div className="stat-label">{name}<Icon size={19}/></div><div className="stat-value">{value}</div><div className="stat-foot"><span>{foot}</span>{cls&&<ArrowUpRight size={17}/>}</div></article>)}
 </section>
 {active==='Overview'&&<><div className="overview-grid"><section className="panel spending-panel"><div className="panel-heading"><div><span className="section-number">01 / THE BIG PICTURE</span><h2>A week in expenses<span className="orange">.</span></h2></div><span className="pill">This week</span></div><div className="chart-info"><strong>{money(week[selectedDay])}</strong><span>September {String(selectedDay+1).padStart(2,'0')}<br/><span className="muted">Daily spending</span></span></div><div className="chart" role="group" aria-label="Daily expenses for September 1 to 7"><div className="chart-axis"><span>{money(Math.max(5000,...week))}</span><span>{money(Math.max(5000,...week)/2)}</span><span>৳0</span></div><div className="plot"><div className="grid-lines"><i/><i/><i/></div><div className="bars">{week.map((value,i)=><button key={i} className={`bar-column ${selectedDay===i?'selected':''}`} onClick={()=>setSelectedDay(i)} aria-label={`September ${i+1}: ${money(value)}`} aria-pressed={selectedDay===i}><span className="bar" style={{height:`${value/Math.max(5000,...week)*100}%`}}/><span className="bar-label">{['Tue','Wed','Thu','Fri','Sat','Sun','Mon'][i]}</span></button>)}</div></div></div><div className="chart-footer"><span><i/>Daily expenses</span><span>Little details. A clearer picture.</span></div></section>
 <section className="panel today-panel"><div className="panel-heading"><div><span className="section-number">02 / AT THE TABLE</span><h2>Today’s meals<span className="orange">.</span></h2></div><Utensils size={21}/></div><div className="meal-total"><strong>{mealCounts.reduce((a,b)=>a+b,0)}</strong><span>meals planned<br/>for today</span><span className="pill">07 Sep</span></div><div className="meal-list">{[{name:'Breakfast',icon:Coffee,time:'8:00 – 9:30 AM'}, {name:'Lunch',icon:Sun,time:'1:00 – 2:30 PM'}, {name:'Dinner',icon:Moon,time:'8:30 – 10:00 PM'}].map(({name,icon:Icon,time},i)=><div className="meal-row" key={name}><span className="meal-icon"><Icon size={19}/></span><div><strong>{name}</strong><small>{time}</small></div><strong className="meal-count">{mealCounts[i]}<span> / {members.length}</span></strong></div>)}</div><button className="wide-link" onClick={()=>setModal('meal')}>Manage today’s meals<ArrowRight size={17}/></button></section></div>
 <div className="community-band"><div className="band-icon"><Users size={22}/></div><p>A happy mess is a <strong>shared effort.</strong><span>{money(totalDue)} in member dues is pending this month.</span></p><button onClick={()=>{setActive('Members');window.scrollTo({top:0,behavior:'smooth'});}}>View balances<ArrowUpRight size={18}/></button></div>
 <section className="panel activity-panel"><div className="panel-heading"><div><span className="section-number">03 / THE EVERYDAY DETAILS</span><h2>Keeping things moving<span className="orange">.</span></h2></div><button className="text-button" onClick={()=>setActive(tableTab==='expenses'?'Expenses':'Members')}>View all<ArrowUpRight size={16}/></button></div><Tabs value={tableTab} onValueChange={value=>setTableTab(String(value))}><TabsList className="activity-tabs"><TabsTrigger value="expenses">Recent expenses<span>{expenses.length}</span></TabsTrigger><TabsTrigger value="members">Member balances<span>{members.length}</span></TabsTrigger></TabsList><TabsContent value="expenses"><ExpenseTable/></TabsContent><TabsContent value="members"><MemberTable/></TabsContent></Tabs></section></>}
 {active==='Expenses'&&<section className="panel detail-panel"><div className="panel-heading"><h2>September expense ledger<span className="orange">.</span></h2><span className="pill">{expenses.length} entries</span></div><ExpenseTable/></section>}
 {active==='Members'&&<section className="panel detail-panel"><div className="panel-heading"><h2>Everyone under one roof<span className="orange">.</span></h2><span className="pill">{money(totalDue)} pending</span></div><MemberTable/></section>}
 {active==='Rooms'&&<section className="rooms-grid">{Array.from(new Set([...['101','102','103','104','105','106'],...members.map(m=>m.room)])).map(room=><article className="panel room-panel" key={room}><BedDouble size={24}/><div className="room-title"><h2>Room {room}</h2><span className="pill">{members.filter(m=>m.room===room).length} members</span></div>{members.filter(m=>m.room===room).map(m=><div className="room-member" key={m.id}><span className="avatar small-avatar">{initials(m.name)}</span>{m.name}</div>)}</article>)}</section>}
 {active==='Meal tracker'&&<section className="panel detail-panel"><div className="panel-heading"><div><span className="section-number">07 SEPTEMBER 2026</span><h2>Today’s kitchen plan<span className="orange">.</span></h2></div><span className="pill">{mealCounts.reduce((a,b)=>a+b,0)} meals</span></div><div className="meal-plan-grid">{['Breakfast','Lunch','Dinner'].map((name,i)=><article key={name}><span className="section-number">0{i+1}</span><h3>{name}</h3><strong>{mealCounts[i]}<span> / {members.length}</span></strong><p>{['Paratha, egg & tea','Rice, chicken curry & dal','Rice, fish curry & vegetables'][i]}</p></article>)}</div><p className="muted meal-note">Update the count before the kitchen starts preparing. Counts include members eating today.</p><button className="btn primary" onClick={()=>setModal('meal')}>Update today’s meals<ArrowRight size={16}/></button></section>}
 <footer className="footer"><span>MESS AVENGERS<span className="orange">.</span><span className="footer-rule"/>Less admin. More living.</span><span>Sample data · Changes last for this session</span></footer>
 </main></div>
 <Dialog open={modal!==null} onOpenChange={open=>{if(!open)setModal(null);}}><DialogContent className="mess-dialog"><DialogTitle>{modal==='expense'?'Add an expense.':modal==='member'?'Make room for someone.':modal==='meal'?'Today’s meal counts.':'A little help, less mess.'}</DialogTitle><DialogDescription>{modal==='help'?'Your quick guide to Avengers House.':'Demo workspace · September 2026'}</DialogDescription>{modal==='help'?<div className="help-copy"><p><strong>Meals</strong><br/>Set how many members are joining each meal using “Manage today’s meals”.</p><p><strong>Expenses</strong><br/>Record grocery costs and export the monthly ledger as a spreadsheet.</p><p><strong>Members & rooms</strong><br/>Add roommates and see their deposits, dues, and room assignments.</p><p className="muted">This is an interactive UI demo. Changes reset when you reload the page; no accounts or payments are connected.</p></div>:<form className="entry-form" onSubmit={saveForm}>{modal==='expense'?<><label>Description<input name="title" required maxLength={100} placeholder="e.g. Fresh vegetables" autoFocus/></label><label>Amount (৳)<input name="amount" required type="number" min="1" max="10000000" step="0.01" placeholder="0.00"/></label><p className="muted">Recorded as groceries, paid by Habib Nabil.</p></>:modal==='member'?<><label>Full name<input name="name" required maxLength={70} placeholder="Roommate’s name" autoFocus/></label><label>Room number<input name="room" required pattern="[0-9]{1,4}" placeholder="e.g. 103"/></label><p className="muted">New members start with a ৳3,000 monthly contribution due.</p></>:<>{['Breakfast','Lunch','Dinner'].map((meal,i)=><label key={meal}>{meal}<input name={meal.toLowerCase()} type="number" min="0" max={members.length} required defaultValue={mealCounts[i]}/></label>)}</>}<button className="btn primary" type="submit">{modal==='expense'?'Save expense':modal==='member'?'Add member':'Save meal counts'}<Check size={17}/></button></form>}</DialogContent></Dialog>
 </SidebarProvider>;
}
