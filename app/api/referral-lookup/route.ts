import { NextResponse } from 'next/server';
import { createAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { normalizeReferralCode } from '@/lib/order-validation';

/**
 * Lagani pregled referral koda za prikaz cene na klijentu (isti procenat kao pri porudžbini).
 */
export async function GET(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ found: false as const }, { status: 503 });
  }

  const url = new URL(request.url);
  const normalized = normalizeReferralCode(url.searchParams.get('code'));
  if (!normalized) {
    return NextResponse.json({ found: false as const });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('creators')
    .select('customer_discount_percent')
    .eq('referral_code', normalized)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: 'Greška pri proveri.' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ found: false as const });
  }

  const row = data as { customer_discount_percent?: number | string | null };
  const discountPercent =
    row.customer_discount_percent != null ? Number(row.customer_discount_percent) : 15;

  return NextResponse.json({
    found: true as const,
    discountPercent: Number.isFinite(discountPercent) ? discountPercent : 15,
  });
}
