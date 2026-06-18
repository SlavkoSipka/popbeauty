import type { CartLine } from '@/lib/cart-context';
import { dzemMistSet, popBeautyPaket, products, serumSet } from '@/lib/data/products';
import { parsePriceStringToRsd } from '@/lib/price';
import {
  BUNDLE_DEFINITIONS,
  computePricing,
  type PricingLine,
} from '@/lib/pricing-engine';

export type BundleMeta = {
  id: string;
  name: string;
  image: string;
  path: string;
  componentSlugs: readonly string[];
};

const BUNDLE_META: Record<string, BundleMeta> = {
  [serumSet.slug]: {
    id: serumSet.slug,
    name: serumSet.name,
    image: serumSet.image,
    path: `/proizvodi/${serumSet.slug}`,
    componentSlugs: [serumSet.uljaniSlug, serumSet.vodeniSlug],
  },
  [dzemMistSet.slug]: {
    id: dzemMistSet.slug,
    name: dzemMistSet.name,
    image: dzemMistSet.image,
    path: `/proizvodi/${dzemMistSet.slug}`,
    componentSlugs: [dzemMistSet.slugA, dzemMistSet.slugB],
  },
  [popBeautyPaket.slug]: {
    id: popBeautyPaket.slug,
    name: popBeautyPaket.name,
    image: popBeautyPaket.image,
    path: `/proizvodi/${popBeautyPaket.slug}`,
    componentSlugs: popBeautyPaket.slugs,
  },
};

export function isBundleSlug(slug: string): boolean {
  return slug in BUNDLE_META;
}

export function getBundleMeta(bundleId: string): BundleMeta | null {
  return BUNDLE_META[bundleId] ?? null;
}

export function getBundleComponentSlugs(bundleId: string): readonly string[] {
  const def = BUNDLE_DEFINITIONS.find((d) => d.id === bundleId);
  return def?.slugs ?? getBundleMeta(bundleId)?.componentSlugs ?? [];
}

export function getBundleFallbackPriceRsd(bundleId: string): number {
  const slugs = getBundleComponentSlugs(bundleId);
  return slugs.reduce((sum, slug) => {
    const p = products.find((x) => x.slug === slug);
    return sum + (parsePriceStringToRsd(p?.price ?? '') ?? 0);
  }, 0);
}

type ExpandOpts = {
  getBasePrice: (slug: string) => number;
  getDiscountPercent: (slug: string) => number | null | undefined;
};

function mergeIntoQtyMap(
  map: Map<string, number>,
  slug: string,
  qty: number,
) {
  if (qty <= 0) return;
  map.set(slug, (map.get(slug) ?? 0) + qty);
}

/**
 * Pretvara korpu (bundle + pojedinačne stavke) u linije za pricing engine.
 * Bundle komponente NISU spojene sa pojedinačnim stavkama: paket linije nose
 * `bundleId` tag (paketni popust), pojedinačne linije ostaju netaknute (normalna cena).
 * Koristi se uz `computePricing({ autoDetectBundles: false })`.
 */
export function expandCartToPricingLines(
  items: Pick<CartLine, 'slug' | 'quantity'>[],
  opts: ExpandOpts,
): PricingLine[] {
  const out: PricingLine[] = [];

  for (const item of items) {
    if (item.quantity <= 0) continue;
    if (isBundleSlug(item.slug)) {
      for (const componentSlug of getBundleComponentSlugs(item.slug)) {
        out.push({
          slug: componentSlug,
          quantity: item.quantity,
          basePriceRsd: opts.getBasePrice(componentSlug),
          discountPercent: opts.getDiscountPercent(componentSlug) ?? null,
          bundleId: item.slug,
        });
      }
    } else {
      out.push({
        slug: item.slug,
        quantity: item.quantity,
        basePriceRsd: opts.getBasePrice(item.slug),
        discountPercent: opts.getDiscountPercent(item.slug) ?? null,
      });
    }
  }

  return out;
}

