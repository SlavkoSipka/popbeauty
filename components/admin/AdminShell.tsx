'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const links = [
  { href: '/admin', label: 'Pregled' },
  { href: '/admin/porudzbine', label: 'Porudžbine' },
  { href: '/admin/kreatori', label: 'Kreatori' },
  { href: '/admin/finansije', label: 'Finansije' },
  { href: '/admin/kalkulator', label: 'Kalkulator' },
  { href: '/admin/zalihe', label: 'Zalihe' },
  { href: '/admin/podesavanja', label: 'Podešavanja' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.push('/prijava?next=/admin');
    router.refresh();
  };

  return (
    <div className="min-h-[70vh] bg-off-white border-t border-silver-light">
      <div className="mx-auto max-w-[1280px] px-4 py-5 md:px-6 md:py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6 mb-6 md:mb-10 pb-4 md:pb-8 border-b border-silver-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body font-[300] text-[10px] uppercase tracking-[0.2em] text-silver-mid mb-0.5">
                Pop Beauty
              </p>
              <h1 className="font-display font-[300] text-[18px] md:text-[22px] text-ink">Admin panel</h1>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="md:hidden font-body font-[300] text-[10px] uppercase tracking-[0.12em] text-silver-mid hover:text-ink"
            >
              Odjavi se
            </button>
          </div>
          <nav className="flex w-full max-w-full min-w-0 flex-wrap items-center gap-1.5 sm:gap-2 md:gap-2.5 md:w-auto md:flex-1 md:justify-end">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch
                  className={`inline-flex min-h-[2rem] items-center justify-center font-body font-[400] text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.08em] md:tracking-[0.12em] px-2 py-1.5 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 border transition-colors ${
                    active
                      ? 'border-ink bg-ink text-white'
                      : 'border-silver-light text-silver-dark hover:border-ink hover:text-ink'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="hidden min-h-[2rem] md:inline-flex items-center font-body font-[300] text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-silver-mid hover:text-ink md:ml-1"
            >
              Odjavi se
            </button>
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
