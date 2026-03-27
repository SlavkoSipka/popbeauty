-- Kreator može da menja sopstveni referral_code (admin i dalje menja sve preko postojeće politike).

DROP POLICY IF EXISTS "Creators update own profile" ON public.creators;
CREATE POLICY "Creators update own profile"
  ON public.creators FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

COMMENT ON POLICY "Creators update own profile" ON public.creators IS
  'Kreator menja svoj red; u aplikaciji šalju se samo referral_code i druga dozvoljena polja.';
