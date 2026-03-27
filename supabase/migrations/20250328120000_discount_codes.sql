-- Promo kodovi (odvojeno od referral koda kreatora). Validacija preko API-ja (service role).

CREATE TABLE IF NOT EXISTS public.discount_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent NUMERIC(5, 2) NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON public.discount_codes (code);

COMMENT ON TABLE public.discount_codes IS 'Promo kodovi za dodatni popust; code je uvek UPPERCASE u bazi.';

ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Samo admini (preko Supabase klijenta); anon nema SELECT
DROP POLICY IF EXISTS "Admins manage discount_codes" ON public.discount_codes;
CREATE POLICY "Admins manage discount_codes"
  ON public.discount_codes FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- Primer (izmeni ili obriši u produkciji)
INSERT INTO public.discount_codes (code, discount_percent, is_active)
VALUES ('POP10', 10.00, true)
ON CONFLICT (code) DO NOTHING;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS promo_code TEXT;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS promo_discount_percent NUMERIC(5, 2);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS promo_discount_rsd NUMERIC(12, 2);

COMMENT ON COLUMN public.orders.promo_code IS 'Snapshot promo koda (UPPERCASE); NULL ako nije korišćen.';
COMMENT ON COLUMN public.orders.promo_discount_percent IS 'Procenat popusta sa discount_codes.';
COMMENT ON COLUMN public.orders.promo_discount_rsd IS 'Iznos odbijen zbog promo koda.';
