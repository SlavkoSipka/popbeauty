'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from '@/lib/supabase/client';

export default function PrijavaForm() {
  const router = useRouter();
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

    const { data: adminRow } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (adminRow) {
      setLoading(false);
      router.push('/admin');
      router.refresh();
      return;
    }

    const { data: creatorRow } = await supabase
      .from('creators')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (creatorRow) {
      setLoading(false);
      router.push('/kreator');
      router.refresh();
      return;
    }

    await supabase.auth.signOut();
    setLoading(false);
    setError('Ovaj nalog nema odobren pristup.');
  };

  return (
    <main className="min-h-[65vh] flex flex-col justify-center section-padding py-20 md:py-28">
      <div className="mx-auto w-full max-w-[400px] px-6">
        <p className="font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-4 text-center">
          Pop Beauty
        </p>
        <h1 className="font-display font-[300] text-[clamp(28px,4vw,40px)] text-ink mb-4 text-center">
          Prijava
        </h1>
        <p className="font-body font-[300] text-[14px] text-silver-dark leading-relaxed mb-10 text-center">
          Miris lavande na jastuku, prva kafa i ti — nastavi tamo gde si stao.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
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
              className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors"
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
              className="w-full border border-silver-light bg-transparent px-4 py-3 font-body font-[300] text-[14px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors"
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
