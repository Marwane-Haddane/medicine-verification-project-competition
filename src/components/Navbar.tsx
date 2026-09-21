'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  ScanLine, 
  Database, 
  AlertTriangle, 
  Menu, 
  X, 
  CheckCircle2, 
  Activity,
  ChevronRight
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Verify', href: '/verify' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Technology', href: '/#technology' },
    { label: 'Database', href: '/database' },
    { label: 'About', href: '/#about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full pt-3 px-3 sm:px-6 lg:px-8 transition-all duration-300">
      <div
        className={`mx-auto max-w-7xl rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'glass-panel shadow-2xl shadow-teal-950/40 border border-teal-500/25 bg-[#0a192f]/90'
            : 'glass-panel border border-slate-700/60 bg-[#0a192f]/70'
        } backdrop-blur-xl px-4 py-3 sm:px-6`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Reticle */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-400/10 border border-teal-400/40 text-teal-400 transition-all duration-300 group-hover:scale-105 group-hover:border-teal-300 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]">
              <ShieldCheck className="h-5 w-5 transition-transform group-hover:rotate-6" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  Medi<span className="text-teal-400 font-extrabold">Verify</span>
                </span>
                <span className="rounded px-1 py-0.5 text-[9px] font-mono font-semibold bg-teal-950/80 text-teal-300 border border-teal-500/30">
                  v2.4
                </span>
              </div>
              <span className="hidden sm:block text-[11px] text-slate-400 tracking-wider uppercase font-medium">
                Digital Medicine Traceability
              </span>
            </div>
          </Link>

          {/* Network Node Status Badge */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-950/40 px-3 py-1 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-slate-300">
              Reference Node: <strong className="text-teal-300 font-medium">AMMPS / BDPM Active</strong>
            </span>
            <span className="inline-block h-3 w-[1px] bg-slate-700 mx-1"></span>
            <span className="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
              <Activity className="h-3 w-3" /> 99.98% Sync
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-teal-300 bg-teal-500/10 border border-teal-500/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Primary High-Visibility CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/verify"
              className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all duration-200 hover:from-teal-400 hover:to-teal-500 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] border border-teal-300/30"
            >
              <ScanLine className="h-4 w-4 animate-pulse" />
              <span>Scan a Medicine</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/verify"
              className="inline-flex items-center justify-center rounded-lg bg-teal-500/20 p-2 text-teal-400 border border-teal-500/40"
              aria-label="Scan"
            >
              <ScanLine className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-slate-800/80 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="mt-3 border-t border-slate-800/80 pt-3 md:hidden">
            <div className="flex items-center gap-2 rounded-lg bg-teal-950/40 p-2.5 mb-3 border border-teal-500/20">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-slate-300">
                AMMPS / BDPM Live Reference Active
              </span>
            </div>
            <nav className="flex flex-col gap-1.5 pb-2">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-500/25"
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
