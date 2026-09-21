'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ScanLine, 
  ArrowRight, 
  ShieldCheck, 
  Layers,
  Sparkles,
  Lock
} from 'lucide-react';
import MedicineBox3D from './MedicineBox3D';
import { PRESET_DEMOS } from '@/lib/mockData';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-400/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Headlines & Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* GS1 Standard Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/90 px-3.5 py-1.5 text-xs text-teal-800 shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="font-semibold tracking-wide">GS1 DataMatrix &amp; Traceability Standard</span>
              <span className="hidden sm:inline text-teal-400">•</span>
              <span className="hidden sm:inline text-slate-600 font-mono text-[11px]">ISO/IEC 16022 Certified</span>
            </div>

            {/* H1 Primary Statement */}
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                TRUST <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700">EVERY DOSE.</span>
              </h1>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                Verify your medicine before you trust it.
              </h2>
            </div>

            {/* Subtitle & Value Proposition */}
            <p className="max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed font-normal">
              Scan the barcode or 2D DataMatrix on any pharmaceutical box to verify serial identifiers against official registries (<strong className="text-teal-700 font-semibold">AMMPS Morocco</strong> &amp; <strong className="text-teal-700 font-semibold">BDPM France</strong>) and inspect physical packaging consistency with AI vision.
            </p>

            {/* Dual CTA Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/verify"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-teal-600/20 transition-all duration-300 hover:from-teal-500 hover:to-teal-600 hover:shadow-teal-600/35 hover:scale-[1.02] active:scale-[0.98] border border-teal-500/30"
              >
                <ScanLine className="h-5 w-5 animate-pulse text-white" />
                <span>Scan a Medicine</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-6 py-3.5 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all duration-200"
              >
                <span>How It Works</span>
              </a>
            </div>

            {/* Quick Demo Selector Strip */}
            <div className="pt-4 border-t border-slate-200/80">
              <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  Instant Prototype Sandbox:
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {PRESET_DEMOS.map((preset) => (
                  <Link
                    key={preset.id}
                    href={`/verify?simulate=${preset.targetStatus}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-mono text-slate-700 hover:border-teal-400 hover:bg-teal-50/50 shadow-sm transition-all"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        preset.targetStatus === 'consistent'
                          ? 'bg-emerald-500'
                          : preset.targetStatus === 'suspicious'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                    />
                    <span className="font-sans font-medium text-slate-900">{preset.name}</span>
                    <span className="text-[10px] text-slate-500">({preset.targetStatus})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <span>Deterministic Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-teal-600" />
                <span>Multi-Signal Bayesian Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-teal-600" />
                <span>Zero-Knowledge Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column: Three.js 3D Interactive Medicine Box with floating pills */}
          <div className="lg:col-span-5 flex justify-center">
            <MedicineBox3D />
          </div>
        </div>
      </div>
    </section>
  );
}
