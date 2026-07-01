import type { SupabaseClient } from '@supabase/supabase-js';
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
  /** Učitaj sve redove koji odgovaraju filteru (paginacija u pozadini). */
  fetchAll?: boolean;
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

async function fetchOrdersViaSearchRpc(
  supabase: SupabaseClient,
  options: {
    search: string;
    status?: string;
    limit: number;
    offset: number;
  },
): Promise<FetchAdminOrdersResult> {
  const { data, error } = await supabase.rpc('search_admin_orders', {
    p_query: options.search,
    p_status: options.status && options.status !== 'all' ? options.status : null,
    p_limit: options.limit,
    p_offset: options.offset,
  });

  if (error) {
    return { data: null, error: { message: error.message }, hasMore: false };
  }

  const rows = (data ?? []) as unknown as AdminOrderRow[];
  return {
    data: rows,
    error: null,
    hasMore: rows.length >= options.limit,
  };
}

/**
 * Učitava porudžbine za admin panel; ako novije kolone ne postoje u bazi,
 * automatski koristi uži SELECT (bez pada cele stranice).
 * Pretraga ide preko RPC `search_admin_orders` (cela tabela).
 */
export async function fetchOrdersForAdminList(
  supabase: SupabaseClient,
  options: FetchAdminOrdersOptions = {},
): Promise<FetchAdminOrdersResult> {
  if (options.fetchAll) {
    return fetchAllOrdersForAdminList(supabase, options);
  }

  const search = options.search?.trim() ?? '';
  const isSearch = search.length > 0;
  const limit =
    options.limit ??
    (isSearch ? ORDER_SEARCH_LIMIT : ORDER_LIST_INITIAL_LIMIT);
  const offset = options.offset ?? 0;
  const status = options.status?.trim();
  const includeLineItems = options.includeLineItems ?? isSearch;

  if (isSearch) {
    return fetchOrdersViaSearchRpc(supabase, {
      search,
      status,
      limit,
      offset,
    });
  }

  const attempts = columnAttempts(includeLineItems);
  let lastError: { message: string } | null = null;

  for (const columns of attempts) {
    let query = supabase
      .from('orders')
      .select(columns as never)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (!error) {
      const rows = (data ?? []) as unknown as AdminOrderRow[];
      return {
        data: rows,
        error: null,
        hasMore: rows.length >= limit,
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

const FETCH_ALL_PAGE_SIZE = 200;
const FETCH_ALL_MAX_ROWS = 5000;

/**
 * Učitava sve porudžbine koje odgovaraju filteru (status, pretraga), stranicu po stranicu.
 */
export async function fetchAllOrdersForAdminList(
  supabase: SupabaseClient,
  options: Omit<FetchAdminOrdersOptions, 'limit' | 'offset' | 'fetchAll'> = {},
): Promise<FetchAdminOrdersResult> {
  const search = options.search?.trim() ?? '';
  const isSearch = search.length > 0;
  const pageSize = isSearch ? ORDER_SEARCH_LIMIT : FETCH_ALL_PAGE_SIZE;
  const all: AdminOrderRow[] = [];
  let offset = 0;

  while (all.length < FETCH_ALL_MAX_ROWS) {
    const batch = await fetchOrdersForAdminList(supabase, {
      ...options,
      limit: pageSize,
      offset,
    });

    if (batch.error || !batch.data) {
      return batch;
    }

    all.push(...batch.data);

    if (!batch.hasMore || batch.data.length === 0) {
      break;
    }

    offset += batch.data.length;
  }

  return {
    data: all,
    error: null,
    hasMore: all.length >= FETCH_ALL_MAX_ROWS,
  };
}
