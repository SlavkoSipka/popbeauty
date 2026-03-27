/** Maks. broj porudžbina u admin/kreator listama (performanse). */
export const ORDER_LIST_LIMIT = 500;

/**
 * Glavni SELECT za admin listu porudžbina.
 * Ne uključuje promo_* kolone — ako migracija nije pokrenuta, ceo upit pada (42703).
 */
export const ORDER_LIST_COLUMNS =
  'id, customer_first_name, customer_last_name, customer_email, customer_phone, address_line, city, postal_code, note, line_items, total_rsd, subtotal_rsd, discount_type, discount_percent, referral_discount_percent, referral_code, creator_id, commission_percent_applied, status, created_at';

/** Bez kolona iz products/discount migracije (starije baze). */
export const ORDER_LIST_COLUMNS_NO_PRODUCT_DISCOUNTS =
  'id, customer_first_name, customer_last_name, customer_email, customer_phone, address_line, city, postal_code, note, line_items, total_rsd, referral_code, creator_id, commission_percent_applied, status, created_at';

/** Minimalno — ako još uvek nema commission_percent_applied. */
export const ORDER_LIST_COLUMNS_MINIMAL =
  'id, customer_first_name, customer_last_name, customer_email, customer_phone, address_line, city, postal_code, note, line_items, total_rsd, referral_code, creator_id, status, created_at';
