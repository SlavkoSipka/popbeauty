-- Pop Beauty: per-proizvod popust.
-- NULL = koristi se globalni site_settings.site_discount_percent
-- Non-NULL = override za taj proizvod.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(11, 8) NULL
    CHECK (
      discount_percent IS NULL
      OR (discount_percent >= 0 AND discount_percent <= 100)
    );

-- Ako kolona već postoji iz ranije (NUMERIC(5,2)), proširi preciznost.
ALTER TABLE public.products
  ALTER COLUMN discount_percent TYPE NUMERIC(11, 8);

COMMENT ON COLUMN public.products.discount_percent IS
  'Popust za ovaj proizvod u procentima (do 8 decimala). NULL = koristi site_settings.site_discount_percent.';
