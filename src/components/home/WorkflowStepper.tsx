'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Search, 
  CheckCircle, 
  Cpu, 
  FileCheck2, 
  ArrowRight, 
  QrCode, 
  ShieldCheck, 
  Zap,
  Activity
} from 'lucide-react';

interface Step {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  technicalDetails: { label: string; value: string }[];
}

export default function WorkflowStepper() {
  const [activeStep, setActiveStep] = useState(0);

  const steps: Step[] = [
    {
      number: 1,
      title: 'Scan',
      subtitle: 'Camera / Sensor Capture',
      description: 'Point your smartphone or pharmacy barcode scanner at the 2D DataMatrix or 1D barcode on the medicine box. Decodes GS1 formatted AI elements in <200ms.',
      badge: 'Capture < 200ms',
      icon: <Camera className="h-5 w-5 text-teal-400" />,
      technicalDetails: [
        { label: 'Input Formats', value: 'GS1 DataMatrix (ECC 200), EAN-13, QR' },
        { label: 'Preprocessing', value: 'Binarization & Perspective Deskewing' },
        { label: 'Hardware', value: 'Any standard WebRTC camera or industrial imager' },
      ],
    },
    {
      number: 2,
      title: 'Identify',
      subtitle: 'Catalogue Resolution',
      description: 'The extracted Global Trade Item Number (GTIN) is matched against the authoritative AMMPS (Morocco) and BDPM (France) drug registration master databases.',
      badge: 'Master DB Query',
      icon: <Search className="h-5 w-5 text-cyan-400" />,
      technicalDetails: [
        { label: 'Registry Match', value: 'AMMPS / DMP Maroc & BDPM / ANSM France' },
        { label: 'Verified Metadata', value: 'INN, Dosage, Form, Lab, AMM Authorization' },
        { label: 'Latency', value: '38ms distributed edge latency' },
      ],
    },
    {
      number: 3,
      title: 'Verify',
      subtitle: 'Serialization & Expiry',
      description: 'Batch number and unique serial number are evaluated against cryptographic manufacturer batch manifests to ensure the unit is legitimate, active, and unexpired.',
      badge: 'GS1 AI (21) + (17)',
      icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
      technicalDetails: [
        { label: 'Batch Checksum', value: 'GS1 AI (10) validation against production run' },
        { label: 'Serial Uniqueness', value: 'Checked against 1-of-1 serialization ledger' },
        { label: 'Temporal Expiry', value: 'Mathematical date threshold evaluation' },
      ],
    },
    {
      number: 4,
      title: 'Analyze',
      subtitle: 'AI Packaging Inspection',
      description: 'Computer vision neural model performs forensic comparison of packaging typography, colorimetry, braille imprint texture, and security hologram diffraction.',
      badge: 'Neural Sub-pixel CV',
      icon: <Cpu className="h-5 w-5 text-teal-300" />,
      technicalDetails: [
        { label: 'Micro-font Check', value: 'Helvetica Neue LT Pro vector baseline diff' },
        { label: 'Tamper Detection', value: 'Cardboard fiber & blister foil integrity' },
        { label: 'Color Gamut', value: 'Spectral CMYK density validation' },
      ],
    },
    {
      number: 5,
      title: 'Report',
      subtitle: 'Evidence Scorecard',
      description: 'Instant multi-signal audit dossier generated: Consistent (Safe to dispense), Suspicious (Flagged for quarantine), or Expired (Prohibited from dispensing).',
      badge: 'Audit Certificate',
      icon: <FileCheck2 className="h-5 w-5 text-emerald-300" />,
      technicalDetails: [
        { label: 'Output Statuses', value: 'Consistent (Green) | Suspicious (Amber) | Expired (Red)' },
        { label: 'Provenance', value: 'SHA-256 integrity hash + AMMPS node signature' },
        { label: 'Regulatory Action', value: '1-click pharmacovigilance incident report' },
      ],
    },
  ];

  const current = steps[activeStep];

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 border-t border-slate-800/80 bg-[#061120]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-3.5 py-1 text-xs font-semibold text-teal-300">
            <Activity className="h-3.5 w-3.5" />
            <span>Architecture &amp; Protocol</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            5-Step Verification Workflow
          </h2>
          <p className="text-base text-slate-300 sm:text-lg">
            From optical scan to cryptographic audit: how MediVerify protects patients and pharmacists against counterfeit medications.
          </p>
        </div>

        {/* Step Buttons Row */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`relative rounded-2xl p-4 text-left transition-all duration-300 border ${
                  isSelected
                    ? 'border-teal-400 bg-gradient-to-b from-[#0f2c4e] to-[#0a1c33] shadow-lg shadow-teal-950/50 scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold font-mono ${
                      isSelected
                        ? 'bg-teal-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    0{step.number}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Step {step.number}</span>
                </div>
                <div className="mt-3 font-semibold text-sm text-white">
                  {step.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {step.subtitle}
                </div>
                {isSelected && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-teal-400 shadow-[0_0_10px_#2dd4bf]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Card */}
        <div className="mt-8 rounded-3xl border border-teal-500/30 bg-gradient-to-br from-[#0c203b] via-[#09182d] to-[#071222] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
            {/* Left: Step Description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 border border-teal-500/40">
                  {current.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-400 uppercase tracking-widest">
                      STEP 0{current.number}
                    </span>
                    <span className="rounded bg-teal-950 px-2 py-0.5 text-[10px] font-mono text-teal-300 border border-teal-500/30">
                      {current.badge}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-0.5">
                    {current.title}: {current.subtitle}
                  </h3>
                </div>
              </div>

              <p className="text-base text-slate-300 leading-relaxed">
                {current.description}
              </p>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-all"
                >
                  <span>Launch Scanner</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {activeStep < steps.length - 1 ? (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="text-xs font-semibold text-teal-300 hover:text-teal-200 transition-colors flex items-center gap-1"
                  >
                    <span>Next: Step {activeStep + 2}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <Link
                    href="/result?preset=consistent"
                    className="text-xs font-semibold text-teal-300 hover:text-teal-200 transition-colors flex items-center gap-1"
                  >
                    <span>Inspect Sample Scorecard</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Technical Specifications Box */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-700/80 bg-slate-950/80 p-5 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 text-[11px] font-sans font-semibold uppercase">
                  Technical Parameters
                </span>
                <span className="text-[10px] text-teal-400">STATUS: ACTIVE</span>
              </div>
              {current.technicalDetails.map((td, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="text-[11px] text-slate-400">{td.label}:</div>
                  <div className="text-slate-200 font-medium text-xs break-words">{td.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
