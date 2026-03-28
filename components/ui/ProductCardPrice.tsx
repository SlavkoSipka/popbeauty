'use client';

import { formatRsd } from '@/lib/price';
import { usePricingData } from '@/lib/use-pricing-data';

type Props = {
  slug: string;
  /** Prikaz iz kataloga dok se ne učita Supabase */
  fallbackPrice: string;
  /** Mobilni / uži blok koristi malo manju tipografiju */
  compact?: boolean;
};

/**
 * Cena na kartici proizvoda — ista logika kao ProductPrice: sajt popust iz DB;
 * paketni % kao kratka napomena ispod.
 */
export default function ProductCardPrice({ slug, fallbackPrice, compact }: Props) {
  const { priceMap, siteDiscountPercent, bundleDiscountPercent, loaded } = usePricingData();

  const sizeMain = compact
    ? 'text-[15px] md:text-[16px]'
    : 'text-[16px] md:text-[18px]';
  const sizeStrike = compact ? 'text-[11px] md:text-[12px]' : 'text-[12px] md:text-[13px]';
  const sizeBadge = 'text-[9px] md:text-[10px]';

  if (!loaded) {
    return (
      <span className={`font-body font-[400] text-ink ${sizeMain}`}>{fallbackPrice}</span>
    );
  }

  const basePrice = priceMap.get(slug);
  if (basePrice === undefined) {
    return (
      <span className={`font-body font-[400] text-ink ${sizeMain}`}>{fallbackPrice}</span>
    );
  }

  if (siteDiscountPercent > 0) {
    const discounted = Math.round(basePrice * (1 - siteDiscountPercent / 100) * 100) / 100;
    return (
      <div>
        <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5`}>
          <span className={`font-display font-[400] text-ink tabular-nums ${sizeMain}`}>
            {formatRsd(discounted)}
          </span>
          <span className={`font-body font-[300] text-silver-mid line-through tabular-nums ${sizeStrike}`}>
            {formatRsd(basePrice)}
          </span>
          <span
            className={`font-body font-[400] text-sage-mid uppercase tracking-[0.06em] ${sizeBadge}`}
          >
            −{siteDiscountPercent}%
          </span>
        </div>
        {bundleDiscountPercent > 0 ? (
          <p className="font-body font-[300] text-[9px] md:text-[10px] text-sage-mid/90 mt-1 leading-snug">
            Paket (oba seruma): −{bundleDiscountPercent}%
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <span className={`font-display font-[400] text-ink tabular-nums ${sizeMain}`}>
        {formatRsd(basePrice)}
      </span>
      {bundleDiscountPercent > 0 ? (
        <p className="font-body font-[300] text-[9px] md:text-[10px] text-silver-mid mt-1 leading-snug">
          Oba seruma: paket −{bundleDiscountPercent}%
        </p>
      ) : null}
    </div>
  );
}
