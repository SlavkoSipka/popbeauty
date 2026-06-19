-- Poštarina po porudžbini (0 = besplatna iznad praga).
-- Pokreće se u Supabase SQL Editor-u ili `supabase db push`.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_rsd NUMERIC(12, 2);

COMMENT ON COLUMN public.orders.shipping_rsd IS 'Naplaćena poštarina (0 = besplatna). NULL za stare porudžbine.';
