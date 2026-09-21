'use client';

import React from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  XCircle, 
  Binary, 
  Scan, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck,
  Eye,
  Sliders
} from 'lucide-react';

export default function ProblemSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/30 px-3 py-1 text-xs font-semibold text-amber-300">
            <AlertOctagon className="h-3.5 w-3.5" />
            <span>The Counterfeit Vulnerability</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            A barcode alone <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-teal-300">isn't enough.</span>
          </h2>
          <p className="text-base text-slate-300 sm:text-lg leading-relaxed">
            Standard 1D barcodes can be photocopied or printed onto fake packaging in seconds. MediVerify employs a 4-layer defensive verification pipeline to guarantee pharmaceutical authenticity.
          </p>
        </div>

        {/* Bento Grid Feature Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Tile 1: Product Identification (7 cols) */}
          <div className="md:col-span-7 rounded-3xl border border-teal-500/20 bg-gradient-to-br from-[#0c1f38] via-[#09172c] to-[#071120] p-6 sm:p-8 relative overflow-hidden group hover:border-teal-500/40 transition-all">
            <div className="hud-corner-tl" />
            <div className="hud-corner-br" />
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-teal-400 font-bold uppercase tracking-wider">
                  LAYER 01 • DETERMINISTIC CATALOG
                </span>
                <h3 className="text-xl font-bold text-white">Product Identification</h3>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Every scanned GTIN is matched against official national pharmaceutical registries (AMMPS Morocco DMP and BDPM France ANSM). Confirms active ingredient dosage, legal status, and licensed manufacturer authorization.
            </p>

            {/* Interactive Preview Comparison Pill */}
            <div className="mt-6 rounded-2xl border border-slate-700/80 bg-slate-950/80 p-4 font-mono text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Legacy 1D EAN-13:</span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <XCircle className="h-3.5 w-3.5" /> Static code (Easily cloned)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">MediVerify GS1 DataMatrix:</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Unique cryptographic identity
                </span>
              </div>
            </div>
          </div>

          {/* Tile 2: Serialization Verification (5 cols) */}
          <div className="md:col-span-5 rounded-3xl border border-teal-500/20 bg-gradient-to-br from-[#0c1f38] via-[#09172c] to-[#071120] p-6 sm:p-8 relative overflow-hidden group hover:border-teal-500/40 transition-all">
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
                <Binary className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  LAYER 02 • GS1 AI (21)
                </span>
                <h3 className="text-xl font-bold text-white">Serialization Registry</h3>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Every unit carton possesses an individualized serial number. Our system verifies whether that exact serial was released in that specific lot, catching clone attacks instantly.
            </p>

            <div className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-3 text-xs font-mono text-cyan-200">
              <div className="flex justify-between">
                <span>SERIAL:</span>
                <span className="font-bold">SN9872134567</span>
              </div>
              <div className="flex justify-between text-emerald-400 mt-1">
                <span>STATUS:</span>
                <span>REGISTERED &amp; UNIQUE (1 of 1)</span>
              </div>
            </div>
          </div>

          {/* Tile 3: AI Physical Packaging Inspection (5 cols) */}
          <div className="md:col-span-5 rounded-3xl border border-teal-500/20 bg-gradient-to-br from-[#0c1f38] via-[#09172c] to-[#071120] p-6 sm:p-8 relative overflow-hidden group hover:border-teal-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-teal-400 font-bold uppercase tracking-wider">
                  LAYER 03 • COMPUTER VISION
                </span>
                <h3 className="text-xl font-bold text-white">AI Packaging Inspection</h3>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Even with authentic serials, illicit actors recycle packaging. MediVerify inspects font kerning, CMYK print density, hologram angles, and tamper-evident seals.
            </p>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-900/80 p-3 border border-slate-800 text-xs">
              <span className="text-slate-400">Micro-font Fidelity:</span>
              <span className="font-mono text-teal-300 font-bold">99.1% Conformance</span>
            </div>
          </div>

          {/* Tile 4: Anomaly Risk Scorecard & Audit (7 cols) */}
          <div className="md:col-span-7 rounded-3xl border border-teal-500/20 bg-gradient-to-br from-[#0c1f38] via-[#09172c] to-[#071120] p-6 sm:p-8 relative overflow-hidden group hover:border-teal-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  LAYER 04 • EVIDENCE FUSION
                </span>
                <h3 className="text-xl font-bold text-white">Transparent Risk Scorecard</h3>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Rather than an opaque yes/no answer, MediVerify outputs a transparent multi-signal audit dossier. Pharmacists and patients can inspect every verification step before dispensing.
            </p>

            {/* Scorecard Mini Grid */}
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-2 sm:p-3">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Catalogue</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">✓ MATCH</span>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-2 sm:p-3">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Serial Manifest</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400">✓ VALID</span>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-2 sm:p-3">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Risk Score</span>
                <span className="text-xs sm:text-sm font-bold text-teal-300 font-mono">0.02 / LOW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
