'use client';

import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function KreatorMissingLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.push('/kreator/prijava');
    router.refresh();
  };

  return (
    <main className="section-padding py-16 max-w-[560px] mx-auto px-6 text-center">
      <h1 className="font-display font-[300] text-[26px] text-ink mb-4">
        Nalog nije podešen
      </h1>
      <p className="font-body font-[300] text-[14px] text-silver-dark mb-8">
        Postoji prijava, ali nema zapisa kreatora u bazi. Obratite se administratoru da doda vaš
        profil.
      </p>
      <button
        type="button"
        onClick={handleLogout}
        className="font-body text-[12px] underline underline-offset-4 text-ink"
      >
        Odjavi se
      </button>
    </main>
  );
}
