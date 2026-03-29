import emailjs, { EmailJSResponseStatus } from '@emailjs/nodejs';
import { formatRsd } from '@/lib/price';

const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '';
const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '';
/** Server env (preferred). PUBLIC fallback ako hosting ne učitava server-only varijable. */
const orderTemplateId =
  process.env.EMAILJS_ORDER_TEMPLATE_ID?.trim() ||
  process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID?.trim() ||
  '';

const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim() ?? '';

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

async function sendOnce(
  templateParams: Record<string, string>,
): Promise<void> {
  await emailjs.send(serviceId, orderTemplateId, templateParams, {
    publicKey,
    ...(privateKey ? { privateKey } : {}),
    /** Bez ovoga SDK može vratiti 429 pri više porudžbina sa iste instance. */
    limitRate: { throttle: 0 },
  });
}

/**
 * Šalje obaveštenje o novoj porudžbini preko zvaničnog EmailJS Node SDK-a.
 * @returns `true` ako je poslato, `false` ako env nije kompletan.
 * @throws Ako EmailJS vrati grešku (porudžbina je već u bazi).
 *
 * Napomena: u EmailJS → Account → Security mora biti uključeno slanje API-jem
 * van pregledača („Allow non-browser / API requests“), inače dobijaš grešku.
 */
export async function sendOrderNotificationEmail(payload: OrderEmailPayload): Promise<boolean> {
  if (!isOrderEmailJsConfigured()) {
    console.warn(
      '[emailjs-order] Preskačem slanje: nije kompletna konfiguracija (NEXT_PUBLIC_EMAILJS_PUBLIC_KEY, NEXT_PUBLIC_EMAILJS_SERVICE_ID, EMAILJS_ORDER_TEMPLATE_ID ili NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID).',
    );
    return false;
  }

  if (!privateKey) {
    console.warn(
      '[emailjs-order] EMAILJS_PRIVATE_KEY nije postavljen — dodaj privatni ključ iz EmailJS (Account → API keys). Bez njega nalog često odbija server zahteve.',
    );
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

  const runSend = async () => {
    try {
      await sendOnce(template_params);
    } catch (err) {
      if (err instanceof EmailJSResponseStatus && err.status === 429) {
        await new Promise((r) => setTimeout(r, 1500));
        await sendOnce(template_params);
        return;
      }
      throw err;
    }
  };

  try {
    await runSend();
  } catch (err) {
    if (err instanceof EmailJSResponseStatus) {
      const hint =
        err.status === 403 &&
        /non-browser|disabled/i.test(String(err.text))
          ? ' → Uključi „API access“ za ne-browser okruženje: https://dashboard.emailjs.com/admin/account/security (newsletter radi jer ide iz browsera; porudžbina sa servera zahteva ovu opciju).'
          : err.status === 403
            ? ' Proveri EmailJS Security i EMAILJS_PRIVATE_KEY.'
            : '';
      console.error(
        `[emailjs-order] EmailJS ${err.status} za porudžbinu ${orderId}: ${err.text}${hint}`,
      );
      throw new Error(`EmailJS order: ${err.status} ${err.text}`);
    }
    throw err;
  }

  console.info('[emailjs-order] Obaveštenje o porudžbini poslato preko EmailJS.', orderId);
  return true;
}
