import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const { data, error } = await supabase
  .from('orders')
  .select('customer_first_name, customer_last_name, customer_email, customer_phone, status')
  .neq('status', 'odbijeno');
if (error) throw error;

const counts = new Map();
for (const r of data) {
  const e = (r.customer_email || '').trim().toLowerCase();
  counts.set(e, (counts.get(e) || 0) + 1);
}

const dupes = [...counts.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);
console.log('Email-ovi koji se ponavljaju:');
for (const [e, n] of dupes) console.log(`  ${n}×  ${e}`);

console.log('\nPun spisak za ponovljene email-ove:');
for (const [e] of dupes) {
  console.log(`\n[${e}]`);
  for (const r of data) {
    if ((r.customer_email || '').trim().toLowerCase() === e) {
      console.log(`  ${r.customer_first_name} ${r.customer_last_name} | ${r.customer_phone} | ${r.status}`);
    }
  }
}
