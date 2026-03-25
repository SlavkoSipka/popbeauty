'use client';

import { useState } from 'react';
import { useScrollReveal } from '@/lib/animations';
import { products } from '@/lib/data/products';
import Button from '@/components/ui/Button';

const faqs = [
  {
    q: 'Zašto se uljani serum nanosi prvi?',
    a: 'Uljani serum sadrži liposolubilne aktivne sastojke koji prodiru u dublje slojeve kože. Nanošenjem prvog, ti sastojci imaju neometani pristup koži. Vodeni serum se zatim nanosi preko uljnog, zaključavajući hidrataciju i dodajući hidrosolubilne aktivne sastojke.',
  },
  {
    q: 'Mogu li koristiti samo jedan serum?',
    a: 'Apsolutno. Svaki serum djeluje i samostalno. Međutim, puna sinergija se postiže korištenjem oba seruma zajedno u pravilnom redoslijedu.',
  },
  {
    q: 'Koliko proizvoda traje?',
    a: 'Uz preporučenu upotrebu (3-4 kapi uljnog i 2-3 pumpe vodenog seruma dnevno), svaki proizvod traje oko 2-3 mjeseca.',
  },
  {
    q: 'Da li je pogodno za osjetljivu kožu?',
    a: 'Da. Naše formule su testirane dermatološki i ne sadrže sintetičke mirise, parabene, silikone niti mineralna ulja. Preporučujemo patch test prije prve upotrebe.',
  },
  {
    q: 'Mogu li koristiti serume i ujutro i uveče?',
    a: 'Da, ritual je dizajniran za jutarnju i večernju rutinu. Ujutro pruža zaštitu i hidrataciju za dan, a uveče podržava prirodni proces obnove kože.',
  },
];

export default function RitualPage() {
  useScrollReveal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main>
      {/* Intro */}
      <section className="py-[120px] section-padding">
        <div className="mx-auto max-w-[700px] px-6 text-center">
          <span
            data-reveal="true"
            className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6"
          >
            Vaš dnevni ritual
          </span>
          <h1
            data-reveal="true"
            data-reveal-delay="100"
            className="font-display font-[300] text-[clamp(36px,5vw,56px)] leading-[1.1] text-ink mb-8"
          >
            Dvostepeni ritual za zdravu kožu
          </h1>
          <p
            data-reveal="true"
            data-reveal-delay="200"
            className="font-body font-[300] text-[16px] leading-[1.8] text-silver-dark"
          >
            Redoslijed nije slučajan. Uljni serum priprema kožu, vodeni zaključava hidrataciju.
            Dva proizvoda, jedan ritual, svaki dan — i ujutro i uveče.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-[120px] bg-sage-pale section-padding relative overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2
            data-reveal="true"
            className="font-display font-[300] text-[clamp(28px,4vw,40px)] text-ink-soft text-center mb-20"
          >
            Jutarnji ritual
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {products.map((p, i) => (
              <div key={p.slug} data-reveal="true" data-reveal-delay={String(i * 150)} className="relative">
                <span className="absolute -top-8 right-0 font-display font-[300] text-[160px] leading-none text-sage-light select-none pointer-events-none opacity-40">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative z-10 bg-white border border-silver-light p-8 md:p-10">
                  <span className="block font-body font-[400] text-[10px] uppercase tracking-[0.16em] text-sage-dark mb-2">
                    {p.stepLabel}
                  </span>
                  <h3 className="font-display font-[400] text-[28px] text-ink mb-4">{p.name}</h3>
                  <p className="font-body font-[300] text-[14px] leading-[1.7] text-silver-dark mb-6">
                    {p.slug === 'uljani-serum'
                      ? 'Nanesite 3-4 kapi na čistu kožu. Lagano umasirajte pokretima prema gore. Sačekajte 30 sekundi da se upije.'
                      : 'Nanesite 2-3 pumpe na lice i vrat. Lagano utisnite u kožu dlanovima. Ne trljajte.'}
                  </p>
                  <Button variant="outlined" href={`/proizvodi/${p.slug}`}>
                    Pogledaj proizvod
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* SVG connector line */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="120" height="2" viewBox="0 0 120 2">
              <line x1="0" y1="1" x2="120" y2="1" stroke="#D1DAC9" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>
      </section>

      {/* Evening note */}
      <section className="py-[80px] section-padding">
        <div className="mx-auto max-w-[700px] px-6 text-center">
          <h2
            data-reveal="true"
            className="font-display font-[300] text-[clamp(28px,4vw,40px)] text-ink-soft mb-6"
          >
            Večernji ritual
          </h2>
          <p
            data-reveal="true"
            data-reveal-delay="100"
            className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark"
          >
            Isti redoslijed, ista dva koraka. Uveče, vaša koža ulazi u fazu obnove — uljani serum
            podržava prirodnu regeneraciju, dok vodeni serum osigurava da koža ostane hidrirana
            tokom noći. Probudite se sa mekanom, odmornulom kožom.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-[120px] bg-off-white section-padding">
        <div className="mx-auto max-w-[700px] px-6">
          <h2
            data-reveal="true"
            className="font-display font-[300] text-[clamp(28px,4vw,40px)] text-ink-soft text-center mb-16"
          >
            Česta pitanja
          </h2>

          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div
                key={i}
                data-reveal="true"
                data-reveal-delay={String(i * 80)}
                className="border-b border-silver-light"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center py-6 text-left"
                >
                  <span className="font-body font-[400] text-[15px] text-ink pr-4">{faq.q}</span>
                  <span className={`text-silver-dark transition-transform duration-200 shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
                      <line x1="8" y1="2" x2="8" y2="14" />
                      <line x1="2" y1="8" x2="14" y2="8" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? 'max-h-[300px] pb-6' : 'max-h-0'
                  }`}
                >
                  <p className="font-body font-[300] text-[14px] leading-[1.7] text-silver-dark">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
