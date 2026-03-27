-- Paketni popust (oba seruma) — podešava admin, čita se na sajtu i u API-ju.
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS bundle_discount_percent NUMERIC(5, 2) NOT NULL DEFAULT 10
  CHECK (bundle_discount_percent >= 0 AND bundle_discount_percent <= 100);

COMMENT ON COLUMN public.site_settings.bundle_discount_percent IS
  'Procenat popusta kada su u korpi oba seruma (umesto site_discount_percent).';
