import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const { data, error } = await supabase
  .from('orders')
  .select('status, customer_email, customer_phone');
if (error) throw error;

const byStatus = {};
let noEmail = 0, noPhone = 0, both = 0;
for (const r of data) {
  byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  const e = (r.customer_email || '').trim();
  const p = (r.customer_phone || '').trim();
  if (!e) noEmail++;
  if (!p) noPhone++;
  if (e && p) both++;
}
console.log('Po statusu:', byStatus);
console.log('Ukupno:', data.length, '| bez emaila:', noEmail, '| bez tel:', noPhone, '| sa oba:', both);
