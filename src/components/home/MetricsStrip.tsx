'use client';

import React from 'react';
import { Database, QrCode, Cpu, Award } from 'lucide-react';

interface MetricItem {
  value: string;
  label: string;
  subtext: string;
  icon: React.ReactNode;
  badge: string;
}

export default function MetricsStrip() {
  const metrics: MetricItem[] = [
    {
      value: '10,000+',
      label: 'Medicine Records',
      subtext: 'AMMPS (Morocco) & BDPM (France) official drug reference catalogs',
      icon: <Database className="h-5 w-5 text-teal-600" />,
      badge: 'Live Reference',
    },
    {
      value: 'GS1 DataMatrix',
      label: 'Supported & Traceable',
      subtext: 'ISO/IEC 16022 standard with AI (01)(10)(21)(17) serialization',
      icon: <QrCode className="h-5 w-5 text-cyan-600" />,
      badge: 'Global Standard',
    },
    {
      value: 'Dual Engines',
      label: 'Batch & Serial Checked',
      subtext: 'Deterministic serialization ledger + cryptographic registry checks',
      icon: <Cpu className="h-5 w-5 text-emerald-600" />,
      badge: 'Dual Verification',
    },
    {
      value: 'OCR & CV',
      label: 'OCR Assisted Visual Checks',
      subtext: 'Sub-pixel packaging inspection, micro-font fidelity & seal integrity',
      icon: <Award className="h-5 w-5 text-teal-600" />,
      badge: 'Vision AI',
    },
  ];

  return (
    <section className="relative py-12 border-y border-slate-200/80 bg-white/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((item, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-teal-400 hover:-translate-y-1 hover:shadow-lg shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 shadow-sm">
                  {item.icon}
                </div>
                <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-mono text-teal-800 border border-teal-200 font-semibold">
                  {item.badge}
                </span>
              </div>
              <div className="font-mono text-2xl font-bold text-slate-900 tracking-tight sm:text-3xl">
                {item.value}
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-800">
                {item.label}
              </div>
              <div className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                {item.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
