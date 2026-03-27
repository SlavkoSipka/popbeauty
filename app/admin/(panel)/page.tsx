import AdminOverviewClient from '@/components/admin/AdminOverviewClient';
import { commissionEarnedRsd } from '@/lib/commission';
import { requireAdminServer } from '@/lib/supabase/panel-server';

export const dynamic = 'force-dynamic';

export default async function AdminPregledPage() {
  const supabase = await requireAdminServer();

  const [{ count: orderCount }, { data: sumRows }, { count: creatorCount }] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_rsd, commission_percent_applied'),
    supabase.from('creators').select('id', { count: 'exact', head: true }),
  ]);

  let ukupanPromet = 0;
  let ukupnaZaradaKreatora = 0;
  for (const o of sumRows ?? []) {
    const t = Number((o as { total_rsd: number | string }).total_rsd);
    ukupanPromet += t;
    ukupnaZaradaKreatora += commissionEarnedRsd(
      t,
      (o as { commission_percent_applied: number | string | null }).commission_percent_applied
    );
  }

  return (
    <AdminOverviewClient
      ukupnoPorudzbina={orderCount ?? 0}
      ukupanPromet={ukupanPromet}
      ukupnaZaradaKreatora={ukupnaZaradaKreatora}
      creatorCount={creatorCount ?? 0}
    />
  );
}
