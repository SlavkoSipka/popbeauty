import AdminPodesavanjaClient from '@/components/admin/AdminPodesavanjaClient';
import { requireAdminServer } from '@/lib/supabase/panel-server';

export const dynamic = 'force-dynamic';

export default async function AdminPodesavanjaPage() {
  const supabase = await requireAdminServer();

  const { data } = await supabase
    .from('site_settings')
    .select('site_discount_percent, bundle_discount_percent')
    .eq('id', 1)
    .maybeSingle();

  const row = data as {
    site_discount_percent?: number | string;
    bundle_discount_percent?: number | string;
  } | null;

  const siteDiscount = Number(row?.site_discount_percent ?? 0);
  const bundleDiscount = Number(row?.bundle_discount_percent ?? 10);

  return (
    <AdminPodesavanjaClient
      initialSiteDiscount={siteDiscount}
      initialBundleDiscount={Number.isFinite(bundleDiscount) ? bundleDiscount : 10}
    />
  );
}