export type BundleLinePrice = {
  subtotalRsd: number;
  afterDiscountRsd: number;
  unitPriceRsd: number;
  discountPercent: number;
};

/** Cena jedne bundle stavke u korpi (po kompletu paketa). */
export function getBundleLinePrice(
  bundleId: string,
  quantity: number,
  opts: ExpandOpts & {
    siteDiscountPercent: number;
    bundleDiscountPercent: number;
  },
): BundleLinePrice | null {
  if (quantity <= 0 || !isBundleSlug(bundleId)) return null;
  const componentSlugs = getBundleComponentSlugs(bundleId);
  if (componentSlugs.length === 0) return null;

  const lines: PricingLine[] = componentSlugs.map((slug) => ({
    slug,
    quantity,
    basePriceRsd: opts.getBasePrice(slug),
    discountPercent: opts.getDiscountPercent(slug) ?? null,
  }));

  const pricing = computePricing({
    lines,
    siteDiscountPercent: opts.siteDiscountPercent,
    bundleDiscountPercent: opts.bundleDiscountPercent,
    referralDiscountPercent: 0,
  });

  return {
    subtotalRsd: pricing.subtotalRsd,
    afterDiscountRsd: pricing.afterProductDiscountRsd,
    unitPriceRsd: pricing.afterProductDiscountRsd / quantity,
    discountPercent: pricing.discountPercent,
  };
}

export type ExpandableOrderLine = {
  slug: string;
  name: string;
  quantity: number;
  basePriceRsd: number;
  image: string;
  discountPercent: number | null;
  isBundle?: boolean;
  bundleId?: string;
};

type OrderProductLookup = (slug: string) => {
  name: string;
  basePriceRsd: number;
  image: string;
  discountPercent: number | null;
} | null;

/**
 * Expanduje bundle stavke u zasebne tagovane komponente za server pricing.
 * Paket komponente nose `bundleId`; pojedinačne stavke ostaju netaknute.
 * Koristi se uz `computePricing({ autoDetectBundles: false })`.
 */
export function expandOrderLinesForPricing(
  lines: ExpandableOrderLine[],
  getProduct: OrderProductLookup,
): ExpandableOrderLine[] {
  const out: ExpandableOrderLine[] = [];

  for (const line of lines) {
    if (line.quantity <= 0) continue;
    if (line.isBundle || isBundleSlug(line.slug)) {
      for (const componentSlug of getBundleComponentSlugs(line.slug)) {
        const product = getProduct(componentSlug);
        if (!product) continue;
        out.push({
          slug: componentSlug,
          name: product.name,
          quantity: line.quantity,
          basePriceRsd: product.basePriceRsd,
          image: product.image,
          discountPercent: product.discountPercent,
          bundleId: line.slug,
        });
      }
    } else {
      const product = getProduct(line.slug);
      if (!product) continue;
      out.push({
        slug: line.slug,
        name: product.name,
        quantity: line.quantity,
        basePriceRsd: product.basePriceRsd,
        image: product.image,
        discountPercent: product.discountPercent,
      });
    }
  }
  return out;
}

/** Spaja expandovane linije po slug-u za `line_items` (pakovanje/magacin). */
export function mergeOrderLinesForPacking(
  lines: ExpandableOrderLine[],
): ExpandableOrderLine[] {
  const qtyMap = new Map<string, number>();
  const meta = new Map<string, ExpandableOrderLine>();

  for (const line of lines) {
    if (line.quantity <= 0) continue;
    mergeIntoQtyMap(qtyMap, line.slug, line.quantity);
    if (!meta.has(line.slug)) meta.set(line.slug, line);
  }

  return [...qtyMap.entries()].map(([slug, quantity]) => {
    const m = meta.get(slug)!;
    return {
      slug,
      name: m.name,
      quantity,
      basePriceRsd: m.basePriceRsd,
      image: m.image,
      discountPercent: m.discountPercent,
    };
  });
}
