import { computePricing } from '@/lib/pricing-engine';
import { getBundleComponentSlugs } from '@/lib/bundles';
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

export function getBundleValueRsd(bundleId: string, fallbackRsd: number): number {
  const p = getCachedPricing();
  if (!p?.loaded) return fallbackRsd;
  const meta = getBundleComponentSlugs(bundleId);
  if (meta.length === 0) return fallbackRsd;
  const bases = meta.map((s) => p.priceMap.get(s));
  if (bases.some((b) => b === undefined)) return fallbackRsd;
  const result = computePricing({
    lines: meta.map((slug, i) => ({
      slug,
      quantity: 1,
      basePriceRsd: bases[i] as number,
      discountPercent: p.productDiscountMap.get(slug) ?? null,
    })),
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
