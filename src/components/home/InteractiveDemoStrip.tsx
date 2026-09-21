'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRESET_DEMOS, runVerification } from '@/lib/mockData';
import { VerificationStatus } from '@/lib/types';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

export default function InteractiveDemoStrip() {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_DEMOS[0]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(() =>
    runVerification(
      PRESET_DEMOS[0].gtin,
      PRESET_DEMOS[0].batch,
      PRESET_DEMOS[0].serial,
      PRESET_DEMOS[0].expiry
    )
  );

  const handleSelectPreset = (preset: typeof PRESET_DEMOS[0]) => {
    setSelectedPreset(preset);
    setIsVerifying(true);
    setTimeout(() => {
      setVerificationResult(
        runVerification(preset.gtin, preset.batch, preset.serial, preset.expiry)
      );
      setIsVerifying(false);
    }, 350);
  };

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case 'consistent':
        return {
          badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40',
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
          title: 'CONSISTENT',
          border: 'border-emerald-500/30',
        };
      case 'suspicious':
        return {
          badge: 'bg-amber-950/80 text-amber-400 border-amber-500/40',
          icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
          title: 'SUSPICIOUS',
          border: 'border-amber-500/30',
        };
      case 'expired':
        return {
          badge: 'bg-red-950/80 text-red-400 border-red-500/40',
          icon: <XCircle className="h-4 w-4 text-red-400" />,
          title: 'EXPIRED',
          border: 'border-red-500/30',
        };
    }
  };

  const statusMeta = getStatusColor(verificationResult.status);

  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-b from-[#0e223d] to-[#071324] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-400" />
                <span className="font-mono text-xs font-semibold text-teal-400 uppercase tracking-wider">
                  Live Verification Simulator
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">
                Test Multi-Signal Verification in Real-Time
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Select a test package to see how MediVerify evaluates serialization, registry catalogs, and expiration.
              </p>
            </div>

            {/* Preset Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {PRESET_DEMOS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-500 text-white font-semibold shadow-md shadow-teal-500/30 scale-105'
                        : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/80'
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body: Live Evaluation Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
            {/* Left: Product & Barcode Data */}
            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 font-sans font-semibold text-xs">
                    Evaluated Identifiers
                  </span>
                  <span className="text-teal-400 text-[11px]">
                    REGISTRY: {verificationResult.product.registry}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">GTIN (AI 01):</span>
                    <span className="text-white font-bold">{selectedPreset.gtin}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">LOT/BATCH (AI 10):</span>
                    <span className="text-teal-300 font-bold">{selectedPreset.batch}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SERIAL (AI 21):</span>
                    <span className="text-white font-bold">{selectedPreset.serial}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">EXPIRY (AI 17):</span>
                    <span className="text-slate-200 font-bold">{selectedPreset.expiry}</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-300 font-sans">
                  <strong>Notes:</strong> {selectedPreset.notes}
                </div>
              </div>
            </div>

            {/* Right: Output Scorecard */}
            <div className="lg:col-span-6">
              <div
                className={`rounded-2xl border ${statusMeta.border} bg-[#0b1b31] p-6 shadow-xl relative transition-all ${
                  isVerifying ? 'opacity-50 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {statusMeta.icon}
                    <span className="font-bold text-lg text-white">
                      Status: {statusMeta.title}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-mono font-bold border ${statusMeta.badge}`}
                  >
                    {verificationResult.confidenceScore}% Confidence
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                  {verificationResult.statusMessage}
                </p>

                {/* Signals Mini Checklist */}
                <div className="mt-4 space-y-2 border-t border-slate-800 pt-3 text-xs">
                  {verificationResult.signals.slice(0, 3).map((sig) => (
                    <div key={sig.id} className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        {sig.status === 'passed' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : sig.status === 'warning' ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-400" />
                        )}
                        <span>{sig.title}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {sig.latencyMs}ms
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    Node: {verificationResult.telemetry.nodeRegistry}
                  </span>
                  <Link
                    href={`/result?preset=${selectedPreset.targetStatus}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-teal-200 transition-colors"
                  >
                    <span>Inspect Full Scorecard</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
