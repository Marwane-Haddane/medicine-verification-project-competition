import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Activity, ExternalLink, AlertTriangle, FileText, HeartPulse } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about" className="mt-24 border-t border-slate-800/80 bg-[#070e1b]/90 text-slate-400 backdrop-blur-xl relative z-10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: Brand & Integrity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Medi<span className="text-teal-400">Verify</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-signal pharmaceutical verification engine combining GS1 serialization, official AMMPS/BDPM registries, and computer-vision packaging forensics.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-teal-400/90 pt-1">
              <Lock className="h-3 w-3" />
              <span>Node: TLS 1.3 / SHA-256 Sealed</span>
            </div>
          </div>

          {/* Col 2: Navigation & Tools */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Core Platform
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/verify" className="hover:text-teal-300 transition-colors">
                  Live Barcode & Camera Scanner
                </Link>
              </li>
              <li>
                <Link href="/result?preset=consistent" className="hover:text-teal-300 transition-colors">
                  Evidence Audit Scorecard
                </Link>
              </li>
              <li>
                <Link href="/database" className="hover:text-teal-300 transition-colors">
                  AMMPS & BDPM Reference Catalog
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-400" />
                  Report Anomaly / Counterfeit
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Standards & Registries */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Registries & Protocols
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="flex items-center gap-1 text-slate-400 hover:text-slate-300">
                <span>AMMPS (DMP Maroc) v2.4</span>
                <span className="rounded bg-teal-950 px-1 py-0.5 text-[9px] font-mono text-teal-300 border border-teal-500/20">LIVE</span>
              </li>
              <li className="flex items-center gap-1 text-slate-400 hover:text-slate-300">
                <span>BDPM (ANSM France) API</span>
                <span className="rounded bg-teal-950 px-1 py-0.5 text-[9px] font-mono text-teal-300 border border-teal-500/20">SYNC</span>
              </li>
              <li className="text-slate-400">GS1 General Specifications (ISO/IEC 16022)</li>
              <li className="text-slate-400">Falsified Medicines Directive (EU 2011/62/EU)</li>
            </ul>
          </div>

          {/* Col 4: Telemetry & Disclaimer */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              System Telemetry
            </h3>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Network Node:</span>
                <span className="text-emerald-400">ONLINE (24ms)</span>
              </div>
              <div className="flex justify-between">
                <span>Ledger Integrity:</span>
                <span className="text-teal-300">VALIDATED</span>
              </div>
              <div className="flex justify-between">
                <span>Anti-Tamper AI:</span>
                <span className="text-teal-300">ACTIVE v4.2</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              For competition & demo verification. Consult authorized health professionals for medical diagnoses.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-teal-400" />
            <span>MediVerify - Digital Pharmaceutical Authentication Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>GS1 Compliance Spec</span>
            <span>•</span>
            <span>Regulatory Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
