'use client';

import { formatRsd } from '@/lib/price';
import { effectiveDiscountPercent, usePricingData } from '@/lib/use-pricing-data';

type Props = {
  slug: string;
  fallbackPrice: string;
};

export default function ProductPrice({ slug, fallbackPrice }: Props) {
  const {
    priceMap,
    productDiscountMap,
    siteDiscountPercent,
    loaded,
  } = usePricingData();

  if (!loaded) {
    return (
      <span className="font-body font-[500] text-[24px] text-ink tabular-nums leading-none">{fallbackPrice}</span>
    );
  }

  const basePrice = priceMap.get(slug);
  if (basePrice === undefined) {
    return (
      <span className="font-body font-[500] text-[24px] text-ink tabular-nums leading-none">{fallbackPrice}</span>
    );
  }

  const effectivePct = effectiveDiscountPercent(slug, productDiscountMap, siteDiscountPercent);
  const displayPct = Math.round(effectivePct);

  if (effectivePct > 0) {
    const discounted = Math.round(basePrice * (1 - effectivePct / 100) * 100) / 100;
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-body font-[500] text-[24px] text-ink tabular-nums leading-none">
          {formatRsd(discounted)}
        </span>
        <span className="font-body font-[500] text-[18px] text-silver-dark line-through tabular-nums">
          {formatRsd(basePrice)}
        </span>
        <span className="inline-flex items-center border border-sage-dark bg-sage-pale px-2 py-1 font-body font-[600] text-[13px] text-sage-dark tabular-nums">
          −{displayPct}%
        </span>
      </div>
    );
  }

  return (
    <span className="font-body font-[500] text-[24px] text-ink tabular-nums leading-none">
      {formatRsd(basePrice)}
    </span>
  );
}
