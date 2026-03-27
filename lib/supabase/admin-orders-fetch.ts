import type { SupabaseClient } from '@supabase/supabase-js';
import type { AdminOrderRow } from '@/components/admin/AdminPorudzbineClient';
import {
  ORDER_LIST_COLUMNS,
  ORDER_LIST_COLUMNS_MINIMAL,
  ORDER_LIST_COLUMNS_NO_PRODUCT_DISCOUNTS,
  ORDER_LIST_LIMIT,
} from '@/lib/supabase/query-limits';

/**
 * Učitava porudžbine za admin panel; ako novije kolone ne postoje u bazi,
 * automatski koristi uži SELECT (bez pada cele stranice).
 */
export async function fetchOrdersForAdminList(supabase: SupabaseClient): Promise<{
  data: AdminOrderRow[] | null;
  error: { message: string } | null;
}> {
  const attempts = [
    ORDER_LIST_COLUMNS,
    ORDER_LIST_COLUMNS_NO_PRODUCT_DISCOUNTS,
    ORDER_LIST_COLUMNS_MINIMAL,
  ] as const;

  let lastError: { message: string } | null = null;

  for (const columns of attempts) {
    const { data, error } = await supabase
      .from('orders')
      // Dinamički string kolona — Supabase tip ne može da ga inferiše
      .select(columns as never)
      .order('created_at', { ascending: false })
      .limit(ORDER_LIST_LIMIT);

    if (!error) {
      return {
        data: (data ?? []) as unknown as AdminOrderRow[],
        error: null,
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
  };
}
