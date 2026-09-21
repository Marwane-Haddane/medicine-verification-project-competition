'use client';

import React, { useState, useEffect } from 'react';
import { Database, QrCode, Cpu, ShieldAlert, CheckCircle, Award } from 'lucide-react';

interface MetricItem {
  value: string;
  label: string;
  subtext: string;
  icon: React.ReactNode;
  badge: string;
}

export default function MetricsStrip() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const metrics: MetricItem[] = [
    {
      value: '10,000+',
      label: 'Medicine Records',
      subtext: 'AMMPS (Morocco) & BDPM (France) official drug reference catalogs',
      icon: <Database className="h-5 w-5 text-teal-400" />,
      badge: 'Live Reference',
    },
    {
      value: 'GS1 DataMatrix',
      label: 'Supported & Traceable',
      subtext: 'ISO/IEC 16022 standard with AI (01)(10)(21)(17) serialization',
      icon: <QrCode className="h-5 w-5 text-cyan-400" />,
      badge: 'Global Standard',
    },
    {
      value: 'Dual Engines',
      label: 'Batch & Serial Checked',
      subtext: 'Deterministic serialization ledger + cryptographic registry checks',
      icon: <Cpu className="h-5 w-5 text-emerald-400" />,
      badge: 'Dual Verification',
    },
    {
      value: 'OCR & CV',
      label: 'OCR Assisted Visual Checks',
      subtext: 'Sub-pixel packaging inspection, micro-font fidelity & seal integrity',
      icon: <Award className="h-5 w-5 text-teal-300" />,
      badge: 'Vision AI',
    },
  ];

  return (
    <section className="relative py-12 border-y border-slate-800/80 bg-[#081527]/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((item, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-2xl border border-teal-500/20 bg-gradient-to-b from-[#0e2444]/60 to-[#09172c]/80 p-5 transition-all duration-300 hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-950/40"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/80 border border-slate-700/80">
                  {item.icon}
                </div>
                <span className="rounded-full bg-teal-950/80 px-2.5 py-0.5 text-[10px] font-mono text-teal-300 border border-teal-500/30">
                  {item.badge}
                </span>
              </div>
              <div className="font-mono text-2xl font-bold text-white tracking-tight sm:text-3xl">
                {item.value}
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-200">
                {item.label}
              </div>
              <div className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {item.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
