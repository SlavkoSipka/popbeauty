'use client';

import { useMemo } from 'react';
import { formatRsd } from '@/lib/price';
import { computePricing } from '@/lib/pricing-engine';
import { usePricingData } from '@/lib/use-pricing-data';

type Props = {
  uljaniSlug: string;
  vodeniSlug: string;
  fallbackRsd: number;
};

export default function BundleProductPrice({ uljaniSlug, vodeniSlug, fallbackRsd }: Props) {
  const { priceMap, productDiscountMap, siteDiscountPercent, bundleDiscountPercent, loaded } =
    usePricingData();

  const pricing = useMemo(() => {
    if (!loaded) return null;
    const pu = priceMap.get(uljaniSlug);
    const pv = priceMap.get(vodeniSlug);
    if (pu === undefined || pv === undefined) return null;
    return computePricing({
      lines: [
        { slug: uljaniSlug, quantity: 1, basePriceRsd: pu, discountPercent: productDiscountMap.get(uljaniSlug) ?? null },
        { slug: vodeniSlug, quantity: 1, basePriceRsd: pv, discountPercent: productDiscountMap.get(vodeniSlug) ?? null },
      ],
      siteDiscountPercent,
      bundleDiscountPercent,
      referralDiscountPercent: 0,
    });
  }, [loaded, priceMap, productDiscountMap, siteDiscountPercent, bundleDiscountPercent, uljaniSlug, vodeniSlug]);

  if (!pricing) {
    return (
      <span className="font-body font-[500] text-[24px] text-ink tabular-nums leading-none">
        {formatRsd(fallbackRsd)}
      </span>
    );
  }

  const pct =
    pricing.discountType === 'bundle'
      ? Math.round(pricing.discountPercent)
      : Math.round(bundleDiscountPercent);
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
