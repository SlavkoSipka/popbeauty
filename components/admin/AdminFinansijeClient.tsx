'use client';

import { useState, useMemo } from 'react';
import { commissionEarnedRsd } from '@/lib/commission';

type OrderRow = {
  total_rsd: number;
  status: string;
  commission_percent_applied: number | string | null;
  line_items: unknown;
  creator_id: string | null;
  created_at: string;
};

type LineItem = {
  slug?: string;
  quantity?: number;
  unit_price_rsd?: number;
  line_total_rsd?: number;
};

type Props = {
  totalRevenue: number;
  totalProfit: number;
  totalProductionCost: number;
  totalCommission: number;
  totalPaidOut: number;
  avgOrderValue: number;
  totalOrders: number;
  paidOrderCount: number;
  statusCounts: Record<string, { count: number; revenue: number }>;
  productStats: Record<string, { revenue: number; qty: number }>;
  costMap: Record<string, number>;
  orders: OrderRow[];
};

const STATUS_LABELS: Record<string, string> = {
  poruceno: 'Poručeno',
  kontaktiran: 'Kontaktiran',
  poslato: 'Poslato',
  placeno: 'Plaćeno',
  odbijeno: 'Odbijeno',
};

const PRODUCT_LABELS: Record<string, string> = {
  'vodeni-serum': 'Vodeni serum',
  'uljani-serum': 'Uljani serum',
};

type Period = 'all' | '30d' | 'this_month' | '7d';

