'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Database, 
  Search, 
  Filter, 
  ScanLine, 
  ShieldCheck, 
  X
} from 'lucide-react';
import { MEDICINE_DATABASE } from '@/lib/mockData';
import { MedicineRecord } from '@/lib/types';

export default function DatabaseBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegistry, setSelectedRegistry] = useState<'ALL' | 'AMMPS' | 'BDPM'>('ALL');
  const [selectedIngredient, setSelectedIngredient] = useState<string>('ALL');
  const [selectedDosage, setSelectedDosage] = useState<string>('ALL');
  const [selectedForm, setSelectedForm] = useState<string>('ALL');
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineRecord | null>(null);

  const activeIngredientsList = [
    'ALL',
    'Albendazole',
    'Paracétamol',
    'Amoxicilline',
    'Salbutamol',
    'Aspirine',
    'Ésoméprazole',
    'Metformine',
  ];

  const dosagesList = [
    'ALL',
    '400 mg',
    '500 mg',
    '1000 mg',
    '75 mg',
    '40 mg',
    '100 µg',
    '1 g / 125 mg',
  ];

  const filteredMedicines = useMemo(() => {
    return MEDICINE_DATABASE.filter((med) => {
      // Registry filter
      if (selectedRegistry !== 'ALL' && med.registry !== selectedRegistry) {
        return false;
      }
      // Active ingredient filter
      if (selectedIngredient !== 'ALL') {
        if (!med.activeIngredient.toLowerCase().includes(selectedIngredient.toLowerCase())) {
          return false;
        }
      }
      // Dosage filter
      if (selectedDosage !== 'ALL') {
        if (!med.dosage.toLowerCase().includes(selectedDosage.toLowerCase())) {
          return false;
        }
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
  }, [searchQuery, selectedRegistry, selectedIngredient, selectedDosage, selectedForm]);

  const hasActiveFilters =
    searchQuery ||
    selectedRegistry !== 'ALL' ||
    selectedIngredient !== 'ALL' ||
    selectedDosage !== 'ALL' ||
    selectedForm !== 'ALL';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedRegistry('ALL');
    setSelectedIngredient('ALL');
    setSelectedDosage('ALL');
    setSelectedForm('ALL');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-800 shadow-sm">
            <Database className="h-3.5 w-3.5 text-teal-600" />
            <span>Reference Master Catalog</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mt-2">
            Public Pharmaceutical Registry
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Searchable reference database indexing authentic medicines from <strong className="text-teal-700">AMMPS (Morocco DMP)</strong> and <strong className="text-teal-700">BDPM (France ANSM)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sync Status: <strong className="text-emerald-700">100% Operational</strong></span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Box */}
          <div className="md:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name, active substance (DCI), GTIN, or laboratory..."
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none shadow-sm"
            />
          </div>

          {/* Registry Filter Buttons */}
          <div className="md:col-span-4 flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['ALL', 'AMMPS', 'BDPM'] as const).map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegistry(reg)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedRegistry === reg
                    ? 'bg-teal-600 text-white font-bold shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {reg === 'ALL' ? 'All Registries' : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Chips: Active Ingredient */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
              <Filter className="h-3 w-3 text-teal-600" />
              <span>Filter by Active Ingredient (DCI):</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeIngredientsList.map((ing) => {
              const isSelected = selectedIngredient === ing;
              return (
                <button
                  key={ing}
                  onClick={() => setSelectedIngredient(ing)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {ing === 'ALL' ? 'All Ingredients' : ing}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Chips: Dosage */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
            Filter by Dosage Strength:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {dosagesList.map((d) => {
              const isSelected = selectedDosage === d;
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDosage(d)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-mono font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {d === 'ALL' ? 'All Dosages' : d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Result Counter & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Displaying <strong className="text-teal-700 font-mono">{filteredMedicines.length}</strong> authenticated records
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-teal-700 hover:underline flex items-center gap-1 text-xs font-medium cursor-pointer"
            >
              <X className="h-3 w-3" /> Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Medicine Records Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-600">
              <tr>
                <th scope="col" className="py-3.5 px-4 font-semibold">Medicine &amp; Dosage</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">Active Substance (DCI)</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">GTIN / Registry</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">Laboratory</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">Price</th>
                <th scope="col" className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((med) => (
                  <tr
                    key={med.gtin}
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedMedicine(med)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors text-sm">
                        {med.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {med.form} • {med.packaging}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">
                        {med.activeIngredient}
                      </span>
                      <div className="font-mono text-[10px] text-slate-400">
                        ATC: {med.atcCode}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-teal-700 font-medium">{med.gtin}</div>
                      <span
                        className={`inline-block rounded px-1.5 py-0.2 text-[9px] font-bold ${
                          med.registry === 'AMMPS'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {med.registry} ({med.country})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {med.manufacturer}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      {med.price}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/result?gtin=${med.gtin}&batch=${med.defaultBatch}&serial=${med.defaultSerial}&expiry=${med.defaultExpiry}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-lg bg-teal-50 border border-teal-200 px-2.5 py-1 text-[11px] font-semibold text-teal-800 hover:bg-teal-600 hover:text-white transition-all shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMedicine(null)}
              className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex-shrink-0 shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-mono text-teal-800 border border-teal-200 font-semibold">
                    {selectedMedicine.registry} Master Dossier
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ID: {selectedMedicine.registrationNumber}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {selectedMedicine.name}
                </h3>
                <p className="text-xs text-slate-500 italic">
                  {selectedMedicine.activeIngredient} • {selectedMedicine.form}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedMedicine.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono shadow-inner">
              <div>
                <span className="text-slate-500 block text-[10px]">GTIN:</span>
                <span className="text-teal-700 font-bold">{selectedMedicine.gtin}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">LABORATORY:</span>
                <span className="text-slate-900">{selectedMedicine.manufacturer}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PRICE TARIFF:</span>
                <span className="text-emerald-700 font-bold">{selectedMedicine.price}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">REIMBURSABLE:</span>
                <span className="text-slate-900">{selectedMedicine.isReimbursable ? 'Eligible' : 'Non-eligible'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">DEFAULT BATCH:</span>
                <span className="text-slate-900">{selectedMedicine.defaultBatch}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">EXPIRY:</span>
                <span className="text-slate-900">{selectedMedicine.defaultExpiry}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
                Therapeutic Indications:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMedicine.indications.map((ind, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-teal-50 border border-teal-200 px-2 py-0.5 text-xs text-teal-800"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedMedicine(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer"
              >
                Close
              </button>
              <Link
                href={`/result?gtin=${selectedMedicine.gtin}&batch=${selectedMedicine.defaultBatch}&serial=${selectedMedicine.defaultSerial}&expiry=${selectedMedicine.defaultExpiry}`}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition-all shadow-md shadow-teal-600/20"
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
