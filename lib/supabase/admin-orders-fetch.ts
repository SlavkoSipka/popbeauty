import type { SupabaseClient } from '@supabase/supabase-js';
import {
  buildOrdersOrFilter,
  orderMatchesAllTokens,
  orderSearchTokens,
} from '@/lib/admin-order-search';
import type { AdminOrderRow } from '@/components/admin/AdminPorudzbineClient';
import {
  ORDER_LIST_COLUMNS,
  ORDER_LIST_COLUMNS_LITE,
  ORDER_LIST_COLUMNS_LITE_WITH_SHIPPING,
  ORDER_LIST_COLUMNS_MINIMAL,
  ORDER_LIST_COLUMNS_NO_PRODUCT_DISCOUNTS,
  ORDER_LIST_COLUMNS_WITH_SHIPPING,
  ORDER_LIST_INITIAL_LIMIT,
  ORDER_SEARCH_LIMIT,
} from '@/lib/supabase/query-limits';

export type FetchAdminOrdersOptions = {
  limit?: number;
  offset?: number;
  /** Tekst pretrage — prazno = samo paginacija. */
  search?: string;
  status?: string;
  /** Uključi line_items (pretraga po nazivima proizvoda). Default: true kad ima search. */
  includeLineItems?: boolean;
};

export type FetchAdminOrdersResult = {
  data: AdminOrderRow[] | null;
  error: { message: string } | null;
  hasMore: boolean;
};

function columnAttempts(includeLineItems: boolean): readonly string[] {
  if (includeLineItems) {
    return [
      ORDER_LIST_COLUMNS_WITH_SHIPPING,
      ORDER_LIST_COLUMNS,
      ORDER_LIST_COLUMNS_NO_PRODUCT_DISCOUNTS,
      ORDER_LIST_COLUMNS_MINIMAL,
    ];
  }
  return [
    ORDER_LIST_COLUMNS_LITE_WITH_SHIPPING,
    ORDER_LIST_COLUMNS_LITE,
    ORDER_LIST_COLUMNS_NO_PRODUCT_DISCOUNTS.replace(', line_items', ''),
    ORDER_LIST_COLUMNS_MINIMAL.replace(', line_items', ''),
  ];
}

/**
 * Učitava porudžbine za admin panel; ako novije kolone ne postoje u bazi,
 * automatski koristi uži SELECT (bez pada cele stranice).
 */
export async function fetchOrdersForAdminList(
  supabase: SupabaseClient,
  options: FetchAdminOrdersOptions = {},
): Promise<FetchAdminOrdersResult> {
  const search = options.search?.trim() ?? '';
  const includeLineItems = options.includeLineItems ?? search.length > 0;
  const isSearch = search.length > 0;
  const limit = options.limit ?? (isSearch ? ORDER_SEARCH_LIMIT : ORDER_LIST_INITIAL_LIMIT);
  const offset = options.offset ?? 0;
  const status = options.status?.trim();

  const attempts = columnAttempts(includeLineItems);
  const orFilter = isSearch ? buildOrdersOrFilter(search) : null;
  const tokens = isSearch ? orderSearchTokens(search) : [];

  let lastError: { message: string } | null = null;

  for (const columns of attempts) {
    let query = supabase
      .from('orders')
      .select(columns as never)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (orFilter) {
      query = query.or(orFilter);
    }

    // Pretraga: uvek 0..limit-1; paginacija: range.
    if (isSearch) {
      query = query.range(0, Math.max(0, limit - 1));
    } else {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error } = await query;

    if (!error) {
      let rows = (data ?? []) as unknown as AdminOrderRow[];
      if (tokens.length > 1) {
        rows = rows.filter((o) => orderMatchesAllTokens(o, tokens));
      }

      const hasMore = !isSearch && rows.length >= limit;

      return {
        data: rows,
        error: null,
        hasMore,
      };
    }

    lastError = error;
    console.warn(
      `[admin orders] SELECT sa kolonama (${columns.slice(0, 40)}…):`,
      error.message,
    );
  }

  return {
    data: null,
    error: lastError,
    hasMore: false,
  };
}
