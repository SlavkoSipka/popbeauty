import AdminKalkulatorClient from '@/components/admin/AdminKalkulatorClient';
import { requireAdminServer } from '@/lib/supabase/panel-server';

export const dynamic = 'force-dynamic';

type ProductRow = {
  slug: string;
  name: string;
  base_price_rsd: number | string;
};

type CostRow = {
  product_slug: string;
  label_cost_rsd: number | string;
  packaging_cost_rsd: number | string;
  serum_cost_rsd: number | string;
};

type SettingsRow = {
  site_discount_percent?: number | string;
  bundle_discount_percent?: number | string;
};

export default async function AdminKalkulatorPage() {
  const supabase = await requireAdminServer();

  const [{ data: products }, { data: costs }, { data: settings }] = await Promise.all([
    supabase.from('products').select('slug, name, base_price_rsd'),
    supabase.from('production_costs').select('*'),
    supabase
      .from('site_settings')
      .select('site_discount_percent, bundle_discount_percent')
      .eq('id', 1)
      .maybeSingle(),
  ]);

  const productList = ((products ?? []) as ProductRow[]).map((p) => ({
    slug: p.slug,
    name: p.name,
    basePriceRsd: Number(p.base_price_rsd),
  }));

  const costMap: Record<string, { label: number; packaging: number; serum: number; total: number }> = {};
  for (const c of (costs ?? []) as CostRow[]) {
    const label = Number(c.label_cost_rsd);
    const packaging = Number(c.packaging_cost_rsd);
    const serum = Number(c.serum_cost_rsd);
    costMap[c.product_slug] = { label, packaging, serum, total: label + packaging + serum };
  }

  const row = settings as SettingsRow | null;
  const currentSiteDiscount = Number(row?.site_discount_percent ?? 0);
  const currentBundleDiscount = Number(row?.bundle_discount_percent ?? 10);

  return (
    <AdminKalkulatorClient
      products={productList}
      costMap={costMap}
      currentSiteDiscount={currentSiteDiscount}
      currentBundleDiscount={Number.isFinite(currentBundleDiscount) ? currentBundleDiscount : 10}
    />
  );
}
