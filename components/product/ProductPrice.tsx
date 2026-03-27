'use client';

import { formatRsd } from '@/lib/price';
import { usePricingData } from '@/lib/use-pricing-data';

type Props = {
  slug: string;
  fallbackPrice: string;
};

export default function ProductPrice({ slug, fallbackPrice }: Props) {
  const { priceMap, siteDiscountPercent, bundleDiscountPercent, loaded } = usePricingData();

  if (!loaded) {
    return (
      <span className="font-display font-[400] text-[28px] text-ink">{fallbackPrice}</span>
    );
  }

  const basePrice = priceMap.get(slug);
  if (basePrice === undefined) {
    return (
      <span className="font-display font-[400] text-[28px] text-ink">{fallbackPrice}</span>
    );
  }

  if (siteDiscountPercent > 0) {
    const discounted = Math.round(basePrice * (1 - siteDiscountPercent / 100) * 100) / 100;
    return (
      <div>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-display font-[400] text-[28px] text-ink">
            {formatRsd(discounted)}
          </span>
          <span className="font-body font-[300] text-[16px] text-silver-mid line-through">
            {formatRsd(basePrice)}
          </span>
          <span className="font-body font-[400] text-[12px] text-sage-mid uppercase tracking-[0.08em]">
            −{siteDiscountPercent}%
          </span>
        </div>
        <p className="font-body font-[300] text-[11px] text-sage-mid mt-1">
          Oba seruma zajedno? Paketni popust {bundleDiscountPercent}% na ukupnu cenu.
        </p>
      </div>
    );
  }

  return (
    <div>
      <span className="font-display font-[400] text-[28px] text-ink">
        {formatRsd(basePrice)}
      </span>
      <p className="font-body font-[300] text-[11px] text-silver-mid mt-1">
        Oba seruma zajedno? Paketni popust {bundleDiscountPercent}% na ukupnu cenu.
      </p>
    </div>
  );
}
