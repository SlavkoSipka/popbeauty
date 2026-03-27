import { commissionEarnedRsd } from '@/lib/commission';

export type OrderAggRow = {
  creator_id: string | null;
  total_rsd: number | string;
  commission_percent_applied: number | string | null;
  status: string;
};

/**
 * Promet i zarada broje se SAMO za porudžbine sa statusom "placeno".
 * Broj porudžbina (count) i dalje obuhvata sve statuse (koliko je ukupno porudžbina preko koda).
 */
export function aggregateCreatorStats(
  orders: OrderAggRow[]
): Record<string, { count: number; promet: number; zarada: number }> {
  const m = new Map<string, { count: number; promet: number; zarada: number }>();
  for (const o of orders) {
    if (!o.creator_id) continue;
    const cur = m.get(o.creator_id) ?? { count: 0, promet: 0, zarada: 0 };
    const t = Number(o.total_rsd);
    cur.count += 1;
    if (o.status === 'placeno') {
      cur.promet += t;
      cur.zarada += commissionEarnedRsd(t, o.commission_percent_applied);
    }
    m.set(o.creator_id, cur);
  }
  return Object.fromEntries(m);
}
