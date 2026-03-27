import AdminKreatoriClient, {
  type AdminCreatorRow,
  type CreatorPaymentRow,
} from '@/components/admin/AdminKreatoriClient';
import { aggregateCreatorStats, type OrderAggRow } from '@/lib/panel-stats';
import { requireAdminServer } from '@/lib/supabase/panel-server';

export const dynamic = 'force-dynamic';

export default async function AdminKreatoriPage() {
  const supabase = await requireAdminServer();

  const { data: oRows, error: oErr } = await supabase
    .from('orders')
    .select('creator_id, total_rsd, commission_percent_applied, status');

  if (oErr) {
    return (
      <p className="font-body text-[14px] text-red-800">Učitavanje podataka nije uspelo.</p>
    );
  }

  const stats = aggregateCreatorStats((oRows ?? []) as OrderAggRow[]);

  // Prvo pokušaj sa bank_account (migracija creator_payments)
  let cRows: unknown[] | null = null;
  const withBank = await supabase
    .from('creators')
    .select(
      'id, email, display_name, referral_code, commission_percent, customer_discount_percent, bank_account, created_at'
    )
    .order('created_at', { ascending: true });

  if (withBank.error) {
    const withoutBank = await supabase
      .from('creators')
      .select(
        'id, email, display_name, referral_code, commission_percent, customer_discount_percent, created_at'
      )
      .order('created_at', { ascending: true });
    if (withoutBank.error) {
      return (
        <p className="font-body text-[14px] text-red-800">Učitavanje kreatora nije uspelo.</p>
      );
    }
    cRows = (withoutBank.data ?? []).map((c) => ({
      ...(c as object),
      bank_account: '',
    }));
  } else {
    cRows = withBank.data ?? [];
  }

  const creators = (cRows ?? []) as AdminCreatorRow[];

  let paymentsByCreator: Record<string, CreatorPaymentRow[]> = {};
  const payRes = await supabase
    .from('creator_payments')
    .select('id, creator_id, amount_rsd, paid_at, note, created_at')
    .order('paid_at', { ascending: false });

  if (!payRes.error && payRes.data) {
    for (const p of payRes.data as CreatorPaymentRow[]) {
      if (!paymentsByCreator[p.creator_id]) paymentsByCreator[p.creator_id] = [];
      paymentsByCreator[p.creator_id].push(p);
    }
  }

  return (
    <AdminKreatoriClient
      initialCreators={creators}
      initialStats={stats}
      initialPayments={paymentsByCreator}
    />
  );
}
