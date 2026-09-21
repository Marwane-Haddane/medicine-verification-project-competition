'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  ScanLine, 
  Menu, 
  X, 
  Activity,
  ChevronRight
} from 'lucide-react';
import RubberSegment from '@/components/reactbits/RubberSegment/RubberSegment';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Verify', href: '/verify' },
  { label: 'Database', href: '/database' },
  { label: 'Report', href: '/report' },
  { label: 'How It Works', href: '/#how-it-works' },
];

const RUBBER_ITEMS = NAV_LINKS.map(l => ({
  value: l.href,
  label: l.label
}));

const subscribeHash = (callback: () => void) => {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
};
const getHashSnapshot = () => (typeof window !== 'undefined' ? window.location.hash : '');
const getServerHashSnapshot = () => '';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeHash = React.useSyncExternalStore(subscribeHash, getHashSnapshot, getServerHashSnapshot);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeTab = React.useMemo(() => {
    if (activeHash) {
      const hashHref = `/${activeHash}`;
      if (NAV_LINKS.some(l => l.href === hashHref)) return hashHref;
    }
    if (pathname.startsWith('/result')) return '/verify';
    const match = NAV_LINKS.find(l => l.href === pathname);
    return match ? match.href : '/';
  }, [pathname, activeHash]);

  const navLinks = NAV_LINKS;
  const rubberItems = RUBBER_ITEMS;

  return (
    <header className="sticky top-0 z-50 w-full pt-3 px-3 sm:px-6 lg:px-8 transition-all duration-300">
      <div
        className={`mx-auto max-w-7xl rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'glass-panel shadow-lg shadow-slate-200/50 border border-slate-200/90 bg-white/95'
            : 'glass-panel border border-slate-200/80 bg-white/85'
        } backdrop-blur-xl px-4 py-3 sm:px-6`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Reticle */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 border border-teal-300/80 text-teal-600 transition-all duration-300 group-hover:scale-105 group-hover:border-teal-500 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] shadow-sm">
              <ShieldCheck className="h-5 w-5 transition-transform group-hover:rotate-6" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  Medi<span className="text-teal-600 font-extrabold">Verify</span>
                </span>
                <span className="rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  v2.4
                </span>
              </div>
              <span className="hidden sm:block text-[11px] text-slate-500 tracking-wider uppercase font-medium">
                Digital Medicine Traceability
              </span>
            </div>
          </Link>

          {/* Network Node Status Badge */}
          <div className="hidden xl:flex items-center gap-2 rounded-full border border-slate-200/90 bg-slate-50/90 px-3 py-1 text-xs text-slate-600 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-slate-700">
              Reference Node: <strong className="text-teal-700 font-semibold">AMMPS / BDPM Active</strong>
            </span>
            <span className="inline-block h-3 w-[1px] bg-slate-300 mx-1"></span>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold flex items-center gap-1">
              <Activity className="h-3 w-3" /> 99.98% Sync
            </span>
          </div>

          {/* Desktop Nav: Animated RubberSegment from React Bits */}
          <nav className="hidden md:flex items-center">
            <RubberSegment
              items={rubberItems}
              value={activeTab}
              onChange={(val) => {
                router.push(val);
              }}
              trackColor="#f1f5f9"
              thumbColor="#ffffff"
              textColor="#475569"
              activeTextColor="#0f766e"
              size="md"
              radius={12}
              inset={3}
              equalSlots={false}
              stretch={75}
              squash={2}
              speed={1}
              glide={50}
              draggable
              className="shadow-sm border border-slate-200/80 font-medium"
            />
          </nav>

          {/* Primary High-Visibility CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/verify"
              className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all duration-200 hover:from-teal-500 hover:to-teal-600 hover:shadow-teal-600/35 hover:scale-[1.02] active:scale-[0.98] border border-teal-500/30"
            >
              <ScanLine className="h-4 w-4 animate-pulse" />
              <span>Scan a Medicine</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/verify"
              className="inline-flex items-center justify-center rounded-lg bg-teal-50 p-2 text-teal-600 border border-teal-200 shadow-sm"
              aria-label="Scan"
            >
              <ScanLine className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="mt-3 border-t border-slate-200 pt-3 md:hidden">
            <div className="flex items-center gap-2 rounded-lg bg-teal-50/80 p-2.5 mb-3 border border-teal-200">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-teal-900 font-medium">
                AMMPS / BDPM Live Reference Active
              </span>
            </div>
            <nav className="flex flex-col gap-1.5 pb-2">
              {navLinks.map((item) => {
                const isActive = activeTab === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                );
              })}
              <div className="pt-2">
                <Link
                  href="/verify"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25"
                >
                  <ScanLine className="h-4 w-4" />
                  <span>Scan a Medicine Now</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
