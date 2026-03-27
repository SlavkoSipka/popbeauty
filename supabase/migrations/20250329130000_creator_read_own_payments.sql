-- Kreator vidi evidenciju svojih isplata (read-only).

DROP POLICY IF EXISTS "Creators read own payments" ON public.creator_payments;
CREATE POLICY "Creators read own payments"
  ON public.creator_payments FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid());
