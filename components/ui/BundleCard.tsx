'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { type CartLineInput, useCart } from '@/lib/cart-context';
import { formatRsd } from '@/lib/price';
import { computePricing } from '@/lib/pricing-engine';
import { usePricingData } from '@/lib/use-pricing-data';

type Props = {
  bundleProducts: CartLineInput[];
  image: string;
  href: string;
  titleTop: string;
  titleBottom: string;
  alt?: string;
  badge?: string;
};

export default function BundleCard({ bundleProducts, image, href, titleTop, titleBottom, alt, badge }: Props) {
  const { addBundleItems } = useCart();
  const { priceMap, productDiscountMap, siteDiscountPercent, bundleDiscountPercent, loaded } =
    usePricingData();
  const slugsKey = bundleProducts.map((p) => p.slug).join(',');

  const pricing = useMemo(() => {
    if (!loaded) return null;
    const bases = bundleProducts.map((p) => priceMap.get(p.slug));
    if (bases.some((b) => b === undefined)) return null;
    return computePricing({
      lines: bundleProducts.map((p, i) => ({
        slug: p.slug,
        quantity: 1,
        basePriceRsd: bases[i] as number,
        discountPercent: productDiscountMap.get(p.slug) ?? null,
      })),
      siteDiscountPercent,
      bundleDiscountPercent,
      referralDiscountPercent: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, priceMap, productDiscountMap, siteDiscountPercent, bundleDiscountPercent, slugsKey]);

  const bundlePct = pricing ? Math.round(pricing.discountPercent) : 0;
  const total = pricing ? pricing.afterProductDiscountRsd : 0;

  return (
    <article className="group w-full bg-white p-3 text-left transition-transform duration-300 ease-out hover:-translate-y-1 md:p-4">
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-sage-pale md:aspect-square">
          {badge ? (
            <span className="absolute left-3 top-3 z-10 inline-flex items-center bg-[#A1A797] px-4 py-2 font-body font-[600] text-[12px] uppercase tracking-[0.2em] text-[#FBFAED] shadow-[0_4px_16px_rgba(28,28,26,0.22)] ring-1 ring-inset ring-white/30 md:left-4 md:top-4 md:px-5 md:py-2.5 md:text-[14px] md:tracking-[0.24em]">
              {badge}
            </span>
          ) : null}
          <Image
            src={image}
            alt={alt ?? `${titleTop} ${titleBottom}`}
            fill
            className="object-cover object-center scale-[1.04] transition-transform duration-500 ease-out group-hover:scale-[1.09]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="flex items-start justify-between gap-4 pt-4">
          <h3 className="font-display font-[500] text-[20px] leading-[1.15] text-ink md:text-[24px] [-webkit-text-stroke:0.4px_currentColor]">
            {titleTop}
            <br />
            {titleBottom}
          </h3>
          <div className="shrink-0 pt-1">
            {pricing ? (
              <div className="flex flex-col items-end gap-0.5">
                {bundlePct > 0 ? (
                  <span className="mr-1 font-body font-[500] text-[13px] text-silver-dark tabular-nums line-through md:text-[14px]">
                    {formatRsd(pricing.subtotalRsd)}
                  </span>
                ) : null}
                <div className="flex items-center gap-2">
                  <span className="font-body font-[500] text-[16px] text-ink tabular-nums md:text-[18px]">
                    {formatRsd(total)}
                  </span>
                  {bundlePct > 0 ? (
                    <span className="inline-flex items-center border border-sage-dark bg-sage-pale px-1.5 py-0.5 font-body font-[500] text-[10px] text-sage-dark tabular-nums md:text-[11px]">
                      −{bundlePct}%
                    </span>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => addBundleItems(bundleProducts)}
        className="mt-4 inline-flex w-full items-center justify-center border border-[#A1A797] bg-[#A1A797] px-4 py-3.5 font-body font-[400] text-[12px] uppercase tracking-[0.14em] text-[#FBFAED] transition-colors duration-200 ease-in-out hover:bg-transparent hover:text-[#A1A797] md:text-[13px]"
      >
        Dodaj u korpu
      </button>
    </article>
  );
}
