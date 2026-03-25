'use client';

import Link from 'next/link';
import BrandLogo from '@/components/layout/BrandLogo';

const footerNav = [
  { href: '/o-nama', label: 'O nama' },
  { href: '/ritual', label: 'Ritual' },
  { href: '/proizvodi/uljani-serum', label: 'Uljani serum' },
  { href: '/proizvodi/vodeni-serum', label: 'Vodeni serum' },
];

const footerSupport = [
  { href: '/ritual', label: 'FAQ' },
  { href: '/kontakt', label: 'Kontakt' },
  { href: '/kontakt', label: 'Dostava' },
];

export default function Footer() {
  return (
    <footer className="bg-off-white border-t border-silver-light">
      <div className="mx-auto max-w-[1280px] px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <BrandLogo variant="footer" className="mb-4" />
            <p className="font-body font-[300] text-[13px] leading-[1.7] text-silver-dark mb-6 max-w-[240px]">
              Prirodna kozmetika bazirana na čistim botaničkim sastojcima. Dva proizvoda. Jedan ritual.
            </p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="text-silver-dark hover:text-ink transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* Email */}
              <a href="#" aria-label="Email" className="text-silver-dark hover:text-ink transition-colors duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <polyline points="22,4 12,13 2,4" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigacija */}
          <div>
            <h4 className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-6">
              Navigacija
            </h4>
            <ul className="flex flex-col gap-3">
              {footerNav.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="link-underline font-body font-[300] text-[13px] text-silver-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Podrška */}
          <div>
            <h4 className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-6">
              Podrška
            </h4>
            <ul className="flex flex-col gap-3">
              {footerSupport.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="link-underline font-body font-[300] text-[13px] text-silver-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-6">
              Newsletter
            </h4>
            <p className="font-body font-[300] text-[13px] text-silver-dark mb-4">
              Prijavite se za novosti o proizvodima i savjete za njegu.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Email adresa"
                className="flex-1 border border-silver-light bg-transparent px-3 py-2 font-body font-[300] text-[13px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none transition-colors duration-200"
              />
              <button
                type="submit"
                className="border border-silver-light border-l-0 px-3 text-silver-dark hover:text-ink hover:border-ink transition-colors duration-200"
                aria-label="Prijavi se"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12,5 19,12 12,19" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-silver-light flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-body font-[300] text-[11px] text-silver-dark">
            © {new Date().getFullYear()} Pop Beauty. Sva prava zadržana.
          </span>
          <Link
            href="/kontakt"
            className="link-underline font-body font-[300] text-[11px] text-silver-dark"
          >
            Politika privatnosti
          </Link>
        </div>
      </div>
    </footer>
  );
}
