import AdminPorudzbineClient from '@/components/admin/AdminPorudzbineClient';
import { ORDER_LIST_INITIAL_LIMIT } from '@/lib/supabase/query-limits';
import { fetchOrdersForAdminList } from '@/lib/supabase/admin-orders-fetch';
import { requireAdminServer } from '@/lib/supabase/panel-server';

export const dynamic = 'force-dynamic';

export default async function AdminPorudzbinePage() {
  const supabase = await requireAdminServer();

  const { data, error, hasMore } = await fetchOrdersForAdminList(supabase, {
    limit: ORDER_LIST_INITIAL_LIMIT,
    offset: 0,
    includeLineItems: false,
  });

  if (error || !data) {
    return (
      <p className="font-body text-[14px] text-red-800">
        Učitavanje porudžbina nije uspelo.
        {error?.message ? (
          <span className="block mt-2 text-[12px] text-silver-dark font-mono">
            {error.message}
          </span>
        ) : null}
      </p>
    );
  }

  return (
    <AdminPorudzbineClient
      initialOrders={data ?? []}
      initialHasMore={hasMore}
    />
  );
}