export default function AdminFinansijeClient({
  totalRevenue: _totalRevenue,
  totalProfit: _totalProfit,
  totalProductionCost: _totalProductionCost,
  totalCommission: _totalCommission,
  totalPaidOut,
  avgOrderValue: _avgOrderValue,
  totalOrders: _totalOrders,
  paidOrderCount: _paidOrderCount,
  statusCounts: _statusCounts,
  productStats: _productStats,
  costMap,
  orders,
}: Props) {
  const [period, setPeriod] = useState<Period>('all');

  const fmt = (n: number) =>
    new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const filtered = useMemo(() => {
    if (period === 'all') return orders;
    const now = new Date();
    let cutoff: Date;
    if (period === '7d') {
      cutoff = new Date(now.getTime() - 7 * 86400000);
    } else if (period === '30d') {
      cutoff = new Date(now.getTime() - 30 * 86400000);
    } else {
      cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    return orders.filter((o) => new Date(o.created_at) >= cutoff);
  }, [orders, period]);

  const stats = useMemo(() => {
    const statusCounts: Record<string, { count: number; revenue: number }> = {};
    const productStats: Record<string, { revenue: number; qty: number }> = {};
    let totalRevenue = 0;
    let totalCommission = 0;
    let totalProductionCost = 0;
    let paidOrderCount = 0;

    for (const o of filtered) {
      const total = o.total_rsd;
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

    const totalProfit = totalRevenue - totalProductionCost - totalCommission;
    const avgOrderValue = paidOrderCount > 0 ? totalRevenue / paidOrderCount : 0;

    return {
      totalRevenue,
      totalProfit,
      totalProductionCost,
      totalCommission,
      paidOrderCount,
      avgOrderValue,
      totalOrders: filtered.length,
      statusCounts,
      productStats,
    };
  }, [filtered, costMap]);

  const statuses = ['poruceno', 'kontaktiran', 'poslato', 'placeno', 'odbijeno'];
  const productSlugs = Object.keys(stats.productStats).length > 0
    ? Object.keys(stats.productStats)
    : ['vodeni-serum', 'uljani-serum'];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 md:mb-8">
        <h2 className="font-display font-[300] text-[20px] md:text-[24px] text-ink">
          Finansije
        </h2>
        <div className="flex gap-1.5">
          {([
            ['all', 'Sve'],
            ['this_month', 'Ovaj mesec'],
            ['30d', '30 dana'],
            ['7d', '7 dana'],
          ] as [Period, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`font-body font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.1em] px-2.5 py-1.5 border transition-colors ${
                period === key
                  ? 'border-ink bg-ink text-white'
                  : 'border-silver-light text-silver-dark hover:border-ink hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4 mb-6 md:mb-10">
        <Card label="Promet" value={`${fmt(stats.totalRevenue)} RSD`} sub={'Samo „Plaćeno"'} />
        <Card
          label="Neto profit"
          value={`${fmt(stats.totalProfit)} RSD`}
          sub="Promet − troškovi − provizije"
          highlight={stats.totalProfit >= 0}
        />
        <Card label="Prosečna porudžbina" value={`${fmt(stats.avgOrderValue)} RSD`} sub="Plaćene" />
        <Card label="Porudžbine" value={String(stats.totalOrders)} sub={`${stats.paidOrderCount} plaćenih`} />
      </div>

      {/* Profit breakdown */}
      <Section title="Analiza profita">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="border-b border-silver-light">
                <Th>Proizvod</Th>
                <Th align="right">Prihod</Th>
                <Th align="right">Komada</Th>
                <Th align="right">Trošak/kom</Th>
                <Th align="right">Uk. trošak</Th>
                <Th align="right">Bruto profit</Th>
              </tr>
            </thead>
            <tbody>
              {productSlugs.map((slug) => {
                const ps = stats.productStats[slug] ?? { revenue: 0, qty: 0 };
                const cost = costMap[slug] ?? 0;
                const totalCost = cost * ps.qty;
                const gross = ps.revenue - totalCost;
                return (
                  <tr key={slug} className="border-b border-silver-light/50">
                    <Td>{PRODUCT_LABELS[slug] ?? slug}</Td>
                    <Td align="right">{fmt(ps.revenue)}</Td>
                    <Td align="right">{ps.qty}</Td>
                    <Td align="right">{fmt(cost)}</Td>
                    <Td align="right">{fmt(totalCost)}</Td>
                    <Td align="right" highlight={gross >= 0}>{fmt(gross)}</Td>
                  </tr>
                );
              })}
              <tr className="font-[500]">
                <Td>Ukupno</Td>
                <Td align="right">{fmt(stats.totalRevenue)}</Td>
                <Td align="right">
                  {productSlugs.reduce((s, slug) => s + (stats.productStats[slug]?.qty ?? 0), 0)}
                </Td>
                <Td align="right">—</Td>
                <Td align="right">{fmt(stats.totalProductionCost)}</Td>
                <Td align="right" highlight={stats.totalRevenue - stats.totalProductionCost >= 0}>
                  {fmt(stats.totalRevenue - stats.totalProductionCost)}
                </Td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-4 mt-4">
          <MiniCard label="Troškovi proizvodnje" value={`${fmt(stats.totalProductionCost)} RSD`} />
          <MiniCard label="Provizije kreatora" value={`${fmt(stats.totalCommission)} RSD`} />
          <MiniCard
            label="Neto profit"
            value={`${fmt(stats.totalProfit)} RSD`}
            highlight={stats.totalProfit >= 0}
          />
        </div>
      </Section>

      {/* Orders by status */}
      <Section title="Porudžbine po statusu">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 md:gap-4">
          {statuses.map((s) => {
            const sc = stats.statusCounts[s];
            return (
              <div key={s} className="border border-silver-light bg-white p-3 md:p-4">
                <p className="font-body font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.12em] text-silver-mid mb-1">
                  {STATUS_LABELS[s] ?? s}
                </p>
                <p className="font-display font-[300] text-[20px] md:text-[24px] text-ink tabular-nums">
                  {sc?.count ?? 0}
                </p>
                <p className="font-body font-[300] text-[10px] text-silver-mid mt-0.5">
                  {fmt(sc?.revenue ?? 0)} RSD
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Creator cost summary */}
      <Section title="Troškovi kreatora">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-4">
          <MiniCard label="Ukupne provizije (plaćene porudžbine)" value={`${fmt(stats.totalCommission)} RSD`} />
          <MiniCard label="Isplaćeno kreatorima" value={`${fmt(totalPaidOut)} RSD`} />
          <MiniCard
            label="Preostali dug"
            value={`${fmt(Math.max(0, stats.totalCommission - totalPaidOut))} RSD`}
            highlight={stats.totalCommission - totalPaidOut <= 0}
          />
        </div>
      </Section>

      {/* Margin summary */}
      <Section title="Marže">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
          <MiniCard
            label="Bruto marža"
            value={
              stats.totalRevenue > 0
                ? `${(((stats.totalRevenue - stats.totalProductionCost) / stats.totalRevenue) * 100).toFixed(1)}%`
                : '—'
            }
            sub="(Promet − proizvodnja) / Promet"
          />
          <MiniCard
            label="Neto marža"
            value={
              stats.totalRevenue > 0
                ? `${((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1)}%`
                : '—'
            }
            sub="Neto profit / Promet"
          />
          <MiniCard
            label="Udeo provizija"
            value={
              stats.totalRevenue > 0
                ? `${((stats.totalCommission / stats.totalRevenue) * 100).toFixed(1)}%`
                : '—'
            }
            sub="Provizije / Promet"
          />
          <MiniCard
            label="Udeo troškova"
            value={
              stats.totalRevenue > 0
                ? `${((stats.totalProductionCost / stats.totalRevenue) * 100).toFixed(1)}%`
                : '—'
            }
            sub="Proizvodnja / Promet"
          />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 md:mb-10">
      <h3 className="font-display font-[300] text-[16px] md:text-[18px] text-ink mb-3 md:mb-5">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Card({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="border border-silver-light bg-white p-4 md:p-6">
      <p className="font-body font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.14em] text-silver-mid mb-1.5 md:mb-2">
        {label}
      </p>
      <p
        className={`font-display font-[300] text-[16px] md:text-[24px] tabular-nums ${
          highlight === false ? 'text-red-600' : 'text-ink'
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className="font-body font-[300] text-[10px] md:text-[11px] text-silver-mid mt-1 leading-relaxed">
          {sub}
        </p>
      )}
    </div>
  );
}

function MiniCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="border border-silver-light bg-white p-3 md:p-4">
      <p className="font-body font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.12em] text-silver-mid mb-1">
        {label}
      </p>
      <p
        className={`font-display font-[300] text-[18px] md:text-[22px] tabular-nums ${
          highlight === false ? 'text-red-600' : 'text-ink'
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className="font-body font-[300] text-[9px] md:text-[10px] text-silver-mid mt-0.5">
          {sub}
        </p>
      )}
    </div>
  );
}

function Th({ children, align }: { children: React.ReactNode; align?: 'right' }) {
  return (
    <th
      className={`font-body font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-silver-mid py-2 pr-3 ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align,
  highlight,
}: {
  children: React.ReactNode;
  align?: 'right';
  highlight?: boolean;
}) {
  return (
    <td
      className={`font-body font-[300] text-[11px] md:text-[12px] text-ink py-2 pr-3 tabular-nums ${
        align === 'right' ? 'text-right' : 'text-left'
      } ${highlight === false ? 'text-red-600' : ''}`}
    >
      {children}
    </td>
  );
}
