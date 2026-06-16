/**
 * Centralized pricing engine for Pop Beauty.
 *
 * Waterfall:
 *   1. Subtotal = SUM(base_price * qty)
 *   2. Product discount (mutually exclusive po liniji):
 *      - Bundle popust za svaki kompletan paket u korpi (vidi BUNDLE_DEFINITIONS),
 *        primenjen SAMO na linije tog paketa.
 *      - Inače: per-line % (line.discountPercent ?? siteDiscountPercent) za svaku liniju
 *        koja nije deo nijednog paketa.
 *   3. Referral discount (per-creator customer_discount_percent) on top of #2
 *   4. Promo kod (discount_codes) — procenat na iznos posle referral popusta
 *   5. Creator commission = commission_percent% of final total (handled outside this module)
 */

export type BundleDefinition = {
  id: string;
  slugs: readonly string[];
  /**
   * 'percent' — koristi bundleDiscountPercent iz site_settings (konfigurabilno u adminu).
   * 'fixed'   — fiksna cena za jedan kompletan komplet (fixedTotalRsd).
   */
  kind: 'percent' | 'fixed';
  /** Za kind 'fixed': ciljna cena jednog kompleta (jedan komad svakog slug-a). */
  fixedTotalRsd?: number;
};

/**
 * Definicije paketa. Poredak je bitan: veći/specifičniji paketi idu PRVI —
 * kad jedan paket zauzme svoje linije, preostali paketi koji dele te slug-ove se preskaču
 * (bez dvostrukog popusta).
 */
export const BUNDLE_DEFINITIONS: readonly BundleDefinition[] = [
  {
    id: 'pop-beauty-paket',
    slugs: ['uljani-serum', 'vodeni-serum', 'dzem', 'mist'],
    kind: 'fixed',
    fixedTotalRsd: 5950,
  },
  { id: 'serum-set', slugs: ['uljani-serum', 'vodeni-serum'], kind: 'percent' },
  { id: 'dzem-mist', slugs: ['dzem', 'mist'], kind: 'fixed', fixedTotalRsd: 2390 },
] as const;

/** Back-compat: originalni serum paket (uljani + vodeni). */
export const BUNDLE_SLUGS =
  BUNDLE_DEFINITIONS.find((d) => d.id === 'serum-set')?.slugs ??
  (['uljani-serum', 'vodeni-serum'] as const);

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
  /** Procenat paketnog popusta (iz site_settings) za pakete kind='percent'. */
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
  /** Izvor popusta: paket ili site/override. */
  source: 'bundle' | 'site';
  /** Za source='bundle': id paketa. */
  bundleId?: string;
};

export type BundleBreakdown = {
  id: string;
  slugs: string[];
  /** Ukupan iznos popusta tog paketa u RSD. */
  amountRsd: number;
  /** Reprezentativni procenat (za prikaz). */
  percent: number;
};

