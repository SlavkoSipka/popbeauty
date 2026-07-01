'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { commissionEarnedRsd } from '@/lib/commission';
import { SHIPPING_RSD } from '@/lib/shipping';
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  formatOrderStatusLabel,
  telHref,
} from '@/lib/order-status';
import type { OrderStatus } from '@/lib/order-status';

export type LineItem = {
  slug?: string;
  name?: string;
  quantity?: number;
  unit_price_rsd?: number;
  line_total_rsd?: number;
};

export type AdminOrderRow = {
  id: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  address_line: string;
  city: string;
  postal_code: string;
  note: string | null;
  /** Interne admin beleške (kolona `admin_notes`). */
  admin_notes?: string | null;
  line_items: unknown;
  total_rsd: number | string;
  subtotal_rsd: number | string | null;
  shipping_rsd?: number | string | null;
  discount_type: string | null;
  discount_percent: number | string | null;
  referral_discount_percent: number | string | null;
  referral_code: string | null;
  promo_code?: string | null;
  promo_discount_percent?: number | string | null;
  promo_discount_rsd?: number | string | null;
  creator_id: string | null;
  commission_percent_applied: number | string | null;
  status: string;
  created_at: string;
};

type Props = {
  initialOrders: AdminOrderRow[];
  initialHasMore: boolean;
};

type StatusFilter = 'all' | OrderStatus;

const ORDER_DETAILS_COLUMNS =
  'line_items, subtotal_rsd, discount_type, discount_percent, referral_discount_percent, promo_code, promo_discount_percent, promo_discount_rsd, shipping_rsd';

/** Mapira stare engleske statuse na srpske radi filtera. */
function canonicalStatusForFilter(raw: string): string {
  if ((ORDER_STATUSES as readonly string[]).includes(raw)) return raw;
  const legacy: Record<string, OrderStatus> = {
    pending: 'poruceno',
    processing: 'poslato',
    shipped: 'poslato',
    completed: 'placeno',
    cancelled: 'odbijeno',
  };
  return legacy[raw] ?? raw;
}

/**
 * Iznos proizvoda bez poštarine. Za stare porudžbine (shipping_rsd == null)
 * pretpostavljamo da je poštarina uvek bila dodata (SHIPPING_RSD).
 */
function productsTotalRsd(o: AdminOrderRow): number {
  const total = Number(o.total_rsd) || 0;
  const shipping = o.shipping_rsd != null ? Number(o.shipping_rsd) : SHIPPING_RSD;
  return total - shipping;
}

function OrderDetails({
  o,
  fmtMoney,
  onRequestDetails,
  detailsLoaded,
  detailsLoading,
}: {
  o: AdminOrderRow;
  fmtMoney: (n: number) => string;
  onRequestDetails: () => void;
  detailsLoaded: boolean;
  detailsLoading: boolean;
}) {
  const productsTotal = productsTotalRsd(o);
  return (
    <div className="space-y-2 text-[11px] text-silver-dark">
      <p>
        {o.address_line}, {o.postal_code} {o.city}
      </p>
      {o.note ? <p>Napomena: {o.note}</p> : null}
      {!detailsLoaded && !detailsLoading ? (
        <button
          type="button"
          onClick={onRequestDetails}
          className="font-body text-[11px] text-ink underline underline-offset-2"
        >
          Učitaj stavke korpe
        </button>
      ) : null}
      {detailsLoading ? (
        <p className="text-[10px] text-silver-mid">Učitavanje stavki…</p>
      ) : null}
      {detailsLoaded && Array.isArray(o.line_items) ? (
        <ul className="list-disc pl-4 space-y-1 text-ink">
          {(o.line_items as LineItem[]).map((li, i) => (
            <li key={i}>
              {li.name ?? li.slug} × {li.quantity} —{' '}
              {li.line_total_rsd != null ? `${fmtMoney(Number(li.line_total_rsd))} RSD` : ''}
            </li>
          ))}
        </ul>
      ) : null}
      {(o.subtotal_rsd != null ||
        o.discount_type ||
        o.referral_discount_percent != null ||
        o.promo_code) && (
        <div className="border-t border-silver-light pt-2 mt-2 space-y-1">
          {o.subtotal_rsd != null && (
            <p>
              Ukupno pre popusta:{' '}
              <span className="text-ink">{fmtMoney(Number(o.subtotal_rsd))} RSD</span>
            </p>
          )}
          {o.discount_type && o.discount_percent != null && (
            <p>
              {o.discount_type === 'bundle' ? 'Paket' : 'Sajt'} popust:{' '}
              <span className="text-ink">−{Number(o.discount_percent)}%</span>
            </p>
          )}
          {o.referral_discount_percent != null && (
            <p>
              Referral popust:{' '}
              <span className="text-ink">−{Number(o.referral_discount_percent)}%</span>
            </p>
          )}
          {o.promo_code != null && o.promo_discount_percent != null && (
            <p>
              Promo kod <span className="font-mono">{o.promo_code}</span>:{' '}
              <span className="text-ink">
                −{Number(o.promo_discount_percent)}%
                {o.promo_discount_rsd != null
                  ? ` (−${fmtMoney(Number(o.promo_discount_rsd))} RSD)`
                  : ''}
              </span>
            </p>
          )}
          <p>
            Cena (bez poštarine):{' '}
            <span className="text-ink font-[400]">{fmtMoney(productsTotal)} RSD</span>
          </p>
        </div>
      )}
    </div>
  );
}

