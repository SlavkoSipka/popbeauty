-- Pop Beauty: per-proizvod popust.
-- NULL = koristi se globalni site_settings.site_discount_percent
-- Non-NULL = override za taj proizvod.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5, 2) NULL
    CHECK (
      discount_percent IS NULL
      OR (discount_percent >= 0 AND discount_percent <= 100)
    );

COMMENT ON COLUMN public.products.discount_percent IS
  'Popust za ovaj proizvod u procentima, 2 decimale. NULL = koristi site_settings.site_discount_percent.';
