import { Suspense } from 'react';
import KreatorPrijavaForm from '@/components/kreator/KreatorPrijavaForm';

export default function KreatorPrijavaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[50vh] flex items-center justify-center section-padding">
          <p className="font-body font-[300] text-[14px] text-silver-dark">Učitavanje…</p>
        </main>
      }
    >
      <KreatorPrijavaForm />
    </Suspense>
  );
}
