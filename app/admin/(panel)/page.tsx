import AdminOverviewClient from '@/components/admin/AdminOverviewClient';
import { commissionEarnedRsd } from '@/lib/commission';
import { requireAdminServer } from '@/lib/supabase/panel-server';

export const dynamic = 'force-dynamic';

export default async function AdminPregledPage() {
  const supabase = await requireAdminServer();

  const [{ count: orderCount }, { data: sumRows }, { count: creatorCount }] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_rsd, commission_percent_applied, status'),
    supabase.from('creators').select('id', { count: 'exact', head: true }),
  ]);

  let ukupanPromet = 0;
  let ukupnaZaradaKreatora = 0;
  for (const o of sumRows ?? []) {
    const row = o as {
      total_rsd: number | string;
      commission_percent_applied: number | string | null;
      status: string;
    };
    if (row.status !== 'placeno') continue;
    const t = Number(row.total_rsd);
    ukupanPromet += t;
    ukupnaZaradaKreatora += commissionEarnedRsd(t, row.commission_percent_applied);
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
