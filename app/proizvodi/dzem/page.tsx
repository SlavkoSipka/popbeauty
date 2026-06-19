'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal } from '@/lib/animations';
import { useCart } from '@/lib/cart-context';
import { products, dzemMistSet } from '@/lib/data/products';
import { useProductViewContentPixel } from '@/lib/hooks/use-product-view-content-pixel';
import { parsePriceStringToRsd } from '@/lib/price';
import Button from '@/components/ui/Button';
import ProductPrice from '@/components/product/ProductPrice';
import ProductRatingStars from '@/components/product/ProductRatingStars';
import ProductDeliveryInfo from '@/components/product/ProductDeliveryInfo';
import TestimonialsSectionLazy from '@/components/sections/TestimonialsSectionLazy';

const product = products.find((p) => p.slug === 'dzem')!;
const fallbackRsd = parsePriceStringToRsd(product.price) ?? 0;

type Tab = 'opis' | 'sastojci' | 'upotreba';

export default function DzemPage() {
  useScrollReveal();
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>('opis');

  useProductViewContentPixel(product.slug, product.name, fallbackRsd);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'opis', label: 'Opis proizvoda' },
    { key: 'sastojci', label: 'Sastojci' },
    { key: 'upotreba', label: 'Način upotrebe' },
  ];

  return (
    <main className="pb-[min(200px,32vh)] md:pb-0">
      {/* Hero */}
      <section className="py-[80px] md:py-[84px] section-padding">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-8 md:gap-10">
            {/* Left — Images */}
            <div>
              <div data-reveal="true" className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-center scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 55vw"
                  priority
                />
              </div>
            </div>

            {/* Right — Info */}
            <div className="md:sticky md:top-24 md:self-start md:pl-8 lg:pl-16">
              <h1
                data-reveal="true"
                data-reveal-delay="150"
                className="font-display font-[300] text-[clamp(36px,5vw,40px)] text-ink mb-4"
              >
                {product.name}
              </h1>

              <div data-reveal="true" data-reveal-delay="200">
                <ProductRatingStars />
              </div>

              <div data-reveal="true" data-reveal-delay="250" className="mb-6">
                <ProductPrice slug={product.slug} fallbackPrice={product.price} />
              </div>

              {product.benefits.length > 0 ? (
                <div
                  data-reveal="true"
                  data-reveal-delay="300"
                  className="mb-6 flex flex-col gap-2.5"
                >
                  {product.benefits.map((label) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#A1A797]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FBFAED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                      </span>
                      <span className="font-body font-[400] text-[14px] text-ink md:text-[15px]">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}

              <div data-reveal="true" data-reveal-delay="350" className="mb-6">
                <Button
                  variant="nav"
                  fullWidth
                  className="h-[52px] !text-[15px] md:!text-[16px]"
                  onClick={() =>
                    addItem({
                      slug: product.slug,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })
                  }
                >
                  Dodaj u korpu
                </Button>
              </div>

              <ProductDeliveryInfo />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-[80px] md:py-[84px] bg-white section-padding">
        <div className="mx-auto max-w-[800px] px-6">
          <div data-reveal="true" className="flex flex-wrap gap-6 border-b border-silver-light mb-12 md:gap-10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-4 font-body text-[13px] uppercase tracking-[0.12em] transition-colors duration-200 md:text-[14px] ${
                  activeTab === tab.key
                    ? 'font-[600] text-ink border-b-2 border-ink -mb-[1px]'
                    : 'font-[400] text-silver-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div data-reveal="true" data-reveal-delay="100">
            {activeTab === 'opis' && (
              <div>
                <h2 className="font-body font-[600] text-[14px] uppercase tracking-[0.14em] text-ink mb-4 md:text-[15px]">
                  Marmelada za bronzani ten
                </h2>
                <p className="font-body font-[400] text-[16px] leading-[1.9] text-ink md:text-[16px]">
                  {product.fullDescription}
                </p>
              </div>
            )}

            {activeTab === 'sastojci' && (
              <div className="flex flex-col gap-8">
                {product.inci ? (
                  <div>
                    <h3 className="font-body font-[600] text-[13px] uppercase tracking-[0.12em] text-ink mb-3 md:text-[14px]">
                      INCI
                    </h3>
                    <p className="font-body font-[400] text-[15px] leading-[1.8] text-ink md:text-[16px]">
                      {product.inci}
                    </p>
                  </div>
                ) : null}
                <div>
                  <h3 className="font-body font-[600] text-[13px] uppercase tracking-[0.12em] text-ink mb-4 md:text-[14px]">
                    Sastav
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {product.ingredients.map((ing) => (
                      <li key={ing.name} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#A1A797]" />
                        <span className="font-body font-[500] text-[16px] text-ink md:text-[16px]">{ing.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'upotreba' && (
              <div className="flex flex-col gap-8">
                <p className="font-body font-[400] text-[16px] leading-[1.9] text-ink md:text-[16px]">
                  {product.howToUse}
                </p>
                {product.warning ? (
                  <div>
                    <h3 className="font-body font-[600] text-[13px] uppercase tracking-[0.12em] text-ink mb-3 md:text-[14px]">
                      Upozorenje
                    </h3>
                    <p className="font-body font-[400] text-[16px] leading-[1.9] text-ink md:text-[16px]">
                      {product.warning}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pairing */}
      <section className="py-[80px] md:py-[72px] section-padding">
        <div className="mx-auto max-w-[800px] px-6">
          <Link
            href={`/proizvodi/${dzemMistSet.slug}`}
            data-reveal="true"
            className="group block border-2 border-[#A1A797] bg-[#A1A797]/10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 transition-colors duration-200 hover:bg-[#A1A797]/20"
          >
            <div className="flex-1">
              <span className="mb-4 inline-block border border-[#A1A797] bg-[#A1A797] px-3 py-1 font-body font-[600] text-[11px] uppercase tracking-[0.16em] text-[#FBFAED]">
                Akcija
              </span>
              <h3 className="font-body font-[700] text-[22px] uppercase leading-[1.2] tracking-[0.02em] text-[#7d8473] mb-4 md:text-[22px]">
                Poruči Glow Marmeladu i Glow Mist zajedno i uštedi
              </h3>
              <span className="link-underline font-body font-[600] text-[12px] uppercase tracking-[0.14em] text-[#7d8473]">
                Pogledaj →
              </span>
            </div>
            <div className="relative w-full min-h-0 md:w-[200px] md:shrink-0 aspect-[3/4] overflow-hidden bg-white">
              <Image
                src={dzemMistSet.image}
                alt={dzemMistSet.name}
                fill
                className="object-cover object-center scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 200px"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* Reviews */}
      <TestimonialsSectionLazy />
    </main>
  );
}
