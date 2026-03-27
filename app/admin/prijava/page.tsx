import { Suspense } from 'react';
import AdminPrijavaForm from '@/components/admin/AdminPrijavaForm';

export default function AdminPrijavaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[50vh] flex items-center justify-center section-padding">
          <p className="font-body font-[300] text-[14px] text-silver-dark">Učitavanje…</p>
        </main>
      }
    >
      <AdminPrijavaForm />
    </Suspense>
  );
}
