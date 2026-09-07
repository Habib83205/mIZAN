import type { Metadata } from 'next';
import { Bricolage_Grotesque, Geist } from 'next/font/google';
import './globals.css';
const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const bricolage = Bricolage_Grotesque({ variable: '--font-display', subsets: ['latin'], weight: ['400','500','600','700'] });
export const metadata: Metadata = { title: 'Mezan — Inventory, beautifully kept', description: 'A thoughtful inventory workspace for local retail shops.', icons: { icon: '/favicon.svg' } };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {return <html lang="en"><body className={`${geist.variable} ${bricolage.variable}`}>{children}</body></html>;}
