import { formatRsd } from '@/lib/price';

const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';
const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
/** Server env (preferred). PUBLIC fallback: isti rizik kao newsletter template u browseru. */
const orderTemplateId =
  process.env.EMAILJS_ORDER_TEMPLATE_ID?.trim() ||
  process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID?.trim() ||
  '';

const EMAILJS_SEND_URL = 'https://api.emailjs.com/api/v1.0/email/send';

export function isOrderEmailJsConfigured(): boolean {
  return Boolean(
    publicKey.length > 0 && serviceId.length > 0 && orderTemplateId.length > 0,
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type OrderEmailPayload = {
  orderId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
  note: string | null;
  referralCode: string | null;
  lineItems: Array<{ name: string; quantity: number; lineTotalRsd: number }>;
  subtotalRsd: number;
  totalRsd: number;
  discountType: 'site' | 'bundle' | null;
  discountPercent: number;
  discountAmountRsd: number;
  referralDiscountPercent: number;
  referralDiscountRsd: number;
};

/**
 * Šalje obaveštenje o novoj porudžbini (isti EmailJS nalog kao newsletter).
 * Ne baca grešku ako nije podešeno — pozivatelj može await bez try ako želi.
 */
export async function sendOrderNotificationEmail(payload: OrderEmailPayload): Promise<void> {
  if (!isOrderEmailJsConfigured()) {
    console.warn(
      '[emailjs-order] Preskačem slanje: nije kompletna konfiguracija (NEXT_PUBLIC_EMAILJS_PUBLIC_KEY, NEXT_PUBLIC_EMAILJS_SERVICE_ID, EMAILJS_ORDER_TEMPLATE_ID ili NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID).',
    );
    return;
  }

  const {
    orderId,
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    postal,
    note,
    referralCode,
    lineItems,
    subtotalRsd,
    totalRsd,
    discountType,
    discountPercent,
    discountAmountRsd,
    referralDiscountPercent,
    referralDiscountRsd,
  } = payload;

  const customer_full_name = `${firstName} ${lastName}`.trim();
  const full_address = `${address}, ${postal} ${city}`.trim();
  const note_display = note && note.length > 0 ? note : '—';
  const referral_display = referralCode && referralCode.length > 0 ? referralCode : '—';

  const line_items_text = lineItems
    .map(
      (l) =>
        `${l.name} × ${l.quantity} — ${formatRsd(l.lineTotalRsd)}`,
    )
    .join('\n');

  const line_items_html = [
    '<table role="presentation" cellpadding="8" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;max-width:480px;font-family:Georgia,serif;font-size:14px;color:#1C1C1A;">',
    '<thead><tr style="border-bottom:1px solid #C8C5BE;"><th align="left">Proizvod</th><th align="right">Kol.</th><th align="right">Iznos</th></tr></thead><tbody>',
    ...lineItems.map(
      (l) =>
        `<tr><td>${escapeHtml(l.name)}</td><td align="right">${l.quantity}</td><td align="right">${escapeHtml(formatRsd(l.lineTotalRsd))}</td></tr>`,
    ),
    '</tbody></table>',
  ].join('');

  let discount_line = '—';
  if (discountType && discountPercent > 0) {
    const label =
      discountType === 'bundle'
        ? `Paket popust −${discountPercent}%`
        : `Sajt popust −${discountPercent}%`;
    discount_line = `${label} (−${formatRsd(discountAmountRsd)})`;
  }

  let referral_line = '—';
  if (referralDiscountPercent > 0) {
    referral_line = `Promo kod / referral −${referralDiscountPercent}% (−${formatRsd(referralDiscountRsd)})`;
  }

  const order_date = new Date().toLocaleString('sr-RS', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const template_params: Record<string, string> = {
    order_id: orderId,
    customer_first_name: firstName,
    customer_last_name: lastName,
    customer_full_name,
    customer_email: email,
    customer_phone: phone,
    address_line: address,
    city,
    postal_code: postal,
    full_address,
    note: note_display,
    referral_code: referral_display,
    line_items_text,
    line_items_html,
    subtotal_rsd: formatRsd(subtotalRsd),
    discount_line,
    referral_line,
    total_rsd: formatRsd(totalRsd),
    order_date,
    site_name: 'Pop Beauty',
  };

  const res = await fetch(EMAILJS_SEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: orderTemplateId,
      user_id: publicKey,
      template_params,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`EmailJS order: ${res.status} ${text}`);
  }
}
