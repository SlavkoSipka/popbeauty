import Link from 'next/link';
import BrandLogo from '@/components/layout/BrandLogo';

const footerNav = [
  { href: '/o-nama', label: 'O nama' },
  { href: '/ritual', label: 'Ritual' },
  { href: '/proizvodi/uljani-serum', label: 'Uljani serum' },
  { href: '/proizvodi/vodeni-serum', label: 'Vodeni serum' },
];

const CONTACT_PHONE_E164 = '+381613091583';
const CONTACT_PHONE_DISPLAY = '+381 61 309 1583';
const CONTACT_PHONE_DIGITS = '381613091583';

export default function Footer() {
  return (
    <footer className="bg-off-white border-t border-silver-light">
      <div className="mx-auto max-w-[1280px] px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10 lg:gap-16 md:items-start">
          {/* Brand */}
          <div className="md:max-w-[320px]">
            <BrandLogo variant="footer" className="mb-4" />
            <p className="font-body font-[300] text-[13px] leading-[1.7] text-silver-dark mb-6 max-w-[240px]">
              Prirodna kozmetika bazirana na čistim botaničkim sastojcima. Dva proizvoda. Jedan ritual.
            </p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/p.o.pbeauty/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram — Pop Beauty"
                className="text-silver-dark hover:text-ink transition-colors duration-200"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* Telefon */}
              <a
                href={`tel:${CONTACT_PHONE_E164}`}
                aria-label="Poziv"
                className="text-silver-dark hover:text-ink transition-colors duration-200"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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

          {/* Kontakt */}
          <div className="min-w-0">
            <h4 className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink mb-6">
              Kontakt
            </h4>
            <p className="font-body font-[300] text-[13px] text-silver-dark mb-3">
              <span className="text-ink">Kontakt: </span>
              <a
                href={`tel:${CONTACT_PHONE_E164}`}
                className="link-underline font-[400] text-ink tabular-nums"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </p>
            <p className="font-body font-[300] text-[12px] leading-[1.7] text-silver-dark mb-4">
              Možete nas kontaktirati putem WhatsApp-a, Vibera, SMS-a ili običnog poziva na isti broj.
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href={`https://wa.me/${CONTACT_PHONE_DIGITS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-body font-[300] text-[13px] text-silver-dark"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`viber://chat?number=${CONTACT_PHONE_DIGITS}`}
                  className="link-underline font-body font-[300] text-[13px] text-silver-dark"
                >
                  Viber
                </a>
              </li>
              <li>
                <a
                  href={`sms:${CONTACT_PHONE_E164}`}
                  className="link-underline font-body font-[300] text-[13px] text-silver-dark"
                >
                  SMS
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_PHONE_E164}`}
                  className="link-underline font-body font-[300] text-[13px] text-silver-dark"
                >
                  Običan poziv
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-silver-light flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-body font-[300] text-[11px] text-silver-dark">
            © {new Date().getFullYear()} Pop Beauty. Sva prava zadržana.
          </span>
          <span className="font-body font-[300] text-[11px] text-silver-dark">
            Politika privatnosti
          </span>
        </div>
      </div>
    </footer>
  );
}
