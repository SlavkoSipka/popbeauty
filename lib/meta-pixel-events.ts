import { computePricing, BUNDLE_SLUGS } from '@/lib/pricing-engine';
import { pixelTrack } from '@/lib/meta-pixel';
import { effectiveDiscountPercent, getCachedPricing } from '@/lib/use-pricing-data';

export function getLineValueRsd(slug: string, fallbackRsd: number): number {
  const p = getCachedPricing();
  if (!p?.loaded) return fallbackRsd;
  const base = p.priceMap.get(slug);
  if (base === undefined) return fallbackRsd;
  const pct = effectiveDiscountPercent(slug, p.productDiscountMap, p.siteDiscountPercent);
  return Math.round(base * (1 - pct / 100) * 100) / 100;
}

export function getBundleValueRsd(fallbackRsd: number): number {
  const p = getCachedPricing();
  if (!p?.loaded) return fallbackRsd;
  const [uljani, vodeni] = BUNDLE_SLUGS;
  const pu = p.priceMap.get(uljani);
  const pv = p.priceMap.get(vodeni);
  if (pu === undefined || pv === undefined) return fallbackRsd;
  const result = computePricing({
    lines: [
      {
        slug: uljani,
        quantity: 1,
        basePriceRsd: pu,
        discountPercent: p.productDiscountMap.get(uljani) ?? null,
      },
      {
        slug: vodeni,
        quantity: 1,
        basePriceRsd: pv,
        discountPercent: p.productDiscountMap.get(vodeni) ?? null,
      },
    ],
    siteDiscountPercent: p.siteDiscountPercent,
    bundleDiscountPercent: p.bundleDiscountPercent,
    referralDiscountPercent: 0,
  });
  return result.afterProductDiscountRsd;
}

type ViewContentParams = {
  contentIds: string[];
  contentName: string;
  value: number;
  contents?: { id: string; quantity: number }[];
};

export function trackViewContent(params: ViewContentParams) {
  pixelTrack('ViewContent', {
    content_ids: params.contentIds,
    content_name: params.contentName,
    content_type: 'product',
    value: params.value,
    currency: 'RSD',
    ...(params.contents?.length
      ? { contents: params.contents }
      : { contents: params.contentIds.map((id) => ({ id, quantity: 1 })) }),
  });
}

type AddToCartLine = { slug: string; name: string; quantity?: number };

export function trackAddToCart(lines: AddToCartLine[], valueRsd: number) {
  const qtyLines = lines.map((l) => ({ id: l.slug, quantity: l.quantity ?? 1 }));
  pixelTrack('AddToCart', {
    content_ids: lines.map((l) => l.slug),
    content_name: lines.map((l) => l.name).join(' + '),
    content_type: 'product',
    value: valueRsd,
    currency: 'RSD',
    contents: qtyLines,
    num_items: qtyLines.reduce((s, l) => s + l.quantity, 0),
  });
}
