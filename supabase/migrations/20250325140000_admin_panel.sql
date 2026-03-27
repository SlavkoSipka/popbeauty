-- Admin panel + provizija kreatora
-- Pokreni u Supabase SQL Editor nakon prethodne migracije.

-- Provizija (%) po kreatoru — iskaznica na porudžbini u trenutku kupovine
ALTER TABLE public.creators
  ADD COLUMN IF NOT EXISTS commission_percent NUMERIC(5, 2) NOT NULL DEFAULT 10;

COMMENT ON COLUMN public.creators.commission_percent IS 'Procenat od prodaje za kreatora (npr. 10 = 10%).';

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS commission_percent_applied NUMERIC(5, 2);

COMMENT ON COLUMN public.orders.commission_percent_applied IS 'Snapshot provizije iz creators u trenutku porudžbine; NULL ako nema kreatora.';

-- Ko je admin (1:1 sa auth.users)
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read self" ON public.admins;
CREATE POLICY "Admins read self"
  ON public.admins FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admin vidi sve porudžbine
DROP POLICY IF EXISTS "Admins read all orders" ON public.orders;
CREATE POLICY "Admins read all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
  );

-- Admin menja status porudžbine
DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
CREATE POLICY "Admins update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
  );

-- Admin vidi sve kreatore
DROP POLICY IF EXISTS "Admins read all creators" ON public.creators;
CREATE POLICY "Admins read all creators"
  ON public.creators FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
  );

-- Admin menja proviziju kreatora
DROP POLICY IF EXISTS "Admins update creators" ON public.creators;
CREATE POLICY "Admins update creators"
  ON public.creators FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid())
  );

-- Prvi admin (zameni UUID nakon što napraviš korisnika u Authentication):
-- INSERT INTO public.admins (user_id) VALUES ('UUID_ADMINA'::uuid);