function OrderDetailsExpander({
  o,
  fmtMoney,
  patchOrder,
  className,
}: {
  o: AdminOrderRow;
  fmtMoney: (n: number) => string;
  patchOrder: (id: string, patch: Partial<AdminOrderRow>) => void;
  className?: string;
}) {
  const hasLineItems = Array.isArray(o.line_items);
  const [loading, setLoading] = useState(false);

  const loadDetails = useCallback(async () => {
    if (hasLineItems || loading) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_DETAILS_COLUMNS)
      .eq('id', o.id)
      .maybeSingle();
    setLoading(false);
    if (!error && data) {
      patchOrder(o.id, data as Partial<AdminOrderRow>);
    }
  }, [hasLineItems, loading, o.id, patchOrder]);

  const onToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    if ((e.target as HTMLDetailsElement).open) {
      void loadDetails();
    }
  };

  return (
    <details className={className ?? 'cursor-pointer'} onToggle={onToggle}>
      <summary className="font-body text-[11px] text-ink underline underline-offset-2">
        Adresa i stavke
      </summary>
      <div className="mt-3 pl-1 max-w-[320px]">
        <OrderDetails
          o={o}
          fmtMoney={fmtMoney}
          onRequestDetails={() => void loadDetails()}
          detailsLoaded={hasLineItems}
          detailsLoading={loading}
        />
      </div>
    </details>
  );
}

