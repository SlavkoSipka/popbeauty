-- Admin pretraga porudžbina (cela baza, neosetljivo na velika/mala slova i č/ć/š/đ).

CREATE OR REPLACE FUNCTION public.normalize_search_text(input text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT translate(
    lower(coalesce(input, '')),
    'čćžšđ',
    'cczsd'
  );
$$;

CREATE OR REPLACE FUNCTION public.search_admin_orders(
  p_query text DEFAULT NULL,
  p_status text DEFAULT NULL,
  p_limit integer DEFAULT 200,
  p_offset integer DEFAULT 0
)
RETURNS SETOF public.orders
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  q text := trim(coalesce(p_query, ''));
  tokens text[];
BEGIN
  IF auth.uid() IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  IF q = '' THEN
    RETURN QUERY
    SELECT o.*
    FROM public.orders o
    WHERE (
      p_status IS NULL
      OR trim(p_status) = ''
      OR lower(trim(p_status)) = 'all'
      OR o.status = p_status
    )
    ORDER BY o.created_at DESC
    LIMIT greatest(1, least(p_limit, 500))
    OFFSET greatest(0, p_offset);
    RETURN;
  END IF;

  tokens := array_remove(
    regexp_split_to_array(public.normalize_search_text(q), '\s+'),
    ''
  );

  RETURN QUERY
  SELECT o.*
  FROM public.orders o
  WHERE (
    p_status IS NULL
    OR trim(p_status) = ''
    OR lower(trim(p_status)) = 'all'
    OR o.status = p_status
  )
  AND (
    SELECT bool_and(
      public.normalize_search_text(
        coalesce(o.customer_first_name, '') || ' ' ||
        coalesce(o.customer_last_name, '') || ' ' ||
        coalesce(o.customer_phone, '') || ' ' ||
        o.total_rsd::text || ' ' ||
        coalesce(o.address_line, '') || ' ' ||
        coalesce(o.city, '') || ' ' ||
        coalesce(o.postal_code, '')
      ) LIKE '%' || public.normalize_search_text(t) || '%'
    )
    FROM unnest(tokens) AS t
  )
  ORDER BY o.created_at DESC
  LIMIT greatest(1, least(p_limit, 500))
  OFFSET greatest(0, p_offset);
END;
$$;

DROP FUNCTION IF EXISTS public.order_matches_search_token(public.orders, text);
DROP FUNCTION IF EXISTS public.order_search_haystack(public.orders);

GRANT EXECUTE ON FUNCTION public.normalize_search_text(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.normalize_search_text(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.search_admin_orders(text, text, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_admin_orders(text, text, integer, integer) TO service_role;

COMMENT ON FUNCTION public.search_admin_orders IS
  'Pretraga po imenu, prezimenu, telefonu, iznosu, ulici, gradu i poštanskom broju.';
