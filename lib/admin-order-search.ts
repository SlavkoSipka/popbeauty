import type { AdminOrderRow } from '@/components/admin/AdminPorudzbineClient';

/** Svi podaci porudžbine kao jedan string (client-side helper). */
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
    lineNames,
  ]
    .filter((v) => v != null && v !== '')
    .join(' ')
    .toLowerCase();
}
