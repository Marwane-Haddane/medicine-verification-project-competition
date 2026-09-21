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
  Copy, 
  Cpu,
  Sparkles,
  Building2,
  KeyRound,
  Check,
  Upload,
  X
} from 'lucide-react';
import { runVerification, PRESET_DEMOS } from '@/lib/mockData';
import { VerificationStatus } from '@/lib/types';
import confetti from 'canvas-confetti';
import LatticeLoader from '@/components/reactbits/LatticeLoader/LatticeLoader';

export default function EvidenceResults() {
  const searchParams = useSearchParams();

  // Read query params if provided
  const queryStatusParam = (searchParams.get('status') || searchParams.get('preset') || '').toLowerCase();
  const queryGtin = searchParams.get('gtin');
  const queryBatch = searchParams.get('batch');
  const querySerial = searchParams.get('serial');
  const queryExpiry = searchParams.get('expiry');

  const initialPreset = queryStatusParam.includes('suspicious')
    ? PRESET_DEMOS[1]
    : queryStatusParam.includes('expired')
    ? PRESET_DEMOS[2]
    : PRESET_DEMOS[0];

  const [overrideParams, setOverrideParams] = useState<{
    gtin: string;
    batch: string;
    serial: string;
    expiry: string;
  } | null>(null);

  const effectiveGtin = overrideParams?.gtin || queryGtin || initialPreset.gtin;
  const effectiveBatch = overrideParams?.batch || queryBatch || initialPreset.batch;
  const effectiveSerial = overrideParams?.serial || querySerial || initialPreset.serial;
  const effectiveExpiry = overrideParams?.expiry || queryExpiry || initialPreset.expiry;

  const result = React.useMemo(() => {
    return runVerification(effectiveGtin, effectiveBatch, effectiveSerial, effectiveExpiry);
  }, [effectiveGtin, effectiveBatch, effectiveSerial, effectiveExpiry]);

  const [copiedHash, setCopiedHash] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Modal report state
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);
  const [reportFlags, setReportFlags] = useState<string[]>([
    'Serial missing or unrecorded in registry',
    'Packaging text mismatch',
  ]);
  const [reportPhotos, setReportPhotos] = useState<string[]>([]);
  const [reportCity, setReportCity] = useState('Casablanca');
  const [reportPharmacy, setReportPharmacy] = useState('Pharmacie Centrale Hassan II');

  useEffect(() => {
    if (result.status === 'consistent') {
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
  }, [result.status]);

  const [isReevaluating, setIsReevaluating] = useState(false);

  const handleSwitchPreset = (status: VerificationStatus) => {
    setIsReevaluating(true);
    const targetPreset = PRESET_DEMOS.find((p) => p.targetStatus === status) || PRESET_DEMOS[0];
    setTimeout(() => {
      setOverrideParams({
        gtin: targetPreset.gtin,
        batch: targetPreset.batch,
        serial: targetPreset.serial,
        expiry: targetPreset.expiry,
      });
      setIsReevaluating(false);
    }, 450);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(result.telemetry.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const toggleReportFlag = (flag: string) => {
    if (reportFlags.includes(flag)) {
      setReportFlags(reportFlags.filter((f) => f !== flag));
    } else {
      setReportFlags([...reportFlags, flag]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setReportPhotos((prev) => [...prev, event.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmitModalReport = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = `AMMPS-TICKET-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setReportSuccess(ticketId);
  };

  // Status visual themes for white UI
  const statusTheme = {
    consistent: {
      bannerBg: 'from-emerald-50 via-teal-50/50 to-white',
      border: 'border-emerald-300',
      badgeBg: 'bg-emerald-600 text-white font-bold',
      icon: <CheckCircle2 className="h-7 w-7 text-emerald-600" />,
      bannerHeadline: 'CONSISTENT - All signals match reference records',
      subtext: 'Product registration found in official pharmaceutical registry. Serial number cryptographically verified in manufacturer batch manifest.',
      pillColor: 'text-emerald-800 border-emerald-300 bg-emerald-50',
    },
    suspicious: {
      bannerBg: 'from-amber-50 via-yellow-50/50 to-white',
      border: 'border-amber-300',
      badgeBg: 'bg-amber-500 text-white font-bold',
      icon: <AlertTriangle className="h-7 w-7 text-amber-600" />,
      bannerHeadline: 'SUSPICIOUS - Serial number not found in registry',
      subtext: 'Product catalog exists, but serial number is unrecorded in manufacturer cryptographic registry. Potential counterfeit or clone attack.',
      pillColor: 'text-amber-800 border-amber-300 bg-amber-50',
    },
    expired: {
      bannerBg: 'from-red-50 via-rose-50/50 to-white',
      border: 'border-red-300',
      badgeBg: 'bg-red-600 text-white font-bold',
      icon: <XCircle className="h-7 w-7 text-red-600" />,
      bannerHeadline: `EXPIRED - Expiration date (${result.scannedExpiry}) has passed`,
      subtext: 'Batch record authenticated, but labeled expiration threshold has elapsed. National regulations prohibit dispensing expired pharmaceutical units.',
      pillColor: 'text-red-800 border-red-300 bg-red-50',
    },
  }[result.status];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Prototype State Switcher Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-600" />
          <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider font-mono">
            Simulate Verification State:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSwitchPreset('consistent')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer ${
              result.status === 'consistent'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/25 scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            ✓ Consistent (Azole)
          </button>

          <button
            onClick={() => handleSwitchPreset('suspicious')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer ${
              result.status === 'suspicious'
                ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/25 scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            ⚠ Suspicious (Doliprane)
          </button>

          <button
            onClick={() => handleSwitchPreset('expired')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer ${
              result.status === 'expired'
                ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/25 scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            ✕ Expired (Amoxicilline)
          </button>
        </div>
      </div>

      {/* Top Banner Status Header */}
      <div
        className={`rounded-3xl border ${statusTheme.border} bg-gradient-to-r ${statusTheme.bannerBg} p-6 sm:p-8 shadow-lg relative overflow-hidden`}
      >
        {/* Re-evaluating overlay with LatticeLoader when switching medicine */}
        {isReevaluating && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm p-6 text-center">
            <LatticeLoader
              status="working"
              label="Re-evaluating Medicine Signals"
              pattern="orbit"
              grid={3}
              shape="round"
              color="#0D9488"
              cellSize={8}
              gap={3}
              fontSize={15}
              step={80}
              showTimer
            />
            <span className="mt-3 font-mono text-xs text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
              Querying AMMPS &amp; serialization ledger...
            </span>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0">{statusTheme.icon}</div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-0.5 text-xs font-mono ${statusTheme.badgeBg}`}>
                  {result.statusLabel}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  GTIN: <strong className="text-slate-900">{result.scannedGtin}</strong>
                </span>
                <span className="text-xs font-mono text-slate-500">
                  BATCH: <strong className="text-slate-900">{result.scannedBatch}</strong>
                </span>
                <span className="text-xs font-mono text-slate-500">
                  REGISTRY: <strong className="text-teal-700">{result.product.registry}</strong>
                </span>
              </div>
              
              {/* Exact Banner Headline */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {statusTheme.bannerHeadline}
              </h1>

              <div className="text-base font-semibold text-slate-800">
                {result.product.name}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {statusTheme.subtext}
              </p>
            </div>
          </div>

          {/* Overall Confidence Gauge */}
          <div className="flex flex-col items-end justify-center rounded-2xl bg-white p-4 border border-slate-200 sm:min-w-[170px] text-right shadow-sm">
            <span className="text-[11px] font-mono text-slate-500 uppercase">
              Trust Score
            </span>
            <div className="font-mono text-3xl font-extrabold text-slate-900">
              {result.confidenceScore}%
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  result.status === 'consistent'
                    ? 'bg-emerald-500'
                    : result.status === 'suspicious'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
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
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Official Product Dossier
                </h3>
              </div>
              <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-mono text-teal-700 border border-teal-200 font-semibold">
                {result.product.registry} (Morocco / France)
              </span>
            </div>

            {/* Medicine Specifications List */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Medicine Name:</span>
                <span className="font-semibold text-slate-900 text-right">{result.product.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Active Ingredient (DCI):</span>
                <span className="font-semibold text-slate-900 text-right">{result.product.activeIngredient}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Dosage:</span>
                <span className="font-semibold text-teal-700 font-mono text-right">{result.product.dosage}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Pharmaceutical Form:</span>
                <span className="text-slate-800 text-right">{result.product.form}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Manufacturer:</span>
                <span className="text-slate-800 text-right">{result.product.manufacturer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Registration ID:</span>
                <span className="font-mono text-teal-700 font-semibold">{result.product.registrationNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Packaging Format:</span>
                <span className="text-slate-800">{result.product.packaging}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Regulated Reference Price:</span>
                <span className="font-mono text-emerald-600 font-bold">{result.product.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Health Reimbursable:</span>
                <span className="text-slate-800">{result.product.isReimbursable ? 'Yes (AMO / Mutuelle)' : 'No'}</span>
              </div>
            </div>

            {/* GS1 HRI Barcode Preview Box */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs space-y-2 shadow-inner">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-sans font-semibold">
                Decoded GS1 Serialization HRI
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px]">(01) GTIN</span>
                  <span className="text-teal-700 font-bold">{result.scannedGtin}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(10) BATCH</span>
                  <span className="text-slate-900 font-bold">{result.scannedBatch}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(21) SERIAL</span>
                  <span className="text-slate-900 font-bold truncate block">{result.scannedSerial}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">(17) EXPIRY</span>
                  <span className={result.status === 'expired' ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
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
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Multi-Signal Audit Checklist
                </h3>
                <p className="text-xs text-slate-500">
                  Deterministic registry checks &amp; forensic computer vision evaluations
                </p>
              </div>
              <span className="text-xs font-mono text-teal-700 font-semibold">
                {result.signals.length} / {result.signals.length} CHECKS RUN
              </span>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3.5">
              {result.signals.map((sig) => (
                <div
                  key={sig.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    sig.status === 'passed'
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : sig.status === 'warning'
                      ? 'border-amber-200 bg-amber-50/50'
                      : 'border-red-200 bg-red-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {sig.status === 'passed' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : sig.status === 'warning' ? (
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {sig.title}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-500">
                            [{sig.code}]
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
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
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-teal-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    AI Visual Packaging Inspection Findings
                  </span>
                </div>
                <span className="text-xs font-mono text-teal-700 font-medium">
                  Model: ResNet-CV-v4
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 block">Typography Kerning</span>
                  <span className="font-mono font-bold text-teal-700">{result.aiVisualInspection.microFontFidelity}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Blister Seal Foil</span>
                  <span className="font-mono font-bold text-emerald-600">{result.aiVisualInspection.tamperSealIntegrity}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Spectral CMYK</span>
                  <span className="font-mono font-bold text-teal-700">{result.aiVisualInspection.colorSpectrumMatch}%</span>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                {result.aiVisualInspection.findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-600 mt-0.5">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cryptographic Proof & Ledger Details */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Cryptographic Audit Proof &amp; Node Manifest
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Timestamp: {result.telemetry.scannedAt}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1">
            <span className="text-slate-500 block text-[10px]">RAW GS1 COMPOSITE STRING:</span>
            <div className="text-teal-700 font-bold break-all">{result.telemetry.gs1RawString}</div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 block text-[10px]">SHA-256 INTEGRITY SEAL:</span>
              <button
                onClick={handleCopyHash}
                className="text-[10px] text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer font-semibold"
              >
                {copiedHash ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedHash ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-slate-700 break-all">{result.telemetry.sha256Hash}</div>
          </div>
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all"
          >
            <ScanLine className="h-4 w-4 text-teal-600" />
            <span>Scan Another Package</span>
          </Link>

          <button
            onClick={() => setShowCertificateModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-teal-800 hover:bg-teal-100 shadow-sm transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Audit Certificate</span>
          </button>
        </div>

        {/* Primary Report CTA: Triggers Report Modal directly */}
        <button
          onClick={() => {
            setReportSuccess(null);
            setShowReportModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-amber-600/20 hover:from-amber-500 hover:to-amber-600 transition-all cursor-pointer"
        >
          <AlertOctagon className="h-4 w-4" />
          <span>Report Inconsistency</span>
        </button>
      </div>

      {/* Regulatory Advice Disclaimer */}
      <p className="text-center text-[11px] text-slate-500 italic">
        <strong>Disclaimer:</strong> This tool assists pharmaceutical verification using public registry nodes and packaging AI. It does not substitute for clinical advice from a licensed pharmacist or physician.
      </p>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900 space-y-5">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <ShieldCheck className="h-8 w-8 text-teal-600" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">Digital Verification Certificate</h3>
                <p className="text-xs font-mono text-teal-700">CERT-ID: MV-2026-{result.scannedGtin.slice(-6)}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">MEDICINE:</span>
                <span className="text-slate-900 font-bold">{result.product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">STATUS:</span>
                <span className={`font-bold ${result.status === 'consistent' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {result.statusLabel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">REGISTRY:</span>
                <span className="text-teal-700">{result.product.registry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">BATCH:</span>
                <span className="text-slate-900">{result.scannedBatch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SERIAL:</span>
                <span className="text-slate-900">{result.scannedSerial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NODE SEAL:</span>
                <span className="text-slate-600 text-[10px] truncate max-w-[200px]">{result.telemetry.sha256Hash}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anomaly Report Modal (Route 4 Dialog) */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-600 shadow-sm">
                <AlertOctagon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Report Inconsistency / Anomaly</h3>
                <p className="text-xs text-slate-500">
                  Pre-populated incident report for AMMPS / BDPM Pharmacovigilance Inspection.
                </p>
              </div>
            </div>

            {reportSuccess ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Report Successfully Logged</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Incident ticket <strong className="text-emerald-700 font-mono">{reportSuccess}</strong> has been transmitted to the national pharmacovigilance network.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-700 cursor-pointer"
                  >
                    Done
                  </button>
                  <Link
                    href="/report"
                    className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
                  >
                    Open Standalone Report Page
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitModalReport} className="space-y-5 text-xs">
                {/* Product & Batch & Expiry Info (Prefilled) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono shadow-inner">
                  <div>
                    <span className="text-slate-500 block text-[10px]">MEDICINE:</span>
                    <span className="text-slate-900 font-bold">{result.product.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">SCANNED GTIN:</span>
                    <span className="text-teal-700 font-bold">{result.scannedGtin}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">BATCH NUMBER:</span>
                    <span className="text-slate-900 font-bold">{result.scannedBatch}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">EXPIRY DATE:</span>
                    <span className="text-slate-900 font-bold">{result.scannedExpiry}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[10px]">SERIAL NUMBER:</span>
                    <span className="text-amber-700 font-bold">{result.scannedSerial}</span>
                  </div>
                </div>

                {/* Checkbox Group */}
                <div className="space-y-2">
                  <span className="font-semibold text-slate-700 block text-xs font-mono">
                    Observed Anomaly Checkboxes:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Barcode unreadable',
                      'Serial missing',
                      'Packaging text mismatch',
                      'Suspected tampering',
                    ].map((flag) => {
                      const checked = reportFlags.includes(flag);
                      return (
                        <label
                          key={flag}
                          onClick={() => toggleReportFlag(flag)}
                          className={`flex items-center gap-2.5 rounded-xl border p-2.5 cursor-pointer transition-all ${
                            checked
                              ? 'border-amber-400 bg-amber-50 text-amber-900 font-medium'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-xs font-medium">{flag}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Image Upload Zone */}
                <div className="space-y-2">
                  <span className="font-semibold text-slate-700 block text-xs font-mono">
                    Package Photos:
                  </span>
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      id="modal-photo-upload"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <label htmlFor="modal-photo-upload" className="cursor-pointer block space-y-1">
                      <Upload className="mx-auto h-5 w-5 text-teal-600" />
                      <span className="text-[11px] text-slate-600 block">Click to upload photos or drag & drop</span>
                    </label>
                    {reportPhotos.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 justify-center">
                        {reportPhotos.map((p, i) => (
                          <div key={i} className="h-14 w-14 rounded-lg overflow-hidden border border-teal-300 shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p} alt="evidence" className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 mb-1">City / Region</label>
                    <input
                      type="text"
                      value={reportCity}
                      onChange={(e) => setReportCity(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-600 mb-1">Pharmacy / Purchase Location</label>
                    <input
                      type="text"
                      value={reportPharmacy}
                      onChange={(e) => setReportPharmacy(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-amber-500 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <Link
                    href={`/report?gtin=${result.scannedGtin}&name=${encodeURIComponent(result.product.name)}&batch=${result.scannedBatch}&serial=${result.scannedSerial}&expiry=${result.scannedExpiry}`}
                    className="text-xs text-slate-500 hover:text-slate-900"
                  >
                    Open Standalone Page
                  </Link>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2 text-xs font-semibold text-white shadow-md hover:from-amber-500 hover:to-amber-600 cursor-pointer"
                    >
                      Submit Report
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
