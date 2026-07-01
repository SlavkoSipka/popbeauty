/** Maks. broj porudžbina u admin/kreator listama (performanse). */
export const ORDER_LIST_LIMIT = 500;

/** Po stranici na admin listi porudžbina (brži prvi prikaz). */
export const ORDER_LIST_INITIAL_LIMIT = 50;

/** Veličina stranice pri „učitaj sve“ (batch na klijentu). */
export const ORDER_LIST_PAGE_SIZE = 200;

/** Maks. rezultata pretrage porudžbina (cela baza). */
export const ORDER_SEARCH_LIMIT = 500;

/**
 * Glavni SELECT za admin listu porudžbina.
 * Ne uključuje promo_* kolone — ako migracija nije pokrenuta, ceo upit pada (42703).
 */
export const ORDER_LIST_COLUMNS =
  'id, customer_first_name, customer_last_name, customer_email, customer_phone, address_line, city, postal_code, note, admin_notes, line_items, total_rsd, subtotal_rsd, discount_type, discount_percent, referral_discount_percent, referral_code, creator_id, commission_percent_applied, status, created_at';

/** Bez line_items — brže učitavanje liste; stavke se učitavaju pri otvaranju detalja. */
export const ORDER_LIST_COLUMNS_LITE =
  'id, customer_first_name, customer_last_name, customer_email, customer_phone, address_line, city, postal_code, note, admin_notes, total_rsd, subtotal_rsd, discount_type, discount_percent, referral_discount_percent, referral_code, creator_id, commission_percent_applied, status, created_at';

/** Glavni SELECT + shipping_rsd (preferirano; pada na ORDER_LIST_COLUMNS ako kolona ne postoji). */
export const ORDER_LIST_COLUMNS_WITH_SHIPPING = `${ORDER_LIST_COLUMNS}, shipping_rsd`;

export const ORDER_LIST_COLUMNS_LITE_WITH_SHIPPING = `${ORDER_LIST_COLUMNS_LITE}, shipping_rsd`;

/** Bez kolona iz products/discount migracije (starije baze). */
export const ORDER_LIST_COLUMNS_NO_PRODUCT_DISCOUNTS =
  'id, customer_first_name, customer_last_name, customer_email, customer_phone, address_line, city, postal_code, note, line_items, total_rsd, referral_code, creator_id, commission_percent_applied, status, created_at';

/** Minimalno — ako još uvek nema commission_percent_applied. */
export const ORDER_LIST_COLUMNS_MINIMAL =
  'id, customer_first_name, customer_last_name, customer_email, customer_phone, address_line, city, postal_code, note, line_items, total_rsd, referral_code, creator_id, status, created_at';
