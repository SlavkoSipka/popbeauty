import AdminPorudzbineClient, {
  type AdminOrderRow,
} from '@/components/admin/AdminPorudzbineClient';
import { ORDER_LIST_COLUMNS, ORDER_LIST_LIMIT } from '@/lib/supabase/query-limits';
import { requireAdminServer } from '@/lib/supabase/panel-server';

export const dynamic = 'force-dynamic';

export default async function AdminPorudzbinePage() {
  const supabase = await requireAdminServer();

  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_LIST_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(ORDER_LIST_LIMIT);

  if (error) {
    return (
      <p className="font-body text-[14px] text-red-800">
        Učitavanje porudžbina nije uspelo.
      </p>
    );
  }

  const rows = (data ?? []) as AdminOrderRow[];
  const listTruncated = rows.length >= ORDER_LIST_LIMIT;

  return <AdminPorudzbineClient initialOrders={rows} listTruncated={listTruncated} />;
}
