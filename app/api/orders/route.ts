import { NextResponse } from 'next/server';
import { sendOrderNotificationEmail } from '@/lib/emailjs-order';
import { createAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { normalizeReferralCode, parseCartLinesFromBody } from '@/lib/order-validation';
import { computePricing } from '@/lib/pricing-engine';
import type { DbProduct } from '@/lib/price';

type OrderBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal?: string;
  note?: string;
  referralCode?: string | null;
  lineItems?: unknown;
  totalRsd?: number;
};

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: 'Porudžbine nisu podešene na serveru.' },
      { status: 503 },
    );
  }

  let body: OrderBody;
  try {
    body = (await request.json()) as OrderBody;
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON.' }, { status: 400 });
  }

  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
  const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const address = typeof body.address === 'string' ? body.address.trim() : '';
  const city = typeof body.city === 'string' ? body.city.trim() : '';
  const postal = typeof body.postal === 'string' ? body.postal.trim() : '';
  const note =
    typeof body.note === 'string' && body.note.trim().length > 0
      ? body.note.trim()
      : null;

  if (!firstName || !lastName || !email || !phone || !address || !city || !postal) {
    return NextResponse.json({ error: 'Popunite sva obavezna polja.' }, { status: 400 });
  }

  const admin = createAdminClient();

  // ── Fetch DB products + site settings ──
  const [{ data: dbProducts }, { data: settingsRow }] = await Promise.all([
    admin.from('products').select('slug, name, base_price_rsd, image_path, volume'),
    admin
      .from('site_settings')
      .select('site_discount_percent, bundle_discount_percent')
      .eq('id', 1)
      .maybeSingle(),
  ]);

  if (!dbProducts || dbProducts.length === 0) {
    return NextResponse.json({ error: 'Nema proizvoda u bazi.' }, { status: 500 });
  }

  const settings = settingsRow as {
    site_discount_percent?: number | string;
    bundle_discount_percent?: number | string;
  } | null;
  const siteDiscountPercent = Number(settings?.site_discount_percent ?? 0);
  const bundleDiscountPercent = Number(settings?.bundle_discount_percent ?? 10);

  // ── Parse + validate cart lines against DB products ──
  const lines = parseCartLinesFromBody(body.lineItems, dbProducts as DbProduct[]);
  if (!lines) {
    return NextResponse.json({ error: 'Korpa je prazna ili neispravna.' }, { status: 400 });
  }

  // ── Referral lookup ──
  const referralNormalized = normalizeReferralCode(body.referralCode);
  let creatorId: string | null = null;
  let referralStored: string | null = null;
  let commissionPercentApplied: number | null = null;
  let customerDiscountPercent = 0;

  if (referralNormalized) {
    const { data: creator, error: refErr } = await admin
      .from('creators')
      .select('id, commission_percent, customer_discount_percent')
      .eq('referral_code', referralNormalized)
      .maybeSingle();

    if (refErr) {
      return NextResponse.json({ error: 'Greška pri proveri referral koda.' }, { status: 500 });
    }
    if (!creator) {
      return NextResponse.json(
        { error: 'Referral kod nije pronađen. Proverite unos ili ostavite prazno.' },
        { status: 400 },
      );
    }

    creatorId = creator.id;
    referralStored = referralNormalized;

    const row = creator as {
      id: string;
      commission_percent?: number | string | null;
      customer_discount_percent?: number | string | null;
    };
    commissionPercentApplied =
      row.commission_percent != null ? Number(row.commission_percent) : 20;
    customerDiscountPercent =
      row.customer_discount_percent != null ? Number(row.customer_discount_percent) : 15;
  }

  // ── Run pricing engine ──
  const pricing = computePricing({
    lines: lines.map((l) => ({
      slug: l.slug,
      quantity: l.quantity,
      basePriceRsd: l.basePriceRsd,
    })),
    siteDiscountPercent,
    bundleDiscountPercent: Number.isFinite(bundleDiscountPercent) ? bundleDiscountPercent : 10,
    referralDiscountPercent: customerDiscountPercent,
  });

  // ── Validate client-sent total (tolerance 1 RSD for rounding) ──
  const claimedTotal = typeof body.totalRsd === 'number' ? body.totalRsd : NaN;
  if (!Number.isFinite(claimedTotal) || Math.abs(claimedTotal - pricing.totalRsd) > 1) {
    return NextResponse.json(
      { error: 'Ukupan iznos se ne slaže. Osvežite stranicu.' },
      { status: 400 },
    );
  }

  // ── Build line_items JSON ──
  const lineItemsJson = lines.map((line) => ({
    slug: line.slug,
    name: line.name,
    quantity: line.quantity,
    unit_price_rsd: line.basePriceRsd,
    line_total_rsd: line.basePriceRsd * line.quantity,
  }));

  // ── Insert order ──
  const { data: inserted, error: insertErr } = await admin
    .from('orders')
    .insert({
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_email: email,
      customer_phone: phone,
      address_line: address,
      city,
      postal_code: postal,
      note,
      line_items: lineItemsJson,
      subtotal_rsd: pricing.subtotalRsd,
      discount_type: pricing.discountType,
      discount_percent: pricing.discountPercent > 0 ? pricing.discountPercent : null,
      referral_discount_percent: customerDiscountPercent > 0 ? customerDiscountPercent : null,
      total_rsd: pricing.totalRsd,
      referral_code: referralStored,
      creator_id: creatorId,
      commission_percent_applied: commissionPercentApplied,
      status: 'poruceno',
    })
    .select('id')
    .single();

  if (insertErr) {
    return NextResponse.json({ error: 'Čuvanje porudžbine nije uspelo.' }, { status: 500 });
  }

  const orderIdStr = String(inserted?.id ?? '');

  /**
   * Moramo await — na serverlessu (npr. Vercel) odgovor pre završetka `void fetch` često prekine izvršavanje
   * i mejl nikad ne ode na EmailJS.
   */
  try {
    await sendOrderNotificationEmail({
      orderId: orderIdStr,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postal,
      note,
      referralCode: referralStored,
      lineItems: lineItemsJson.map((li) => ({
        name: li.name,
        quantity: li.quantity,
        lineTotalRsd: Number(li.line_total_rsd),
      })),
      subtotalRsd: pricing.subtotalRsd,
      totalRsd: pricing.totalRsd,
      discountType: pricing.discountType,
      discountPercent: pricing.discountPercent,
      discountAmountRsd: pricing.discountAmountRsd,
      referralDiscountPercent: pricing.referralDiscountPercent,
      referralDiscountRsd: pricing.referralDiscountRsd,
    });
  } catch (err) {
    console.error('[api/orders] EmailJS porudžbina nije poslata (porudžbina je sačuvana):', err);
  }

  return NextResponse.json({ ok: true, orderId: inserted?.id });
}
