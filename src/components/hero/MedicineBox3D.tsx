'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, ShieldCheck, QrCode, Sparkles, Cpu, Eye } from 'lucide-react';

export default function MedicineBox3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(-6);
  const [rotateY, setRotateY] = useState(12);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth tilt limit
    const rX = -(y / (rect.height / 2)) * 14;
    const rY = (x / (rect.width / 2)) * 16;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(-6);
    setRotateY(12);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center p-4 sm:p-8 perspective-1000 select-none"
    >
      {/* Background glow orb behind 3D box */}
      <div className="absolute h-72 w-72 rounded-full bg-gradient-to-tr from-teal-500/20 via-cyan-500/15 to-emerald-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Floating Pill 1: Top-Left (Product recognized) */}
      <div className="absolute -top-3 sm:top-2 -left-2 sm:-left-6 z-30 animate-float-1 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-emerald-500/40 px-3.5 py-2 text-xs font-medium text-slate-100 shadow-xl shadow-emerald-950/40 backdrop-blur-md">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-semibold text-emerald-400 text-[11px] leading-tight flex items-center gap-1">
              ✓ Product recognized
            </div>
            <div className="text-[10px] text-slate-400 font-mono">AMMPS Registry ID #920342</div>
          </div>
        </div>
      </div>

      {/* Floating Pill 2: Top-Right (Manufacturer matched) */}
      <div className="absolute -top-4 sm:top-4 -right-2 sm:-right-6 z-30 animate-float-2 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-teal-500/40 px-3.5 py-2 text-xs font-medium text-slate-100 shadow-xl shadow-teal-950/40 backdrop-blur-md">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-teal-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-semibold text-teal-300 text-[11px] leading-tight">
              ✓ Manufacturer matched
            </div>
            <div className="text-[10px] text-slate-400">Promopharm / Laprophan</div>
          </div>
        </div>
      </div>

      {/* Floating Pill 3: Bottom-Left (Batch recognized) */}
      <div className="absolute -bottom-3 sm:bottom-4 -left-3 sm:-left-8 z-30 animate-float-2 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-emerald-500/40 px-3.5 py-2 text-xs font-medium text-slate-100 shadow-xl shadow-emerald-950/40 backdrop-blur-md">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-semibold text-emerald-400 text-[11px] leading-tight">
              ✓ Batch recognized
            </div>
            <div className="text-[10px] text-slate-400 font-mono">LOT: B2024-X88 (Valid)</div>
          </div>
        </div>
      </div>

      {/* Floating Pill 4: Bottom-Right (Packaging anomaly detected - amber warning) */}
      <div className="absolute -bottom-5 sm:bottom-2 -right-3 sm:-right-8 z-30 animate-float-1 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-amber-500/40 px-3.5 py-2 text-xs font-medium text-slate-100 shadow-xl shadow-amber-950/40 backdrop-blur-md">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-semibold text-amber-400 text-[11px] leading-tight flex items-center gap-1">
              ⚠ Packaging anomaly probe
            </div>
            <div className="text-[10px] text-slate-400">Active CV Tamper Scan</div>
          </div>
        </div>
      </div>

      {/* 3D Medicine Box Container */}
      <div
        className="relative w-72 sm:w-80 rounded-2xl transition-transform duration-200 ease-out transform-style-3d cursor-pointer"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.03 : 1})`,
          boxShadow: '0 25px 60px -15px rgba(13, 148, 136, 0.35), 0 0 40px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* HUD Crosshairs on corners */}
        <div className="hud-corner-tl -top-2 -left-2" />
        <div className="hud-corner-tr -top-2 -right-2" />
        <div className="hud-corner-bl -bottom-2 -left-2" />
        <div className="hud-corner-br -bottom-2 -right-2" />

        {/* Medicine Box Outer Body */}
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/40 bg-gradient-to-b from-[#0e223d] via-[#0b1b31] to-[#071324] p-5 text-slate-100 backdrop-blur-xl">
          {/* Laser Scanning Beam Sweep */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf] animate-laser z-20 pointer-events-none" />

          {/* Top Brand Header */}
          <div className="flex items-start justify-between border-b border-slate-700/60 pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-300 font-semibold">
                  AMMPS RX AUTHENTICATED
                </span>
              </div>
              <h4 className="mt-1 text-xl font-bold tracking-tight text-white">
                AZOLE <span className="text-teal-400 font-mono">400 mg</span>
              </h4>
              <p className="text-[11px] text-slate-400 italic">Albendazole • Antihelminthique</p>
            </div>

            {/* Holographic Security Shield Badge */}
            <div className="relative flex flex-col items-center justify-center rounded-lg border border-teal-400/50 bg-gradient-to-tr from-teal-900/60 to-cyan-800/40 p-1.5 text-center shadow-inner">
              <ShieldCheck className="h-5 w-5 text-teal-300" />
              <span className="mt-0.5 text-[8px] font-mono font-bold text-teal-200 uppercase">
                SECURE
              </span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40 animate-pulse pointer-events-none" />
            </div>
          </div>

          {/* Center: Blister & Formula specs */}
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-900/60 p-3 border border-slate-800">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Dosage Form</span>
              <span className="text-xs font-semibold text-slate-200">1 Comprimé à croquer</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Laboratoire</span>
              <span className="text-xs font-semibold text-slate-200">Promopharm / Laprophan</span>
            </div>
          </div>

          {/* Realistic GS1 2D DataMatrix & Human Readable Section */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-teal-500/30 bg-[#081527] p-3">
            {/* GS1 DataMatrix 2D Barcode Visualization */}
            <div className="relative flex-shrink-0 rounded-lg bg-white p-2 text-slate-950 shadow-md">
              <div className="w-14 h-14 grid grid-cols-7 gap-0.5">
                {/* Simulated 2D DataMatrix matrix cells */}
                {[
                  1,1,1,1,1,1,1,
                  1,0,1,0,0,1,0,
                  1,0,1,1,0,0,1,
                  1,1,0,1,0,1,0,
                  1,0,0,0,1,1,1,
                  1,0,1,0,1,0,0,
                  1,1,1,1,1,1,1
                ].map((val, i) => (
                  <div 
                    key={i} 
                    className={`${val ? 'bg-slate-950' : 'bg-transparent'} rounded-[1px]`} 
                  />
                ))}
              </div>
              <span className="absolute -bottom-1 -right-1 rounded bg-teal-600 px-1 py-0.2 text-[7px] font-mono text-white font-bold">
                GS1
              </span>
            </div>

            {/* Human Readable Interpretation (HRI) */}
            <div className="flex-1 font-mono text-[10px] leading-relaxed text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">(01) GTIN:</span>
                <span className="text-teal-300 font-bold">06111234567890</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">(17) EXP:</span>
                <span className="text-emerald-400">11/2027</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">(10) LOT:</span>
                <span className="text-slate-200">B2024-X88</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">(21) SN:</span>
                <span className="text-teal-300">SN9872134567</span>
              </div>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="mt-4 flex items-center justify-between pt-2 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <Cpu className="h-3 w-3" /> AMMPS Node Validated
            </span>
            <span className="text-slate-500">AMM 920 342 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
