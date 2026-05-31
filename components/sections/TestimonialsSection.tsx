'use client';

import Image from 'next/image';
import { useRef } from 'react';

const images = [
  '/WhatsApp Image 2026-05-31 at 15.12.53.jpeg',
  '/WhatsApp Image 2026-05-31 at 15.13.04.jpeg',
  '/WhatsApp Image 2026-05-31 at 15.13.13.jpeg',
  '/WhatsApp Image 2026-05-31 at 15.13.25.jpeg',
  '/WhatsApp Image 2026-05-31 at 15.13.37.jpeg',
  '/WhatsApp Image 2026-05-31 at 15.13.50.jpeg',
  '/WhatsApp Image 2026-05-31 at 15.14.01.jpeg',
];

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section className="py-[120px] bg-white section-padding overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <span
              data-reveal="true"
              className="block font-body font-[400] text-[12px] uppercase tracking-[0.2em] text-silver-dark mb-4"
            >
              Iskustva
            </span>
            <h2
              data-reveal="true"
              data-reveal-delay="100"
              className="font-display font-[500] text-[clamp(32px,4vw,48px)] leading-[1.15] text-ink-soft"
            >
              Šta kažu naše korisnice
            </h2>
          </div>

          <div className="hidden shrink-0 gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Prethodno"
              className="flex h-11 w-11 items-center justify-center border border-silver-mid text-ink transition-colors hover:bg-[#A1A797] hover:border-[#A1A797] hover:text-[#FBFAED]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Sledeće"
              className="flex h-11 w-11 items-center justify-center border border-silver-mid text-ink transition-colors hover:bg-[#A1A797] hover:border-[#A1A797] hover:text-[#FBFAED]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))]"
      >
        {images.map((src, i) => (
          <div
            key={src}
            data-reveal="true"
            data-reveal-delay={String(Math.min(i, 4) * 80)}
            className="relative w-[240px] shrink-0 snap-start overflow-hidden border border-silver-light bg-off-white md:w-[280px]"
          >
            <Image
              src={src}
              alt={`Poruka korisnice ${i + 1}`}
              width={280}
              height={560}
              sizes="(max-width: 768px) 240px, 280px"
              loading="lazy"
              className="h-auto w-full object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
