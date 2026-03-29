import { Suspense } from 'react';
import type { Metadata } from 'next';
import PrijavaForm from './PrijavaForm';

export const metadata: Metadata = {
  title: 'Prijava — Pop Beauty',
  description: 'Prijava na admin ili kreator panel.',
};

export default function PrijavaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[50vh] flex items-center justify-center px-6">
          <p className="font-body font-[300] text-[14px] text-silver-dark">Učitavanje…</p>
        </main>
      }
    >
      <PrijavaForm />
    </Suspense>
  );
}
