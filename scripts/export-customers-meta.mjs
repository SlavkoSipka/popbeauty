// Pull svih kupaca iz orders, dedup po telefonu, Meta Custom Audience format.
// Pokreni:  node --env-file=.env scripts/export-customers-meta.mjs
// Rezultat: customers1.csv

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'node:fs';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Nedostaje NEXT_PUBLIC_SUPABASE_URL ili SUPABASE_SERVICE_ROLE_KEY u .env');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function clean(s) {
  return String(s ?? '').trim().replace(/\s+/g, ' ');
}

function normalizePhone(raw) {
  if (!raw) return '';
  let p = String(raw).replace(/\D/g, '');
  if (p.startsWith('00')) p = p.slice(2);
  if (p.startsWith('0')) p = '381' + p.slice(1);
  if (!p.startsWith('381') && p.length >= 8 && p.length <= 9) p = '381' + p;
  return p ? '+' + p : '';
}

function phoneKey(raw) {
  return normalizePhone(raw).replace(/\D/g, '');
}

function csvEscape(v) {
  const s = String(v ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const { data: orders, error } = await supabase
  .from('orders')
  .select('customer_first_name, customer_last_name, customer_email, customer_phone, city, postal_code, status, created_at')
  .order('created_at', { ascending: false });
if (error) throw error;

console.log(`Učitano porudžbina: ${orders.length}`);

// Dedup po telefonu (najnovije ostaje, jer je sortirano desc).
const byPhone = new Map();
for (const o of orders) {
  const k = phoneKey(o.customer_phone);
  if (!k) continue;
  if (byPhone.has(k)) continue;
  byPhone.set(k, {
    Ime: clean(o.customer_first_name),
    Prezime: clean(o.customer_last_name),
    Email: clean(o.customer_email).toLowerCase(),
    Phone: normalizePhone(o.customer_phone),
  });
}

const customers = [...byPhone.values()];
console.log(`Jedinstvenih kupaca (po telefonu): ${customers.length}`);

const cols = ['Ime', 'Prezime', 'Email', 'Phone'];
const lines = [cols.join(',')];
for (const c of customers) lines.push(cols.map((h) => csvEscape(c[h])).join(','));

writeFileSync('customers1.csv', '\ufeff' + lines.join('\n') + '\n', 'utf8');
console.log('Snimljeno: customers1.csv');
