'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client';

function safeNextAfterLogin(
  nextParam: string | null,
  role: 'admin' | 'creator',
): string {
  const fallback = role === 'admin' ? '/admin' : '/kreator';
  const prefix = role === 'admin' ? '/admin' : '/kreator';
  if (!nextParam || !nextParam.startsWith('/')) return fallback;
  if (!nextParam.startsWith(prefix)) return fallback;
  if (nextParam.includes('//') || nextParam.includes('..')) return fallback;
  return nextParam;
}

export default function PrijavaForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseBrowserConfigured()) {
      setError('Prijava trenutno nije dostupna.');
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError('Prijava trenutno nije dostupna.');
      return;
    }

    setLoading(true);
    const { data: authData, error: signErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signErr || !authData.user) {
      setLoading(false);
      setError('Pogrešan email ili lozinka.');
      return;
    }

    const userId = authData.user.id;

    const [{ data: adminRow }, { data: creatorRow }] = await Promise.all([
      supabase.from('admins').select('user_id').eq('user_id', userId).maybeSingle(),
      supabase.from('creators').select('id').eq('id', userId).maybeSingle(),
    ]);

    if (adminRow) {
      window.location.assign(safeNextAfterLogin(nextParam, 'admin'));
      return;
    }

    if (creatorRow) {
      window.location.assign(safeNextAfterLogin(nextParam, 'creator'));
      return;
    }

    await supabase.auth.signOut();
    setLoading(false);
    setError('Ovaj nalog nema odobren pristup panelu.');
  };

  return (
    <main className="min-h-[65vh] flex flex-col justify-center px-4 md:px-6 py-16 md:py-20 relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-end justify-center gap-2 h-10 w-[120px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="popbeauty-load-bar flex-1 max-w-[10px] min-h-[6px] origin-bottom bg-gradient-to-t from-sage-mid/90 to-sage-light/70"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
            <p className="font-body font-[300] text-[11px] uppercase tracking-[0.22em] text-silver-dark">
              Prijavljivanje…
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[400px]">
        <p className="font-body font-[300] text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-3 md:mb-4 text-center">
          Pop Beauty
        </p>
        <h1 className="font-display font-[300] text-[26px] md:text-[clamp(28px,4vw,40px)] text-ink mb-3 md:mb-4 text-center">
          Prijava
        </h1>
        <p className="font-body font-[300] text-[12px] md:text-[14px] text-silver-dark leading-relaxed mb-8 md:mb-10 text-center">
          Jedan nalog za pristup admin panelu ili panelu kreatora.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 text-left">
          <div>
            <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full border border-silver-light bg-white px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors disabled:opacity-60"
              placeholder="tvoj@email.com"
            />
          </div>
          <div>
            <label className="block font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-2">
              Lozinka
            </label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full border border-silver-light bg-white px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors disabled:opacity-60"
            />
          </div>
          {error ? (
            <p className="font-body font-[300] text-[13px] text-red-800" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-ink bg-ink py-3 font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-transparent hover:text-ink disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Prijava…' : 'Prijavi se'}
          </button>
        </form>

        <p className="mt-10 text-center">
          <Link
            href="/"
            className="font-body font-[300] text-[12px] text-silver-dark underline underline-offset-4 hover:text-ink"
          >
            Nazad na početnu
          </Link>
        </p>
      </div>
    </main>
  );
}
