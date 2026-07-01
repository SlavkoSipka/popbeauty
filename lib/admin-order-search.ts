import type { AdminOrderRow } from '@/components/admin/AdminPorudzbineClient';

/** Bez zareza i %/_ — lome PostgREST `.or()` i ILIKE. */
export function sanitizeOrderSearchTerm(raw: string): string {
  return raw.replace(/[%_,]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function orderSearchTokens(query: string): string[] {
  return sanitizeOrderSearchTerm(query)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

/** Parsira "1990", "1.990,00", "2390.50" u broj za upoređivanje cena. */
export function parseOrderSearchAmount(raw: string): number | null {
  const t = raw.trim().replace(/\s*RSD\s*$/i, '').trim();
  if (!t) return null;
  const normalized = t.replace(/\./g, '').replace(',', '.');
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : null;
}

function formatAmountForHaystack(n: number): string {
  return n.toFixed(2).replace('.', ',');
}

/** Svi podaci porudžbine kao jedan string za lokalno filtriranje. */
export function orderSearchHaystack(o: AdminOrderRow): string {
  const productsTotal =
    Number(o.total_rsd) -
    (o.shipping_rsd != null ? Number(o.shipping_rsd) : 0);

  const lineNames = Array.isArray(o.line_items)
    ? (o.line_items as { name?: string; slug?: string; quantity?: number }[])
        .map((li) => `${li.name ?? ''} ${li.slug ?? ''} ${li.quantity ?? ''}`)
        .join(' ')
    : typeof o.line_items === 'string'
      ? o.line_items
      : o.line_items != null
        ? JSON.stringify(o.line_items)
        : '';

  return [
    o.id,
    o.customer_first_name,
    o.customer_last_name,
    o.customer_email,
    o.customer_phone,
    o.address_line,
    o.city,
    o.postal_code,
    o.note,
    o.admin_notes,
    o.referral_code,
    o.promo_code,
    o.status,
    o.total_rsd,
    o.subtotal_rsd,
    o.shipping_rsd,
    productsTotal,
    formatAmountForHaystack(Number(o.total_rsd) || 0),
    formatAmountForHaystack(productsTotal),
    lineNames,
  ]
    .filter((v) => v != null && v !== '')
    .join(' ')
    .toLowerCase();
}

export function orderMatchesAllTokens(o: AdminOrderRow, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const haystack = orderSearchHaystack(o);
  return tokens.every((t) => haystack.includes(t));
}

/**
 * PostgREST `.or()` filter — koristi prvi token ili celu fraza.
 * Za više reči dodatno filtriramo u memoriji (`orderMatchesAllTokens`).
 */
export function buildOrdersOrFilter(query: string): string | null {
  const sanitized = sanitizeOrderSearchTerm(query);
  if (!sanitized) return null;

  const primary = sanitized.split(/\s+/)[0] ?? sanitized;
  const pattern = `%${primary}%`;

  const parts = [
    `customer_first_name.ilike.${pattern}`,
    `customer_last_name.ilike.${pattern}`,
    `customer_email.ilike.${pattern}`,
    `customer_phone.ilike.${pattern}`,
    `address_line.ilike.${pattern}`,
    `city.ilike.${pattern}`,
    `postal_code.ilike.${pattern}`,
    `note.ilike.${pattern}`,
    `admin_notes.ilike.${pattern}`,
    `referral_code.ilike.${pattern}`,
    `status.ilike.${pattern}`,
    `id.ilike.${pattern}`,
  ];

  const amount = parseOrderSearchAmount(sanitized);
  if (amount != null) {
    parts.push(`total_rsd.eq.${amount}`, `subtotal_rsd.eq.${amount}`);
    const rounded = Math.round(amount);
    if (rounded !== amount) {
      parts.push(`total_rsd.eq.${rounded}`, `subtotal_rsd.eq.${rounded}`);
    }
  }

  return parts.join(',');
}
