import KreatorDashboardClient, {
  type KreatorOrderRow,
} from '@/components/kreator/KreatorDashboardClient';
import KreatorMissingLogout from '@/components/kreator/KreatorMissingLogout';
import { ORDER_LIST_LIMIT } from '@/lib/supabase/query-limits';
import { requireCreatorServer } from '@/lib/supabase/panel-server';

export const dynamic = 'force-dynamic';

export default async function KreatorPanelPage() {
  const { creator, supabase } = await requireCreatorServer();

  if (!creator) {
    return <KreatorMissingLogout />;
  }

  const { data: orderList } = await supabase
    .from('orders')
    .select(
      'id, total_rsd, created_at, status, referral_code, commission_percent_applied'
    )
    .eq('creator_id', creator.id)
    .order('created_at', { ascending: false })
    .limit(ORDER_LIST_LIMIT);

  return (
    <KreatorDashboardClient
      creator={creator}
      initialOrders={(orderList ?? []) as KreatorOrderRow[]}
    />
  );
}
