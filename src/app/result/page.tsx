import React, { Suspense } from 'react';
import EvidenceResults from '@/components/results/EvidenceResults';
import { ScanLine } from 'lucide-react';

export const metadata = {
  title: 'Evidence Audit Scorecard | MediVerify',
  description: 'Multi-signal forensic audit checklist and verification scorecard for medicine packaging.',
};

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 animate-pulse">
            <ScanLine className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-mono text-teal-300">
            Resolving multi-signal audit dossier...
          </p>
        </div>
      }
    >
      <EvidenceResults />
    </Suspense>
  );
}