export type PricingResult = {
  subtotalRsd: number;
  isBundle: boolean;
  discountType: 'site' | 'bundle' | null;
  /**
   * Za bundle: reprezentativni paketni %. Za site mode: reprezentativni % (max efektivni % u korpi).
   * Za tačan prikaz po proizvodu koristi `lineDiscounts`.
   */
  discountPercent: number;
  discountAmountRsd: number;
  /** Popust po liniji (i bundle i site). */
  lineDiscounts: LineDiscount[];
  /** Sažetak po paketu (samo paketi koji su kompletni u korpi). */
  bundleBreakdown: BundleBreakdown[];
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

  const subtotalRsd = round2(lines.reduce((sum, l) => sum + l.basePriceRsd * l.quantity, 0));

  const lineBySlug = new Map(lines.map((l) => [l.slug, l]));
  const qtyOf = (slug: string) => {
    const l = lineBySlug.get(slug);
    return l && l.quantity > 0 ? l.quantity : 0;
  };

  const lineDiscounts: LineDiscount[] = [];
  const bundleBreakdown: BundleBreakdown[] = [];
  const bundledSlugs = new Set<string>();

  // ── 1) Paketni popusti (svaki kompletan paket, skopiran na svoje linije) ──
  for (const def of BUNDLE_DEFINITIONS) {
    const complete = def.slugs.every((s) => qtyOf(s) > 0);
    if (!complete) continue;
    // Preklapanje: ako je neki slug ovog paketa već zauzet drugim (ranijim) paketom, preskoči.
    if (def.slugs.some((s) => bundledSlugs.has(s))) continue;

    const defLines = def.slugs.map((s) => lineBySlug.get(s)!);
    const scopedSubtotal = round2(defLines.reduce((sum, l) => sum + l.basePriceRsd * l.quantity, 0));

    let bundleAmount = 0;
    const perLine: { slug: string; amount: number; gross: number }[] = [];

    if (def.kind === 'fixed' && def.fixedTotalRsd != null) {
      // n kompletnih kompleta; višak komada ostaje na punoj ceni.
      const n = Math.min(...def.slugs.map((s) => qtyOf(s)));
      const setBase = round2(defLines.reduce((sum, l) => sum + l.basePriceRsd, 0));
      const totalSetDiscount = round2(Math.max(0, n * (setBase - def.fixedTotalRsd)));
      bundleAmount = totalSetDiscount;
      // Raspodela popusta po liniji proporcionalno baznoj ceni komada.
      for (const l of defLines) {
        const gross = l.basePriceRsd * l.quantity;
        const share = setBase > 0 ? round2((totalSetDiscount * l.basePriceRsd) / setBase) : 0;
        perLine.push({ slug: l.slug, amount: share, gross });
      }
      // Korekcija zaokruživanja: poravnaj sumu na bundleAmount.
      const sumShares = round2(perLine.reduce((s, p) => s + p.amount, 0));
      const drift = round2(bundleAmount - sumShares);
      if (drift !== 0 && perLine.length > 0) perLine[0].amount = round2(perLine[0].amount + drift);
    } else {
      // 'percent' — primeni bundlePct na scoped subtotal.
      for (const l of defLines) {
        const gross = l.basePriceRsd * l.quantity;
        const amount = round2((gross * bundlePct) / 100);
        perLine.push({ slug: l.slug, amount, gross });
      }
      bundleAmount = round2(perLine.reduce((s, p) => s + p.amount, 0));
    }

    if (bundleAmount > 0.005) {
      for (const p of perLine) {
        const pct = p.gross > 0 ? round2((p.amount / p.gross) * 100) : 0;
        lineDiscounts.push({
          slug: p.slug,
          percent: pct,
          amountRsd: p.amount,
          source: 'bundle',
          bundleId: def.id,
        });
      }
      bundleBreakdown.push({
        id: def.id,
        slugs: [...def.slugs],
        amountRsd: bundleAmount,
        percent: scopedSubtotal > 0 ? round2((bundleAmount / scopedSubtotal) * 100) : 0,
      });
    }
    // Linije ovog paketa su obrađene (čak i ako je popust 0 — paket je kompletan).
    def.slugs.forEach((s) => bundledSlugs.add(s));
  }

  // ── 2) Per-line site/override popust za linije van paketa ──
  let siteMaxPct = 0;
  for (const l of lines) {
    if (l.quantity <= 0) continue;
    if (bundledSlugs.has(l.slug)) continue;
    const override = l.discountPercent;
    const pct = clampPct(override != null ? Number(override) : sitePct);
    if (pct <= 0) continue;
    const gross = l.basePriceRsd * l.quantity;
    const amount = round2((gross * pct) / 100);
    if (amount > 0.005) {
      lineDiscounts.push({ slug: l.slug, percent: pct, amountRsd: amount, source: 'site' });
      if (pct > siteMaxPct) siteMaxPct = pct;
    }
  }

  const hasBundle = bundleBreakdown.length > 0;
  const hasSite = lineDiscounts.some((d) => d.source === 'site');

  const discountAmountRsd = round2(lineDiscounts.reduce((s, d) => s + d.amountRsd, 0));

  let discountType: PricingResult['discountType'] = null;
  let discountPercent = 0;
  if (hasBundle) {
    discountType = 'bundle';
    // Reprezentativni %: max paketni % (ili pun udeo popusta nad subtotalom paketa).
    discountPercent = Math.max(...bundleBreakdown.map((b) => b.percent), 0);
  } else if (hasSite) {
    discountType = 'site';
    discountPercent = siteMaxPct;
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
    isBundle: hasBundle,
    discountType,
    discountPercent,
    discountAmountRsd,
    lineDiscounts,
    bundleBreakdown,
    afterProductDiscountRsd,
    referralDiscountPercent: appliedReferral,
    referralDiscountRsd,
    afterReferralRsd,
    promoDiscountPercent: appliedPromo,
    promoDiscountRsd,
    totalRsd,
  };
}
