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
    router.push('/kreator/prijava');
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
    <main className="section-padding py-12 md:py-16">
      <div className="mx-auto max-w-[900px] px-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-12">
          <div>
            <p className="font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-2">
              Zdravo, {creator.display_name}
            </p>
            <h1 className="font-display font-[300] text-[clamp(28px,4vw,40px)] text-ink">
              Tvoj referral i prodaja
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start border border-silver-light px-4 py-2 font-body font-[300] text-[12px] text-ink hover:border-ink"
          >
            Odjavi se
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="border border-silver-light p-6">
            <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-2">
              Tvoj referral / promo kod
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <input
                type="text"
                value={referralInput}
                onChange={(e) => {
                  setReferralInput(e.target.value);
                  setReferralMsg(null);
                }}
                autoCapitalize="characters"
                maxLength={48}
                className="min-w-0 flex-1 border border-silver-light bg-white px-3 py-2.5 font-mono font-[400] text-[15px] text-ink tracking-wide focus:border-sage-mid focus:outline-none uppercase"
                placeholder="npr. POP-IME1"
                aria-label="Referral kod"
              />
              <button
                type="button"
                onClick={() => void saveReferralCode()}
                disabled={referralSaving}
                className="shrink-0 border border-ink bg-ink px-4 py-2.5 font-body font-[400] text-[11px] uppercase tracking-[0.12em] text-white hover:bg-transparent hover:text-ink transition-colors disabled:opacity-50"
              >
                {referralSaving ? 'Čuvam…' : 'Sačuvaj'}
              </button>
            </div>
            {referralMsg ? (
              <p
                className={`font-body font-[300] text-[12px] mt-2 leading-relaxed ${
                  referralMsg.startsWith('Kod je') ? 'text-sage-dark' : 'text-red-800'
                }`}
                role={referralMsg.startsWith('Kod je') ? 'status' : 'alert'}
              >
                {referralMsg}
              </p>
            ) : null}
            <p className="font-body font-[300] text-[11px] text-silver-mid mt-3 leading-relaxed">
              3–48 znakova: slova, brojevi, crtica. Jedinstven mora biti ceo kod. Pri čuvanju se uklanjaju
              razmaci i mala slova postaju velika. (Možeš i donju crtu _.)
            </p>
            <p className="font-body font-[300] text-[12px] text-silver-mid mt-3 leading-relaxed">
              Tvoja provizija:{' '}
              <span className="text-ink font-[400]">{provizijaProcenat}%</span> od prodaje preko tvog
              koda (dogovor sa brendom).
            </p>
            <p className="font-body font-[300] text-[12px] text-silver-mid mt-2 leading-relaxed">
              Podeli kod sa pratiocima. Kad neko unese ovaj kod pri porudžbini, prodaja se vezuje za
              tebe.
            </p>
          </div>
          <div className="border border-silver-light p-6">
            <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-2">
              Ukupno porudžbina
            </p>
            <p className="font-display font-[300] text-[36px] text-ink tabular-nums">
              {ukupnoPorudzbina}
            </p>
            <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark mt-6 mb-1">
              Ukupan promet (RSD)
            </p>
            <p className="font-display font-[300] text-[28px] text-ink tabular-nums">
              {new Intl.NumberFormat('sr-RS', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(ukupanPromet)}{' '}
              <span className="font-body font-[300] text-[14px] text-silver-dark">RSD</span>
            </p>
          </div>
        </div>

        <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-4">
          Isplate i dugovanje
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="border border-silver-light p-6">
            <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-2">
              Ukupna zarada
            </p>
            <p className="font-display font-[300] text-[28px] text-ink tabular-nums">
              {fmtMoney(ukupnaZarada)}{' '}
              <span className="font-body font-[300] text-[14px] text-silver-dark">RSD</span>
            </p>
            <p className="font-body font-[300] text-[11px] text-silver-mid mt-3 leading-relaxed">
              Provizija od porudžbina sa statusom &quot;Plaćeno&quot; (isto kao u admin panelu).
            </p>
          </div>
          <div className="border border-silver-light p-6">
            <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-2">
              Isplaćeno do sada
            </p>
            <p className="font-display font-[300] text-[28px] text-sage-mid tabular-nums">
              {fmtMoney(ukupnoIsplaceno)}{' '}
              <span className="font-body font-[300] text-[14px] text-silver-dark">RSD</span>
            </p>
            <p className="font-body font-[300] text-[11px] text-silver-mid mt-3 leading-relaxed">
              Zbir isplata koje je brend uneo u evidenciju.
            </p>
          </div>
          <div className="border border-silver-light p-6">
            <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-2">
              Dugovanje
            </p>
            <p
              className={`font-display font-[300] text-[28px] tabular-nums ${
                dugovanje > 0 ? 'text-red-800' : 'text-ink'
              }`}
            >
              {fmtMoney(dugovanje)}{' '}
              <span className="font-body font-[300] text-[14px] text-silver-dark">RSD</span>
            </p>
            <p className="font-body font-[300] text-[11px] text-silver-mid mt-3 leading-relaxed">
              Ukupna zarada minus isplaćeno. Kada je 0, sve je izmireno.
            </p>
          </div>
        </div>

        {initialPayments.length > 0 ? (
          <>
            <h2 className="font-display font-[300] text-[20px] text-ink mb-4">
              Istorija isplata
            </h2>
            <div className="border border-silver-light overflow-x-auto mb-12">
              <table className="w-full text-left font-body font-[300] text-[13px] min-w-[420px]">
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
          </>
        ) : null}

        <h2 className="font-display font-[300] text-[20px] text-ink mb-4">
          Porudžbine preko tvog koda
        </h2>
        {orders.length === 0 ? (
          <p className="font-body font-[300] text-[14px] text-silver-dark border border-dashed border-silver-light p-8 text-center">
            Još nema porudžbina sa tvog referral koda.
          </p>
        ) : (
          <div className="border border-silver-light overflow-x-auto">
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
                      {new Intl.NumberFormat('sr-RS', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(o.total_rsd))}{' '}
                      RSD
                    </td>
                    <td className="px-4 py-3 text-ink tabular-nums">
                      {o.status === 'placeno'
                        ? `${new Intl.NumberFormat('sr-RS', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(
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
        )}

        <p className="mt-12 text-center">
          <Link
            href="/"
            className="font-body font-[300] text-[12px] text-silver-dark underline underline-offset-4 hover:text-ink"
          >
            Nazad na sajt
          </Link>
        </p>
      </div>
    </main>
  );
}
