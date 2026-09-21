import React, { Suspense } from 'react';
import ScannerInterface from '@/components/scanner/ScannerInterface';

export const metadata = {
  title: 'Verification Scanner | MediVerify',
  description: 'Scan GS1 DataMatrix or enter pharmaceutical identifiers for real-time verification against AMMPS and BDPM registries.',
};

export default function VerifyPage() {
  return (
    <div className="py-6">
      <Suspense
        fallback={
          <div className="mx-auto max-w-5xl p-8 text-center text-slate-500 font-mono text-xs">
            Loading optical verification scanner...
          </div>
        }
      >
        <ScannerInterface />
      </Suspense>
    </div>
  );
}
