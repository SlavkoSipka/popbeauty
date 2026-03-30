'use client';

import { useMemo } from 'react';
import type { CartLineInput } from '@/lib/cart-context';
import { useCart } from '@/lib/cart-context';
import { formatRsd } from '@/lib/price';
import { computePricing } from '@/lib/pricing-engine';
import { usePricingData } from '@/lib/use-pricing-data';

type Props = {
  lineUljani: CartLineInput;
  lineVodeni: CartLineInput;
  /** npr. mb-0 u fixed baru */
  className?: string;
};

/**
 * Dugme ispod „Dodaj u korpu“: dodaje oba seruma (po 1) i prikazuje paketnu cenu i procenat.
 * Bez `data-reveal`: blok nastaje tek kad se učita pricing — inače useScrollReveal ga
 * nikad ne bi registrovao i ostao bi na opacity 0.
 */
export default function ProductBundleCta({ lineUljani, lineVodeni, className }: Props) {
  const { addBundlePair } = useCart();
  const { priceMap, siteDiscountPercent, bundleDiscountPercent, loaded } = usePricingData();

  const pricing = useMemo(() => {
    if (!loaded) return null;
    const pu = priceMap.get(lineUljani.slug);
    const pv = priceMap.get(lineVodeni.slug);
    if (pu === undefined || pv === undefined) return null;
    return computePricing({
      lines: [
        { slug: lineUljani.slug, quantity: 1, basePriceRsd: pu },
        { slug: lineVodeni.slug, quantity: 1, basePriceRsd: pv },
      ],
      siteDiscountPercent,
      bundleDiscountPercent,
      referralDiscountPercent: 0,
    });
  }, [
    loaded,
    priceMap,
    siteDiscountPercent,
    bundleDiscountPercent,
    lineUljani.slug,
    lineVodeni.slug,
  ]);

  if (!loaded || !pricing) return null;

  const bundlePct =
    pricing.discountType === 'bundle' ? pricing.discountPercent : bundleDiscountPercent;
  const ukupno = pricing.afterProductDiscountRsd;
  const imaPaketniPopust =
    pricing.discountType === 'bundle' && pricing.discountAmountRsd > 0.005;

  return (
    <div className={`opacity-100 ${className ?? 'mb-6'}`}>
      <button
        type="button"
        onClick={() => addBundlePair(lineUljani, lineVodeni)}
        className="group flex w-full min-h-[52px] flex-col items-center justify-center gap-1.5 border-2 border-[#1C1C1A] bg-[#E8EDE5] px-4 py-3.5 text-center text-[#1C1C1A] transition-colors duration-200 hover:bg-[#1C1C1A] hover:text-white"
      >
        <span className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] group-hover:text-white">
          Poruči oba
        </span>
        <span className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0">
          {imaPaketniPopust ? (
            <span className="font-body font-[300] text-[13px] text-[#9E9B94] line-through tabular-nums group-hover:text-white/75">
              {formatRsd(pricing.subtotalRsd)}
            </span>
          ) : null}
          <span className="font-display font-[400] text-[clamp(20px,4vw,24px)] tabular-nums leading-tight group-hover:text-white">
            {formatRsd(ukupno)}
          </span>
        </span>
        <span className="font-body font-[400] text-[10px] tracking-[0.08em] text-[#6B7D5E] normal-case group-hover:text-white/85">
          {bundlePct > 0 ? `Paket −${bundlePct}%` : 'Paket — oba seruma'}
        </span>
      </button>
    </div>
  );
}
