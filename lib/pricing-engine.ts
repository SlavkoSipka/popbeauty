/**
 * Centralized pricing engine for Pop Beauty.
 *
 * Waterfall:
 *   1. Subtotal = SUM(base_price * qty)
 *   2. Product discount (mutually exclusive):
 *      - Bundle 10% if BOTH slugs present
 *      - Site discount % otherwise (if > 0)
 *   3. Referral discount (per-creator customer_discount_percent) on top of #2
 *   4. Creator commission = commission_percent% of final total (handled outside this module)
 */

export const BUNDLE_DISCOUNT_PERCENT = 10;
export const BUNDLE_SLUGS = ['uljani-serum', 'vodeni-serum'] as const;

export type PricingLine = {
  slug: string;
  quantity: number;
  basePriceRsd: number;
};

export type PricingInput = {
  lines: PricingLine[];
  siteDiscountPercent: number;
  referralDiscountPercent: number;
};

export type PricingResult = {
  subtotalRsd: number;
  isBundle: boolean;
  discountType: 'site' | 'bundle' | null;
  discountPercent: number;
  discountAmountRsd: number;
  afterProductDiscountRsd: number;
  referralDiscountPercent: number;
  referralDiscountRsd: number;
  totalRsd: number;
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function computePricing(input: PricingInput): PricingResult {
  const { lines, siteDiscountPercent, referralDiscountPercent } = input;

  const subtotalRsd = round2(
    lines.reduce((sum, l) => sum + l.basePriceRsd * l.quantity, 0),
  );

  const slugsInCart = new Set(lines.filter((l) => l.quantity > 0).map((l) => l.slug));
  const isBundle = BUNDLE_SLUGS.every((s) => slugsInCart.has(s));

  let discountType: PricingResult['discountType'] = null;
  let discountPercent = 0;

  if (isBundle) {
    discountType = 'bundle';
    discountPercent = BUNDLE_DISCOUNT_PERCENT;
  } else if (siteDiscountPercent > 0) {
    discountType = 'site';
    discountPercent = siteDiscountPercent;
  }

  const discountAmountRsd = round2((subtotalRsd * discountPercent) / 100);
  const afterProductDiscountRsd = round2(subtotalRsd - discountAmountRsd);

  const appliedReferral = referralDiscountPercent > 0 ? referralDiscountPercent : 0;
  const referralDiscountRsd = round2((afterProductDiscountRsd * appliedReferral) / 100);
  const totalRsd = round2(afterProductDiscountRsd - referralDiscountRsd);

  return {
    subtotalRsd,
    isBundle,
    discountType,
    discountPercent,
    discountAmountRsd,
    afterProductDiscountRsd,
    referralDiscountPercent: appliedReferral,
    referralDiscountRsd,
    totalRsd,
  };
}
