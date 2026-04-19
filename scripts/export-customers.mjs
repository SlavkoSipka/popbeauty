// Export kupaca u Meta Custom Audience CSV.
// Izvor: ovapublika.csv (rucno editovana lista) + obogaceno gradom/zip iz orders.
// Pokreni:  node --env-file=.env scripts/export-customers.mjs
// Rezultat: customers1.csv

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'node:fs';

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

// Cifre + obavezan + na pocetku.
function normalizePhone(raw) {
  if (!raw) return '';
  let p = String(raw).replace(/\D/g, '');
  if (p.startsWith('00')) p = p.slice(2);
  if (p.startsWith('0')) p = '381' + p.slice(1);
  if (!p.startsWith('381') && p.length >= 8 && p.length <= 9) p = '381' + p;
  return p ? '+' + p : '';
}

// Kljuc za poredjenje (samo cifre).
function phoneKey(raw) {
  return normalizePhone(raw).replace(/\D/g, '');
}

// CSV parser dovoljan za nas slucaj (zarezi unutar navodnika).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  const src = text.replace(/^\ufeff/, '');
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cell += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (cell !== '' || row.length) { row.push(cell); rows.push(row); row = []; cell = ''; }
        if (c === '\r' && src[i + 1] === '\n') i++;
      } else cell += c;
    }
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function csvEscape(v) {
  const s = String(v ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const raw = readFileSync('ovapublika.csv', 'utf8');
const parsed = parseCsv(raw);
const header = parsed[0].map((h) => h.trim().toLowerCase());
const idx = {
  fn: header.indexOf('first name'),
  ln: header.indexOf('last name'),
  email: header.indexOf('email'),
  phone: header.indexOf('phone'),
};

const list = parsed.slice(1)
  .filter((r) => r.some((c) => c && c.trim()))
  .map((r) => ({
    fn: clean(r[idx.fn]),
    ln: clean(r[idx.ln]),
    email: clean(r[idx.email]).toLowerCase(),
    phoneRaw: clean(r[idx.phone]),
  }));

console.log(`Iz ovapublika.csv: ${list.length} kupaca`);

const { data: orders, error } = await supabase
  .from('orders')
  .select('customer_phone, city, postal_code, created_at')
  .order('created_at', { ascending: false });
if (error) throw error;

const cityByPhone = new Map();
for (const o of orders) {
  const k = phoneKey(o.customer_phone);
  if (!k) continue;
  if (!cityByPhone.has(k)) {
    cityByPhone.set(k, { ct: clean(o.city), zip: clean(o.postal_code) });
  }
}

let matched = 0;
const customers = list.map((c) => {
  const k = phoneKey(c.phoneRaw);
  const addr = cityByPhone.get(k);
  if (addr) matched++;
  return {
    email: c.email,
    phone: normalizePhone(c.phoneRaw),
    fn: c.fn,
    ln: c.ln,
    ct: addr?.ct ?? '',
    st: '',
    zip: addr?.zip ?? '',
    country: 'RS',
  };
});

console.log(`Matchovano grad/zip iz orders: ${matched}/${list.length}`);

const cols = ['email', 'phone', 'fn', 'ln', 'ct', 'st', 'zip', 'country'];
const lines = [cols.join(',')];
for (const c of customers) lines.push(cols.map((h) => csvEscape(c[h])).join(','));

writeFileSync('customers1.csv', '\ufeff' + lines.join('\n') + '\n', 'utf8');
console.log('Snimljeno: customers1.csv');
