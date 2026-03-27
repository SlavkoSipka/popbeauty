-- Status porudžbina na srpskom (plaćanje pouzećem). Mapiranje starih engleskih vrednosti.

UPDATE public.orders
SET status = CASE status
  WHEN 'pending' THEN 'poruceno'
  WHEN 'processing' THEN 'poslato'
  WHEN 'shipped' THEN 'poslato'
  WHEN 'completed' THEN 'placeno'
  WHEN 'cancelled' THEN 'odbijeno'
  ELSE status
END
WHERE status IN ('pending', 'processing', 'shipped', 'completed', 'cancelled');

ALTER TABLE public.orders
  ALTER COLUMN status SET DEFAULT 'poruceno';

COMMENT ON COLUMN public.orders.status IS
  'poruceno | poslato | placeno | odbijeno — prati porudžbinu i pouzeće.';
