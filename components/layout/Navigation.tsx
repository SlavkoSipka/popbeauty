'use client';

import { useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/layout/BrandLogo';
import { useCart } from '@/lib/cart-context';

const navLinks = [
  { href: '/o-nama', label: 'O nama' },
  { href: '/ritual', label: 'Ritual' },
  { href: '/#proizvodi', label: 'Proizvodi' },
];

function CartNavButton({
  className = '',
  onBeforeOpen,
}: {
  className?: string;
  onBeforeOpen?: () => void;
}) {
  const { itemCount, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={() => {
        onBeforeOpen?.();
        openCart();
      }}
      className={`relative inline-flex items-center justify-center text-ink hover:opacity-70 transition-opacity ${className}`}
      aria-label={`Korpa${itemCount > 0 ? `, ${itemCount} stavki` : ''}`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 9V6a6 6 0 0 1 12 0v3" />
        <path d="M4 9h16l-1.2 12H5.2L4 9z" />
      </svg>
      {itemCount > 0 ? (
        <span className="absolute -top-1.5 -right-2 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ink px-[5px] font-body font-[500] text-[10px] leading-none text-white">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      ) : null}
    </button>
  );
}

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
          <div className="flex items-center gap-4 md:gap-5">
            <Link
              href="/prijava"
              className="hidden sm:inline-flex font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink-soft hover:text-ink transition-colors link-underline"
            >
              Prijava
            </Link>
            <CartNavButton />

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
          <Link
            href="/prijava"
            onClick={() => setMobileOpen(false)}
            className="font-body font-[400] text-[13px] uppercase tracking-[0.14em] text-ink-soft"
          >
            Prijava
          </Link>
          <div className="mt-4 pt-6 border-t border-silver-light flex items-center justify-between gap-4">
            <span className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              Korpa
            </span>
            <CartNavButton onBeforeOpen={() => setMobileOpen(false)} />
          </div>
        </div>
      </div>
    </>
  );
}
