-- Opcioni status: kupac kontaktiran pre slanja / daljeg toka.
COMMENT ON COLUMN public.orders.status IS
  'poruceno | kontaktiran | poslato | placeno | odbijeno — prati porudžbinu i pouzeće.';
