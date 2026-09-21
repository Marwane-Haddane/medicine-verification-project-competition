import React from 'react';
import DatabaseBrowser from '@/components/database/DatabaseBrowser';

export const metadata = {
  title: 'Pharmaceutical Registry Database | MediVerify',
  description: 'Search official drug registries from AMMPS (Morocco) and BDPM (France) with verified GTINs and indications.',
};

export default function DatabasePage() {
  return (
    <div className="py-6">
      <DatabaseBrowser />
    </div>
  );
}
