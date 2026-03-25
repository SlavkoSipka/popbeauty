'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import BrandLogo from '@/components/layout/BrandLogo';

const navLinks = [
  { href: '/o-nama', label: 'O nama' },
  { href: '/ritual', label: 'Ritual' },
  { href: '/proizvodi/uljani-serum', label: 'Proizvodi' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-silver-light bg-[rgba(250,250,248,0.92)] backdrop-blur-[8px]">
        <div className="mx-auto max-w-[1280px] px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <BrandLogo />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-underline font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink-soft"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Button variant="outlined" href="/proizvodi/uljani-serum">
                Kupi
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Otvori meni"
            >
              <span
                className={`block w-5 h-[1px] bg-ink transition-transform duration-200 ${mobileOpen ? 'rotate-45 translate-y-[3px]' : ''}`}
              />
              <span
                className={`block w-5 h-[1px] bg-ink transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block w-5 h-[1px] bg-ink transition-transform duration-200 ${mobileOpen ? '-rotate-45 -translate-y-[3px]' : ''}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[rgba(28,28,26,0.3)] transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile menu slide-in */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-white border-l border-silver-light transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-6">
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Zatvori meni"
            className="w-8 h-8 flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
              <line x1="1" y1="1" x2="15" y2="15" />
              <line x1="15" y1="1" x2="1" y2="15" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col px-8 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-body font-[400] text-[13px] uppercase tracking-[0.14em] text-ink-soft"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 pt-6 border-t border-silver-light">
            <Button variant="filled" href="/proizvodi/uljani-serum" fullWidth>
              Kupi
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
