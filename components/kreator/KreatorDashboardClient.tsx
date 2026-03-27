'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
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

type Props = {
  creator: CreatorProfileRow;
  initialOrders: KreatorOrderRow[];
};

export default function KreatorDashboardClient({ creator, initialOrders }: Props) {
  const router = useRouter();
  const orders = initialOrders;

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    router.push('/kreator/prijava');
    router.refresh();
  };

  const ukupnoPorudzbina = orders.length;
  const ukupanPromet = orders.reduce((s, o) => s + Number(o.total_rsd), 0);
  const ukupnaZarada = orders.reduce(
    (s, o) =>
      s + commissionEarnedRsd(Number(o.total_rsd), o.commission_percent_applied),
    0
  );
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="border border-silver-light p-6">
            <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-2">
              Tvoj referral kod
            </p>
            <p className="font-display font-[400] text-[24px] text-ink tracking-wide break-all">
              {creator.referral_code}
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
          <div className="border border-silver-light p-6">
            <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-2">
              Tvoja zarada (procena)
            </p>
            <p className="font-display font-[300] text-[28px] text-ink tabular-nums">
              {new Intl.NumberFormat('sr-RS', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(ukupnaZarada)}{' '}
              <span className="font-body font-[300] text-[14px] text-silver-dark">RSD</span>
            </p>
            <p className="font-body font-[300] text-[11px] text-silver-mid mt-3 leading-relaxed">
              Zbir po porudžbinama, prema snimljenom procentu u svakoj porudžbini.
            </p>
          </div>
        </div>

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
                      {new Intl.NumberFormat('sr-RS', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        commissionEarnedRsd(Number(o.total_rsd), o.commission_percent_applied)
                      )}{' '}
                      RSD
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
