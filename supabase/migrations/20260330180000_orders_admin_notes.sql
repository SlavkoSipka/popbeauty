-- Interne admin beleške po porudžbini (odvojeno od kupčeve napomene `note`).

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

COMMENT ON COLUMN public.orders.admin_notes IS 'Interne beleške admina; kupac ne vidi.';
