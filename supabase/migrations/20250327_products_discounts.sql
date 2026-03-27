-- Products table, site settings, per-creator customer discount, order discount columns.
-- Run in Supabase SQL Editor after previous migrations.

-- ═══════════════════════════════════════════════════════════════
-- 1. Products
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  base_price_rsd NUMERIC(12, 2) NOT NULL CHECK (base_price_rsd >= 0),
  image_path TEXT NOT NULL,
  volume TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can read products (storefront)
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin can update products (price changes)
DROP POLICY IF EXISTS "Admins update products" ON public.products;
CREATE POLICY "Admins update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- Seed 2 products
INSERT INTO public.products (slug, name, base_price_rsd, image_path, volume)
VALUES
  ('uljani-serum', 'Uljani serum za lice', 2490.00, '/zuti.webp', '20ml'),
  ('vodeni-serum', 'Vodeni serum za lice', 2390.00, '/zeleni.webp', '30ml')
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 2. Site settings (single-row)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_discount_percent NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (site_discount_percent >= 0 AND site_discount_percent <= 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (storefront needs discount %)
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin can update settings
DROP POLICY IF EXISTS "Admins update site_settings" ON public.site_settings;
CREATE POLICY "Admins update site_settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- Seed single row
INSERT INTO public.site_settings (id, site_discount_percent)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 3. Creators: customer_discount_percent + update commission default
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.creators
  ADD COLUMN IF NOT EXISTS customer_discount_percent NUMERIC(5, 2) NOT NULL DEFAULT 15;

COMMENT ON COLUMN public.creators.customer_discount_percent
  IS 'Popust koji kupci tog kreatora dobijaju (npr. 15 = 15%). Snima se u porudžbinu.';

ALTER TABLE public.creators
  ALTER COLUMN commission_percent SET DEFAULT 20;

-- ═══════════════════════════════════════════════════════════════
-- 4. Orders: discount tracking columns
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS subtotal_rsd NUMERIC(12, 2);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS discount_type TEXT;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5, 2);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS referral_discount_percent NUMERIC(5, 2);

COMMENT ON COLUMN public.orders.subtotal_rsd IS 'Zbir baznih cena pre popusta.';
COMMENT ON COLUMN public.orders.discount_type IS 'site | bundle | NULL';
COMMENT ON COLUMN public.orders.discount_percent IS 'Primenjen procenat popusta (sajt ili paket).';
COMMENT ON COLUMN public.orders.referral_discount_percent IS 'Snapshot customer_discount_percent kreatora; NULL ako nema referrala.';
