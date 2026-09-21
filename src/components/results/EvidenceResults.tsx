'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ScanLine, 
  Download, 
  AlertOctagon, 
  Printer, 
  ShieldCheck, 
  FileText, 
  Copy, 
  Share2, 
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
  Building2,
  Calendar,
  KeyRound,
  Check
} from 'lucide-react';
import { runVerification, PRESET_DEMOS, MEDICINE_DATABASE } from '@/lib/mockData';
import { VerificationStatus, VerificationResult } from '@/lib/types';
import confetti from 'canvas-confetti';

export default function EvidenceResults() {
  const searchParams = useSearchParams();

  // Read query params if provided
  const queryPreset = searchParams.get('preset') || searchParams.get('status');
  const queryGtin = searchParams.get('gtin');
  const queryBatch = searchParams.get('batch');
  const querySerial = searchParams.get('serial');
  const queryExpiry = searchParams.get('expiry');

  // Find initial preset or run verification
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus>(() => {
    if (queryPreset === 'suspicious') return 'suspicious';
    if (queryPreset === 'expired') return 'expired';
    return 'consistent';
  });

  const [copiedHash, setCopiedHash] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Compute verification result
  const currentPreset = PRESET_DEMOS.find((p) => p.targetStatus === selectedStatus) || PRESET_DEMOS[0];
  
  const gtinToUse = queryGtin || currentPreset.gtin;
  const batchToUse = queryBatch || currentPreset.batch;
  const serialToUse = querySerial || currentPreset.serial;
  const expiryToUse = queryExpiry || currentPreset.expiry;

  const [result, setResult] = useState<VerificationResult>(() =>
    runVerification(gtinToUse, batchToUse, serialToUse, expiryToUse)
  );

  useEffect(() => {
    const newResult = runVerification(gtinToUse, batchToUse, serialToUse, expiryToUse);
    setResult(newResult);

    if (newResult.status === 'consistent') {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.2 },
          colors: ['#0D9488', '#14B8A6', '#10B981'],
        });
      } catch {
        // ignore in SSR
      }
    }
  }, [selectedStatus, queryGtin, queryBatch, querySerial, queryExpiry]);

  const handleSwitchPreset = (status: VerificationStatus) => {
    setSelectedStatus(status);
    const targetPreset = PRESET_DEMOS.find((p) => p.targetStatus === status) || PRESET_DEMOS[0];
    setResult(
      runVerification(
        targetPreset.gtin,
        targetPreset.batch,
        targetPreset.serial,
        targetPreset.expiry
      )
    );
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(result.telemetry.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // Status visual themes
  const statusTheme = {
    consistent: {
      bannerBg: 'from-emerald-950/90 via-[#0a231d] to-[#071714]',
      border: 'border-emerald-500/50',
      badgeBg: 'bg-emerald-500 text-slate-950 font-bold',
      icon: <CheckCircle2 className="h-6 w-6 text-emerald-400" />,
      title: 'CONSISTENT',
      subtext: 'All signals match reference records and manufacturer serialization registry.',
      pillColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60',
    },
    suspicious: {
      bannerBg: 'from-amber-950/90 via-[#261e09] to-[#171306]',
      border: 'border-amber-500/50',
      badgeBg: 'bg-amber-400 text-slate-950 font-bold',
      icon: <AlertTriangle className="h-6 w-6 text-amber-400" />,
      title: 'SUSPICIOUS',
      subtext: 'Serial number not found in registry. Potential counterfeit or unrecorded distribution.',
      pillColor: 'text-amber-400 border-amber-500/40 bg-amber-950/60',
    },
    expired: {
      bannerBg: 'from-red-950/90 via-[#290e0e] to-[#1a0808]',
      border: 'border-red-500/50',
      badgeBg: 'bg-red-500 text-white font-bold',
      icon: <XCircle className="h-6 w-6 text-red-400" />,
      title: 'EXPIRED',
      subtext: `Expiration date (${result.scannedExpiry}) has passed. Product is expired and must not be consumed.`,
      pillColor: 'text-red-400 border-red-500/40 bg-red-950/60',
    },
  }[result.status];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Prototype State Switcher Toolbar */}
      <div className="rounded-2xl border border-teal-500/30 bg-[#08182c]/90 p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-400" />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
            Simulate Verification State:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSwitchPreset('consistent')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium transition-all ${
              result.status === 'consistent'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30 scale-105'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            ✓ Verified (Azole)
          </button>

          <button
            onClick={() => handleSwitchPreset('suspicious')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium transition-all ${
              result.status === 'suspicious'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/30 scale-105'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            ⚠ Suspicious (Doliprane)
          </button>

          <button
            onClick={() => handleSwitchPreset('expired')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium transition-all ${
              result.status === 'expired'
                ? 'bg-red-500 text-white font-bold shadow-lg shadow-red-500/30 scale-105'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            ✕ Expired (Amoxicilline)
          </button>
        </div>
      </div>

      {/* Top Banner Status Header */}
      <div
        className={`rounded-3xl border ${statusTheme.border} bg-gradient-to-r ${statusTheme.bannerBg} p-6 sm:p-8 shadow-2xl relative overflow-hidden`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0">{statusTheme.icon}</div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-0.5 text-xs font-mono ${statusTheme.badgeBg}`}>
                  {statusTheme.title}
                </span>
                <span className="text-xs font-mono text-slate-300">
                  GTIN: <strong className="text-white">{result.scannedGtin}</strong>
                </span>
                <span className="text-xs font-mono text-slate-300">
                  BATCH: <strong className="text-white">{result.scannedBatch}</strong>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {result.product.name}
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {statusTheme.subtext}
              </p>
            </div>
          </div>

          {/* Overall Confidence Gauge */}
          <div className="flex flex-col items-end justify-center rounded-2xl bg-slate-950/60 p-4 border border-slate-800 sm:min-w-[170px] text-right">
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              Trust Score
            </span>
            <div className="font-mono text-3xl font-extrabold text-white">
              {result.confidenceScore}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  result.status === 'consistent'
                    ? 'bg-emerald-400'
                    : result.status === 'suspicious'
                    ? 'bg-amber-400'
                    : 'bg-red-400'
                }`}
                style={{ width: `${result.confidenceScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dual Column Grid: Left Product Dossier & Right Multi-Signal Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Product Dossier (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dossier Card */}
          <div className="rounded-3xl border border-teal-500/20 bg-[#09182d] p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Official Dossier (AMMPS / BDPM)
                </h3>
              </div>
              <span className="rounded bg-teal-950 px-2 py-0.5 text-[10px] font-mono text-teal-300 border border-teal-500/30">
                {result.product.registry}
              </span>
            </div>

            {/* Medicine Specifications List */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Active Ingredient (DCI):</span>
                <span className="font-semibold text-white text-right">{result.product.activeIngredient}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Dosage &amp; Form:</span>
                <span className="font-semibold text-white text-right">{result.product.dosage} • {result.product.form}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Marketing Authorization:</span>
                <span className="font-mono text-teal-300 font-semibold">{result.product.registrationNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Manufacturer:</span>
                <span className="text-slate-200 text-right">{result.product.manufacturer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Country of Jurisdiction:</span>
                <span className="text-slate-200">{result.product.country}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Packaging Format:</span>
                <span className="text-slate-200">{result.product.packaging}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Regulated Reference Price:</span>
                <span className="font-mono text-emerald-400 font-bold">{result.product.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">National Health Reimbursable:</span>
                <span className="text-slate-200">{result.product.isReimbursable ? 'Yes (AMO / Mutuelle)' : 'No'}</span>
              </div>
            </div>

            {/* GS1 HRI Barcode Preview Box */}
            <div className="rounded-2xl border border-teal-500/30 bg-[#061220] p-4 font-mono text-xs space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-sans font-semibold">
                Decoded GS1 Serialization HRI
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px]">(01) GTIN</span>
                  <span className="text-teal-300 font-bold">{result.scannedGtin}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(10) BATCH</span>
                  <span className="text-white font-bold">{result.scannedBatch}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(21) SERIAL</span>
                  <span className="text-white font-bold truncate block">{result.scannedSerial}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(17) EXPIRY</span>
                  <span className={result.status === 'expired' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {result.scannedExpiry}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Signal Audit Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Audit Checklist Card */}
          <div className="rounded-3xl border border-teal-500/20 bg-[#09182d] p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  Multi-Signal Audit Checklist
                </h3>
                <p className="text-xs text-slate-400">
                  Individual deterministic checks &amp; forensic computer vision evaluations
                </p>
              </div>
              <span className="text-xs font-mono text-teal-400">
                6 / 6 CHECKS RUN
              </span>
            </div>

            {/* Checklist Items */}
            <div className="space-y-4">
              {result.signals.map((sig) => (
                <div
                  key={sig.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    sig.status === 'passed'
                      ? 'border-emerald-500/30 bg-emerald-950/20'
                      : sig.status === 'warning'
                      ? 'border-amber-500/40 bg-amber-950/20'
                      : 'border-red-500/40 bg-red-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {sig.status === 'passed' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : sig.status === 'warning' ? (
                          <AlertTriangle className="h-5 w-5 text-amber-400" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {sig.title}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-400">
                            [{sig.code}]
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                          {sig.description}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] text-slate-400 flex-shrink-0">
                      {sig.latencyMs}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Packaging Forensics Panel */}
            <div className="rounded-2xl border border-teal-500/20 bg-[#061220] p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    AI Visual Packaging Inspection Findings
                  </span>
                </div>
                <span className="text-xs font-mono text-teal-300">
                  Model: ResNet-CV-v4
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Typography Kerning</span>
                  <span className="font-mono font-bold text-teal-300">{result.aiVisualInspection.microFontFidelity}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Blister Seal Foil</span>
                  <span className="font-mono font-bold text-emerald-400">{result.aiVisualInspection.tamperSealIntegrity}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Spectral CMYK</span>
                  <span className="font-mono font-bold text-teal-300">{result.aiVisualInspection.colorSpectrumMatch}%</span>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                {result.aiVisualInspection.findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-400 mt-0.5">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cryptographic Proof & Ledger Details */}
      <div className="rounded-3xl border border-slate-800 bg-[#081527]/90 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Cryptographic Audit Proof &amp; Node Manifest
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Timestamp: {result.telemetry.scannedAt}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px]">RAW GS1 COMPOSITE STRING:</span>
            <div className="text-teal-300 font-bold break-all">{result.telemetry.gs1RawString}</div>
          </div>

          <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 block text-[10px]">SHA-256 INTEGRITY SEAL:</span>
              <button
                onClick={handleCopyHash}
                className="text-[10px] text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                {copiedHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedHash ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-slate-300 break-all">{result.telemetry.sha256Hash}</div>
          </div>
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
          >
            <ScanLine className="h-4 w-4 text-teal-400" />
            <span>Scan Another Package</span>
          </Link>

          <button
            onClick={() => setShowCertificateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-teal-500/40 bg-teal-950/40 px-4 py-2.5 text-xs sm:text-sm font-semibold text-teal-300 hover:bg-teal-900/50 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Audit Certificate</span>
          </button>
        </div>

        <Link
          href={`/report?gtin=${result.scannedGtin}&name=${encodeURIComponent(result.product.name)}&batch=${result.scannedBatch}&serial=${result.scannedSerial}`}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-amber-900/30 hover:from-amber-500 hover:to-amber-600 transition-all"
        >
          <AlertOctagon className="h-4 w-4" />
          <span>Report Inconsistency / Flag Package</span>
        </Link>
      </div>

      {/* Regulatory Advice Disclaimer */}
      <p className="text-center text-[11px] text-slate-400 italic">
        <strong>Disclaimer:</strong> This tool assists pharmaceutical verification using public registry nodes and packaging AI. It does not substitute for clinical advice from a licensed pharmacist or physician.
      </p>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-teal-500/40 bg-[#0a1b31] p-6 sm:p-8 shadow-2xl text-slate-100 space-y-5">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <ShieldCheck className="h-8 w-8 text-teal-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Digital Verification Certificate</h3>
                <p className="text-xs font-mono text-teal-300">CERT-ID: MV-2026-{result.scannedGtin.slice(-6)}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">MEDICINE:</span>
                <span className="text-white font-bold">{result.product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">STATUS:</span>
                <span className={`font-bold ${result.status === 'consistent' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {result.statusLabel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">REGISTRY:</span>
                <span className="text-teal-300">{result.product.registry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">BATCH:</span>
                <span className="text-white">{result.scannedBatch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SERIAL:</span>
                <span className="text-white">{result.scannedSerial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NODE SEAL:</span>
                <span className="text-slate-400 text-[10px] truncate max-w-[200px]">{result.telemetry.sha256Hash}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
