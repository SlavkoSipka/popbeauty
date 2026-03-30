'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type InvRow = {
  product_slug: string;
  component_type: string;
  quantity: number;
  unit_cost_rsd: number;
  updated_at: string;
};

type TxRow = {
  id: string;
  product_slug: string;
  component_type: string;
  quantity_change: number;
  type: string;
  note: string | null;
  total_cost_rsd: number | null;
  created_at: string;
};

type Props = {
  inventory: InvRow[];
  transactions: TxRow[];
  costMap: Record<string, Record<string, number>>;
};

const PRODUCT_LABELS: Record<string, string> = {
  'vodeni-serum': 'Vodeni serum',
  'uljani-serum': 'Uljani serum',
};

const COMPONENT_LABELS: Record<string, string> = {
  nalepnica: 'Nalepnica',
  ambalaza: 'Ambalaža',
  serum: 'Serum',
};

const TYPE_LABELS: Record<string, string> = {
  purchase: 'Nabavka',
  sale: 'Prodaja',
  adjustment: 'Korekcija',
};

const PRODUCTS = ['vodeni-serum', 'uljani-serum'];
const COMPONENTS = ['nalepnica', 'ambalaza', 'serum'] as const;

export default function AdminZaliheClient({ inventory, transactions, costMap }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Purchase form
  const [pSlug, setPSlug] = useState(PRODUCTS[0]);
  const [pComp, setPComp] = useState<string>(COMPONENTS[0]);
  const [pQty, setPQty] = useState(0);
  const [pCost, setPCost] = useState(0);

  // Adjustment form
  const [aSlug, setASlug] = useState(PRODUCTS[0]);
  const [aComp, setAComp] = useState<string>(COMPONENTS[0]);
  const [aQty, setAQty] = useState(0);
  const [aNote, setANote] = useState('');

  const fmt = (n: number) =>
    new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const getRow = (slug: string, comp: string) =>
    inventory.find((r) => r.product_slug === slug && r.component_type === comp);

  const getMaxProducible = (slug: string) => {
    const quantities = COMPONENTS.map((c) => getRow(slug, c)?.quantity ?? 0);
    return Math.min(...quantities);
  };

  const totalInventoryValue = inventory.reduce(
    (sum, r) => sum + r.quantity * r.unit_cost_rsd,
    0,
  );

  async function handleSubmit(action: 'purchase' | 'adjustment') {
    setLoading(true);
    setError('');
    try {
      const body =
        action === 'purchase'
          ? {
              action,
              product_slug: pSlug,
              component_type: pComp,
              quantity: pQty,
              unit_cost_rsd: pCost,
            }
          : {
              action,
              product_slug: aSlug,
              component_type: aComp,
              quantity: aQty,
              note: aNote || undefined,
            };

      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Greška');
        return;
      }

      if (action === 'purchase') {
        setPQty(0);
        setPCost(0);
      } else {
        setAQty(0);
        setANote('');
      }

      router.refresh();
    } catch {
      setError('Mrežna greška');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="font-display font-[300] text-[20px] md:text-[24px] text-ink mb-5 md:mb-8">
        Zalihe
      </h2>

      {error && (
        <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 font-body text-[11px] md:text-[12px]">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4 mb-6 md:mb-10">
        <div className="border border-silver-light bg-white p-4 md:p-6">
          <p className="font-body font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.14em] text-silver-mid mb-1.5">
            Ukupna vrednost zaliha
          </p>
          <p className="font-display font-[300] text-[16px] md:text-[24px] text-ink tabular-nums">
            {fmt(totalInventoryValue)} RSD
          </p>
        </div>
        {PRODUCTS.map((slug) => (
          <div key={slug} className="border border-silver-light bg-white p-4 md:p-6">
            <p className="font-body font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.14em] text-silver-mid mb-1.5">
              {PRODUCT_LABELS[slug]} — može da se napravi
            </p>
            <p className="font-display font-[300] text-[24px] md:text-[32px] text-ink tabular-nums">
              {getMaxProducible(slug)}
            </p>
            <p className="font-body font-[300] text-[10px] text-silver-mid mt-0.5">
              komada (min. komponenta)
            </p>
          </div>
        ))}
      </div>

      {/* Stock per product */}
      {PRODUCTS.map((slug) => (
        <div key={slug} className="mb-6 md:mb-10">
          <h3 className="font-display font-[300] text-[16px] md:text-[18px] text-ink mb-3 md:mb-4">
            {PRODUCT_LABELS[slug]}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-4">
            {COMPONENTS.map((comp) => {
              const row = getRow(slug, comp);
              const qty = row?.quantity ?? 0;
              const cost = row?.unit_cost_rsd ?? costMap[slug]?.[comp] ?? 0;
              return (
                <div key={comp} className="border border-silver-light bg-white p-3 md:p-4">
                  <p className="font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.1em] text-silver-mid mb-2">
                    {COMPONENT_LABELS[comp]}
                  </p>
                  <div className="space-y-1 font-body text-[11px] md:text-[12px] text-ink">
                    <div className="flex justify-between">
                      <span className="text-silver-dark">Količina:</span>
                      <span className="font-[500] tabular-nums">{qty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-silver-dark">Cena/kom:</span>
                      <span className="tabular-nums">{fmt(cost)} RSD</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-silver-light/50">
                      <span className="text-silver-dark">Vrednost:</span>
                      <span className="font-[500] tabular-nums">{fmt(qty * cost)} RSD</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Purchase form */}
      <div className="border border-silver-light bg-white p-4 md:p-6 mb-6 md:mb-10">
        <h3 className="font-display font-[300] text-[14px] md:text-[16px] text-ink mb-4">
          Naruči zalihe
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
          <SelectField
            label="Proizvod"
            value={pSlug}
            onChange={setPSlug}
            options={PRODUCTS.map((s) => ({ value: s, label: PRODUCT_LABELS[s] }))}
          />
          <SelectField
            label="Komponenta"
            value={pComp}
            onChange={setPComp}
            options={COMPONENTS.map((c) => ({ value: c, label: COMPONENT_LABELS[c] }))}
          />
          <NumberField label="Količina" value={pQty} onChange={setPQty} min={1} />
          <NumberField
            label="Cena po komadu (RSD)"
            value={pCost}
            onChange={setPCost}
            min={0}
            step={0.01}
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="font-body text-[12px] md:text-[13px] text-ink">
            Ukupna cena:{' '}
            <span className="font-[500] tabular-nums">
              {fmt(pQty * pCost)} RSD
            </span>
          </div>
          <button
            type="button"
            disabled={loading || pQty <= 0}
            onClick={() => handleSubmit('purchase')}
            className="inline-flex border border-ink bg-ink px-4 py-2.5 font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-white hover:bg-transparent hover:text-ink transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? 'Čuvanje...' : 'Dodaj zalihe'}
          </button>
        </div>
      </div>

      {/* Adjustment form */}
      <div className="border border-silver-light bg-white p-4 md:p-6 mb-6 md:mb-10">
        <h3 className="font-display font-[300] text-[14px] md:text-[16px] text-ink mb-4">
          Korekcija zaliha
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
          <SelectField
            label="Proizvod"
            value={aSlug}
            onChange={setASlug}
            options={PRODUCTS.map((s) => ({ value: s, label: PRODUCT_LABELS[s] }))}
          />
          <SelectField
            label="Komponenta"
            value={aComp}
            onChange={setAComp}
            options={COMPONENTS.map((c) => ({ value: c, label: COMPONENT_LABELS[c] }))}
          />
          <NumberField
            label="Količina (+/-)"
            value={aQty}
            onChange={setAQty}
            allowNegative
          />
          <div>
            <label className="block font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.1em] text-silver-mid mb-1.5">
              Napomena
            </label>
            <input
              type="text"
              value={aNote}
              onChange={(e) => setANote(e.target.value)}
              placeholder="Razlog korekcije"
              className="w-full border border-silver-light px-3 py-2 font-body text-[12px] text-ink focus:outline-none focus:border-ink transition-colors"
            />
          </div>
        </div>
        <button
          type="button"
          disabled={loading || aQty === 0}
          onClick={() => handleSubmit('adjustment')}
          className="inline-flex border border-silver-light px-4 py-2.5 font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-ink hover:border-ink transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          {loading ? 'Čuvanje...' : 'Sačuvaj korekciju'}
        </button>
      </div>

      {/* Transaction history */}
      <div className="mb-6 md:mb-10">
        <h3 className="font-display font-[300] text-[16px] md:text-[18px] text-ink mb-3 md:mb-5">
          Istorija promena
        </h3>
        {transactions.length === 0 ? (
          <p className="font-body font-[300] text-[12px] text-silver-mid">
            Nema promena.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <table className="w-full min-w-[580px] text-left">
              <thead>
                <tr className="border-b border-silver-light">
                  {['Datum', 'Proizvod', 'Komponenta', 'Tip', 'Količina', 'Cena', 'Napomena'].map(
                    (h) => (
                      <th
                        key={h}
                        className="font-body font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-silver-mid py-2 pr-3 text-left"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-silver-light/50">
                    <td className="font-body font-[300] text-[10px] md:text-[11px] text-ink py-2 pr-3 whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleDateString('sr-RS', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="font-body font-[300] text-[10px] md:text-[11px] text-ink py-2 pr-3">
                      {PRODUCT_LABELS[tx.product_slug] ?? tx.product_slug}
                    </td>
                    <td className="font-body font-[300] text-[10px] md:text-[11px] text-ink py-2 pr-3">
                      {COMPONENT_LABELS[tx.component_type] ?? tx.component_type}
                    </td>
                    <td className="font-body font-[300] text-[10px] md:text-[11px] text-ink py-2 pr-3">
                      {TYPE_LABELS[tx.type] ?? tx.type}
                    </td>
                    <td
                      className={`font-body font-[500] text-[10px] md:text-[11px] py-2 pr-3 tabular-nums ${
                        tx.quantity_change >= 0 ? 'text-ink' : 'text-red-600'
                      }`}
                    >
                      {tx.quantity_change > 0 ? '+' : ''}
                      {tx.quantity_change}
                    </td>
                    <td className="font-body font-[300] text-[10px] md:text-[11px] text-ink py-2 pr-3 tabular-nums">
                      {tx.total_cost_rsd != null ? `${fmt(tx.total_cost_rsd)} RSD` : '—'}
                    </td>
                    <td className="font-body font-[300] text-[10px] md:text-[11px] text-silver-dark py-2 pr-3 max-w-[150px] truncate">
                      {tx.note ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.1em] text-silver-mid mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-silver-light px-3 py-2 font-body text-[12px] text-ink bg-white focus:outline-none focus:border-ink transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  step,
  allowNegative,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
  allowNegative?: boolean;
}) {
  const decimal = step != null && step < 1;
  const inputMode = decimal ? 'decimal' : 'numeric';
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState('');

  const display =
    focused ? text : value === 0 ? '' : decimal ? String(value) : String(Math.round(value));

  function commitFromString(raw: string) {
    const t = raw.trim().replace(',', '.');
    if (t === '' || t === '-' || t === '.') {
      onChange(0);
      return;
    }
    const n = decimal ? parseFloat(t) : parseInt(t, 10);
    if (Number.isNaN(n)) {
      onChange(0);
      return;
    }
    let next = n;
    if (!allowNegative && next < 0) next = 0;
    onChange(next);
  }

  return (
    <div>
      <label className="block font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.1em] text-silver-mid mb-1.5">
        {label}
      </label>
      <input
        type="text"
        inputMode={inputMode}
        autoComplete="off"
        spellCheck={false}
        value={display}
        onFocus={() => {
          setFocused(true);
          setText(value === 0 ? '' : decimal ? String(value) : String(Math.round(value)));
        }}
        onChange={(e) => {
          let t = e.target.value.replace(',', '.');
          if (decimal) {
            if (t !== '' && !/^-?\d*\.?\d*$/.test(t)) return;
          } else {
            if (allowNegative) {
              if (t !== '' && t !== '-' && !/^-?\d*$/.test(t)) return;
            } else if (t !== '' && !/^\d*$/.test(t)) return;
          }
          setText(t);
          if (t === '' || t === '-') {
            onChange(0);
            return;
          }
          if (decimal && t === '.') {
            onChange(0);
            return;
          }
          if (decimal && t.endsWith('.')) {
            const n = parseFloat(t.slice(0, -1));
            if (!Number.isNaN(n)) onChange(n);
            return;
          }
          const n = decimal ? parseFloat(t) : parseInt(t, 10);
          if (!Number.isNaN(n)) onChange(n);
        }}
        onBlur={(e) => {
          commitFromString(e.target.value.replace(',', '.'));
          setFocused(false);
        }}
        className="w-full border border-silver-light px-3 py-2 font-body text-[12px] text-ink tabular-nums focus:outline-none focus:border-ink transition-colors"
      />
    </div>
  );
}
