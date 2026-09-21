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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 animate-pulse shadow-sm">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-mono text-amber-800 font-medium">
            Initializing incident dispatch form...
          </p>
        </div>
      }
    >
      <AnomalyReportForm />
    </Suspense>
  );
}
