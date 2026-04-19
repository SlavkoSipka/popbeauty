'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useScrollReveal } from '@/lib/animations';
import { useCart } from '@/lib/cart-context';
import { products } from '@/lib/data/products';
import { pixelTrack } from '@/lib/meta-pixel';
import { parsePriceStringToRsd } from '@/lib/price';
import { testimonials } from '@/lib/data/testimonials';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ReviewCard from '@/components/ui/ReviewCard';
import ProductPrice from '@/components/product/ProductPrice';
import ProductBundleCta from '@/components/product/ProductBundleCta';
import ProductPageStickyCtas from '@/components/product/ProductPageStickyCtas';

const product = products[1];
const otherProduct = products[0];
const productReviews = testimonials.filter(
  (t) => t.product === 'Vodeni serum' || t.product === 'Oba seruma'
).slice(0, 3);

type Tab = 'opis' | 'sastojci' | 'upotreba';

export default function VodeniSerumPage() {
  useScrollReveal();
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState<Tab>('opis');

  useEffect(() => {
    pixelTrack('ViewContent', {
      content_ids: [product.slug],
      content_name: product.name,
      content_type: 'product',
      value: parsePriceStringToRsd(product.price) ?? 0,
      currency: 'RSD',
    });
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'opis', label: 'Opis' },
    { key: 'sastojci', label: 'Sastojci' },
    { key: 'upotreba', label: 'Kako koristiti' },
  ];

  return (
    <main className="pb-[min(200px,32vh)] md:pb-0">
      {/* Hero */}
      <section className="py-[80px] md:py-[120px] section-padding">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-8 md:gap-16">
            {/* Left — Images */}
            <div>
              <div data-reveal="true" className="relative aspect-[3/4] w-full overflow-hidden bg-sage-pale">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 100vw, 55vw"
                  priority
                />
              </div>
            </div>

            {/* Right — Info */}
            <div className="md:sticky md:top-24 md:self-start md:pl-8 lg:pl-16">
              <nav data-reveal="true" className="mb-6">
                <span className="font-body font-[300] text-[11px] text-silver-mid">
                  <Link href="/" className="link-underline">Početna</Link>
                  {' / '}
                  <Link href="/proizvodi/vodeni-serum" className="link-underline">Proizvodi</Link>
                  {' / '}
                  <span className="text-ink-soft">Vodeni serum</span>
                </span>
              </nav>

              <div data-reveal="true" data-reveal-delay="100" className="mb-4">
                <Badge variant="outlined">{product.volume}</Badge>
              </div>

              <h1
                data-reveal="true"
                data-reveal-delay="150"
                className="font-display font-[300] text-[clamp(36px,5vw,48px)] text-ink mb-3"
              >
                {product.name}
              </h1>

              <p
                data-reveal="true"
                data-reveal-delay="200"
                className="font-display font-[300] italic text-[20px] text-silver-dark mb-6"
              >
                {product.tagline}
              </p>

              <div data-reveal="true" data-reveal-delay="250" className="w-full h-[1px] bg-silver-light mb-6" />

              <div data-reveal="true" data-reveal-delay="300" className="mb-6">
                <ProductPrice slug={product.slug} fallbackPrice={product.price} />
              </div>

              <p
                data-reveal="true"
                data-reveal-delay="350"
                className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark mb-8"
              >
                {product.description}
              </p>

              <ProductPageStickyCtas>
                <div className="md:mb-6">
                  <Button
                    variant="filled"
                    fullWidth
                    className="h-[52px]"
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

                <ProductBundleCta
                  className="mb-0 md:mb-6"
                  lineUljani={{
                    slug: products[0].slug,
                    name: products[0].name,
                    price: products[0].price,
                    image: products[0].image,
                  }}
                  lineVodeni={{
                    slug: products[1].slug,
                    name: products[1].name,
                    price: products[1].price,
                    image: products[1].image,
                  }}
                />
              </ProductPageStickyCtas>

              <div
                data-reveal="true"
                data-reveal-delay="450"
                className="mt-8 flex gap-6 justify-center md:mt-0"
              >
                {['Prirodno', 'Vegan', 'Cruelty-free'].map((label) => (
                  <div key={label} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sage-dark">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                    <span className="font-body font-[300] text-[11px] uppercase tracking-[0.1em] text-silver-dark">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-[80px] md:py-[120px] bg-off-white section-padding">
        <div className="mx-auto max-w-[800px] px-6">
          <div data-reveal="true" className="flex gap-8 border-b border-silver-light mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-4 font-body font-[400] text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'text-ink border-b-2 border-ink -mb-[1px]'
                    : 'text-silver-mid'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div data-reveal="true" data-reveal-delay="100">
            {activeTab === 'opis' && (
              <div className="font-display font-[300] text-[17px] leading-[1.9] text-ink">
                <p>{product.fullDescription}</p>
                <ul className="mt-8 space-y-3">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-sage-mid mt-2.5 shrink-0" />
                      <span className="font-body font-[300] text-[15px] text-ink-soft">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'sastojci' && (
              <div>
                <div className="space-y-6 mb-10">
                  {product.ingredients.map((ing) => (
                    <div key={ing.name} className="border-b border-silver-light pb-6 last:border-0">
                      <div className="flex items-baseline gap-3 mb-2">
                        <h4 className="font-display font-[400] text-[18px] text-ink">{ing.name}</h4>
                        {ing.latin && (
                          <span className="font-body font-[300] italic text-[12px] text-silver-mid">{ing.latin}</span>
                        )}
                      </div>
                      <p className="font-body font-[300] text-[14px] text-silver-dark leading-[1.7]">{ing.benefit}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-silver-light pt-8">
                  <span className="block font-body font-[400] text-[10px] uppercase tracking-[0.16em] text-silver-dark mb-3">
                    INCI
                  </span>
                  <p className="font-body font-[300] text-[12px] leading-[1.9] text-silver-mid">
                    {product.inci}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'upotreba' && (
              <div className="font-body font-[300] text-[15px] leading-[1.9] text-ink-soft">
                <p>{product.howToUse}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pairing */}
      <section className="py-[80px] md:py-[100px] section-padding">
        <div className="mx-auto max-w-[800px] px-6">
          <div data-reveal="true" className="border border-silver-light p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-3">
                Savršen par
              </span>
              <h3 className="font-display font-[300] text-[24px] text-ink mb-2">
                Ovaj serum se savršeno kombinuje sa
              </h3>
              <p className="font-display font-[400] text-[20px] text-ink-soft mb-4">
                {otherProduct.name}
              </p>
              <p className="font-body font-[300] text-[14px] text-silver-dark leading-[1.7] mb-6">
                {otherProduct.description}
              </p>
              <Link
                href={`/proizvodi/${otherProduct.slug}`}
                className="link-underline font-body font-[400] text-[12px] uppercase tracking-[0.14em] text-ink"
              >
                Pogledaj →
              </Link>
            </div>
            <div className="relative w-full min-h-0 md:w-[200px] md:shrink-0 aspect-[3/4] overflow-hidden bg-sage-pale">
              <Image
                src="/zuti.webp"
                alt={otherProduct.name}
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 200px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-[80px] md:py-[120px] bg-white section-padding">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2
            data-reveal="true"
            className="font-display font-[300] text-[clamp(28px,4vw,40px)] text-ink-soft text-center mb-16"
          >
            Iskustva korisnica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {productReviews.map((t, i) => (
              <div key={t.name} data-reveal="true" data-reveal-delay={String(i * 100)}>
                <ReviewCard quote={t.quote} name={t.name} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
