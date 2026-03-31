import AdminPodesavanjaClient from '@/components/admin/AdminPodesavanjaClient';
import { requireAdminServer } from '@/lib/supabase/panel-server';

export const dynamic = 'force-dynamic';

export default async function AdminPodesavanjaPage() {
  const supabase = await requireAdminServer();

  const [{ data }, { data: creatorRows }] = await Promise.all([
    supabase
      .from('site_settings')
      .select('site_discount_percent, bundle_discount_percent')
      .eq('id', 1)
      .maybeSingle(),
    supabase.from('creators').select('commission_percent, customer_discount_percent'),
  ]);

  const row = data as {
    site_discount_percent?: number | string;
    bundle_discount_percent?: number | string;
  } | null;

  const siteDiscount = Number(row?.site_discount_percent ?? 0);
  const bundleDiscount = Number(row?.bundle_discount_percent ?? 10);

  const cr = (creatorRows ?? []) as {
    commission_percent: number | string;
    customer_discount_percent: number | string;
  }[];
  const uniqComm = new Set(cr.map((r) => Number(r.commission_percent)));
  const uniqCust = new Set(cr.map((r) => Number(r.customer_discount_percent)));
  const creatorCommissionMixed = cr.length > 0 && uniqComm.size > 1;
  const creatorCustomerDiscountMixed = cr.length > 0 && uniqCust.size > 1;
  const initialCreatorCommission =
    cr.length === 0 ? 20 : creatorCommissionMixed ? null : Number([...uniqComm][0]);
  const initialCreatorCustomerDiscount =
    cr.length === 0
      ? 15
      : creatorCustomerDiscountMixed
        ? null
        : Number([...uniqCust][0]);

  return (
    <AdminPodesavanjaClient
      initialSiteDiscount={siteDiscount}
      initialBundleDiscount={Number.isFinite(bundleDiscount) ? bundleDiscount : 10}
      initialCreatorCommission={initialCreatorCommission}
      initialCreatorCustomerDiscount={initialCreatorCustomerDiscount}
      creatorCommissionMixed={creatorCommissionMixed}
      creatorCustomerDiscountMixed={creatorCustomerDiscountMixed}
      creatorCount={cr.length}
    />
  );
}
