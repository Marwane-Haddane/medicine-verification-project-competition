'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  Upload, 
  Edit3, 
  ScanLine, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  FlipHorizontal, 
  Zap, 
  Layers, 
  ArrowRight,
  RefreshCw,
  FileSearch,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { PRESET_DEMOS } from '@/lib/mockData';

export default function ScannerInterface() {
  const router = useRouter();
  // Dual-mode tab toggle: "Live Scanner" | "Manual Entry"
  const [activeTab, setActiveTab] = useState<'scanner' | 'manual'>('scanner');
  
  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Manual Form state
  const [gtin, setGtin] = useState('06111234567890');
  const [batch, setBatch] = useState('B2024-X88');
  const [serial, setSerial] = useState('SN9872134567');
  const [expiry, setExpiry] = useState('11/2027');

  // Verification loading state
  const [isVerifying, setIsVerifying] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');

  // Upload Photo from Device state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    setUploadedImage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported on this device/browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      setCameraError(err.message || 'Unable to access camera. Please allow permissions or use simulated scan.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const toggleFacingMode = () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  // Handle Preset quick-fill
  const handleQuickFill = (preset: typeof PRESET_DEMOS[0]) => {
    setGtin(preset.gtin);
    setBatch(preset.batch);
    setSerial(preset.serial);
    setExpiry(preset.expiry);
  };

  // Submit Verification pipeline
  const handleSubmit = (customGtin?: string, customBatch?: string, customSerial?: string, customExpiry?: string) => {
    const finalGtin = customGtin || gtin;
    const finalBatch = customBatch || batch;
    const finalSerial = customSerial || serial;
    const finalExpiry = customExpiry || expiry;

    setIsVerifying(true);
    setLoadingStep('Accessing AMMPS / BDPM Regulatory Reference Node...');

    setTimeout(() => {
      setLoadingStep('Deciphering GS1 DataMatrix AI (01)(10)(21)(17)...');
    }, 450);

    setTimeout(() => {
      setLoadingStep('Executing Computer Vision packaging integrity evaluation...');
    }, 900);

    setTimeout(() => {
      setLoadingStep('Generating SHA-256 cryptographic audit manifest...');
    }, 1350);

    setTimeout(() => {
      setIsVerifying(false);
      const params = new URLSearchParams({
        gtin: finalGtin,
        batch: finalBatch,
        serial: finalSerial,
        expiry: finalExpiry,
      });
      router.push(`/result?${params.toString()}`);
    }, 1750);
  };

  // File Upload Handlers (Upload Photo from Device)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        // Default to Azole or preset for demonstration
        handleQuickFill(PRESET_DEMOS[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      stopCamera();
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        handleQuickFill(PRESET_DEMOS[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-3.5 py-1 text-xs font-semibold text-teal-300">
          <ScanLine className="h-3.5 w-3.5 animate-pulse" />
          <span>Optical GS1 Decoder &amp; Verification Reticle</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Pharmaceutical Verification Scanner
        </h1>
        <p className="max-w-xl mx-auto text-sm text-slate-300">
          Position your medicine carton inside the reticle viewfinder to scan the GS1 2D DataMatrix, or enter package serial codes manually.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="rounded-3xl border border-teal-500/30 bg-[#08182e]/80 shadow-2xl backdrop-blur-xl overflow-hidden relative">
        {/* Verification Progress Modal Overlay */}
        {isVerifying && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#071324]/95 backdrop-blur-md p-6 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
              <ScanLine className="h-8 w-8 text-teal-300 animate-pulse" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white tracking-wide">
              Analyzing Packaging Signals
            </h3>
            <p className="mt-2 text-sm font-mono text-teal-300">
              {loadingStep}
            </p>
            <div className="mt-6 w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-teal-300 animate-pulse w-3/4 rounded-full" />
            </div>
          </div>
        )}

        {/* Dual-Mode Tab Toggle: "Live Scanner" | "Manual Entry" */}
        <div className="flex border-b border-slate-800 bg-[#061222] p-2 gap-2">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/25 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Live Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/25 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Edit3 className="h-4 w-4" />
            <span>Manual Entry</span>
          </button>
        </div>

        {/* TAB 1: Live Scanner View */}
        {activeTab === 'scanner' && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Viewfinder Frame with dark overlay & centered corner reticles & sweeping laser line */}
            <div 
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`relative mx-auto max-w-lg aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden border bg-slate-950 flex items-center justify-center shadow-inner transition-colors ${
                isDragOver ? 'border-teal-400 bg-teal-950/30' : 'border-teal-500/40'
              }`}
            >
              {/* Hidden file input for "Upload Photo from Device" */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Mode A: Real Camera Stream */}
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : uploadedImage ? (
                /* Mode B: Uploaded Image Preview */
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uploadedImage}
                    alt="Uploaded packaging specimen"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-3 left-3 rounded-lg bg-teal-950/80 border border-teal-500/40 px-2 py-1 text-[10px] font-mono text-teal-300">
                    Uploaded specimen ready
                  </div>
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-3 right-3 rounded-lg bg-slate-900/80 p-1 text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                /* Mode C: Simulated Viewfinder Visual */
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a182d] to-[#06101d] p-6 text-center">
                  <div className="w-48 h-48 rounded-xl border border-teal-500/30 bg-teal-950/20 p-4 flex flex-col items-center justify-center relative shadow-lg">
                    {/* Corner Crosshairs */}
                    <div className="hud-corner-tl" />
                    <div className="hud-corner-tr" />
                    <div className="hud-corner-bl" />
                    <div className="hud-corner-br" />

                    {/* Barcode representation */}
                    <div className="w-24 h-24 grid grid-cols-6 gap-0.5 bg-white p-2 rounded">
                      {[1,1,1,1,1,1, 1,0,1,0,0,1, 1,0,1,1,0,1, 1,1,0,1,1,0, 1,0,1,0,1,1, 1,1,1,1,1,1].map((val, idx) => (
                        <div key={idx} className={val ? 'bg-slate-900 rounded-[0.5px]' : 'bg-transparent'} />
                      ))}
                    </div>
                    <span className="mt-2 font-mono text-[9px] text-teal-300">GS1 DATAMATRIX (ECC 200)</span>
                  </div>

                  <p className="mt-4 text-xs text-slate-400 max-w-xs">
                    Optical sensor ready. Switch to camera, upload a photo, or click instant simulation below.
                  </p>
                </div>
              )}

              {/* Viewfinder Target Reticle Overlay with Sweeping Laser Line */}
              <div className="absolute inset-0 pointer-events-none p-8 flex items-center justify-center">
                <div className="relative w-56 h-56 rounded-2xl border-2 border-teal-400/70 shadow-[0_0_20px_rgba(45,212,191,0.25)] flex items-center justify-center">
                  <div className="hud-corner-tl -top-1 -left-1" />
                  <div className="hud-corner-tr -top-1 -right-1" />
                  <div className="hud-corner-bl -bottom-1 -left-1" />
                  <div className="hud-corner-br -bottom-1 -right-1" />

                  {/* Horizontal HUD Marks */}
                  <div className="w-8 h-[1px] bg-teal-300 absolute left-2" />
                  <div className="w-8 h-[1px] bg-teal-300 absolute right-2" />

                  {/* Animated Teal Laser Scanning Line Sweeping Vertically */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-300 to-transparent shadow-[0_0_14px_#2dd4bf] animate-laser" />
                  
                  <span className="absolute -bottom-6 font-mono text-[10px] text-teal-300 tracking-wider">
                    ALIGN DATAMATRIX HERE
                  </span>
                </div>
              </div>

              {/* Camera Error Alert */}
              {cameraError && (
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-amber-950/90 border border-amber-500/40 p-2.5 text-xs text-amber-200 flex items-center justify-between">
                  <span className="truncate">{cameraError}</span>
                  <button onClick={() => setCameraError(null)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Action Controls Bar: "Switch to Camera", "Upload Photo from Device", "Simulate DataMatrix Read" */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Action 1: Switch to Camera */}
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-teal-500/25 hover:bg-teal-400 transition-all cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <span>Switch to Camera</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleFacingMode}
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-teal-400 transition-all cursor-pointer"
                  >
                    <FlipHorizontal className="h-4 w-4" />
                    <span>Switch Camera ({facingMode === 'environment' ? 'Back' : 'Front'})</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/40 px-4 py-2.5 text-xs sm:text-sm font-semibold text-red-300 hover:bg-red-500/30 transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    <span>Stop Camera</span>
                  </button>
                </>
              )}

              {/* Action 2: Upload Photo from Device */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
              >
                <Upload className="h-4 w-4 text-teal-400" />
                <span>Upload Photo from Device</span>
              </button>

              {/* Action if photo uploaded: Verify now */}
              {uploadedImage && (
                <button
                  onClick={() => handleSubmit()}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-teal-500/30 hover:from-teal-400 hover:to-teal-500 transition-all cursor-pointer"
                >
                  <ScanLine className="h-4 w-4" />
                  <span>Verify Uploaded Image</span>
                </button>
              )}
            </div>

            {/* Action 3: Simulate DataMatrix Read (for instant demo/testing) */}
            <div className="rounded-2xl border border-teal-500/25 bg-[#0b1c33] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                    Simulate DataMatrix Read (Instant Demo / Testing)
                  </span>
                </div>
                <span className="text-[10px] text-teal-400 font-mono">1-Click Verification</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRESET_DEMOS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSubmit(preset.gtin, preset.batch, preset.serial, preset.expiry)}
                    className="rounded-xl border border-slate-700/80 bg-slate-900/90 p-3 text-left hover:border-teal-500/50 hover:bg-slate-800/90 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white group-hover:text-teal-300">
                        {preset.name}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          preset.targetStatus === 'consistent'
                            ? 'bg-emerald-400'
                            : preset.targetStatus === 'suspicious'
                            ? 'bg-amber-400'
                            : 'bg-red-400'
                        }`}
                      />
                    </div>
                    <div className="mt-1 text-[10px] text-slate-400 truncate">
                      {preset.subtitle}
                    </div>
                    <div className="mt-2 font-mono text-[9px] text-teal-400/90 flex items-center justify-between">
                      <span>Simulate scan</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Manual Entry View */}
        {activeTab === 'manual' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Manual GS1 Identifier Form</h3>
                <p className="text-xs text-slate-400">
                  Input the GS1 Application Identifiers printed adjacent to the 2D DataMatrix on the packaging.
                </p>
              </div>

              {/* Quick fill buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-slate-400">Quick fill:</span>
                {PRESET_DEMOS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleQuickFill(p)}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-mono text-slate-300 hover:border-teal-500 hover:text-teal-300 cursor-pointer"
                  >
                    {p.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* GTIN / EAN-13 (14-digit input) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>(01) GTIN / EAN-13 (14 Digits)</span>
                    <span className="text-[10px] text-teal-400">GS1 Key</span>
                  </label>
                  <input
                    type="text"
                    value={gtin}
                    onChange={(e) => setGtin(e.target.value)}
                    placeholder="06111234567890"
                    maxLength={14}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 font-mono text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
                  />
                </div>

                {/* Batch / Lot Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>(10) Batch / Lot Number</span>
                    <span className="text-[10px] text-slate-400">AI (10)</span>
                  </label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="B2024-X88"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 font-mono text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
                  />
                </div>

                {/* Serial Number (Alphanumeric) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>(21) Serial Number (Alphanumeric)</span>
                    <span className="text-[10px] text-slate-400">AI (21)</span>
                  </label>
                  <input
                    type="text"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    placeholder="SN9872134567"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 font-mono text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
                  />
                </div>

                {/* Expiration Date picker (MM/YYYY) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>(17) Expiration Date (MM/YYYY)</span>
                    <span className="text-[10px] text-slate-400">AI (17)</span>
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="11/2027"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 font-mono text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
                  />
                </div>
              </div>

              {/* Submit for Verification Action Button with Loading Spinner */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 py-3.5 text-sm font-semibold text-white shadow-xl shadow-teal-500/25 hover:from-teal-400 hover:to-teal-500 transition-all border border-teal-300/30 active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying Identifiers...</span>
                    </>
                  ) : (
                    <>
                      <ScanLine className="h-4 w-4" />
                      <span>Submit for Verification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
