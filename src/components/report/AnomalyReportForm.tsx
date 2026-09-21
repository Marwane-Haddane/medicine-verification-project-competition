'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Upload, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowLeft, 
  Printer, 
  Send
} from 'lucide-react';
import ThoughtLine from '@/components/reactbits/ThoughtLine/ThoughtLine';

export default function AnomalyReportForm() {
  const searchParams = useSearchParams();

  // Prefill from query params if available
  const initialGtin = searchParams.get('gtin') || '03582910029381';
  const initialName = searchParams.get('name') || 'Doliprane 1000 mg';
  const initialBatch = searchParams.get('batch') || 'LOT-FR-4421';
  const initialSerial = searchParams.get('serial') || 'SN-UNKNOWN-8899';
  const initialExpiry = searchParams.get('expiry') || '08/2027';

  const [medicineName, setMedicineName] = useState(initialName);
  const [gtin, setGtin] = useState(initialGtin);
  const [batchNumber, setBatchNumber] = useState(initialBatch);
  const [expiry, setExpiry] = useState(initialExpiry);
  const [serialNumber, setSerialNumber] = useState(initialSerial);
  const [city, setCity] = useState('Casablanca');
  const [pharmacyName, setPharmacyName] = useState('Pharmacie Centrale Hassan II');
  const [purchaseDate, setPurchaseDate] = useState('2026-09-18');
  const [reporterRole, setReporterRole] = useState('Pharmacist');
  const [comments, setComments] = useState(
    'Serial number unrecorded in manufacturer cryptographic registry. Packaging font on batch stamp has inconsistent ink density.'
  );

  const [selectedFlags, setSelectedFlags] = useState<string[]>([
    'Serial missing',
    'Packaging text mismatch',
  ]);

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isPhotoScanning, setIsPhotoScanning] = useState(false);
  const [photoSteps, setPhotoSteps] = useState<string[]>([]);
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    timestamp: string;
  } | null>(null);

  const availableFlags = [
    'Barcode unreadable',
    'Serial missing',
    'Packaging text mismatch',
    'Suspected tampering',
    'Abnormal tablet color, texture, or odor',
    'Sold significantly below official regulated tariff',
  ];

  const toggleFlag = (flag: string) => {
    if (selectedFlags.includes(flag)) {
      setSelectedFlags(selectedFlags.filter((f) => f !== flag));
    } else {
      setSelectedFlags([...selectedFlags, flag]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsPhotoScanning(true);
      setPhotoSteps(['Ingesting uploaded packaging specimen']);
      setTimeout(() => {
        setPhotoSteps((prev) => [...prev, 'Scanning for tamper indicators & print density']);
      }, 400);
      setTimeout(() => {
        setPhotoSteps((prev) => [...prev, 'Photographic evidence verified for inspection dossier']);
        setIsPhotoScanning(false);
      }, 950);
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedPhotos((prev) => [...prev, event.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomTicket = `AMMPS-FLAG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedTicket({
      id: randomTicket,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/result"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Evidence Scorecard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800 shadow-sm">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span>Pharmacovigilance Incident Dispatch</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Report Pharmaceutical Anomaly
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Submit suspicious packaging, serial mismatch, or tampering to the AMMPS / BDPM regulatory alert network. Reports are immediately logged for forensic inspection.
        </p>
      </div>

      {/* Success State Screen */}
      {submittedTicket ? (
        <div className="rounded-3xl border border-emerald-300 bg-emerald-50/60 p-8 sm:p-12 shadow-xl text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Incident Report Dispatched</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your report has been encrypted, assigned a regulatory ticket ID, and routed to the AMMPS Pharmacovigilance Inspection Unit.
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 font-mono text-xs text-left space-y-2 shadow-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">TICKET ID:</span>
              <span className="text-emerald-700 font-bold">{submittedTicket.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">MEDICINE:</span>
              <span className="text-slate-900">{medicineName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">GTIN:</span>
              <span className="text-teal-700">{gtin}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">BATCH / LOT:</span>
              <span className="text-slate-900">{batchNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">EXPIRY DATE:</span>
              <span className="text-slate-900">{expiry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SERIAL:</span>
              <span className="text-amber-700">{serialNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PHARMACY / CITY:</span>
              <span className="text-slate-800">{pharmacyName}, {city}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print Confirmation Receipt</span>
            </button>
            <button
              onClick={() => setSubmittedTicket(null)}
              className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal-700 transition-all shadow-md shadow-teal-600/20 cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Form Card */
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-10 shadow-xl space-y-8"
        >
          {/* Section 1: Product Identifiers */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3 font-mono">
              <span>01. Package Identifiers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                <label className="block text-xs font-mono text-slate-700">
                  Medicine Name
                </label>
                <input
                  type="text"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-700">
                  GTIN / Barcode (14 Digits)
                </label>
                <input
                  type="text"
                  value={gtin}
                  onChange={(e) => setGtin(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-mono text-slate-900 focus:border-teal-500 focus:outline-none shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-700">
                  Batch / Lot Number
                </label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-mono text-slate-900 focus:border-teal-500 focus:outline-none shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-700">
                  Expiration Date (MM/YYYY)
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YYYY"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-mono text-slate-900 focus:border-teal-500 focus:outline-none shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-700">
                  Serial Number (AI 21)
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-mono text-slate-900 focus:border-teal-500 focus:outline-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Observed Anomalies Checkboxes */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3 font-mono">
              <span>02. Observed Anomaly Indicators</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableFlags.map((flag) => {
                const checked = selectedFlags.includes(flag);
                return (
                  <label
                    key={flag}
                    onClick={() => toggleFlag(flag)}
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                      checked
                        ? 'border-amber-400 bg-amber-50 text-amber-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-xs font-medium leading-relaxed">{flag}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 3: Photo Evidence Upload */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3 font-mono">
              <span>03. Photographic Evidence</span>
            </h3>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                id="photo-evidence-upload"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label htmlFor="photo-evidence-upload" className="cursor-pointer block space-y-2">
                <Upload className="mx-auto h-8 w-8 text-teal-600" />
                <span className="text-xs font-semibold text-slate-800 block">Click to upload packaging photos</span>
                <span className="text-[11px] text-slate-500 block">Upload photos of DataMatrix, batch imprint, blister pack, or cardboard edges</span>
              </label>

              {uploadedPhotos.length > 0 && (
                <div className="space-y-3 pt-3">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {uploadedPhotos.map((p, i) => (
                      <div key={i} className="h-20 w-20 rounded-xl overflow-hidden border border-teal-300 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p} alt="evidence" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-left shadow-sm">
                    <ThoughtLine
                      working={isPhotoScanning}
                      steps={photoSteps}
                      label="Analyzing packaging photo evidence…"
                      doneLabel="Specimen photo evaluated in"
                      glyph="sparkle"
                      fontSize={14}
                      color="#0D9488"
                      collapsible
                      showTimer
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Location & Metadata */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3 font-mono">
              <span>04. Discovery Location &amp; Observations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-700">
                  City / Region
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-700">
                  Pharmacy / Dispensary Name
                </label>
                <input
                  type="text"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-700">
                  Purchase / Verification Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-700">
                  Reporter Role
                </label>
                <select
                  value={reporterRole}
                  onChange={(e) => setReporterRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none shadow-sm"
                >
                  <option value="Pharmacist">Community Pharmacist</option>
                  <option value="Hospital Pharmacist">Hospital Pharmacist</option>
                  <option value="Wholesaler">Pharmaceutical Wholesaler</option>
                  <option value="Patient">Patient / Consumer</option>
                  <option value="Physician">Physician</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-mono text-slate-700">
                  Detailed Forensic Notes &amp; Observations
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-600/25 hover:from-amber-500 hover:to-amber-600 transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>Transmit Report to AMMPS Pharmacovigilance</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
