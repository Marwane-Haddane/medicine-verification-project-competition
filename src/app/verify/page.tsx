import React from 'react';
import ScannerInterface from '@/components/scanner/ScannerInterface';

export const metadata = {
  title: 'Verification Scanner | MediVerify',
  description: 'Scan GS1 DataMatrix or enter pharmaceutical identifiers for real-time verification against AMMPS and BDPM registries.',
};

export default function VerifyPage() {
  return (
    <div className="py-6">
      <ScannerInterface />
    </div>
  );
}
