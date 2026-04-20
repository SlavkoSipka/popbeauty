'use client';

import { formatRsd } from '@/lib/price';
import { effectiveDiscountPercent, usePricingData } from '@/lib/use-pricing-data';

type Props = {
  slug: string;
  /** Prikaz iz kataloga dok se ne učita Supabase */
  fallbackPrice: string;
  /** Mobilni blok — uži prikaz cene (proporcionalno manji od desktop tela kartice) */
  compact?: boolean;
};

/**
 * Cena na kartici proizvoda — ista logika kao ProductPrice: popust iz DB (per-proizvod
 * override ili site fallback); paketni % kao kratka napomena ispod.
 */
export default function ProductCardPrice({ slug, fallbackPrice, compact }: Props) {
  const {
    priceMap,
    productDiscountMap,
    siteDiscountPercent,
    bundleDiscountPercent,
    loaded,
  } = usePricingData();

  const sizeMain = compact
    ? 'text-[17px] md:text-[16px]'
    : 'text-[16px] md:text-[18px]';
  const sizeStrike = compact ? 'text-[12px] md:text-[13px]' : 'text-[12px] md:text-[13px]';
  const sizeBadge = compact ? 'text-[10px] md:text-[11px]' : 'text-[9px] md:text-[10px]';
  const sizeBundleNote = compact ? 'text-[10px] md:text-[10px]' : 'text-[9px] md:text-[10px]';
  const fontMain = compact ? 'font-body font-[400]' : 'font-display font-[400]';

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

  const effectivePct = effectiveDiscountPercent(slug, productDiscountMap, siteDiscountPercent);
  const displayPct = Math.round(effectivePct);
  const bundleDisplay = Math.round(bundleDiscountPercent);

  if (effectivePct > 0) {
    const discounted = Math.round(basePrice * (1 - effectivePct / 100) * 100) / 100;
    return (
      <div>
        <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5`}>
          <span className={`${fontMain} text-ink tabular-nums ${sizeMain}`}>
            {formatRsd(discounted)}
          </span>
          <span className={`font-body font-[300] text-silver-mid line-through tabular-nums ${sizeStrike}`}>
            {formatRsd(basePrice)}
          </span>
          <span
            className={`font-body font-[400] text-sage-mid uppercase tracking-[0.06em] ${sizeBadge}`}
          >
            −{displayPct}%
          </span>
        </div>
        {bundleDiscountPercent > 0 ? (
          <p className={`font-body font-[300] ${sizeBundleNote} text-sage-mid/90 mt-1 leading-snug`}>
            Paket (oba seruma): −{bundleDisplay}%
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <span className={`${fontMain} text-ink tabular-nums ${sizeMain}`}>
        {formatRsd(basePrice)}
      </span>
      {bundleDiscountPercent > 0 ? (
        <p className={`font-body font-[300] ${sizeBundleNote} text-silver-mid mt-1 leading-snug`}>
          Oba seruma: paket −{bundleDisplay}%
        </p>
      ) : null}
    </div>
  );
}
