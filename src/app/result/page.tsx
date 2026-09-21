import React, { Suspense } from 'react';
import EvidenceResults from '@/components/results/EvidenceResults';
import LatticeLoader from '@/components/reactbits/LatticeLoader/LatticeLoader';

export const metadata = {
  title: 'Evidence Audit Scorecard | MediVerify',
  description: 'Multi-signal forensic audit checklist and verification scorecard for medicine packaging.',
};

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
          <div className="p-8 rounded-3xl border border-slate-200 bg-white/95 shadow-xl flex flex-col items-center max-w-sm w-full backdrop-blur-md">
            <LatticeLoader
              status="working"
              label="Resolving Audit Dossier"
              pattern="orbit"
              grid={3}
              shape="round"
              color="#0D9488"
              cellSize={8}
              gap={3}
              fontSize={15}
              step={85}
              showTimer
            />
            <p className="mt-4 text-xs font-mono text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
              Cross-checking AMMPS &amp; serialization ledger...
            </p>
          </div>
        </div>
      }
    >
      <EvidenceResults />
    </Suspense>
  );
}
