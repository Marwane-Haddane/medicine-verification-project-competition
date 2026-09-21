import React, { Suspense } from 'react';
import AnomalyReportForm from '@/components/report/AnomalyReportForm';
import { ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Report Medicine Anomaly | MediVerify',
  description: 'Report suspected counterfeit, serial mismatch, or packaging tampering to the AMMPS Pharmacovigilance network.',
};

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 animate-pulse">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-mono text-amber-300">
            Initializing incident dispatch form...
          </p>
        </div>
      }
    >
      <AnomalyReportForm />
    </Suspense>
  );
}
