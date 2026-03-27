-- Pop Beauty: kreatori (referral) + porudžbine
-- Pokreni u Supabase → SQL Editor (jednom po projektu).

-- Profil kreatora (1:1 sa auth.users). Nalog se pravi u Authentication,
-- zatim INSERT u ovu tabelu (vidi komentar na dnu).

CREATE TABLE IF NOT EXISTS public.creators (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creators_referral_upper ON public.creators (upper(referral_code));

COMMENT ON TABLE public.creators IS 'Kreator: id = auth.users.id. referral_code jedinstven, npr. POP-MARIA1';

-- Porudžbine (INSERT samo preko API-ja sa service role).

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  note TEXT,
  line_items JSONB NOT NULL,
  total_rsd NUMERIC(12, 2) NOT NULL CHECK (total_rsd >= 0),
  referral_code TEXT,
  creator_id UUID REFERENCES public.creators (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_creator_id ON public.orders (creator_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creators read own profile" ON public.creators;
CREATE POLICY "Creators read own profile"
  ON public.creators FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Creators read own orders" ON public.orders;
CREATE POLICY "Creators read own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());

-- Kako dodati kreatora nakon što napraviš korisnika u Authentication:
-- INSERT INTO public.creators (id, email, display_name, referral_code)
-- VALUES (
--   'UUID_IZ_AUTH_USERS'::uuid,
--   'email@example.com',
--   'Ime Prezime',
--   'POP-IME1'
-- );
