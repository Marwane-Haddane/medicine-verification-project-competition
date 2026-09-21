'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRESET_DEMOS, runVerification } from '@/lib/mockData';
import { VerificationStatus } from '@/lib/types';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import LatticeLoader from '@/components/reactbits/LatticeLoader/LatticeLoader';

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
    }, 700);
  };

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case 'consistent':
        return {
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
          title: 'CONSISTENT',
          border: 'border-emerald-300 bg-emerald-50/40',
        };
      case 'suspicious':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
          title: 'SUSPICIOUS',
          border: 'border-amber-300 bg-amber-50/40',
        };
      case 'expired':
        return {
          badge: 'bg-red-50 text-red-800 border-red-300',
          icon: <XCircle className="h-4 w-4 text-red-600" />,
          title: 'EXPIRED',
          border: 'border-red-300 bg-red-50/40',
        };
    }
  };

  const statusMeta = getStatusColor(verificationResult.status);

  return (
    <section className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <span className="font-mono text-xs font-semibold text-teal-700 uppercase tracking-wider">
                  Live Verification Simulator
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                Test Multi-Signal Verification in Real-Time
              </h3>
              <p className="text-xs text-slate-500 mt-1">
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
                    className={`rounded-xl px-3.5 py-2 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-600 text-white font-semibold shadow-md shadow-teal-600/25 scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
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
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-700 font-sans font-semibold text-xs">
                    Evaluated Identifiers
                  </span>
                  <span className="text-teal-700 text-[11px] font-semibold">
                    REGISTRY: {verificationResult.product.registry}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">GTIN (AI 01):</span>
                    <span className="text-slate-900 font-bold">{selectedPreset.gtin}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">LOT/BATCH (AI 10):</span>
                    <span className="text-teal-700 font-bold">{selectedPreset.batch}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">SERIAL (AI 21):</span>
                    <span className="text-slate-900 font-bold">{selectedPreset.serial}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">EXPIRY (AI 17):</span>
                    <span className="text-slate-700 font-bold">{selectedPreset.expiry}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-600 font-sans">
                  <strong>Notes:</strong> {selectedPreset.notes}
                </div>
              </div>
            </div>

            {/* Right: Output Scorecard */}
            <div className="lg:col-span-6">
              <div
                className={`rounded-2xl border ${statusMeta.border} p-6 shadow-md relative transition-all`}
              >
                {/* Evaluating overlay with LatticeLoader */}
                {isVerifying && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
                    <LatticeLoader
                      status="working"
                      label="Evaluating Medicine Signals"
                      pattern="orbit"
                      grid={3}
                      shape="round"
                      color="#0D9488"
                      cellSize={7}
                      gap={2.5}
                      fontSize={14}
                      step={85}
                      showTimer
                    />
                    <span className="mt-2 text-[11px] font-mono text-teal-700 font-semibold">
                      Querying AMMPS &amp; serialization ledger...
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {statusMeta.icon}
                    <span className="font-bold text-lg text-slate-900">
                      Status: {statusMeta.title}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-mono font-bold border ${statusMeta.badge}`}
                  >
                    {verificationResult.confidenceScore}% Confidence
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {verificationResult.statusMessage}
                </p>

                {/* Signals Mini Checklist */}
                <div className="mt-4 space-y-2 border-t border-slate-200 pt-3 text-xs">
                  {verificationResult.signals.slice(0, 3).map((sig) => (
                    <div key={sig.id} className="flex items-center justify-between">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        {sig.status === 'passed' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : sig.status === 'warning' ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-600" />
                        )}
                        <span>{sig.title}</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {sig.latencyMs}ms
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-slate-500">
                    Node: {verificationResult.telemetry.nodeRegistry}
                  </span>
                  <Link
                    href={`/result?preset=${selectedPreset.targetStatus}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors"
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
