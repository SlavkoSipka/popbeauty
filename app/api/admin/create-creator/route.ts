import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase/admin';

type Body = {
  email?: string;
  password?: string;
  display_name?: string;
  referral_code?: string;
  commission_percent?: number;
  customer_discount_percent?: number;
};

export async function POST(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'Server nije podešen.' }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
  }

  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRow) {
    return NextResponse.json({ error: 'Nemate admin pristup.' }, { status: 403 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const displayName = typeof body.display_name === 'string' ? body.display_name.trim() : '';
  const referralCode = typeof body.referral_code === 'string' ? body.referral_code.trim().toUpperCase() : '';
  const commissionPercent = typeof body.commission_percent === 'number' ? body.commission_percent : 20;
  const customerDiscountPercent = typeof body.customer_discount_percent === 'number' ? body.customer_discount_percent : 15;

  if (!email || !password || !displayName || !referralCode) {
    return NextResponse.json({ error: 'Sva polja su obavezna (email, lozinka, ime, referral kod).' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Lozinka mora imati minimum 6 karaktera.' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: authData, error: authErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authErr) {
    const msg = authErr.message?.toLowerCase() ?? '';
    if (msg.includes('already') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Korisnik sa ovim emailom već postoji.' }, { status: 409 });
    }
    return NextResponse.json({ error: `Greška auth: ${authErr.message}` }, { status: 500 });
  }

  if (!authData.user) {
    return NextResponse.json({ error: 'Kreiranje korisnika nije uspelo.' }, { status: 500 });
  }

  const { data: creator, error: insertErr } = await admin
    .from('creators')
    .insert({
      id: authData.user.id,
      email,
      display_name: displayName,
      referral_code: referralCode,
      commission_percent: commissionPercent,
      customer_discount_percent: customerDiscountPercent,
    })
    .select('id, email, display_name, referral_code, commission_percent, customer_discount_percent, bank_account, created_at')
    .single();

  if (insertErr) {
    // Rollback: delete the auth user since the creator row failed
    await admin.auth.admin.deleteUser(authData.user.id);
    const msg = insertErr.message?.toLowerCase() ?? '';
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Referral kod već postoji. Izaberite drugi.' }, { status: 409 });
    }
    return NextResponse.json({ error: `Greška baze: ${insertErr.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, creator });
}
