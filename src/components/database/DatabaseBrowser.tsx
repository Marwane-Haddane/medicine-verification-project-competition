'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Database, 
  Search, 
  Filter, 
  ScanLine, 
  ExternalLink, 
  ShieldCheck, 
  Building2, 
  Tag, 
  ChevronRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { MEDICINE_DATABASE } from '@/lib/mockData';
import { MedicineRecord } from '@/lib/types';

export default function DatabaseBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegistry, setSelectedRegistry] = useState<'ALL' | 'AMMPS' | 'BDPM'>('ALL');
  const [selectedForm, setSelectedForm] = useState<string>('ALL');
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineRecord | null>(null);

  const formsList = ['ALL', 'Comprimé', 'Gélule', 'Suspension / Sirop', 'Poudre'];

  const filteredMedicines = useMemo(() => {
    return MEDICINE_DATABASE.filter((med) => {
      // Registry filter
      if (selectedRegistry !== 'ALL' && med.registry !== selectedRegistry) {
        return false;
      }
      // Form filter
      if (selectedForm !== 'ALL') {
        if (!med.form.toLowerCase().includes(selectedForm.toLowerCase().split(' ')[0])) {
          return false;
        }
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = med.name.toLowerCase().includes(query);
        const matchActive = med.activeIngredient.toLowerCase().includes(query);
        const matchGtin = med.gtin.includes(query);
        const matchManufacturer = med.manufacturer.toLowerCase().includes(query);
        return matchName || matchActive || matchGtin || matchManufacturer;
      }
      return true;
    });
  }, [searchQuery, selectedRegistry, selectedForm]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-3.5 py-1 text-xs font-semibold text-teal-300">
            <Database className="h-3.5 w-3.5" />
            <span>Reference Master Catalog</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mt-2">
            Public Pharmaceutical Registry
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Live synchronized database indexing official medicines from <strong className="text-teal-300">AMMPS (Morocco DMP)</strong> and <strong className="text-teal-300">BDPM (France ANSM)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sync Status: <strong>100% Operational</strong></span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="rounded-2xl border border-slate-800 bg-[#08182c]/80 p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name, active substance (DCI), GTIN, or laboratory..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/90 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none"
            />
          </div>

          {/* Registry Filter Buttons */}
          <div className="md:col-span-3 flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {(['ALL', 'AMMPS', 'BDPM'] as const).map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegistry(reg)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-mono font-medium transition-all ${
                  selectedRegistry === reg
                    ? 'bg-teal-500 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {reg === 'ALL' ? 'All' : reg}
              </button>
            ))}
          </div>

          {/* Form Filter Chips */}
          <div className="md:col-span-3">
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:border-teal-400 focus:outline-none"
            >
              {formsList.map((f) => (
                <option key={f} value={f}>
                  {f === 'ALL' ? 'All Dosage Forms' : f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Result Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <span>
            Displaying <strong className="text-teal-300">{filteredMedicines.length}</strong> authenticated records
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-teal-400 hover:underline flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Medicine Records Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#08182c]/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#061220] border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <tr>
                <th scope="col" className="py-3.5 px-4 font-semibold">Medicine &amp; Dosage</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">Active Substance (DCI)</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">GTIN / Registry</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">Laboratory</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">Price</th>
                <th scope="col" className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((med) => (
                  <tr
                    key={med.gtin}
                    className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                    onClick={() => setSelectedMedicine(med)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-teal-300 transition-colors text-sm">
                        {med.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {med.form} • {med.packaging}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-200">
                        {med.activeIngredient}
                      </span>
                      <div className="font-mono text-[10px] text-slate-500">
                        ATC: {med.atcCode}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-teal-300 font-medium">{med.gtin}</div>
                      <span
                        className={`inline-block rounded px-1.5 py-0.2 text-[9px] font-bold ${
                          med.registry === 'AMMPS'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-blue-950 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {med.registry} ({med.country})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {med.manufacturer}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {med.price}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/result?gtin=${med.gtin}&batch=${med.defaultBatch}&serial=${med.defaultSerial}&expiry=${med.defaultExpiry}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-lg bg-teal-500/20 border border-teal-500/40 px-2.5 py-1 text-[11px] font-semibold text-teal-300 hover:bg-teal-500 hover:text-white transition-all"
                        >
                          <ScanLine className="h-3 w-3" />
                          <span>Audit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No medicines match the specified search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Medicine Details Drawer / Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl rounded-3xl border border-teal-500/40 bg-[#091b31] p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMedicine(null)}
              className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-3 border-b border-slate-800 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex-shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-teal-950 px-2 py-0.5 text-[10px] font-mono text-teal-300 border border-teal-500/30">
                    {selectedMedicine.registry} Master Dossier
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {selectedMedicine.registrationNumber}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {selectedMedicine.name}
                </h3>
                <p className="text-xs text-slate-300 italic">
                  {selectedMedicine.activeIngredient} • {selectedMedicine.form}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedMedicine.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/80 p-4 rounded-xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">GTIN:</span>
                <span className="text-teal-300 font-bold">{selectedMedicine.gtin}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">LABORATORY:</span>
                <span className="text-white">{selectedMedicine.manufacturer}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PRICE TARIFF:</span>
                <span className="text-emerald-400 font-bold">{selectedMedicine.price}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">REIMBURSABLE:</span>
                <span className="text-white">{selectedMedicine.isReimbursable ? 'Eligible' : 'Non-eligible'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">DEFAULT BATCH:</span>
                <span className="text-white">{selectedMedicine.defaultBatch}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">EXPIRY:</span>
                <span className="text-white">{selectedMedicine.defaultExpiry}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Therapeutic Indications:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMedicine.indications.map((ind, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-teal-950/60 border border-teal-500/20 px-2 py-0.5 text-xs text-teal-300"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedMedicine(null)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
              <Link
                href={`/result?gtin=${selectedMedicine.gtin}&batch=${selectedMedicine.defaultBatch}&serial=${selectedMedicine.defaultSerial}&expiry=${selectedMedicine.defaultExpiry}`}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-400 transition-all shadow-md shadow-teal-500/20"
              >
                <ScanLine className="h-4 w-4" />
                <span>Verify this Medicine</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
