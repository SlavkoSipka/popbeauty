-- Production costs, inventory, and inventory transactions tables.
-- Run in Supabase SQL Editor after previous migrations.

-- ═══════════════════════════════════════════════════════════════
-- 1. Production costs (per-product cost breakdown)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.production_costs (
  id SERIAL PRIMARY KEY,
  product_slug TEXT NOT NULL REFERENCES public.products(slug),
  label_cost_rsd NUMERIC(12, 2) NOT NULL DEFAULT 0,
  packaging_cost_rsd NUMERIC(12, 2) NOT NULL DEFAULT 0,
  serum_cost_rsd NUMERIC(12, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_slug)
);

ALTER TABLE public.production_costs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read production_costs" ON public.production_costs;
CREATE POLICY "Admins read production_costs"
  ON public.production_costs FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins update production_costs" ON public.production_costs;
CREATE POLICY "Admins update production_costs"
  ON public.production_costs FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins insert production_costs" ON public.production_costs;
CREATE POLICY "Admins insert production_costs"
  ON public.production_costs FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

INSERT INTO public.production_costs (product_slug, label_cost_rsd, packaging_cost_rsd, serum_cost_rsd)
VALUES
  ('vodeni-serum', 117.00, 113.00, 320.00),
  ('uljani-serum', 146.00, 103.00, 380.00)
ON CONFLICT (product_slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 2. Inventory (current stock per component per product)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.inventory (
  id SERIAL PRIMARY KEY,
  product_slug TEXT NOT NULL,
  component_type TEXT NOT NULL CHECK (component_type IN ('nalepnica', 'ambalaza', 'serum')),
  quantity INT NOT NULL DEFAULT 0,
  unit_cost_rsd NUMERIC(12, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_slug, component_type)
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read inventory" ON public.inventory;
CREATE POLICY "Admins read inventory"
  ON public.inventory FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins update inventory" ON public.inventory;
CREATE POLICY "Admins update inventory"
  ON public.inventory FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins insert inventory" ON public.inventory;
CREATE POLICY "Admins insert inventory"
  ON public.inventory FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

INSERT INTO public.inventory (product_slug, component_type, quantity, unit_cost_rsd)
VALUES
  ('vodeni-serum', 'nalepnica', 0, 117.00),
  ('vodeni-serum', 'ambalaza',  0, 113.00),
  ('vodeni-serum', 'serum',     0, 320.00),
  ('uljani-serum', 'nalepnica', 0, 146.00),
  ('uljani-serum', 'ambalaza',  0, 103.00),
  ('uljani-serum', 'serum',     0, 380.00)
ON CONFLICT (product_slug, component_type) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 3. Inventory transactions (audit log)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug TEXT NOT NULL,
  component_type TEXT NOT NULL,
  quantity_change INT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'sale', 'adjustment')),
  note TEXT,
  total_cost_rsd NUMERIC(12, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read inventory_transactions" ON public.inventory_transactions;
CREATE POLICY "Admins read inventory_transactions"
  ON public.inventory_transactions FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

DROP POLICY IF EXISTS "Admins insert inventory_transactions" ON public.inventory_transactions;
CREATE POLICY "Admins insert inventory_transactions"
  ON public.inventory_transactions FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));
