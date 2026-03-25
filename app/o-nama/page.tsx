'use client';

import { useScrollReveal } from '@/lib/animations';
import Link from 'next/link';

export default function ONamaPage() {
  useScrollReveal();

  return (
    <main>
      {/* Hero */}
      <section className="relative">
        <div className="aspect-[5/2] w-full bg-sage-light" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(28,28,26,0.5)] to-transparent p-6 md:p-16">
          <div className="mx-auto max-w-[1280px]">
            <h1
              data-reveal="true"
              className="font-display font-[300] text-[clamp(36px,5vw,64px)] text-white"
            >
              O nama
            </h1>
          </div>
        </div>
      </section>

      {/* Story sections */}
      <section className="py-[120px] section-padding">
        <div className="mx-auto max-w-[1280px] px-6">
          {/* Block 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <span
                data-reveal="true"
                className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6"
              >
                Naša priča
              </span>
              <h2
                data-reveal="true"
                data-reveal-delay="100"
                className="font-display font-[300] text-[clamp(28px,4vw,40px)] leading-[1.3] text-ink mb-6"
              >
                Počeli smo sa pitanjem: šta koža zaista treba?
              </h2>
              <p
                data-reveal="true"
                data-reveal-delay="200"
                className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark"
              >
                Umjesto beskonačne rutine od deset koraka, željeli smo stvoriti nešto
                jednostavno ali efektivno. Dva proizvoda koji rade u savršenoj sinergiji
                — uljani i vodeni serum koji zajedno pokrivaju sve potrebe zdrave kože.
                Bez marketinškog fluba, bez nepotrebnih koraka.
              </p>
            </div>
            <div data-reveal="true" data-reveal-delay="100" className="aspect-[4/3] bg-sage-pale" />
          </div>

          {/* Block 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <div data-reveal="true" className="order-2 md:order-1 aspect-[4/3] bg-off-white" />
            <div className="order-1 md:order-2">
              <span
                data-reveal="true"
                className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6"
              >
                Filozofija
              </span>
              <h2
                data-reveal="true"
                data-reveal-delay="100"
                className="font-display font-[300] text-[clamp(28px,4vw,40px)] leading-[1.3] text-ink mb-6"
              >
                Manje proizvoda, više rezultata
              </h2>
              <p
                data-reveal="true"
                data-reveal-delay="200"
                className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark"
              >
                Slow beauty nije trend — to je pristup. Svaki sastojak u našim formulama je pažljivo
                odabran, svaka koncentracija testirana. Ne pravimo proizvode da bismo punili police,
                već da bismo riješili konkretne potrebe kože na najčistiji mogući način.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="border-t border-silver-light pt-20">
            <h2
              data-reveal="true"
              className="font-display font-[300] text-[clamp(28px,4vw,40px)] text-ink-soft text-center mb-16"
            >
              Naše vrijednosti
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: 'Transparentnost',
                  text: 'Svaki sastojak ima razlog. Objavljujemo kompletne INCI liste i izvore svih sirovina.',
                },
                {
                  title: 'Jednostavnost',
                  text: 'Dva proizvoda, jedan ritual. Vjerujemo da efektivna njega ne mora biti komplikovana.',
                },
                {
                  title: 'Odgovornost',
                  text: 'Cruelty-free, veganski, bez sintetičkih mirisa. Ambalaža je reciklabilna i minimalna.',
                },
              ].map((v, i) => (
                <div key={v.title} data-reveal="true" data-reveal-delay={String(i * 100)}>
                  <h3 className="font-display font-[400] text-[24px] text-ink mb-4">{v.title}</h3>
                  <p className="font-body font-[300] text-[14px] leading-[1.7] text-silver-dark">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[80px] bg-sage-pale text-center section-padding">
        <div className="mx-auto max-w-[600px] px-6">
          <h2
            data-reveal="true"
            className="font-display font-[300] italic text-[clamp(28px,4vw,40px)] text-ink mb-6"
          >
            Upoznajte naš ritual
          </h2>
          <p
            data-reveal="true"
            data-reveal-delay="100"
            className="font-body font-[300] text-[15px] text-silver-dark mb-8"
          >
            Dva koraka za zdravu, sjajnu kožu — svaki dan.
          </p>
          <div data-reveal="true" data-reveal-delay="200">
            <Link
              href="/ritual"
              className="inline-flex items-center justify-center border border-ink bg-ink text-white px-6 py-[10px] font-body font-[400] text-[11px] uppercase tracking-[0.14em] hover:bg-transparent hover:text-ink transition-colors duration-200"
            >
              Saznaj više
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
