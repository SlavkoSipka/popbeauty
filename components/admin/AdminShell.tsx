'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const links = [
  { href: '/admin', label: 'Pregled' },
  { href: '/admin/porudzbine', label: 'Porudžbine' },
  { href: '/admin/kreatori', label: 'Kreatori' },
  { href: '/admin/podesavanja', label: 'Podešavanja' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.push('/admin/prijava');
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
          <nav className="flex items-center gap-1.5 md:gap-4 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch
                  className={`shrink-0 font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.1em] md:tracking-[0.12em] px-2.5 py-1.5 md:px-3 md:py-2 border transition-colors ${
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
              className="hidden md:inline-flex shrink-0 font-body font-[300] text-[11px] uppercase tracking-[0.12em] text-silver-mid hover:text-ink ml-4"
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
