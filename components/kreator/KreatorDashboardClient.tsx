'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { validateCreatorReferralCodeInput } from '@/lib/order-validation';
import type { CreatorProfileRow } from '@/lib/supabase/panel-server';
import { commissionEarnedRsd } from '@/lib/commission';
import { formatOrderStatusLabel } from '@/lib/order-status';

export type KreatorOrderRow = {
  id: string;
  total_rsd: number;
  created_at: string;
  status: string;
  referral_code: string | null;
  commission_percent_applied: number | string | null;
};

export type KreatorPaymentRow = {
  id: string;
  creator_id: string;
  amount_rsd: number | string;
  paid_at: string;
  note: string;
  created_at: string;
};

type Props = {
  creator: CreatorProfileRow;
  initialOrders: KreatorOrderRow[];
  initialPayments: KreatorPaymentRow[];
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

function fmtPaymentDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('sr-RS', { dateStyle: 'medium' });
  } catch {
    return d;
  }
}

export default function KreatorDashboardClient({ creator, initialOrders, initialPayments }: Props) {
  const router = useRouter();
  const orders = initialOrders;

  const [referralInput, setReferralInput] = useState(creator.referral_code);
  const [referralMsg, setReferralMsg] = useState<string | null>(null);
  const [referralSaving, setReferralSaving] = useState(false);

  useEffect(() => {
    setReferralInput(creator.referral_code);
  }, [creator.referral_code]);

  const saveReferralCode = async () => {
    setReferralMsg(null);
    const v = validateCreatorReferralCodeInput(referralInput);
    if (!v.ok) {
      setReferralMsg(v.error);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setReferralMsg('Sesija nije dostupna.');
      return;
    }
    setReferralSaving(true);
    const { error } = await supabase
      .from('creators')
      .update({ referral_code: v.normalized })
      .eq('id', creator.id);
    setReferralSaving(false);
    if (error) {
      if (error.code === '23505') {
        setReferralMsg('Ovaj kod već koristi neko drugi. Izaberi drugačiji.');
      } else {
        setReferralMsg(error.message || 'Čuvanje nije uspelo.');
      }
      return;
    }
    setReferralInput(v.normalized);
    setReferralMsg('Kod je sačuvan.');
    router.refresh();
  };

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.push('/prijava?next=/kreator');
    router.refresh();
  };

  const ukupnoPorudzbina = orders.length;
  const ukupanPromet = orders.reduce((s, o) => s + Number(o.total_rsd), 0);
  const ukupnaZarada = orders
    .filter((o) => o.status === 'placeno')
    .reduce(
      (s, o) => s + commissionEarnedRsd(Number(o.total_rsd), o.commission_percent_applied),
      0,
    );
  const ukupnoIsplaceno = initialPayments.reduce((s, p) => s + Number(p.amount_rsd), 0);
  const dugovanje = Math.max(0, ukupnaZarada - ukupnoIsplaceno);
  const provizijaProcenat = Number(creator.commission_percent ?? 10);

  return (
    <main className="py-8 md:py-16 px-4 md:px-6">
      <div className="mx-auto max-w-[900px]">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 mb-6 md:mb-12">
          <div>
            <p className="font-body font-[300] text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-1">
              Zdravo, {creator.display_name}
            </p>
            <h1 className="font-display font-[300] text-[22px] md:text-[clamp(28px,4vw,40px)] text-ink">
              Tvoj referral i prodaja
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 border border-silver-light px-3 py-1.5 md:px-4 md:py-2 font-body font-[300] text-[10px] md:text-[12px] text-ink hover:border-ink"
          >
            Odjavi se
          </button>
        </div>

        {/* ── Referral + stats row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Referral code */}
          <div className="border border-silver-light p-4 md:p-6">
            <p className="font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-2">
              Tvoj referral / promo kod
            </p>
            <div className="flex gap-2 items-stretch">
              <input
                type="text"
                value={referralInput}
                onChange={(e) => {
                  setReferralInput(e.target.value);
                  setReferralMsg(null);
                }}
                autoCapitalize="characters"
                maxLength={48}
                className="min-w-0 flex-1 border border-silver-light bg-white px-3 py-2 font-mono font-[400] text-[14px] md:text-[15px] text-ink tracking-wide focus:border-sage-mid focus:outline-none uppercase"
                placeholder="npr. POP-IME1"
                aria-label="Referral kod"
              />
              <button
                type="button"
                onClick={() => void saveReferralCode()}
                disabled={referralSaving}
                className="shrink-0 border border-ink bg-ink px-3 md:px-4 py-2 font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-white hover:bg-transparent hover:text-ink transition-colors disabled:opacity-50"
              >
                {referralSaving ? '…' : 'Sačuvaj'}
              </button>
            </div>
            {referralMsg ? (
              <p
                className={`font-body font-[300] text-[11px] md:text-[12px] mt-2 leading-relaxed ${
                  referralMsg.startsWith('Kod je') ? 'text-sage-dark' : 'text-red-800'
                }`}
                role={referralMsg.startsWith('Kod je') ? 'status' : 'alert'}
              >
                {referralMsg}
              </p>
            ) : null}
            <p className="font-body font-[300] text-[10px] md:text-[11px] text-silver-mid mt-2 leading-relaxed">
              Provizija: <span className="text-ink font-[400]">{provizijaProcenat}%</span> od plaćenih porudžbina.
              Podeli kod sa pratiocima.
            </p>
          </div>

          {/* Quick stats */}
          <div className="border border-silver-light p-4 md:p-6">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <p className="font-body font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.14em] text-silver-dark mb-1">
                  Porudžbine
                </p>
                <p className="font-display font-[300] text-[24px] md:text-[32px] text-ink tabular-nums">
                  {ukupnoPorudzbina}
                </p>
              </div>
              <div>
                <p className="font-body font-[400] text-[9px] md:text-[10px] uppercase tracking-[0.14em] text-silver-dark mb-1">
                  Promet
                </p>
                <p className="font-display font-[300] text-[18px] md:text-[24px] text-ink tabular-nums">
                  {fmtMoney(ukupanPromet)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Financial cards ── */}
        <div className="grid grid-cols-3 gap-2.5 md:gap-6 mb-8 md:mb-12">
          <div className="border border-silver-light p-3 md:p-6">
            <p className="font-body font-[400] text-[8px] md:text-[10px] uppercase tracking-[0.14em] text-silver-dark mb-1 md:mb-2">
              Zarada
            </p>
            <p className="font-display font-[300] text-[16px] md:text-[26px] text-ink tabular-nums">
              {fmtMoney(ukupnaZarada)}
            </p>
            <p className="hidden md:block font-body font-[300] text-[11px] text-silver-mid mt-2 leading-relaxed">
              Provizija od plaćenih porudžbina.
            </p>
          </div>
          <div className="border border-silver-light p-3 md:p-6">
            <p className="font-body font-[400] text-[8px] md:text-[10px] uppercase tracking-[0.14em] text-silver-dark mb-1 md:mb-2">
              Isplaćeno
            </p>
            <p className="font-display font-[300] text-[16px] md:text-[26px] text-sage-mid tabular-nums">
              {fmtMoney(ukupnoIsplaceno)}
            </p>
            <p className="hidden md:block font-body font-[300] text-[11px] text-silver-mid mt-2 leading-relaxed">
              Zbir isplata iz evidencije.
            </p>
          </div>
          <div className="border border-silver-light p-3 md:p-6">
            <p className="font-body font-[400] text-[8px] md:text-[10px] uppercase tracking-[0.14em] text-silver-dark mb-1 md:mb-2">
              Dugovanje
            </p>
            <p
              className={`font-display font-[300] text-[16px] md:text-[26px] tabular-nums ${
                dugovanje > 0 ? 'text-red-800' : 'text-ink'
              }`}
            >
              {fmtMoney(dugovanje)}
            </p>
            <p className="hidden md:block font-body font-[300] text-[11px] text-silver-mid mt-2 leading-relaxed">
              Zarada minus isplaćeno.
            </p>
          </div>
        </div>

        {/* ── Payment history ── */}
        {initialPayments.length > 0 && (
          <div className="mb-8 md:mb-12">
            <h2 className="font-display font-[300] text-[18px] md:text-[20px] text-ink mb-3 md:mb-4">
              Istorija isplata
            </h2>
            {/* Mobile: cards */}
            <div className="md:hidden space-y-2">
              {initialPayments.map((p) => (
                <div key={p.id} className="border border-silver-light bg-white p-3 flex items-start justify-between gap-2 text-[12px]">
                  <div>
                    <p className="text-ink font-[400] tabular-nums">{fmtMoney(Number(p.amount_rsd))} RSD</p>
                    <p className="text-[10px] text-silver-dark tabular-nums mt-0.5">{fmtPaymentDate(p.paid_at)}</p>
                  </div>
                  {p.note?.trim() && (
                    <p className="text-[11px] text-silver-dark text-right max-w-[140px] truncate">{p.note}</p>
                  )}
                </div>
              ))}
            </div>
            {/* Desktop: table */}
            <div className="hidden md:block border border-silver-light overflow-x-auto">
              <table className="w-full text-left font-body font-[300] text-[13px]">
                <thead>
                  <tr className="border-b border-silver-light bg-off-white">
                    <th className="px-4 py-3 font-[400] text-[11px] uppercase tracking-[0.1em] text-silver-dark">
                      Datum
                    </th>
                    <th className="px-4 py-3 font-[400] text-[11px] uppercase tracking-[0.1em] text-silver-dark">
                      Iznos
                    </th>
                    <th className="px-4 py-3 font-[400] text-[11px] uppercase tracking-[0.1em] text-silver-dark">
                      Napomena
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {initialPayments.map((p) => (
                    <tr key={p.id} className="border-b border-silver-light last:border-0">
                      <td className="px-4 py-3 text-ink tabular-nums whitespace-nowrap">
                        {fmtPaymentDate(p.paid_at)}
                      </td>
                      <td className="px-4 py-3 text-ink tabular-nums font-[400] whitespace-nowrap">
                        {fmtMoney(Number(p.amount_rsd))} RSD
                      </td>
                      <td className="px-4 py-3 text-silver-dark max-w-[280px]">
                        {p.note?.trim() ? p.note : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Orders ── */}
        <h2 className="font-display font-[300] text-[18px] md:text-[20px] text-ink mb-3 md:mb-4">
          Porudžbine preko tvog koda
        </h2>
        {orders.length === 0 ? (
          <p className="font-body font-[300] text-[13px] md:text-[14px] text-silver-dark border border-dashed border-silver-light p-6 md:p-8 text-center">
            Još nema porudžbina sa tvog referral koda.
          </p>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="md:hidden space-y-2">
              {orders.map((o) => {
                const total = Number(o.total_rsd);
                const earned = commissionEarnedRsd(total, o.commission_percent_applied);
                return (
                  <div key={o.id} className="border border-silver-light bg-white p-3 font-body text-[12px]">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[10px] text-silver-dark tabular-nums">
                        {new Date(o.created_at).toLocaleString('sr-RS', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </p>
                      <span className="text-[10px] text-silver-dark">
                        {formatOrderStatusLabel(o.status)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-ink font-[400] tabular-nums">{fmtMoney(total)} RSD</p>
                      {o.status === 'placeno' && (
                        <p className="text-[11px] text-sage-dark tabular-nums">
                          +{fmtMoney(earned)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Desktop: table */}
            <div className="hidden md:block border border-silver-light overflow-x-auto">
              <table className="w-full text-left font-body font-[300] text-[13px]">
                <thead>
                  <tr className="border-b border-silver-light bg-off-white">
                    <th className="px-4 py-3 font-[400] text-[11px] uppercase tracking-[0.1em] text-silver-dark">
                      Datum
                    </th>
                    <th className="px-4 py-3 font-[400] text-[11px] uppercase tracking-[0.1em] text-silver-dark">
                      Iznos
                    </th>
                    <th className="px-4 py-3 font-[400] text-[11px] uppercase tracking-[0.1em] text-silver-dark">
                      Tvoja zarada
                    </th>
                    <th className="px-4 py-3 font-[400] text-[11px] uppercase tracking-[0.1em] text-silver-dark">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-silver-light last:border-0">
                      <td className="px-4 py-3 text-ink tabular-nums">
                        {new Date(o.created_at).toLocaleString('sr-RS', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="px-4 py-3 text-ink tabular-nums">
                        {fmtMoney(Number(o.total_rsd))} RSD
                      </td>
                      <td className="px-4 py-3 text-ink tabular-nums">
                        {o.status === 'placeno'
                          ? `${fmtMoney(
                              commissionEarnedRsd(Number(o.total_rsd), o.commission_percent_applied),
                            )} RSD`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-silver-dark">{formatOrderStatusLabel(o.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="mt-8 md:mt-12 text-center">
          <Link
            href="/"
            className="font-body font-[300] text-[11px] md:text-[12px] text-silver-dark underline underline-offset-4 hover:text-ink"
          >
            Nazad na sajt
          </Link>
        </p>
      </div>
    </main>
  );
}