function OrderAdminNotesField({
  orderId,
  initial,
  onSaved,
}: {
  orderId: string;
  initial: string | null | undefined;
  onSaved: (id: string, notes: string | null) => void;
}) {
  const [value, setValue] = useState(() => initial ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => {
    setValue(initial ?? '');
  }, [initial, orderId]);

  const save = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const trimmed = value.trim();
    const payload = trimmed === '' ? null : trimmed;
    setSaving(true);
    setSaveError(false);
    const { error } = await supabase.from('orders').update({ admin_notes: payload }).eq('id', orderId);
    setSaving(false);
    if (error) {
      setSaveError(true);
      return;
    }
    onSaved(orderId, payload);
  };

  return (
    <div className="space-y-1 w-full min-w-0">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        rows={4}
        maxLength={8000}
        placeholder="Interne beleške…"
        className="w-full min-h-[5.5rem] resize-y border border-silver-light bg-white px-2.5 py-2 font-body text-[11px] md:text-[12px] text-ink leading-relaxed placeholder:text-silver-mid focus:border-sage-mid focus:outline-none"
      />
      <div className="flex items-center gap-2 min-h-[14px]">
        {saving ? (
          <span className="text-[10px] text-silver-mid">Čuvanje…</span>
        ) : saveError ? (
          <span className="text-[10px] text-red-700">Nije sačuvano. Pokušaj ponovo.</span>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminPorudzbineClient({ initialOrders, initialHasMore }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchInput]);

  const fetchOrders = useCallback(
    async (opts: { q: string; offset: number; append: boolean }) => {
      const params = new URLSearchParams();
      if (opts.q) params.set('q', opts.q);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (opts.offset > 0) params.set('offset', String(opts.offset));

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = (await res.json()) as {
        orders?: AdminOrderRow[];
        hasMore?: boolean;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? 'Učitavanje nije uspelo.');
      }

      const rows = data.orders ?? [];
      setOrders((prev) => (opts.append ? [...prev, ...rows] : rows));
      setHasMore(Boolean(data.hasMore));
    },
    [statusFilter],
  );

  useEffect(() => {
    let cancelled = false;
    setFetchError(null);

    if (!searchQuery) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    void (async () => {
      try {
        await fetchOrders({ q: searchQuery, offset: 0, append: false });
      } catch (err) {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : 'Pretraga nije uspela.');
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, statusFilter, fetchOrders]);

  useEffect(() => {
    if (searchQuery) return;
    setOrders(initialOrders);
    setHasMore(initialHasMore);
  }, [initialOrders, initialHasMore, searchQuery]);

  const filteredOrders = useMemo(() => {
    if (searchQuery) return orders;
    if (statusFilter === 'all') return orders;
    return orders.filter((o) => canonicalStatusForFilter(o.status) === statusFilter);
  }, [orders, statusFilter, searchQuery]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setFetchError(null);
    try {
      await fetchOrders({ q: searchQuery, offset: orders.length, append: true });
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Učitavanje nije uspelo.');
    } finally {
      setLoadingMore(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setUpdating(id);
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    setUpdating(null);
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  };

  const patchAdminNotes = (id: string, admin_notes: string | null) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, admin_notes } : o)));
  };

  const patchOrder = (id: string, patch: Partial<AdminOrderRow>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  const fmtMoney = (n: number) =>
    new Intl.NumberFormat('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      n
    );

  const statusSelect = (o: AdminOrderRow) => (
    <select
      value={o.status}
      disabled={updating === o.id}
      onChange={(e) => updateStatus(o.id, e.target.value)}
      className="w-full md:max-w-[130px] border border-silver-light bg-white px-2 py-1.5 font-body text-[11px] text-ink focus:border-sage-mid focus:outline-none"
    >
      {Array.from(new Set([...ORDER_STATUSES, o.status])).map((s) => (
        <option key={s} value={s}>
          {formatOrderStatusLabel(s)}
        </option>
      ))}
    </select>
  );

  return (
    <div>
      <h2 className="font-display font-[300] text-[20px] md:text-[24px] text-ink mb-2">
        Sve porudžbine
      </h2>
      <p className="font-body font-[300] text-[12px] md:text-[13px] text-silver-dark mb-4 md:mb-5 max-w-[720px] leading-relaxed">
        Plaćanje je <strong className="font-[400] text-ink">pouzećem</strong>. Pregled pošiljki,
        kupac, kontakt, adresa, stavke korpe, referral i status. Broj telefona je link za poziv.
        {!searchQuery ? (
          <span className="block mt-2 text-silver-mid">
            Prikazano je poslednjih {orders.length} porudžbina. Koristi pretragu za starije ili
            učitaj još.
          </span>
        ) : null}
      </p>

      <div className="mb-5 md:mb-6 space-y-3">
        <label htmlFor="admin-orders-search" className="sr-only">
          Pretraga porudžbina
        </label>
        <input
          id="admin-orders-search"
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Pretraga: ime, telefon, email, adresa, grad, cena, proizvod…"
          className="w-full border border-silver-light bg-white px-3 py-2.5 font-body text-[13px] text-ink placeholder:text-silver-mid focus:border-sage-mid focus:outline-none"
        />
        {isSearching ? (
          <p className="font-body font-[300] text-[11px] text-silver-mid">Pretraga…</p>
        ) : null}
        {fetchError ? (
          <p className="font-body font-[300] text-[11px] text-red-800" role="alert">
            {fetchError}
          </p>
        ) : null}
        {searchQuery && !isSearching ? (
          <p className="font-body font-[300] text-[11px] text-silver-mid">
            Rezultata: {filteredOrders.length}
            {filteredOrders.length === 0 ? ' — probaj drugi pojam.' : null}
          </p>
        ) : null}
      </div>

      <div className="mb-5 md:mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <label
          htmlFor="admin-orders-status-filter"
          className="font-body font-[400] text-[10px] uppercase tracking-[0.12em] text-silver-dark shrink-0"
        >
          Status
        </label>
        <select
          id="admin-orders-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="w-full sm:w-auto min-w-[200px] max-w-full border border-silver-light bg-white px-3 py-2 font-body text-[12px] text-ink focus:border-sage-mid focus:outline-none"
        >
          <option value="all">Sve porudžbine</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        {statusFilter !== 'all' && !searchQuery && (
          <span className="font-body font-[300] text-[11px] text-silver-mid">
            Prikazano: {filteredOrders.length} od {orders.length}
          </span>
        )}
      </div>

      {hasMore ? (
        <div className="mb-5 md:mb-6">
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={loadingMore}
            className="border border-silver-light bg-white px-4 py-2 font-body text-[12px] text-ink hover:border-sage-mid disabled:opacity-50"
          >
            {loadingMore
              ? 'Učitavanje…'
              : searchQuery
                ? 'Učitaj još rezultata pretrage'
                : 'Učitaj starije porudžbine'}
          </button>
        </div>
      ) : null}

      {/* ── Mobile: card layout ── */}
      <div className="md:hidden space-y-3">
        {filteredOrders.map((o) => {
          const total = Number(o.total_rsd);
          const productsTotal = productsTotalRsd(o);
          const earned = commissionEarnedRsd(total, o.commission_percent_applied);
          return (
            <div key={o.id} className="border border-silver-light bg-white p-4 space-y-3 font-body text-[12px]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-ink font-[400]">
                    {o.customer_first_name} {o.customer_last_name}
                  </p>
                  <p className="text-[10px] text-silver-dark tabular-nums mt-0.5">
                    {new Date(o.created_at).toLocaleString('sr-RS', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <p className="text-ink font-[400] tabular-nums whitespace-nowrap">
                  {fmtMoney(productsTotal)} RSD
                </p>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                <a
                  href={telHref(o.customer_phone)}
                  className="text-ink font-[400] underline underline-offset-2 decoration-sage-mid/40"
                >
                  {o.customer_phone}
                </a>
                <a
                  href={`mailto:${encodeURIComponent(o.customer_email)}`}
                  className="text-silver-dark underline underline-offset-2 decoration-sage-mid/40 truncate max-w-[200px]"
                >
                  {o.customer_email}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-silver-dark">
                {o.referral_code && (
                  <span>
                    Ref: <span className="font-mono text-ink">{o.referral_code}</span>
                  </span>
                )}
                {o.commission_percent_applied != null && (
                  <span>
                    Zarada kr.:{' '}
                    <span className="text-ink tabular-nums">{fmtMoney(earned)} RSD</span>
                  </span>
                )}
              </div>

              <div>{statusSelect(o)}</div>

              <div className="pt-1">
                <p className="font-body font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark mb-1.5">
                  Beleške
                </p>
                <OrderAdminNotesField
                  orderId={o.id}
                  initial={o.admin_notes}
                  onSaved={patchAdminNotes}
                />
              </div>

              <OrderDetailsExpander
                o={o}
                fmtMoney={fmtMoney}
                patchOrder={patchOrder}
                className="cursor-pointer"
              />
            </div>
          );
        })}
      </div>

      {/* ── Desktop: table ── */}
      <div className="hidden md:block border border-silver-light overflow-x-auto bg-white">
        <table className="w-full min-w-[1280px] text-left font-body text-[12px]">
          <thead>
            <tr className="border-b border-silver-light bg-off-white">
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Datum
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Kupac
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Kontakt
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Iznos
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Referral
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Zarada kr.
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Status
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Detalji
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark min-w-[220px] max-w-[280px]">
                Beleške
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => {
              const total = Number(o.total_rsd);
              const productsTotal = productsTotalRsd(o);
              const earned = commissionEarnedRsd(total, o.commission_percent_applied);
              return (
                <tr key={o.id} className="border-b border-silver-light align-top">
                  <td className="px-3 py-3 text-silver-dark whitespace-nowrap tabular-nums">
                    {new Date(o.created_at).toLocaleString('sr-RS', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-3 py-3 text-ink max-w-[140px]">
                    {o.customer_first_name} {o.customer_last_name}
                  </td>
                  <td className="px-3 py-3 text-silver-dark max-w-[180px] break-words">
                    <div>
                      <a
                        href={`mailto:${encodeURIComponent(o.customer_email)}`}
                        className="text-ink underline underline-offset-2 decoration-sage-mid/40 hover:decoration-ink"
                      >
                        {o.customer_email}
                      </a>
                    </div>
                    <div className="mt-0.5">
                      <a
                        href={telHref(o.customer_phone)}
                        className="text-ink font-[400] underline underline-offset-2 decoration-sage-mid/40 hover:decoration-ink"
                      >
                        {o.customer_phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-ink tabular-nums whitespace-nowrap">
                    {fmtMoney(productsTotal)} RSD
                  </td>
                  <td className="px-3 py-3 text-silver-dark font-mono text-[11px]">
                    {o.referral_code ?? '—'}
                  </td>
                  <td className="px-3 py-3 text-ink tabular-nums whitespace-nowrap">
                    {o.commission_percent_applied != null ? `${fmtMoney(earned)} RSD` : '—'}
                  </td>
                  <td className="px-3 py-3">{statusSelect(o)}</td>
                  <td className="px-3 py-3">
                    <OrderDetailsExpander o={o} fmtMoney={fmtMoney} patchOrder={patchOrder} />
                  </td>
                  <td className="px-3 py-3 align-top min-w-[220px] max-w-[280px]">
                    <OrderAdminNotesField
                      orderId={o.id}
                      initial={o.admin_notes}
                      onSaved={patchAdminNotes}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 font-body font-[300] text-[14px] text-silver-dark text-center border border-dashed border-silver-light py-12">
          Još nema porudžbina.
        </p>
      ) : filteredOrders.length === 0 ? (
        <p className="mt-8 font-body font-[300] text-[14px] text-silver-dark text-center border border-dashed border-silver-light py-12">
          {searchQuery
            ? 'Nema rezultata za tu pretragu.'
            : 'Nema porudžbina sa izabranim statusom. Izaberite drugi filter ili „Sve porudžbine“.'}
        </p>
      ) : null}
    </div>
  );
}
