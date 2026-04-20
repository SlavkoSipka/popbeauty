/**
 * Centralized pricing engine for Pop Beauty.
 *
 * Waterfall:
 *   1. Subtotal = SUM(base_price * qty)
 *   2. Product discount (mutually exclusive):
 *      - Bundle % if BOTH slugs present (bundle_discount_percent iz site_settings)
 *      - Inače: per-line % (line.discountPercent ?? siteDiscountPercent) za svaku liniju
 *   3. Referral discount (per-creator customer_discount_percent) on top of #2
 *   4. Promo kod (discount_codes) — procenat na iznos posle referral popusta
 *   5. Creator commission = commission_percent% of final total (handled outside this module)
 */

/** Slugovi koji čine paket (oba moraju biti u korpi sa qty > 0). */
export const BUNDLE_SLUGS = ['uljani-serum', 'vodeni-serum'] as const;

export type PricingLine = {
  slug: string;
  quantity: number;
  basePriceRsd: number;
  /** Override popusta za ovaj proizvod (u %). NULL/undefined = koristi siteDiscountPercent. */
  discountPercent?: number | null;
};

export type PricingInput = {
  lines: PricingLine[];
  siteDiscountPercent: number;
  /** Procenat paketnog popusta (iz site_settings) kad su oba seruma u korpi. */
  bundleDiscountPercent: number;
  referralDiscountPercent: number;
  /** Promo kod iz discount_codes (0 = nema). Primenjuje se na iznos posle referral popusta. */
  promoDiscountPercent?: number;
};

export type LineDiscount = {
  slug: string;
  /** Efektivni procenat primenjen na ovu liniju (može biti decimalan). */
  percent: number;
  /** Iznos popusta u RSD za ovu liniju (ukupno za qty). */
  amountRsd: number;
};

export type PricingResult = {
  subtotalRsd: number;
  isBundle: boolean;
  discountType: 'site' | 'bundle' | null;
  /**
   * Za bundle: paketni %. Za site mode: reprezentativni % (max efektivni % u korpi) —
   * koristi se za pojednostavljeni prikaz. Za tačan prikaz po proizvodu koristi `lineDiscounts`.
   */
  discountPercent: number;
  discountAmountRsd: number;
  /** Popust po liniji (samo za site mode; za bundle je prazan niz). */
  lineDiscounts: LineDiscount[];
  afterProductDiscountRsd: number;
  referralDiscountPercent: number;
  referralDiscountRsd: number;
  /** Iznos posle paket/sajt i posle referrala, pre promo koda */
  afterReferralRsd: number;
  promoDiscountPercent: number;
  promoDiscountRsd: number;
  totalRsd: number;
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

export function computePricing(input: PricingInput): PricingResult {
  const { lines, siteDiscountPercent, bundleDiscountPercent, referralDiscountPercent } = input;
  const sitePct = clampPct(Number(siteDiscountPercent) || 0);
  const bundlePct = clampPct(Number(bundleDiscountPercent) || 0);
  const promoDiscountPercent =
    input.promoDiscountPercent != null && input.promoDiscountPercent > 0
      ? input.promoDiscountPercent
      : 0;

  const subtotalRsd = round2(
    lines.reduce((sum, l) => sum + l.basePriceRsd * l.quantity, 0),
  );

  const slugsInCart = new Set(lines.filter((l) => l.quantity > 0).map((l) => l.slug));
  const isBundle = BUNDLE_SLUGS.every((s) => slugsInCart.has(s));

  let discountType: PricingResult['discountType'] = null;
  let discountPercent = 0;
  let discountAmountRsd = 0;
  let lineDiscounts: LineDiscount[] = [];

  if (isBundle) {
    discountType = 'bundle';
    discountPercent = bundlePct;
    discountAmountRsd = round2((subtotalRsd * bundlePct) / 100);
  } else {
    // Per-line popust: koristi override ako postoji, inače site %.
    let maxPct = 0;
    let totalDiscount = 0;
    const perLine: LineDiscount[] = [];
    for (const l of lines) {
      if (l.quantity <= 0) continue;
      const override = l.discountPercent;
      const pct = clampPct(override != null ? Number(override) : sitePct);
      const lineGross = l.basePriceRsd * l.quantity;
      const amount = round2((lineGross * pct) / 100);
      if (pct > 0) {
        perLine.push({ slug: l.slug, percent: pct, amountRsd: amount });
        totalDiscount += amount;
        if (pct > maxPct) maxPct = pct;
      }
    }
    if (totalDiscount > 0.005) {
      discountType = 'site';
      discountPercent = maxPct;
      discountAmountRsd = round2(totalDiscount);
      lineDiscounts = perLine;
    }
  }

  const afterProductDiscountRsd = round2(subtotalRsd - discountAmountRsd);

  const appliedReferral = referralDiscountPercent > 0 ? referralDiscountPercent : 0;
  const referralDiscountRsd = round2((afterProductDiscountRsd * appliedReferral) / 100);
  const afterReferralRsd = round2(afterProductDiscountRsd - referralDiscountRsd);

  const appliedPromo =
    promoDiscountPercent > 0 && promoDiscountPercent <= 100 ? promoDiscountPercent : 0;
  const promoDiscountRsd = round2((afterReferralRsd * appliedPromo) / 100);
  const totalRsd = round2(afterReferralRsd - promoDiscountRsd);

  return {
    subtotalRsd,
    isBundle,
    discountType,
    discountPercent,
    discountAmountRsd,
    lineDiscounts,
    afterProductDiscountRsd,
    referralDiscountPercent: appliedReferral,
    referralDiscountRsd,
    afterReferralRsd,
    promoDiscountPercent: appliedPromo,
    promoDiscountRsd,
    totalRsd,
  };
}
