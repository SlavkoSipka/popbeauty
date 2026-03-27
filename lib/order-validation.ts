import type { CartLine } from '@/lib/cart-context';
import { products } from '@/lib/data/products';
import type { DbProduct } from '@/lib/price';

const fallbackBySlug = new Map(products.map((p) => [p.slug, p]));

export type ParsedOrderLine = {
  slug: string;
  name: string;
  quantity: number;
  basePriceRsd: number;
  image: string;
};

/**
 * Parse + validate cart lines from the request body.
 * Uses DB products as source of truth; falls back to static catalog.
 */
export function parseCartLinesFromBody(
  raw: unknown,
  dbProducts?: DbProduct[],
): ParsedOrderLine[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const dbBySlug = dbProducts
    ? new Map(dbProducts.map((p) => [p.slug, p]))
    : null;

  const out: ParsedOrderLine[] = [];

  for (const row of raw) {
    if (!row || typeof row !== 'object') return null;
    const slug = (row as { slug?: unknown }).slug;
    const quantity = (row as { quantity?: unknown }).quantity;
    if (typeof slug !== 'string') return null;

    const dbP = dbBySlug?.get(slug);
    const staticP = fallbackBySlug.get(slug);
    if (!dbP && !staticP) return null;

    const q = typeof quantity === 'number' ? quantity : Number(quantity);
    if (!Number.isInteger(q) || q < 1 || q > 99) return null;

    out.push({
      slug,
      name: dbP?.name ?? staticP!.name,
      quantity: q,
      basePriceRsd: dbP?.base_price_rsd ?? 0,
      image: dbP?.image_path ?? staticP!.image,
    });
  }

  return out;
}

/** For backward compat — builds CartLine[] from parsed lines. */
export function toCartLines(lines: ParsedOrderLine[]): CartLine[] {
  return lines.map((l) => ({
    slug: l.slug,
    name: l.name,
    price: `${l.basePriceRsd}`,
    image: l.image,
    quantity: l.quantity,
  }));
}

export function normalizeReferralCode(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== 'string') return null;
  const t = raw.trim().toUpperCase().replace(/\s+/g, '');
  return t.length === 0 ? null : t;
}

const CREATOR_REFERRAL_MAX = 48;

/**
 * Validacija koda koje kreator unosi u panelu (samo slova, brojevi, crtica).
 * Vraća normalizovan kod ili poruku greške.
 */
export function validateCreatorReferralCodeInput(raw: string):
  | { ok: true; normalized: string }
  | { ok: false; error: string } {
  const normalized = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (normalized.length < 3) {
    return { ok: false, error: 'Kod mora imati bar 3 znaka.' };
  }
  if (normalized.length > CREATOR_REFERRAL_MAX) {
    return { ok: false, error: `Kod je predugačak (najviše ${CREATOR_REFERRAL_MAX} znakova).` };
  }
  if (!/^[A-Z0-9_-]+$/.test(normalized)) {
    return {
      ok: false,
      error: 'Dozvoljena su slova, brojevi, crtica (-) i donja crta (_).',
    };
  }
  return { ok: true, normalized };
}

/** Isti format kao referral (trim, uppercase, bez razmaka). */
export const normalizePromoCode = normalizeReferralCode;
