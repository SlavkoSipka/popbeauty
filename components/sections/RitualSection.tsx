import Link from 'next/link';
import { products } from '@/lib/data/products';

export default function RitualSection() {
  return (
    <section className="py-[120px] bg-sage-pale section-padding relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 relative z-10">
        <div className="text-center mb-20">
          <span
            data-reveal="true"
            className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6"
          >
            Kako koristiti
          </span>
          <h2
            data-reveal="true"
            data-reveal-delay="100"
            className="font-display font-[300] text-[clamp(32px,4vw,48px)] text-ink-soft"
          >
            Ritual u dva koraka
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-4 items-start">
          {/* Step 1 */}
          <div data-reveal="true" className="relative">
            <span className="absolute -top-4 right-0 font-display font-[300] text-[160px] md:text-[200px] leading-none text-sage-light select-none pointer-events-none opacity-50">
              01
            </span>
            <div className="relative z-10">
              <span className="block font-body font-[400] text-[10px] uppercase tracking-[0.16em] text-sage-dark mb-4">
                {products[0].stepLabel}
              </span>
              <h3 className="font-display font-[400] text-[28px] text-ink mb-4">
                {products[0].name}
              </h3>
              <p className="font-body font-[300] text-[14px] leading-[1.7] text-silver-dark max-w-[360px] mb-4">
                Liposolubilni aktivni sastojci koji se nanose na čistu kožu. Uljana baza prodire duboko
                i priprema kožu za optimalnu apsorpciju vodenog seruma.
              </p>
              <span className="inline-block font-body font-[400] text-[10px] uppercase tracking-[0.14em] text-sage-dark border border-sage-mid px-3 py-1">
                {products[0].type}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            data-reveal="true"
            data-reveal-delay="100"
            className="hidden md:flex flex-col items-center justify-center self-center gap-3 px-6"
          >
            <div className="w-[1px] h-16 bg-sage-mid" />
            <span className="font-body font-[300] text-[10px] uppercase tracking-[0.16em] text-silver-dark -rotate-0">
              zatim
            </span>
            <div className="w-[1px] h-16 bg-sage-mid" />
          </div>
          <div className="md:hidden flex items-center justify-center gap-4 py-2">
            <div className="h-[1px] w-12 bg-sage-mid" />
            <span className="font-body font-[300] text-[10px] uppercase tracking-[0.16em] text-silver-dark">
              zatim
            </span>
            <div className="h-[1px] w-12 bg-sage-mid" />
          </div>

          {/* Step 2 */}
          <div data-reveal="true" data-reveal-delay="200" className="relative">
            <span className="absolute -top-4 right-0 font-display font-[300] text-[160px] md:text-[200px] leading-none text-sage-light select-none pointer-events-none opacity-50">
              02
            </span>
            <div className="relative z-10">
              <span className="block font-body font-[400] text-[10px] uppercase tracking-[0.16em] text-sage-dark mb-4">
                {products[1].stepLabel}
              </span>
              <h3 className="font-display font-[400] text-[28px] text-ink mb-4">
                {products[1].name}
              </h3>
              <p className="font-body font-[300] text-[14px] leading-[1.7] text-silver-dark max-w-[360px] mb-4">
                Hidrosolubilni aktivni sastojci koji privlače i zadržavaju vlagu.
                Nanosi se preko uljnog seruma za zaključavanje hidratacije.
              </p>
              <span className="inline-block font-body font-[400] text-[10px] uppercase tracking-[0.14em] text-sage-dark border border-sage-mid px-3 py-1">
                {products[1].type}
              </span>
            </div>
          </div>
        </div>

        <div data-reveal="true" data-reveal-delay="300" className="text-center mt-16">
          <Link
            href="/ritual"
            className="link-underline font-body font-[400] text-[12px] uppercase tracking-[0.14em] text-ink"
          >
            Saznaj više o ritualu →
          </Link>
        </div>
      </div>
    </section>
  );
}
