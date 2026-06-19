'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useScrollReveal } from '@/lib/animations';
import { useCart } from '@/lib/cart-context';
import { products, popBeautyPaket } from '@/lib/data/products';
import { useBundleViewContentPixel } from '@/lib/hooks/use-product-view-content-pixel';
import { parsePriceStringToRsd } from '@/lib/price';
import Button from '@/components/ui/Button';
import BundleProductPrice from '@/components/product/BundleProductPrice';
import ProductRatingStars from '@/components/product/ProductRatingStars';
import ProductDeliveryInfo from '@/components/product/ProductDeliveryInfo';
import BundleProductSections from '@/components/product/BundleProductSections';
import TestimonialsSectionLazy from '@/components/sections/TestimonialsSectionLazy';

const bundleDisplayOrder = ['vodeni-serum', 'uljani-serum', 'dzem', 'mist'] as const;
const setProducts = bundleDisplayOrder
  .map((slug) => products.find((p) => p.slug === slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));
const fallbackRsd = setProducts.reduce(
  (sum, p) => sum + (parsePriceStringToRsd(p.price) ?? 0),
  0,
);

type Tab = 'opis' | 'sastojci' | 'upotreba';

export default function PopBeautyPaketPage() {
  useScrollReveal();
  const { addBundle } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>('opis');

  useBundleViewContentPixel(popBeautyPaket.slug, popBeautyPaket.name, fallbackRsd);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'opis', label: 'Opis proizvoda' },
    { key: 'sastojci', label: 'Sastojci' },
    { key: 'upotreba', label: 'Način upotrebe' },
  ];

  const addSet = () => addBundle(popBeautyPaket.slug);

  return (
    <main className="pb-[min(200px,32vh)] md:pb-0">
      {/* Hero */}
      <section className="py-[80px] md:py-[84px] section-padding">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-8 md:gap-10">
            {/* Left — Image */}
            <div>
              <div data-reveal="true" className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                <Image
                  src={popBeautyPaket.image}
                  alt={popBeautyPaket.name}
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
                Pop Beauty paket
              </h1>

              <div data-reveal="true" data-reveal-delay="200">
                <ProductRatingStars />
              </div>

              <div
                data-reveal="true"
                data-reveal-delay="250"
                className="mb-6 flex flex-col gap-2.5"
              >
                {setProducts.map((product) => (
                  <div key={product.slug} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#A1A797]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FBFAED" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    </span>
                    <span className="font-body font-[400] text-[14px] text-ink md:text-[15px]">
                      {product.name} — {product.tagline.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>

              <div data-reveal="true" data-reveal-delay="300" className="mb-6">
                <BundleProductPrice slugs={popBeautyPaket.slugs} fallbackRsd={fallbackRsd} />
              </div>

              <div data-reveal="true" data-reveal-delay="350" className="mb-6">
                <Button
                  variant="nav"
                  fullWidth
                  className="h-[52px] !text-[15px] md:!text-[16px]"
                  onClick={addSet}
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
            <BundleProductSections
              activeTab={activeTab}
              bundleProducts={setProducts}
              intro={popBeautyPaket.fullDescription}
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <TestimonialsSectionLazy />
    </main>
  );
}
