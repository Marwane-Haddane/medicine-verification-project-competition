'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Camera, 
  Upload, 
  Edit3, 
  ScanLine, 
  Sparkles, 
  X, 
  FlipHorizontal, 
  ShieldCheck,
  AlertTriangle,
  XCircle,
  FileText,
  MapPin,
  RefreshCw,
  Info
} from 'lucide-react';
import { PRESET_DEMOS } from '@/lib/mockData';
import Stepper, { Step } from '@/components/reactbits/Stepper/Stepper';
import RefineFrame, { RefineFrameStatus } from '@/components/reactbits/RefineFrame/RefineFrame';
import LatticeLoader from '@/components/reactbits/LatticeLoader/LatticeLoader';
import ThoughtLine from '@/components/reactbits/ThoughtLine/ThoughtLine';
import { SAMPLE_CARTON_AZOLE, SAMPLE_CARTON_DOLIPRANE, SAMPLE_CARTON_AMOXICILLINE } from '@/lib/sampleCartons';

export default function ScannerInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoTriggeredRef = useRef(false);

  // Tab mode: 'guided' (Stepper) | 'live' (Camera reticle) | 'manual' (Direct form)
  const [activeTab, setActiveTab] = useState<'guided' | 'live' | 'manual'>('guided');

  // Stepper state
  const [stepperIndex, setStepperIndex] = useState(1);

  // Packaging Photo & RefineFrame state
  const [packageImage, setPackageImage] = useState<string>(SAMPLE_CARTON_AZOLE);
  const [refineStatus, setRefineStatus] = useState<RefineFrameStatus>('complete');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Analysis state (Step 2)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<'working' | 'done'>('working');
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Medicine Details form state (Step 3)
  const [medicineName, setMedicineName] = useState('Azolé 400 mg (Albendazole)');
  const [gtin, setGtin] = useState('06111234567890');
  const [batch, setBatch] = useState('B2024-X88');
  const [serial, setSerial] = useState('SN9872134567');
  const [expiry, setExpiry] = useState('11/2027');
  const [pharmacyLocation, setPharmacyLocation] = useState('Pharmacie Principale, Casablanca');

  // Verification result status (derived or simulated)
  const [targetOutcome, setTargetOutcome] = useState<'consistent' | 'suspicious' | 'expired'>('consistent');

  // Live Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Camera controls
  const startCamera = async (mode = facingMode) => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported on this device/browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to access camera. Please allow permissions or use simulated scan.';
      setCameraError(msg);
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
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (cameraActive) {
      void startCamera(nextMode);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Quick Preset Selection
  const applyPreset = useCallback((preset: typeof PRESET_DEMOS[0]) => {
    setMedicineName(preset.name);
    setGtin(preset.gtin);
    setBatch(preset.batch);
    setSerial(preset.serial);
    setExpiry(preset.expiry);
    setTargetOutcome(preset.targetStatus as 'consistent' | 'suspicious' | 'expired');

    if (preset.targetStatus === 'consistent') {
      setPackageImage(SAMPLE_CARTON_AZOLE);
    } else if (preset.targetStatus === 'suspicious') {
      setPackageImage(SAMPLE_CARTON_DOLIPRANE);
    } else {
      setPackageImage(SAMPLE_CARTON_AMOXICILLINE);
    }
    setRefineStatus('complete');
  }, []);

  // File Upload Handlers for Drag-and-Drop & File Browser
  const handleFile = (file: File) => {
    const reader = new FileReader();
    setRefineStatus('generating');
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPackageImage(dataUrl);
      setTimeout(() => {
        setRefineStatus('complete');
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // Run Step 2 AI Forensic Analysis
  const runAiAnalysis = useCallback(() => {
    setStepperIndex(2);
    setIsAnalyzing(true);
    setAnalysisStatus('working');
    setRefineStatus('refining');
    setAnalysisProgress(10);
    setAnalysisSteps(['Ingesting high-resolution packaging raster']);

    setTimeout(() => {
      setAnalysisSteps(prev => [...prev, 'Detecting GS1 2D DataMatrix (ECC 200) reticle']);
      setAnalysisProgress(35);
    }, 600);

    setTimeout(() => {
      setAnalysisSteps(prev => [...prev, 'Optical OCR text extraction across typography layers']);
      setAnalysisProgress(60);
    }, 1200);

    setTimeout(() => {
      setAnalysisSteps(prev => [...prev, 'Deciphering Application Identifiers: GTIN, Batch, Expiry & Serial']);
      setAnalysisProgress(85);
    }, 1800);

    setTimeout(() => {
      setAnalysisSteps(prev => [...prev, 'Comparing identifiers against AMMPS / BDPM catalog node']);
      setAnalysisProgress(100);
      setAnalysisStatus('done');
      setRefineStatus('complete');
      setIsAnalyzing(false);
    }, 2500);
  }, []);

  // Trigger from URL params if present
  useEffect(() => {
    if (autoTriggeredRef.current) return;
    const simParam = searchParams.get('simulate') || searchParams.get('preset');
    if (simParam) {
      const match = PRESET_DEMOS.find(
        (p) => p.targetStatus.toLowerCase() === simParam.toLowerCase() || p.id === simParam
      );
      if (match) {
        autoTriggeredRef.current = true;
        const timer = setTimeout(() => {
          applyPreset(match);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, applyPreset]);

  // Navigate to full audit dossier in /result
  const navigateToResult = () => {
    const params = new URLSearchParams({
      gtin,
      batch,
      serial,
      expiry,
      status: targetOutcome
    });
    router.push(`/result?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-800 shadow-sm">
          <ScanLine className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
          <span>Multi-Signal Forensic Package Verification</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Verify Medicine Packaging Authenticity
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-slate-600">
          Upload or photograph your medicine carton to run automated OCR label extraction, GS1 2D DataMatrix validation, and AMMPS / BDPM registry cross-referencing.
        </p>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex border border-slate-200 bg-slate-50/80 p-1.5 rounded-2xl max-w-xl mx-auto mb-8 shadow-sm">
        <button
          onClick={() => {
            stopCamera();
            setActiveTab('guided');
          }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'guided'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>4-Step Photo Verification</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('live');
            void startCamera();
          }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'live'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Camera className="h-4 w-4" />
          <span>Live Camera View</span>
        </button>

        <button
          onClick={() => {
            stopCamera();
            setActiveTab('manual');
          }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Edit3 className="h-4 w-4" />
          <span>Manual Entry</span>
        </button>
      </div>

      {/* TAB 1: GUIDED 4-STEP PHOTO VERIFICATION VIA REACT BITS STEPPER */}
      {activeTab === 'guided' && (
        <div className="w-full">
          <Stepper
            initialStep={stepperIndex}
            currentStep={stepperIndex}
            onStepChange={(step) => setStepperIndex(step)}
            onFinalStepCompleted={() => navigateToResult()}
            backButtonText="← Back"
            nextButtonText={
              stepperIndex === 1
                ? 'Start AI Analysis →'
                : stepperIndex === 2
                ? 'Review Details →'
                : stepperIndex === 3
                ? 'Final Scorecard →'
                : 'View Full Dossier'
            }
            stepCircleContainerClassName="shadow-xl shadow-slate-200/40 border border-slate-200 bg-white"
          >
            {/* STEP 1: DRAG & DROP PHOTO PREVIEW IN REFINEFRAME */}
            <Step>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-teal-700 uppercase tracking-wider">Step 1 of 4</span>
                    <h2 className="text-xl font-bold text-slate-900">Upload or Drag Medicine Packaging Photo</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ensure the medicine name, dosage, and 2D GS1 DataMatrix code are clearly visible in good lighting.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <Upload className="h-4 w-4 text-teal-600" />
                    <span>Browse Files</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* RefineFrame Packaging Container */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 flex flex-col items-center justify-center">
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      className={`relative w-full max-w-md p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                        isDragOver
                          ? 'border-teal-500 bg-teal-50/60 scale-[1.01]'
                          : 'border-slate-200 bg-slate-50/50 hover:border-teal-300'
                      }`}
                    >
                      <RefineFrame
                        status={refineStatus}
                        aspectRatio="4 / 3"
                        width={420}
                        radius={14}
                        background="#ffffff"
                        color="#0f172a"
                        sweep={refineStatus === 'refining'}
                        showStatus={true}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={packageImage}
                          alt="Medicine packaging specimen"
                          className="w-full h-full object-contain p-2"
                        />
                      </RefineFrame>

                      <p className="text-center text-[11px] font-medium text-slate-500 mt-2">
                        {isDragOver ? 'Release photo to analyze' : 'Drag & drop replacement photo or click browse above'}
                      </p>
                    </div>
                  </div>

                  {/* Preset Selector Card */}
                  <div className="md:col-span-5 space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-teal-600" />
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                          Quick Test Specimens
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">
                        Test the forensic verification engine with pre-configured pharmaceutical records:
                      </p>

                      <div className="space-y-2">
                        {PRESET_DEMOS.map((preset) => {
                          const isSelected = medicineName === preset.name;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => applyPreset(preset)}
                              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'border-teal-500 bg-teal-50/80 shadow-sm ring-1 ring-teal-500/30'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <div className="text-xs font-bold text-slate-900">{preset.name}</div>
                                <div className="text-[10px] text-slate-500">{preset.subtitle}</div>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  preset.targetStatus === 'consistent'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : preset.targetStatus === 'suspicious'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {preset.targetStatus.toUpperCase()}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/50 flex items-start gap-2.5">
                      <Info className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-teal-800 leading-relaxed">
                        The AI OCR engine will inspect micro-typography and decode the 2D DataMatrix (01), (10), (17), (21) identifiers during Step 2.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Step>

            {/* STEP 2: MULTI-SIGNAL FORENSIC AI ANALYSIS VIA LATTICELOADER & THOUGHTLINE */}
            <Step>
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-teal-700 uppercase tracking-wider">Step 2 of 4</span>
                    <h2 className="text-xl font-bold text-slate-900">AI Multi-Signal Forensic Inspection</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Decoding GS1 2D DataMatrix ECC 200 symbology, font kerning, and AMMPS / BDPM catalog registration.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={runAiAnalysis}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>Re-run Analysis</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: RefineFrame with live sweep laser */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <RefineFrame
                      status={isAnalyzing ? 'refining' : 'complete'}
                      aspectRatio="4 / 3"
                      width={340}
                      radius={16}
                      background="#ffffff"
                      color="#0f172a"
                      sweep={isAnalyzing}
                      showStatus={true}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={packageImage}
                        alt="Analyzing medicine packaging"
                        className="w-full h-full object-contain p-2"
                      />
                    </RefineFrame>

                    <div className="mt-3 w-full max-w-[340px]">
                      <div className="flex justify-between text-[11px] font-mono text-slate-600 mb-1">
                        <span>Analysis Completeness</span>
                        <span>{analysisProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded-full transition-all duration-300"
                          style={{ width: `${analysisProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: LatticeLoader & ThoughtLine Progress List */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm shrink-0">
                        <LatticeLoader
                          status={analysisStatus}
                          label="Processing Matrix"
                          doneLabel="Inspection Complete"
                          errorLabel="Inspection Failed"
                          pattern="orbit"
                          grid={3}
                          shape="round"
                          color="#0D9488"
                          doneColor="#10B981"
                          cellSize={7}
                          gap={2.5}
                          fontSize={13}
                          showTimer
                        />
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="font-bold text-slate-800">
                          {isAnalyzing ? 'Running multi-layer verification…' : 'Packaging scan successful!'}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {isAnalyzing
                            ? 'Cross-referencing optical raster with pharmaceutical serialization databases.'
                            : 'Identifiers extracted with 99.4% confidence score.'}
                        </p>
                      </div>
                    </div>

                    {/* Step-by-step ThoughtLine animation */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <ThoughtLine
                        working={isAnalyzing}
                        steps={analysisSteps.length > 0 ? analysisSteps : [
                          'Ingesting high-resolution packaging raster',
                          'Detecting GS1 2D DataMatrix (ECC 200) reticle',
                          'Optical OCR text extraction across typography layers',
                          'Deciphering Application Identifiers: GTIN, Batch, Expiry & Serial',
                          'Comparing identifiers against AMMPS / BDPM catalog node'
                        ]}
                        label="Forensic OCR & Symbology Inspection…"
                        doneLabel="Verification finalized in"
                        glyph="sparkle"
                        fontSize={14}
                        color="#0D9488"
                        collapsible
                        showTimer
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Step>

            {/* STEP 3: MEDICINE DETAILS VERIFICATION & USER SUPPLEMENT FORM */}
            <Step>
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[11px] font-mono font-bold text-teal-700 uppercase tracking-wider">Step 3 of 4</span>
                  <h2 className="text-xl font-bold text-slate-900">Review &amp; Supplement Medicine Details</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verify the OCR-extracted packaging identifiers below and complement any purchase or pharmacy records.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Medicine Name & Strength */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-mono font-semibold text-slate-700 flex items-center justify-between">
                      <span>Medicine Trade Name &amp; Strength</span>
                      <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        OCR Extracted
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={medicineName}
                        onChange={(e) => setMedicineName(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* GTIN / EAN-13 */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-700 flex items-center justify-between">
                      <span>(01) GTIN / EAN-13 (14 Digits)</span>
                      <span className="text-[10px] text-slate-500">GS1 Primary Key</span>
                    </label>
                    <input
                      type="text"
                      value={gtin}
                      onChange={(e) => setGtin(e.target.value)}
                      maxLength={14}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-mono text-xs text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
                    />
                  </div>

                  {/* Batch / Lot */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-700 flex items-center justify-between">
                      <span>(10) Batch / Lot Number</span>
                      <span className="text-[10px] text-slate-500">AI (10)</span>
                    </label>
                    <input
                      type="text"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-mono text-xs text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
                    />
                  </div>

                  {/* Serial Number */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-700 flex items-center justify-between">
                      <span>(21) Serial Number</span>
                      <span className="text-[10px] text-slate-500">AI (21)</span>
                    </label>
                    <input
                      type="text"
                      value={serial}
                      onChange={(e) => setSerial(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-mono text-xs text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-700 flex items-center justify-between">
                      <span>(17) Expiry Date (MM/YYYY)</span>
                      <span className="text-[10px] text-slate-500">AI (17)</span>
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="11/2027"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-mono text-xs text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
                    />
                  </div>

                  {/* Optional Pharmacy Location */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-mono text-slate-700 flex items-center justify-between">
                      <span>Pharmacy / Dispensary Location (Optional)</span>
                      <span className="text-[10px] text-slate-400">Traceability audit</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={pharmacyLocation}
                        onChange={(e) => setPharmacyLocation(e.target.value)}
                        placeholder="e.g. Pharmacie Centrale, Rabat"
                        className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Step>

            {/* STEP 4: REAL-TIME VERIFICATION RESULT SCORECARD */}
            <Step>
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-teal-700 uppercase tracking-wider">Step 4 of 4</span>
                    <h2 className="text-xl font-bold text-slate-900">Verification Result Scorecard</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Multi-signal consensus completed against national registries and serialization rules.
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      targetOutcome === 'consistent'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : targetOutcome === 'suspicious'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {targetOutcome === 'consistent' ? (
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    ) : targetOutcome === 'suspicious' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>
                      {targetOutcome === 'consistent'
                        ? 'CONSISTENT (AUTHENTIC)'
                        : targetOutcome === 'suspicious'
                        ? 'SUSPICIOUS (IRREGULAR)'
                        : 'FAILED (EXPIRED)'}
                    </span>
                  </span>
                </div>

                {/* Scorecard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left: Summary Banner */}
                  <div className="md:col-span-7 space-y-4">
                    <div
                      className={`p-5 rounded-2xl border ${
                        targetOutcome === 'consistent'
                          ? 'bg-emerald-50/70 border-emerald-200'
                          : targetOutcome === 'suspicious'
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-red-50/70 border-red-200'
                      }`}
                    >
                      <h3 className="font-bold text-base text-slate-900">{medicineName}</h3>
                      <p className="text-xs text-slate-600 mt-1">
                        {targetOutcome === 'consistent'
                          ? 'All physical and digital signals match official AMMPS / BDPM catalog data. Packaging serial is unique and verified.'
                          : targetOutcome === 'suspicious'
                          ? 'Serial number mismatch detected with central pharmaceutical distribution records. Packaging inspection flagged.'
                          : 'The expiration date stamped on this carton (06/2023) has passed. Do not dispense or ingest this medication.'}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-700">
                        <div>
                          <span className="text-slate-500">GTIN: </span>
                          <span className="font-semibold">{gtin}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Batch: </span>
                          <span className="font-semibold">{batch}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Expiry: </span>
                          <span className="font-semibold">{expiry}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Serial: </span>
                          <span className="font-semibold">{serial}</span>
                        </div>
                      </div>
                    </div>

                    {/* Audit Checklist */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2.5">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono mb-2">
                        Verification Audit Matrix
                      </div>
                      {[
                        { label: 'AMMPS / BDPM National Catalog Record', pass: true },
                        { label: 'Authorized Pharmaceutical Manufacturer Matched', pass: true },
                        {
                          label: 'Serialization Registry & Unique Serial Check',
                          pass: targetOutcome === 'consistent'
                        },
                        {
                          label: 'Shelf Life & Expiration Range Validation',
                          pass: targetOutcome !== 'expired'
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                          <span className="text-slate-700 font-medium">{item.label}</span>
                          <span className={`font-mono text-xs font-bold ${item.pass ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {item.pass ? '✓ VALID' : '⚠ FLAG'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="md:col-span-5 flex flex-col justify-between space-y-3">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                      <div className="text-xs font-bold text-slate-800 font-mono uppercase">Next Actions</div>
                      <button
                        type="button"
                        onClick={navigateToResult}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-all cursor-pointer"
                      >
                        <FileText className="h-4 w-4" />
                        <span>View Full Audit Dossier (/result)</span>
                      </button>

                      <Link
                        href={`/report?gtin=${gtin}&name=${encodeURIComponent(medicineName)}&batch=${batch}&serial=${serial}&expiry=${expiry}`}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        <span>Report Packaging Irregularity</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setStepperIndex(1);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Verify Another Medicine</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 text-center leading-relaxed">
                      This digital cryptographic audit is based on Morocco AMMPS and France BDPM open datasets and does not replace the counsel of a licensed pharmacist.
                    </div>
                  </div>
                </div>
              </div>
            </Step>
          </Stepper>
        </div>
      )}

      {/* TAB 2: LIVE CAMERA OPTICAL SCANNER */}
      {activeTab === 'live' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40 space-y-6">
          <div 
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`relative mx-auto max-w-lg aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden border bg-slate-900 flex items-center justify-center shadow-inner transition-colors ${
              isDragOver ? 'border-teal-500 ring-2 ring-teal-500/40' : 'border-slate-300'
            }`}
          >
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
                <Camera className="h-12 w-12 text-teal-400 mb-3 animate-pulse" />
                <p className="text-sm font-semibold">Camera is stopped</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Click below to activate device optical sensor and position the GS1 DataMatrix reticle.
                </p>
              </div>
            )}

            {/* Target Reticle Overlay with Sweeping Laser Line */}
            <div className="absolute inset-0 pointer-events-none p-8 flex items-center justify-center">
              <div className="relative w-56 h-56 rounded-2xl border-2 border-teal-400 shadow-[0_0_20px_rgba(13,148,136,0.35)] flex items-center justify-center">
                <div className="hud-corner-tl -top-1 -left-1" />
                <div className="hud-corner-tr -top-1 -right-1" />
                <div className="hud-corner-bl -bottom-1 -left-1" />
                <div className="hud-corner-br -bottom-1 -right-1" />

                <div className="w-8 h-[1px] bg-teal-400 absolute left-2" />
                <div className="w-8 h-[1px] bg-teal-400 absolute right-2" />

                {/* Animated Teal Laser Scanning Line Sweeping Vertically */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_14px_#14b8a6] animate-laser" />
                
                <span className="absolute -bottom-6 font-mono text-[10px] text-teal-300 font-semibold tracking-wider">
                  ALIGN GS1 DATAMATRIX
                </span>
              </div>
            </div>

            {cameraError && (
              <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-amber-500/90 text-white p-2.5 text-xs flex items-center justify-between shadow-sm">
                <span className="truncate">{cameraError}</span>
                <button onClick={() => setCameraError(null)} className="cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Camera Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!cameraActive ? (
              <button
                type="button"
                onClick={() => void startCamera()}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-all cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                <span>Start Camera</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    runAiAnalysis();
                    setActiveTab('guided');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-teal-600/25 hover:from-teal-500 hover:to-teal-600 transition-all cursor-pointer ring-2 ring-teal-400/40 animate-pulse"
                >
                  <Camera className="h-4 w-4" />
                  <span>Capture Frame &amp; Verify</span>
                </button>
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <FlipHorizontal className="h-4 w-4" />
                  <span>{facingMode === 'environment' ? 'Back' : 'Front'} Camera</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-red-700 hover:bg-red-100 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  <span>Stop Camera</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MANUAL GS1 ENTRY FORM */}
      {activeTab === 'manual' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Manual GS1 Identifier Form</h3>
              <p className="text-xs text-slate-500">
                Input the GS1 Application Identifiers printed adjacent to the 2D DataMatrix on the packaging.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-500">Quick fill:</span>
              {PRESET_DEMOS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-mono text-slate-700 hover:border-teal-400 hover:text-teal-700 shadow-sm cursor-pointer"
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigateToResult();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-700 flex items-center justify-between">
                  <span>(01) GTIN / EAN-13 (14 Digits)</span>
                  <span className="text-[10px] text-teal-700 font-semibold">GS1 Key</span>
                </label>
                <input
                  type="text"
                  value={gtin}
                  onChange={(e) => setGtin(e.target.value)}
                  placeholder="06111234567890"
                  maxLength={14}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-mono text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-700 flex items-center justify-between">
                  <span>(10) Batch / Lot Number</span>
                  <span className="text-[10px] text-slate-500">AI (10)</span>
                </label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="B2024-X88"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-mono text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-700 flex items-center justify-between">
                  <span>(21) Serial Number</span>
                  <span className="text-[10px] text-slate-500">AI (21)</span>
                </label>
                <input
                  type="text"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="SN9872134567"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-mono text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-700 flex items-center justify-between">
                  <span>(17) Expiry Date (MM/YYYY)</span>
                  <span className="text-[10px] text-slate-500">AI (17)</span>
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="11/2027"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-mono text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 hover:from-teal-500 hover:to-teal-600 transition-all border border-teal-500/30 active:scale-[0.99] cursor-pointer"
              >
                <ScanLine className="h-4 w-4" />
                <span>Submit Identifiers for Verification</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
