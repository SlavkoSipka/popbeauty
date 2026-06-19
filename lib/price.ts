import type { CartLine } from '@/lib/cart-context';
import { products } from '@/lib/data/products';

const bySlug = new Map(products.map((p) => [p.slug, p]));

/** Stara cena za prikaz (precrtano) — naplata i dalje ide po base_price_rsd iz baze. */
const DISPLAY_COMPARE_AT_RSD: Record<string, number> = {
  dzem: 2190,
  mist: 890,
};

export function getDisplayCompareAtRsd(slug: string): number | null {
  return DISPLAY_COMPARE_AT_RSD[slug] ?? null;
}

/** Procenat popusta za prikaz (compare-at → prodajna cena), zaokruženo. */
export function getDisplayCompareAtDiscountPercent(
  compareAt: number,
  salePrice: number,
): number {
  if (compareAt <= salePrice) return 0;
  return Math.round(((compareAt - salePrice) / compareAt) * 100);
}

/** Parsira prikaz tipa "2.490,00 RSD" ili "48,00 KM" u iznos u RSD (broj). */
export function parsePriceStringToRsd(s: string): number | null {
  const t = s
    .replace(/\s*RSD\s*$/i, '')
    .replace(/\s*KM\s*$/i, '')
    .trim();
  const noThousands = t.replace(/\./g, '');
  const withDot = noThousands.replace(',', '.');
  const n = parseFloat(withDot);
  return Number.isFinite(n) ? n : null;
}

/** Format kao na sajtu: "2.490,00 RSD". */
export function formatRsd(amount: number): string {
  const formatted = new Intl.NumberFormat('sr-RS', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} RSD`;
}

/** Jedinična cena: koristi DB cenu ako je prosleđena, inače fallback na katalog. */
export function unitPriceRsdForLine(
  line: CartLine,
  dbPrices?: Map<string, number>,
): number {
  if (dbPrices) {
    const dbp = dbPrices.get(line.slug);
    if (dbp !== undefined) return dbp;
  }
  const catalog = bySlug.get(line.slug);
  if (catalog) {
    const n = parsePriceStringToRsd(catalog.price);
    if (n !== null) return n;
  }
  const n = parsePriceStringToRsd(line.price);
  return n ?? 0;
}

/** Tekst cene za jednu stavku. */
export function displayUnitPriceForLine(
  line: CartLine,
  dbPrices?: Map<string, number>,
): string {
  const n = unitPriceRsdForLine(line, dbPrices);
  return formatRsd(n);
}

export function lineSubtotalRsd(
  line: CartLine,
  dbPrices?: Map<string, number>,
): number {
  return unitPriceRsdForLine(line, dbPrices) * line.quantity;
}

/** Jedinična cena posle popusta (%). */
export function discountedUnitPriceRsd(base: number, percent: number): number {
  if (percent <= 0) return base;
  return Math.round(base * (1 - percent / 100) * 100) / 100;
}

export function cartTotalRsd(
  items: CartLine[],
  dbPrices?: Map<string, number>,
): number {
  return items.reduce((sum, line) => sum + lineSubtotalRsd(line, dbPrices), 0);
}

// ── DB product / settings types ──────────────────────────────

export type DbProduct = {
  slug: string;
  name: string;
  base_price_rsd: number;
  image_path: string;
  volume: string;
  /** Per-proizvod popust u %. NULL/undefined = koristi site_settings.site_discount_percent. */
  discount_percent?: number | null;
};

export type DbSiteSettings = {
  site_discount_percent: number;
  /** Posle migracije; ako nema u redu, tretira se kao 10. */
  bundle_discount_percent?: number;
};
