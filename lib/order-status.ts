/** Vrednosti u koloni `orders.status` — plaćanje je pouzećem, status prati isporuku i naplatu. */
export const ORDER_STATUSES = ['poruceno', 'poslato', 'placeno', 'odbijeno'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  poruceno: 'Poručeno',
  poslato: 'Poslato',
  placeno: 'Plaćeno',
  odbijeno: 'Odbijeno',
};

/** Stari engleski statusi (pre migracije) — samo za prikaz ako još negde ostane. */
const LEGACY_STATUS_LABELS: Record<string, string> = {
  pending: 'Poručeno',
  processing: 'Poslato',
  shipped: 'Poslato',
  completed: 'Plaćeno',
  cancelled: 'Odbijeno',
};

export function formatOrderStatusLabel(status: string): string {
  if ((ORDER_STATUSES as readonly string[]).includes(status)) {
    return ORDER_STATUS_LABELS[status as OrderStatus];
  }
  return LEGACY_STATUS_LABELS[status] ?? status;
}

/** Za href="tel:..." — uklanja razmake i tipične separatore. */
export function telHref(phone: string): string {
  const t = phone.trim();
  if (!t) return '#';
  const compact = t.replace(/[\s\u00A0()/.-]/g, '');
  if (!compact) return '#';
  return `tel:${compact}`;
}
