'use client';

import Link from 'next/link';
import { useScrollReveal } from '@/lib/animations';

export default function ZahvalnicaPage() {
  useScrollReveal();

  return (
    <main>
      <section className="py-[80px] md:py-[120px] section-padding min-h-[60vh] flex items-center">
        <div className="mx-auto max-w-[560px] px-6 w-full text-center">
          <span
            data-reveal="true"
            className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6"
          >
            Pop Beauty
          </span>
          <div
            data-reveal="true"
            data-reveal-delay="100"
            className="border border-silver-light py-14 md:py-16 px-6"
          >
            <h1 className="font-display font-[300] text-[clamp(28px,4vw,36px)] text-ink mb-5">
              Hvala na porudžbini
            </h1>
            <p className="font-body font-[300] text-[15px] leading-[1.85] text-silver-dark mb-2">
              Primili smo vaše podatke.
            </p>
            <p className="font-body font-[300] text-[15px] leading-[1.85] text-ink mb-8">
              Pozvaćemo vas da potvrdimo porudžbinu u narednih 24 sata.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-ink bg-ink text-white px-6 py-[10px] font-body font-[400] text-[11px] uppercase tracking-[0.14em] hover:bg-transparent hover:text-ink transition-colors duration-200"
            >
              Nazad na početnu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
