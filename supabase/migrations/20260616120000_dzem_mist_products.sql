-- Novi proizvodi: Džem i Mist.
-- Pokreni u Supabase SQL Editor-u (ili `supabase db push`).
-- Cene su autoritativne sa servera (app/api/orders) — bez ovog INSERT-a
-- porudžbina za dzem/mist se odbija.

-- ═══════════════════════════════════════════════════════════════
-- 1. Proizvodi (obavezno za poručivanje)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.products (slug, name, base_price_rsd, image_path, volume)
VALUES
  ('dzem', 'Glow Marmelada', 1990.00, '/dzem2.webp', '50ml'),
  ('mist', 'Glow Mist',       690.00, '/mist2.webp', '100ml')
ON CONFLICT (slug) DO NOTHING;

-- Ako su redovi već ubačeni sa starim imenom, ažuriraj naziv:
UPDATE public.products SET name = 'Glow Marmelada' WHERE slug = 'dzem';
UPDATE public.products SET image_path = '/dzem2.webp' WHERE slug = 'dzem';
UPDATE public.products SET name = 'Glow Mist' WHERE slug = 'mist';
UPDATE public.products SET image_path = '/mist2.webp' WHERE slug = 'mist';

-- Bez site popusta (15%) — fiksna cena 1990 / 690:
UPDATE public.products SET discount_percent = 0 WHERE slug IN ('dzem', 'mist');

-- ═══════════════════════════════════════════════════════════════
-- 2. (Opciono) Troškovi proizvodnje i zalihe — da se prikažu u adminu.
--    Vrednosti su 0 dok ne uneseš stvarne; bezbedno za preskočiti.
-- ═══════════════════════════════════════════════════════════════

INSERT INTO public.production_costs (product_slug, label_cost_rsd, packaging_cost_rsd, serum_cost_rsd)
VALUES
  ('dzem', 0, 0, 0),
  ('mist', 0, 0, 0)
ON CONFLICT (product_slug) DO NOTHING;

INSERT INTO public.inventory (product_slug, component_type, quantity, unit_cost_rsd)
VALUES
  ('dzem', 'nalepnica', 0, 0),
  ('dzem', 'ambalaza',  0, 0),
  ('dzem', 'serum',     0, 0),
  ('mist', 'nalepnica', 0, 0),
  ('mist', 'ambalaza',  0, 0),
  ('mist', 'serum',     0, 0)
ON CONFLICT (product_slug, component_type) DO NOTHING;
