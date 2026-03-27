-- Pop Beauty — dijagnostika šeme (pokreni ceo fajl u Supabase → SQL Editor)
-- Uporedi rezultate sa migracijama u supabase/migrations/

-- ═══════════════════════════════════════════════════════════════
-- 1) Koje tabele postoje (očekujemo ove)
-- ═══════════════════════════════════════════════════════════════
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND table_name IN (
    'creators', 'orders', 'admins',
    'products', 'site_settings', 'creator_payments'
  )
ORDER BY table_name;

-- ═══════════════════════════════════════════════════════════════
-- 2) Kolone po tabeli (šta aplikacija koristi)
-- ═══════════════════════════════════════════════════════════════

-- creators: id, email, display_name, referral_code, created_at,
--           commission_percent, customer_discount_percent, bank_account
SELECT column_name, data_type, udt_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'creators'
ORDER BY ordinal_position;

-- orders
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'orders'
ORDER BY ordinal_position;

-- orders — brzi pregled: fale li kolone koje API/admin očekuju?
SELECT
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'commission_percent_applied'
  ) AS has_commission_percent_applied,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'subtotal_rsd'
  ) AS has_subtotal_rsd,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'discount_type'
  ) AS has_discount_type,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'discount_percent'
  ) AS has_discount_percent,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'referral_discount_percent'
  ) AS has_referral_discount_percent;

-- creators — fale li kolone?
SELECT
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'creators' AND column_name = 'customer_discount_percent'
  ) AS has_customer_discount_percent,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'creators' AND column_name = 'bank_account'
  ) AS has_bank_account,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'creators' AND column_name = 'commission_percent'
  ) AS has_commission_percent;

-- products
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'products'
ORDER BY ordinal_position;

-- site_settings
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'site_settings'
ORDER BY ordinal_position;

-- creator_payments
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'creator_payments'
ORDER BY ordinal_position;

-- ═══════════════════════════════════════════════════════════════
-- 3) Broj redova (bez osetljivih podataka)
-- ═══════════════════════════════════════════════════════════════
SELECT
  (SELECT COUNT(*) FROM public.creators) AS creators_count,
  (SELECT COUNT(*) FROM public.orders) AS orders_count,
  (SELECT COUNT(*) FROM public.admins) AS admins_count,
  (SELECT COUNT(*) FROM public.products) AS products_count,
  (SELECT COUNT(*) FROM public.site_settings) AS site_settings_count,
  (SELECT COUNT(*) FROM public.creator_payments) AS creator_payments_count;

-- ═══════════════════════════════════════════════════════════════
-- 4) Proizvodi i podešavanja (očekujemo 2 proizvoda, 1 red u site_settings)
-- ═══════════════════════════════════════════════════════════════
SELECT slug, base_price_rsd, name
FROM public.products
ORDER BY slug;

SELECT id, site_discount_percent, updated_at
FROM public.site_settings
WHERE id = 1;

-- ═══════════════════════════════════════════════════════════════
-- 5) Da li postoji bar jedan admin? (samo broj — bez UUID u izvozu)
-- ═══════════════════════════════════════════════════════════════
SELECT COUNT(*) AS admin_users_count FROM public.admins;

-- ═══════════════════════════════════════════════════════════════
-- 6) RLS politike na ključnim tabelama (za poređenje sa migracijama)
-- ═══════════════════════════════════════════════════════════════
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'creators', 'admins', 'products', 'site_settings', 'creator_payments')
ORDER BY tablename, policyname;
