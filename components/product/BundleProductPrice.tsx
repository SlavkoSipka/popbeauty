'use client';

import { useMemo } from 'react';
import { formatRsd } from '@/lib/price';
import { computePricing } from '@/lib/pricing-engine';
import { usePricingData } from '@/lib/use-pricing-data';

type Props = {
  slugs: string[];
  fallbackRsd: number;
};

export default function BundleProductPrice({ slugs, fallbackRsd }: Props) {
  const { priceMap, productDiscountMap, siteDiscountPercent, bundleDiscountPercent, loaded } =
    usePricingData();
  const slugsKey = slugs.join(',');

  const pricing = useMemo(() => {
    if (!loaded) return null;
    const bases = slugs.map((s) => priceMap.get(s));
    if (bases.some((b) => b === undefined)) return null;
    return computePricing({
      lines: slugs.map((slug, i) => ({
        slug,
        quantity: 1,
        basePriceRsd: bases[i] as number,
        discountPercent: productDiscountMap.get(slug) ?? null,
      })),
      siteDiscountPercent,
      bundleDiscountPercent,
      referralDiscountPercent: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, priceMap, productDiscountMap, siteDiscountPercent, bundleDiscountPercent, slugsKey]);

  if (!pricing) {
    return (
      <span className="font-body font-[500] text-[24px] text-ink tabular-nums leading-none">
        {formatRsd(fallbackRsd)}
      </span>
    );
  }

  const pct = Math.round(pricing.discountPercent);
  const total = pricing.afterProductDiscountRsd;

  if (pct > 0) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-body font-[500] text-[24px] text-ink tabular-nums leading-none">
          {formatRsd(total)}
        </span>
        <span className="font-body font-[500] text-[18px] text-silver-dark line-through tabular-nums">
          {formatRsd(pricing.subtotalRsd)}
        </span>
        <span className="inline-flex items-center border border-sage-dark bg-sage-pale px-2 py-1 font-body font-[600] text-[13px] text-sage-dark tabular-nums">
          −{pct}%
        </span>
      </div>
    );
  }

  return (
    <span className="font-body font-[500] text-[24px] text-ink tabular-nums leading-none">
      {formatRsd(total)}
    </span>
  );
}
