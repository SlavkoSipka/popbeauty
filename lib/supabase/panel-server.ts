import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export type CreatorProfileRow = {
  id: string;
  email: string;
  display_name: string;
  referral_code: string;
  commission_percent: number | string;
  customer_discount_percent: number | string;
};

/** Server-only: ulogovan admin (RLS + provera reda u admins). */
export async function requireAdminServer(): Promise<SupabaseClient> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/prijava?next=/admin');

  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRow) redirect('/');
  return supabase;
}

/** Server-only: ulogovan korisnik + profil kreatora ako postoji. */
export async function requireCreatorServer(): Promise<{
  supabase: SupabaseClient;
  creator: CreatorProfileRow | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/prijava?next=/kreator');

  const { data: creator } = await supabase
    .from('creators')
    .select('id, email, display_name, referral_code, commission_percent, customer_discount_percent')
    .eq('id', user.id)
    .maybeSingle();

  return { supabase, creator: creator as CreatorProfileRow | null };
}
