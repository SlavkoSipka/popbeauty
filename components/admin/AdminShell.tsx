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
      <div className="mx-auto max-w-[1280px] px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 pb-8 border-b border-silver-light">
          <div>
            <p className="font-body font-[300] text-[10px] uppercase tracking-[0.2em] text-silver-mid mb-1">
              Pop Beauty
            </p>
            <h1 className="font-display font-[300] text-[22px] text-ink">Admin panel</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2 md:gap-4">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch
                  className={`font-body font-[400] text-[11px] uppercase tracking-[0.12em] px-3 py-2 border transition-colors ${
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
              className="font-body font-[300] text-[11px] uppercase tracking-[0.12em] text-silver-mid hover:text-ink ml-0 md:ml-4"
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
