'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export type AdminCreatorRow = {
  id: string;
  email: string;
  display_name: string;
  referral_code: string;
  commission_percent: number | string;
  customer_discount_percent: number | string;
  bank_account: string;
  created_at: string;
};

export type CreatorPaymentRow = {
  id: string;
  creator_id: string;
  amount_rsd: number | string;
  paid_at: string;
  note: string;
  created_at: string;
};

type Props = {
  initialCreators: AdminCreatorRow[];
  initialStats: Record<string, { count: number; promet: number; zarada: number }>;
  initialPayments: Record<string, CreatorPaymentRow[]>;
};

type EditField = 'commission' | 'discount' | 'bank_account';

const emptyStat = { count: 0, promet: 0, zarada: 0 };

export default function AdminKreatoriClient({
  initialCreators,
  initialStats,
  initialPayments,
}: Props) {
  const [creators, setCreators] = useState(initialCreators);
  const [payments, setPayments] = useState(initialPayments);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [editField, setEditField] = useState<EditField>('commission');
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [payNote, setPayNote] = useState('');
  const [payingSaving, setPayingSaving] = useState(false);

  // ── New creator form ──
  const [showNewForm, setShowNewForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newReferral, setNewReferral] = useState('');
  const [newCommission, setNewCommission] = useState('20');
  const [newDiscount, setNewDiscount] = useState('15');
  const [creatingCreator, setCreatingCreator] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const rowStat = (id: string) => initialStats[id] ?? emptyStat;

  const totalPaid = (creatorId: string) =>
    (payments[creatorId] ?? []).reduce((s, p) => s + Number(p.amount_rsd), 0);

  // ── Inline field editing ──

  const startEdit = (c: AdminCreatorRow, field: EditField) => {
    setEditId(c.id);
    setEditField(field);
    if (field === 'commission') setEditValue(String(c.commission_percent ?? 20));
    else if (field === 'discount') setEditValue(String(c.customer_discount_percent ?? 15));
    else setEditValue(c.bank_account ?? '');
  };

  const saveField = async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let col: string;
    let val: number | string;

    if (editField === 'bank_account') {
      col = 'bank_account';
      val = editValue.trim();
    } else {
      const v = parseFloat(editValue.replace(',', '.'));
      if (Number.isNaN(v) || v < 0 || v > 100) return;
      col = editField === 'commission' ? 'commission_percent' : 'customer_discount_percent';
      val = v;
    }

    setSaving(true);
    const { error } = await supabase.from('creators').update({ [col]: val }).eq('id', id);
    setSaving(false);

    if (!error) {
      setCreators((prev) => prev.map((c) => (c.id === id ? { ...c, [col]: val } : c)));
      setEditId(null);
    }
  };

  // ── Add payment ──

  const addPayment = async (creatorId: string) => {
    const amount = parseFloat(payAmount.replace(',', '.'));
    if (Number.isNaN(amount) || amount <= 0) return;
    if (!payDate) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setPayingSaving(true);
    const { data, error } = await supabase
      .from('creator_payments')
      .insert({
        creator_id: creatorId,
        amount_rsd: amount,
        paid_at: payDate,
        note: payNote.trim(),
      })
      .select('id, creator_id, amount_rsd, paid_at, note, created_at')
      .single();
    setPayingSaving(false);

    if (!error && data) {
      const row = data as CreatorPaymentRow;
      setPayments((prev) => ({
        ...prev,
        [creatorId]: [row, ...(prev[creatorId] ?? [])],
      }));
      setPayAmount('');
      setPayNote('');
    }
  };

  // ── Delete payment ──

  const deletePayment = async (paymentId: string, creatorId: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.from('creator_payments').delete().eq('id', paymentId);
    if (!error) {
      setPayments((prev) => ({
        ...prev,
        [creatorId]: (prev[creatorId] ?? []).filter((p) => p.id !== paymentId),
      }));
    }
  };

  // ── Create creator ──

  const handleCreateCreator = async () => {
    setCreateError(null);
    if (!newEmail.trim() || !newPassword || !newName.trim() || !newReferral.trim()) {
      setCreateError('Sva polja su obavezna.');
      return;
    }
    const commVal = parseFloat(newCommission.replace(',', '.'));
    const discVal = parseFloat(newDiscount.replace(',', '.'));
    if (Number.isNaN(commVal) || commVal < 0 || commVal > 100) {
      setCreateError('Provizija mora biti 0–100.');
      return;
    }
    if (Number.isNaN(discVal) || discVal < 0 || discVal > 100) {
      setCreateError('Popust mora biti 0–100.');
      return;
    }

    setCreatingCreator(true);
    try {
      const res = await fetch('/api/admin/create-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail.trim(),
          password: newPassword,
          display_name: newName.trim(),
          referral_code: newReferral.trim().toUpperCase(),
          commission_percent: commVal,
          customer_discount_percent: discVal,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setCreateError(json.error || 'Greška pri kreiranju.');
        setCreatingCreator(false);
        return;
      }
      const row = json.creator as AdminCreatorRow;
      setCreators((prev) => [...prev, row]);
      setShowNewForm(false);
      setNewEmail('');
      setNewPassword('');
      setNewName('');
      setNewReferral('');
      setNewCommission('20');
      setNewDiscount('15');
    } catch {
      setCreateError('Mrežna greška.');
    }
    setCreatingCreator(false);
  };

  // ── Formatting ──

  const fmt = (n: number) =>
    new Intl.NumberFormat('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  const fmtDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('sr-RS', { dateStyle: 'medium' });
    } catch {
      return d;
    }
  };

  // ── Editable percent cell ──

  const renderEditablePercent = (c: AdminCreatorRow, field: 'commission' | 'discount', value: number | string) => {
    const isEditing = editId === c.id && editField === field;

    if (isEditing) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-16 border border-silver-light px-2 py-1 text-[12px]"
          />
          <button
            type="button"
            disabled={saving}
            onClick={() => saveField(c.id)}
            className="text-[11px] uppercase tracking-[0.1em] text-ink border border-ink px-2 py-1 hover:bg-ink hover:text-white"
          >
            OK
          </button>
          <button type="button" onClick={() => setEditId(null)} className="text-[11px] text-silver-mid">
            ×
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => startEdit(c, field)}
        className="tabular-nums text-ink underline underline-offset-2 decoration-silver-mid"
      >
        {fmt(Number(value))}%
      </button>
    );
  };

  // ── Shared expanded panel ──

  const renderExpandedPanel = (c: AdminCreatorRow) => {
    const s = rowStat(c.id);
    const paid = totalPaid(c.id);
    const owed = Math.max(0, s.zarada - paid);
    const creatorPayments = payments[c.id] ?? [];

    return (
      <div className="bg-off-white/40 border-t border-silver-light px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-[12px]">
          <div>
            <p className="font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark mb-1">
              Email
            </p>
            <p className="text-ink break-all">{c.email}</p>
          </div>
          <div>
            <p className="font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark mb-1">
              Porudžbine
            </p>
            <p className="text-ink tabular-nums">
              {s.count} ukupno · {fmt(s.promet)} RSD (plaćene)
            </p>
          </div>
          <div>
            <p className="font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark mb-1">
              Žiro račun
            </p>
            {editId === c.id && editField === 'bank_account' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full max-w-[200px] border border-silver-light px-2 py-1 text-[12px] bg-white"
                  placeholder="npr. 265-1234567890-12"
                />
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => saveField(c.id)}
                  className="text-[11px] uppercase tracking-[0.1em] text-ink border border-ink px-2 py-1 hover:bg-ink hover:text-white"
                >
                  OK
                </button>
                <button type="button" onClick={() => setEditId(null)} className="text-[11px] text-silver-mid">
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); startEdit(c, 'bank_account'); }}
                className="text-ink underline underline-offset-2 decoration-silver-mid"
              >
                {c.bank_account || '— dodaj —'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <div className="border border-silver-light bg-white p-3 md:p-4">
            <p className="font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-silver-dark mb-1">
              Zarada
            </p>
            <p className="font-display font-[300] text-[16px] md:text-[20px] text-ink tabular-nums">
              {fmt(s.zarada)}
            </p>
          </div>
          <div className="border border-silver-light bg-white p-3 md:p-4">
            <p className="font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-silver-dark mb-1">
              Isplaćeno
            </p>
            <p className="font-display font-[300] text-[16px] md:text-[20px] text-sage-mid tabular-nums">
              {fmt(paid)}
            </p>
          </div>
          <div className="border border-silver-light bg-white p-3 md:p-4">
            <p className="font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.1em] text-silver-dark mb-1">
              Dugovanje
            </p>
            <p className={`font-display font-[300] text-[16px] md:text-[20px] tabular-nums ${owed > 0 ? 'text-red-800' : 'text-ink'}`}>
              {fmt(owed)}
            </p>
          </div>
        </div>

        <div className="border border-silver-light bg-white p-3 md:p-4">
          <p className="font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark mb-3">
            Zabeleži isplatu
          </p>
          <div className="grid grid-cols-2 md:flex md:flex-wrap md:items-end gap-2 md:gap-3">
            <div>
              <label className="block text-[10px] text-silver-mid mb-1">Iznos (RSD)</label>
              <input
                type="text"
                inputMode="decimal"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full md:w-32 border border-silver-light px-2 py-1.5 text-[12px] bg-white focus:border-sage-mid focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-[10px] text-silver-mid mb-1">Datum</label>
              <input
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                className="w-full border border-silver-light px-2 py-1.5 text-[12px] bg-white focus:border-sage-mid focus:outline-none"
              />
            </div>
            <div className="col-span-2 md:flex-1 md:min-w-[120px]">
              <label className="block text-[10px] text-silver-mid mb-1">Napomena</label>
              <input
                type="text"
                value={payNote}
                onChange={(e) => setPayNote(e.target.value)}
                className="w-full border border-silver-light px-2 py-1.5 text-[12px] bg-white focus:border-sage-mid focus:outline-none"
                placeholder="opciono"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <button
                type="button"
                disabled={payingSaving}
                onClick={() => addPayment(c.id)}
                className="w-full md:w-auto border border-ink bg-ink text-white px-4 py-1.5 font-[400] text-[11px] uppercase tracking-[0.12em] hover:bg-transparent hover:text-ink transition-colors disabled:opacity-50"
              >
                {payingSaving ? '…' : 'Dodaj'}
              </button>
            </div>
          </div>
        </div>

        {creatorPayments.length > 0 && (
          <div>
            <p className="font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark mb-3">
              Istorija isplata
            </p>
            {/* Mobile payment cards */}
            <div className="md:hidden space-y-2">
              {creatorPayments.map((p) => (
                <div key={p.id} className="border border-silver-light bg-white p-3 flex items-start justify-between gap-2 text-[12px]">
                  <div>
                    <p className="text-ink font-[400] tabular-nums">{fmt(Number(p.amount_rsd))} RSD</p>
                    <p className="text-[10px] text-silver-dark tabular-nums mt-0.5">{fmtDate(p.paid_at)}</p>
                    {p.note && <p className="text-[11px] text-silver-dark mt-1">{p.note}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => { if (confirm('Obriši ovu isplatu?')) deletePayment(p.id, c.id); }}
                    className="text-[10px] text-silver-mid hover:text-red-800 shrink-0"
                  >
                    Obriši
                  </button>
                </div>
              ))}
            </div>
            {/* Desktop payment table */}
            <div className="hidden md:block border border-silver-light bg-white">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-silver-light bg-off-white">
                    <th className="px-3 py-2 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                      Datum
                    </th>
                    <th className="px-3 py-2 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                      Iznos
                    </th>
                    <th className="px-3 py-2 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                      Napomena
                    </th>
                    <th className="px-3 py-2 w-16" />
                  </tr>
                </thead>
                <tbody>
                  {creatorPayments.map((p) => (
                    <tr key={p.id} className="border-b border-silver-light last:border-0">
                      <td className="px-3 py-2 text-ink tabular-nums">{fmtDate(p.paid_at)}</td>
                      <td className="px-3 py-2 text-ink tabular-nums whitespace-nowrap font-[400]">
                        {fmt(Number(p.amount_rsd))} RSD
                      </td>
                      <td className="px-3 py-2 text-silver-dark max-w-[240px] truncate">
                        {p.note || '—'}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Obriši ovu isplatu?')) deletePayment(p.id, c.id);
                          }}
                          className="text-[10px] text-silver-mid hover:text-red-800"
                        >
                          Obriši
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── New creator form ──

  const renderNewCreatorForm = () => (
    <div className="border border-silver-light bg-white p-4 md:p-6 mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-4">
        <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark">
          Novi kreator
        </p>
        <button
          type="button"
          onClick={() => { setShowNewForm(false); setCreateError(null); }}
          className="text-[11px] text-silver-mid hover:text-ink"
        >
          ✕ Zatvori
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
        <div>
          <label className="block text-[10px] text-silver-mid mb-1">Email *</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border border-silver-light px-3 py-2 text-[13px] bg-white focus:border-sage-mid focus:outline-none"
            placeholder="kreator@email.com"
          />
        </div>
        <div>
          <label className="block text-[10px] text-silver-mid mb-1">Lozinka *</label>
          <input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-silver-light px-3 py-2 text-[13px] bg-white focus:border-sage-mid focus:outline-none"
            placeholder="min. 6 karaktera"
          />
        </div>
        <div>
          <label className="block text-[10px] text-silver-mid mb-1">Ime i prezime *</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full border border-silver-light px-3 py-2 text-[13px] bg-white focus:border-sage-mid focus:outline-none"
            placeholder="Marija Petrović"
          />
        </div>
        <div>
          <label className="block text-[10px] text-silver-mid mb-1">Referral kod *</label>
          <input
            type="text"
            value={newReferral}
            onChange={(e) => setNewReferral(e.target.value.toUpperCase())}
            className="w-full border border-silver-light px-3 py-2 text-[13px] bg-white font-mono focus:border-sage-mid focus:outline-none"
            placeholder="POP-IME1"
          />
        </div>
        <div>
          <label className="block text-[10px] text-silver-mid mb-1">Provizija %</label>
          <input
            type="text"
            inputMode="decimal"
            value={newCommission}
            onChange={(e) => setNewCommission(e.target.value)}
            className="w-full border border-silver-light px-3 py-2 text-[13px] bg-white focus:border-sage-mid focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] text-silver-mid mb-1">Popust kupaca %</label>
          <input
            type="text"
            inputMode="decimal"
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            className="w-full border border-silver-light px-3 py-2 text-[13px] bg-white focus:border-sage-mid focus:outline-none"
          />
        </div>
      </div>
      {createError && (
        <p className="font-body text-[12px] text-red-800 mb-3">{createError}</p>
      )}
      <button
        type="button"
        disabled={creatingCreator}
        onClick={handleCreateCreator}
        className="border border-ink bg-ink text-white px-5 py-2 font-[400] text-[11px] uppercase tracking-[0.12em] hover:bg-transparent hover:text-ink transition-colors disabled:opacity-50"
      >
        {creatingCreator ? 'Kreiranje…' : 'Kreiraj nalog'}
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <h2 className="font-display font-[300] text-[20px] md:text-[24px] text-ink">Kreatori</h2>
        {!showNewForm && (
          <button
            type="button"
            onClick={() => setShowNewForm(true)}
            className="self-start border border-ink bg-ink text-white px-4 py-2 font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.12em] hover:bg-transparent hover:text-ink transition-colors"
          >
            + Dodaj kreatora
          </button>
        )}
      </div>
      <p className="font-body font-[300] text-[12px] md:text-[13px] text-silver-dark mb-6 md:mb-8 max-w-[720px] leading-relaxed">
        Klikni na kreatora za detalje i evidenciju isplata. Proviziju, popust kupaca i žiro račun
        menjaš klikom na vrednost.
      </p>

      {showNewForm && renderNewCreatorForm()}

      {/* ── Mobile: card layout ── */}
      <div className="md:hidden space-y-3">
        {creators.map((c) => {
          const s = rowStat(c.id);
          const paid = totalPaid(c.id);
          const owed = Math.max(0, s.zarada - paid);
          const isExpanded = expandedId === c.id;

          return (
            <div key={c.id} className="border border-silver-light bg-white font-body text-[12px]">
              <div
                className="p-4 cursor-pointer active:bg-off-white/60"
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-ink font-[400]">{c.display_name}</p>
                    <p className="font-mono text-[10px] text-silver-dark mt-0.5">{c.referral_code}</p>
                  </div>
                  <span className="text-[10px] text-silver-mid shrink-0">
                    {isExpanded ? '▾' : '▸'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-silver-dark mb-0.5">Provizija</p>
                    {renderEditablePercent(c, 'commission', c.commission_percent)}
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-silver-dark mb-0.5">Popust</p>
                    {renderEditablePercent(c, 'discount', c.customer_discount_percent)}
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-silver-dark mb-0.5">Dugovanje</p>
                    <p className={`tabular-nums font-[400] ${owed > 0 ? 'text-red-800' : 'text-ink'}`}>
                      {fmt(owed)}
                    </p>
                  </div>
                </div>
              </div>
              {isExpanded && renderExpandedPanel(c)}
            </div>
          );
        })}
      </div>

      {/* ── Desktop: table ── */}
      <div className="hidden md:block border border-silver-light overflow-x-auto bg-white">
        <table className="w-full min-w-[1060px] text-left font-body text-[12px]">
          <thead>
            <tr className="border-b border-silver-light bg-off-white">
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Ime
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Referral
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Provizija %
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Popust kupaca %
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Zarada
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Isplaćeno
              </th>
              <th className="px-3 py-3 font-[400] text-[10px] uppercase tracking-[0.1em] text-silver-dark">
                Dugovanje
              </th>
            </tr>
          </thead>
          <tbody>
            {creators.map((c) => {
              const s = rowStat(c.id);
              const paid = totalPaid(c.id);
              const owed = Math.max(0, s.zarada - paid);
              const isExpanded = expandedId === c.id;

              return (
                <tr key={c.id} className="border-b border-silver-light align-top">
                  <td colSpan={7} className="p-0">
                    <div
                      className="grid items-center cursor-pointer hover:bg-off-white/60 transition-colors"
                      style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
                      onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    >
                      <div className="px-3 py-3 text-ink font-[400]">
                        {c.display_name}
                        <span className="block text-[10px] text-silver-mid font-[300] mt-0.5">
                          {isExpanded ? '▾ zatvori' : '▸ detalji'}
                        </span>
                      </div>
                      <div className="px-3 py-3 font-mono text-[11px] text-ink">{c.referral_code}</div>
                      <div className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        {renderEditablePercent(c, 'commission', c.commission_percent)}
                      </div>
                      <div className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        {renderEditablePercent(c, 'discount', c.customer_discount_percent)}
                      </div>
                      <div className="px-3 py-3 tabular-nums whitespace-nowrap text-ink">
                        {fmt(s.zarada)} RSD
                      </div>
                      <div className="px-3 py-3 tabular-nums whitespace-nowrap text-sage-mid">
                        {fmt(paid)} RSD
                      </div>
                      <div className={`px-3 py-3 tabular-nums whitespace-nowrap font-[400] ${owed > 0 ? 'text-red-800' : 'text-ink'}`}>
                        {fmt(owed)} RSD
                      </div>
                    </div>
                    {isExpanded && renderExpandedPanel(c)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {creators.length === 0 && !showNewForm ? (
        <div className="mt-8 font-body text-[14px] text-silver-dark text-center border border-dashed border-silver-light py-12">
          <p className="font-[300] mb-3">Nema kreatora.</p>
          <button
            type="button"
            onClick={() => setShowNewForm(true)}
            className="border border-ink bg-ink text-white px-5 py-2 font-[400] text-[11px] uppercase tracking-[0.12em] hover:bg-transparent hover:text-ink transition-colors"
          >
            + Dodaj prvog kreatora
          </button>
        </div>
      ) : null}
    </div>
  );
}
