import AdminZaliheClient from '@/components/admin/AdminZaliheClient';
import { requireAdminServer } from '@/lib/supabase/panel-server';

export const dynamic = 'force-dynamic';

export default async function AdminZalihePage() {
  const supabase = await requireAdminServer();

  const [{ data: inventory }, { data: transactions }, { data: costs }] = await Promise.all([
    supabase
      .from('inventory')
      .select('product_slug, component_type, quantity, unit_cost_rsd, updated_at')
      .order('product_slug')
      .order('component_type'),
    supabase
      .from('inventory_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase.from('production_costs').select('*'),
  ]);

  type InvRow = {
    product_slug: string;
    component_type: string;
    quantity: number | string;
    unit_cost_rsd: number | string;
    updated_at: string;
  };

  type TxRow = {
    id: string;
    product_slug: string;
    component_type: string;
    quantity_change: number | string;
    type: string;
    note: string | null;
    total_cost_rsd: number | string | null;
    created_at: string;
  };

  const invRows = ((inventory ?? []) as InvRow[]).map((r) => ({
    product_slug: r.product_slug,
    component_type: r.component_type,
    quantity: Number(r.quantity),
    unit_cost_rsd: Number(r.unit_cost_rsd),
    updated_at: r.updated_at,
  }));

  const txRows = ((transactions ?? []) as TxRow[]).map((r) => ({
    id: r.id,
    product_slug: r.product_slug,
    component_type: r.component_type,
    quantity_change: Number(r.quantity_change),
    type: r.type,
    note: r.note,
    total_cost_rsd: r.total_cost_rsd != null ? Number(r.total_cost_rsd) : null,
    created_at: r.created_at,
  }));

  type CostRow = {
    product_slug: string;
    label_cost_rsd: number | string;
    packaging_cost_rsd: number | string;
    serum_cost_rsd: number | string;
  };

  const costMap: Record<string, Record<string, number>> = {};
  for (const c of (costs ?? []) as CostRow[]) {
    costMap[c.product_slug] = {
      nalepnica: Number(c.label_cost_rsd),
      ambalaza: Number(c.packaging_cost_rsd),
      serum: Number(c.serum_cost_rsd),
    };
  }

  return (
    <AdminZaliheClient
      inventory={invRows}
      transactions={txRows}
      costMap={costMap}
    />
  );
}
