'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ScanLine, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileSearch, 
  Lock, 
  Layers,
  Sparkles
} from 'lucide-react';
import MedicineBox3D from './MedicineBox3D';
import { PRESET_DEMOS } from '@/lib/mockData';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Headlines & Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* GS1 Standard Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/50 px-3.5 py-1.5 text-xs text-teal-300 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="font-semibold tracking-wide">GS1 DataMatrix &amp; Traceability Standard</span>
              <span className="hidden sm:inline text-teal-400/60">•</span>
              <span className="hidden sm:inline text-slate-300 font-mono text-[11px]">ISO/IEC 16022 Certified</span>
            </div>

            {/* H1 Primary Statement */}
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                TRUST <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-cyan-300">EVERY DOSE.</span>
              </h1>
              <h2 className="text-2xl font-bold tracking-tight text-slate-200 sm:text-3xl">
                Verify your medicine before you trust it.
              </h2>
            </div>

            {/* Subtitle & Value Proposition */}
            <p className="max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed font-normal">
              Scan the barcode or 2D DataMatrix on any pharmaceutical box to verify serial identifiers against official registries (<strong className="text-teal-300 font-semibold">AMMPS Morocco</strong> &amp; <strong className="text-teal-300 font-semibold">BDPM France</strong>) and inspect physical packaging consistency with AI vision.
            </p>

            {/* Dual CTA Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/verify"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-teal-500/25 transition-all duration-300 hover:from-teal-400 hover:to-teal-500 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] border border-teal-300/30"
              >
                <ScanLine className="h-5 w-5 animate-pulse text-white" />
                <span>Scan a Medicine</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-6 py-3.5 text-base font-medium text-slate-200 hover:bg-slate-800/80 hover:text-white hover:border-slate-600 transition-all duration-200"
              >
                <span>How It Works</span>
              </a>
            </div>

            {/* Quick Demo Selector Strip */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                  Instant Prototype Sandbox:
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {PRESET_DEMOS.map((preset) => (
                  <Link
                    key={preset.id}
                    href={`/result?preset=${preset.targetStatus}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-[#0c1e36]/70 px-3 py-1.5 text-xs font-mono text-slate-300 hover:border-teal-500/50 hover:bg-[#0f2747] transition-all"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        preset.targetStatus === 'consistent'
                          ? 'bg-emerald-400'
                          : preset.targetStatus === 'suspicious'
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                      }`}
                    />
                    <span className="font-sans font-medium text-white">{preset.name}</span>
                    <span className="text-[10px] text-slate-400">({preset.targetStatus})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-400" />
                <span>Deterministic Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-teal-400" />
                <span>Multi-Signal Bayesian Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-teal-400" />
                <span>Zero-Knowledge Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Medicine Box with floating pills */}
          <div className="lg:col-span-5 flex justify-center">
            <MedicineBox3D />
          </div>
        </div>
      </div>
    </section>
  );
}
