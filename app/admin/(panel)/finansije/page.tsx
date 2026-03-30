import AdminFinansijeClient from '@/components/admin/AdminFinansijeClient';
import { commissionEarnedRsd } from '@/lib/commission';
import { requireAdminServer } from '@/lib/supabase/panel-server';

export const dynamic = 'force-dynamic';

type OrderRow = {
  total_rsd: number | string;
  subtotal_rsd: number | string | null;
  commission_percent_applied: number | string | null;
  status: string;
  line_items: unknown;
  creator_id: string | null;
  referral_code: string | null;
  created_at: string;
};

type PaymentRow = {
  amount_rsd: number | string;
};

type CostRow = {
  product_slug: string;
  label_cost_rsd: number | string;
  packaging_cost_rsd: number | string;
  serum_cost_rsd: number | string;
};

type LineItem = {
  slug?: string;
  quantity?: number;
  unit_price_rsd?: number;
  line_total_rsd?: number;
};

export default async function AdminFinansijePage() {
  const supabase = await requireAdminServer();

  const [
    { data: orders },
    { data: costs },
    { data: payments },
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('total_rsd, subtotal_rsd, commission_percent_applied, status, line_items, creator_id, referral_code, created_at')
      .order('created_at', { ascending: false })
      .limit(5000),
    supabase.from('production_costs').select('*'),
    supabase.from('creator_payments').select('amount_rsd'),
  ]);

  const costMap: Record<string, number> = {};
  for (const c of (costs ?? []) as CostRow[]) {
    costMap[c.product_slug] =
      Number(c.label_cost_rsd) + Number(c.packaging_cost_rsd) + Number(c.serum_cost_rsd);
  }

  const statusCounts: Record<string, { count: number; revenue: number }> = {};
  const productStats: Record<string, { revenue: number; qty: number }> = {};
  let totalRevenue = 0;
  let totalCommission = 0;
  let totalProductionCost = 0;
  let paidOrderCount = 0;

  for (const o of (orders ?? []) as OrderRow[]) {
    const total = Number(o.total_rsd) || 0;
    const status = o.status || 'poruceno';

    if (!statusCounts[status]) statusCounts[status] = { count: 0, revenue: 0 };
    statusCounts[status].count += 1;
    statusCounts[status].revenue += total;

    if (status !== 'placeno') continue;
    paidOrderCount += 1;
    totalRevenue += total;
    totalCommission += commissionEarnedRsd(total, o.commission_percent_applied);

    const items = (Array.isArray(o.line_items) ? o.line_items : []) as LineItem[];
    for (const item of items) {
      const slug = item.slug ?? '';
      const qty = item.quantity ?? 0;
      const lineTotal = item.line_total_rsd ?? (item.unit_price_rsd ?? 0) * qty;
      if (!productStats[slug]) productStats[slug] = { revenue: 0, qty: 0 };
      productStats[slug].revenue += lineTotal;
      productStats[slug].qty += qty;
      totalProductionCost += (costMap[slug] ?? 0) * qty;
    }
  }

  let totalPaidOut = 0;
  for (const p of (payments ?? []) as PaymentRow[]) {
    totalPaidOut += Number(p.amount_rsd) || 0;
  }

  return (
    <AdminFinansijeClient
      totalRevenue={totalRevenue}
      totalProfit={totalRevenue - totalProductionCost - totalCommission}
      totalProductionCost={totalProductionCost}
      totalCommission={totalCommission}
      totalPaidOut={totalPaidOut}
      avgOrderValue={paidOrderCount > 0 ? totalRevenue / paidOrderCount : 0}
      totalOrders={(orders ?? []).length}
      paidOrderCount={paidOrderCount}
      statusCounts={statusCounts}
      productStats={productStats}
      costMap={costMap}
      orders={(orders ?? []).map((o) => {
        const row = o as OrderRow;
        return {
          total_rsd: Number(row.total_rsd) || 0,
          status: row.status,
          commission_percent_applied: row.commission_percent_applied,
          line_items: row.line_items,
          creator_id: row.creator_id,
          created_at: row.created_at,
        };
      })}
    />
  );
}
