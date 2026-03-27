'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client';

export default function KreatorPrijavaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/kreator';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseBrowserConfigured()) {
      setError('Prijava nije podešena (Supabase env).');
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError('Prijava nije dostupna.');
      return;
    }

    setLoading(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signErr) {
      setError('Pogrešan email ili lozinka.');
      return;
    }

    const safeNext = nextPath.startsWith('/kreator') ? nextPath : '/kreator';
    router.push(safeNext);
    router.refresh();
  };

  return (
    <main className="min-h-[70vh] flex flex-col justify-center section-padding py-16">
      <div className="mx-auto w-full max-w-[400px] px-6">
        <p className="font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-4 text-center">
          Pop Beauty
        </p>
        <h1 className="font-display font-[300] text-[32px] text-ink text-center mb-2">
          Panel kreatora
        </h1>
        <p className="font-body font-[300] text-[13px] text-silver-dark text-center mb-10">
          Prijava je samo za odobrene naloge. Registracija nije javna.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink focus:border-sage-mid focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
              Lozinka
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink focus:border-sage-mid focus:outline-none"
            />
          </div>
          {error ? (
            <p className="font-body font-[300] text-[13px] text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-ink bg-ink py-3 font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-white hover:bg-transparent hover:text-ink transition-colors disabled:opacity-50"
          >
            {loading ? 'Prijava…' : 'Prijavi se'}
          </button>
        </form>

        <p className="mt-10 text-center">
          <Link
            href="/"
            className="font-body font-[300] text-[12px] text-silver-dark underline underline-offset-4 hover:text-ink"
          >
            Nazad na sajt
          </Link>
        </p>
      </div>
    </main>
  );
}
