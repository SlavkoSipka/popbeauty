'use client';

import { formatRsd } from '@/lib/price';
import { effectiveDiscountPercent, usePricingData } from '@/lib/use-pricing-data';

type Props = {
  slug: string;
  /** Prikaz iz kataloga dok se ne učita Supabase */
  fallbackPrice: string;
  compact?: boolean;
};

export default function ProductCardPrice({ slug, fallbackPrice }: Props) {
  const { priceMap, productDiscountMap, siteDiscountPercent, loaded } = usePricingData();

  if (!loaded) {
    return (
      <span className="font-body font-[500] text-[16px] text-ink md:text-[18px]">{fallbackPrice}</span>
    );
  }

  const basePrice = priceMap.get(slug);
  if (basePrice === undefined) {
    return (
      <span className="font-body font-[500] text-[16px] text-ink md:text-[18px]">{fallbackPrice}</span>
    );
  }

  const effectivePct = effectiveDiscountPercent(slug, productDiscountMap, siteDiscountPercent);
  const displayPct = Math.round(effectivePct);

  if (effectivePct > 0) {
    const discounted = Math.round(basePrice * (1 - effectivePct / 100) * 100) / 100;
    return (
      <div className="flex flex-col items-end gap-0.5">
        <span className="mr-1 font-body font-[500] text-[13px] text-silver-dark tabular-nums line-through md:text-[14px]">
          {formatRsd(basePrice)}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-body font-[500] text-[16px] text-ink tabular-nums md:text-[18px]">
            {formatRsd(discounted)}
          </span>
          <span className="inline-flex items-center border border-sage-dark bg-sage-pale px-1.5 py-0.5 font-body font-[500] text-[10px] text-sage-dark tabular-nums md:text-[11px]">
            −{displayPct}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <span className="font-body font-[500] text-[16px] text-ink tabular-nums md:text-[18px]">
      {formatRsd(basePrice)}
    </span>
  );
}
