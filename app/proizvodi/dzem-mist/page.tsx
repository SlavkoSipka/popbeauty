'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useScrollReveal } from '@/lib/animations';
import { useCart } from '@/lib/cart-context';
import { products, dzemMistSet } from '@/lib/data/products';
import { useBundleViewContentPixel } from '@/lib/hooks/use-product-view-content-pixel';
import { parsePriceStringToRsd } from '@/lib/price';
import Button from '@/components/ui/Button';
import BundleProductPrice from '@/components/product/BundleProductPrice';
import ProductRatingStars from '@/components/product/ProductRatingStars';
import ProductDeliveryInfo from '@/components/product/ProductDeliveryInfo';
import BundleProductSections from '@/components/product/BundleProductSections';
import TestimonialsSectionLazy from '@/components/sections/TestimonialsSectionLazy';

const dzem = products.find((p) => p.slug === dzemMistSet.slugA)!;
const mist = products.find((p) => p.slug === dzemMistSet.slugB)!;
const bundleProducts = [dzem, mist];
const fallbackRsd =
  (parsePriceStringToRsd(dzem.price) ?? 0) + (parsePriceStringToRsd(mist.price) ?? 0);

type Tab = 'opis' | 'sastojci' | 'upotreba';

export default function DzemMistPage() {
  useScrollReveal();
  const { addBundlePair } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>('opis');

  useBundleViewContentPixel([dzemMistSet.slugA, dzemMistSet.slugB], dzemMistSet.name, fallbackRsd);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'opis', label: 'Opis proizvoda' },
    { key: 'sastojci', label: 'Sastojci' },
    { key: 'upotreba', label: 'Način upotrebe' },
  ];

  const addSet = () =>
    addBundlePair(
      { slug: dzem.slug, name: dzem.name, price: dzem.price, image: dzem.image },
      { slug: mist.slug, name: mist.name, price: mist.price, image: mist.image },
    );

  return (
    <main className="pb-[min(200px,32vh)] md:pb-0">
      {/* Hero */}
      <section className="py-[80px] md:py-[120px] section-padding">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-8 md:gap-16">
            {/* Left — Image */}
            <div>
              <div data-reveal="true" className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                <Image
                  src={dzemMistSet.image}
                  alt={dzemMistSet.name}
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
                className="font-display font-[300] text-[clamp(36px,5vw,48px)] text-ink mb-4"
              >
                Glow Marmelada + Glow Mist
              </h1>

              <div data-reveal="true" data-reveal-delay="200">
                <ProductRatingStars />
              </div>

              <div data-reveal="true" data-reveal-delay="300" className="mb-6">
                <BundleProductPrice
                  slugs={[dzemMistSet.slugA, dzemMistSet.slugB]}
                  fallbackRsd={fallbackRsd}
                />
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
      <section className="py-[80px] md:py-[120px] bg-white section-padding">
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
              bundleProducts={bundleProducts}
              intro={dzemMistSet.fullDescription}
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <TestimonialsSectionLazy />
    </main>
  );
}
