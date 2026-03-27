-- Creator payment tracking + bank account field.
-- Run in Supabase SQL Editor after previous migrations.

-- ═══════════════════════════════════════════════════════════════
-- 1. Bank account on creators
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.creators
  ADD COLUMN IF NOT EXISTS bank_account TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.creators.bank_account IS 'Žiro račun kreatora (slobodan tekst).';

-- ═══════════════════════════════════════════════════════════════
-- 2. Creator payments table
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.creator_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creators (id) ON DELETE CASCADE,
  amount_rsd NUMERIC(12, 2) NOT NULL CHECK (amount_rsd > 0),
  paid_at DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creator_payments_creator ON public.creator_payments (creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_payments_paid_at ON public.creator_payments (paid_at DESC);

ALTER TABLE public.creator_payments ENABLE ROW LEVEL SECURITY;

-- Admin reads all payments
DROP POLICY IF EXISTS "Admins read creator_payments" ON public.creator_payments;
CREATE POLICY "Admins read creator_payments"
  ON public.creator_payments FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- Admin inserts payments
DROP POLICY IF EXISTS "Admins insert creator_payments" ON public.creator_payments;
CREATE POLICY "Admins insert creator_payments"
  ON public.creator_payments FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- Admin deletes payments (corrections)
DROP POLICY IF EXISTS "Admins delete creator_payments" ON public.creator_payments;
CREATE POLICY "Admins delete creator_payments"
  ON public.creator_payments FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

COMMENT ON TABLE public.creator_payments IS 'Evidencija fizičkih isplata kreatorima. Admin unosi ručno.';
