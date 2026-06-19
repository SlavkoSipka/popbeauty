'use client';

import { formatRsd, getDisplayCompareAtDiscountPercent, getDisplayCompareAtRsd, parsePriceStringToRsd } from '@/lib/price';
import { effectiveDiscountPercent, usePricingData } from '@/lib/use-pricing-data';

type Props = {
  slug: string;
  /** Prikaz iz kataloga dok se ne učita Supabase */
  fallbackPrice: string;
  compact?: boolean;
};

export default function ProductCardPrice({ slug, fallbackPrice }: Props) {
  const { priceMap, productDiscountMap, siteDiscountPercent, loaded } = usePricingData();
  const compareAt = getDisplayCompareAtRsd(slug);

  if (!loaded) {
    if (compareAt != null) {
      const sale = parsePriceStringToRsd(fallbackPrice);
      if (sale != null) {
        const pct = getDisplayCompareAtDiscountPercent(compareAt, sale);
        return (
          <div className="flex flex-col items-end gap-0.5">
            <span className="mr-1 font-body font-[500] text-[13px] text-silver-dark tabular-nums line-through md:text-[14px] lg:text-[13px]">
              {formatRsd(compareAt)}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-body font-[500] text-[16px] text-ink tabular-nums md:text-[18px] lg:text-[16px]">
                {formatRsd(sale)}
              </span>
              {pct > 0 ? (
                <span className="inline-flex items-center border border-sage-dark bg-sage-pale px-1.5 py-0.5 font-body font-[500] text-[10px] text-sage-dark tabular-nums md:text-[11px]">
                  −{pct}%
                </span>
              ) : null}
            </div>
          </div>
        );
      }
    }
    return (
      <span className="font-body font-[500] text-[16px] text-ink md:text-[18px] lg:text-[16px]">{fallbackPrice}</span>
    );
  }

  const basePrice = priceMap.get(slug);
  if (basePrice === undefined) {
    return (
      <span className="font-body font-[500] text-[16px] text-ink md:text-[18px] lg:text-[16px]">{fallbackPrice}</span>
    );
  }

  if (compareAt != null && compareAt > basePrice) {
    const pct = getDisplayCompareAtDiscountPercent(compareAt, basePrice);
    return (
      <div className="flex flex-col items-end gap-0.5">
        <span className="mr-1 font-body font-[500] text-[13px] text-silver-dark tabular-nums line-through md:text-[14px] lg:text-[13px]">
          {formatRsd(compareAt)}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-body font-[500] text-[16px] text-ink tabular-nums md:text-[18px] lg:text-[16px]">
            {formatRsd(basePrice)}
          </span>
          {pct > 0 ? (
            <span className="inline-flex items-center border border-sage-dark bg-sage-pale px-1.5 py-0.5 font-body font-[500] text-[10px] text-sage-dark tabular-nums md:text-[11px]">
              −{pct}%
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  const effectivePct = effectiveDiscountPercent(slug, productDiscountMap, siteDiscountPercent);
  const displayPct = Math.round(effectivePct);

  if (effectivePct > 0) {
    const discounted = Math.round(basePrice * (1 - effectivePct / 100) * 100) / 100;
    return (
      <div className="flex flex-col items-end gap-0.5">
        <span className="mr-1 font-body font-[500] text-[13px] text-silver-dark tabular-nums line-through md:text-[14px] lg:text-[13px]">
          {formatRsd(basePrice)}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-body font-[500] text-[16px] text-ink tabular-nums md:text-[18px] lg:text-[16px]">
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
    <span className="font-body font-[500] text-[16px] text-ink tabular-nums md:text-[18px] lg:text-[16px]">
      {formatRsd(basePrice)}
    </span>
  );
}
