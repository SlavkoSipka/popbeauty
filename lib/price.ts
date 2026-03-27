import type { CartLine } from '@/lib/cart-context';
import { products } from '@/lib/data/products';

const bySlug = new Map(products.map((p) => [p.slug, p]));

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
};

export type DbSiteSettings = {
  site_discount_percent: number;
};
