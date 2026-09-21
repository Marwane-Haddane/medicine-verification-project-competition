'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  AlertTriangle, 
  Upload, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  MapPin, 
  Building, 
  Calendar, 
  Send,
  ArrowLeft,
  Copy,
  Printer
} from 'lucide-react';

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
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/result"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-teal-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Evidence Scorecard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1 text-xs font-semibold text-amber-300">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Pharmacovigilance Incident Dispatch</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Report Pharmaceutical Anomaly
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Submit suspicious packaging, serial mismatch, or tampering to the AMMPS / BDPM regulatory alert network. Reports are immediately logged for forensic inspection.
        </p>
      </div>

      {/* Success State Screen */}
      {submittedTicket ? (
        <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#0e2c24] to-[#071714] p-8 sm:p-12 shadow-2xl text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Incident Report Dispatched</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your report has been encrypted, assigned a regulatory ticket ID, and routed to the AMMPS Pharmacovigilance Inspection Unit.
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-950/80 p-5 font-mono text-xs text-left space-y-2">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">TICKET ID:</span>
              <span className="text-emerald-400 font-bold">{submittedTicket.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">MEDICINE:</span>
              <span className="text-white">{medicineName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">GTIN:</span>
              <span className="text-teal-300">{gtin}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">BATCH / LOT:</span>
              <span className="text-white">{batchNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">EXPIRY DATE:</span>
              <span className="text-white">{expiry}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">SERIAL:</span>
              <span className="text-amber-400">{serialNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">PHARMACY / CITY:</span>
              <span className="text-slate-200">{pharmacyName}, {city}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
            >
              <Printer className="h-4 w-4" />
              <span>Print Confirmation Receipt</span>
            </button>
            <button
              onClick={() => setSubmittedTicket(null)}
              className="rounded-xl bg-teal-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal-400 transition-all shadow-md shadow-teal-500/25"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Form Card */
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-[#08182c]/90 p-6 sm:p-10 shadow-2xl space-y-8"
        >
          {/* Section 1: Product Identifiers */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 font-mono">
              <span>01. Package Identifiers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                <label className="block text-xs font-mono text-slate-300">
                  Medicine Name
                </label>
                <input
                  type="text"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">
                  GTIN / Barcode (14 Digits)
                </label>
                <input
                  type="text"
                  value={gtin}
                  onChange={(e) => setGtin(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm font-mono text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">
                  Batch / Lot Number
                </label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm font-mono text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">
                  Expiration Date (MM/YYYY)
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YYYY"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm font-mono text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">
                  Serial Number (AI 21)
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm font-mono text-white focus:border-teal-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Observed Anomalies Checkboxes */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 font-mono">
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
                        ? 'border-amber-500/50 bg-amber-950/30 text-amber-200'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="mt-1 h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-xs font-medium leading-relaxed">{flag}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 3: Photo Evidence Upload */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 font-mono">
              <span>03. Photographic Evidence</span>
            </h3>

            <div className="rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/50 p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                id="photo-upload"
                className="hidden"
              />
              <label htmlFor="photo-upload" className="cursor-pointer space-y-2 block">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="text-xs font-semibold text-white">
                  Attach photos of box, batch stamp, or blister
                </div>
                <div className="text-[11px] text-slate-400">
                  High-resolution photos assist computer vision forensic analysis
                </div>
              </label>

              {uploadedPhotos.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {uploadedPhotos.map((photo, i) => (
                    <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-teal-500/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt="Evidence" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Location & Purchase Details */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 font-mono">
              <span>04. Source Pharmacy &amp; Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">City / Wilaya</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-mono text-slate-300">Pharmacy / Dispensary Name</label>
                <input
                  type="text"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">Purchase Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-mono text-slate-300">Reporter Role</label>
                <select
                  value={reporterRole}
                  onChange={(e) => setReporterRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="Pharmacist">Licensed Pharmacist</option>
                  <option value="Pharmacy Technician">Pharmacy Technician / Assistant</option>
                  <option value="Physician">Physician / Doctor</option>
                  <option value="Patient">Patient / Consumer</option>
                  <option value="Health Inspector">Regulatory Health Inspector</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-mono text-slate-300">
                Detailed Incident Observations
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-white focus:border-teal-400 focus:outline-none"
                placeholder="Provide any additional details about packaging, vendor, or discrepancy..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 py-3.5 text-sm font-semibold text-white shadow-xl shadow-amber-950/50 hover:from-amber-500 hover:to-amber-600 transition-all active:scale-[0.99]"
            >
              <Send className="h-4 w-4" />
              <span>Transmit Anomaly Report to Pharmacovigilance</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
