'use client';

import Link from 'next/link';

type Props = {
  ukupnoPorudzbina: number;
  ukupanPromet: number;
  ukupnaZaradaKreatora: number;
  creatorCount: number;
};

export default function AdminOverviewClient({
  ukupnoPorudzbina,
  ukupanPromet,
  ukupnaZaradaKreatora,
  creatorCount,
}: Props) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <div>
      <h2 className="font-display font-[300] text-[24px] text-ink mb-8">Pregled poslovanja</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        <div className="border border-silver-light bg-white p-6">
          <p className="font-body font-[400] text-[10px] uppercase tracking-[0.14em] text-silver-mid mb-2">
            Porudžbine
          </p>
          <p className="font-display font-[300] text-[32px] text-ink tabular-nums">
            {ukupnoPorudzbina}
          </p>
        </div>
        <div className="border border-silver-light bg-white p-6">
          <p className="font-body font-[400] text-[10px] uppercase tracking-[0.14em] text-silver-mid mb-2">
            Ukupan promet
          </p>
          <p className="font-display font-[300] text-[26px] text-ink tabular-nums">
            {fmt(ukupanPromet)}{' '}
            <span className="text-[13px] font-body font-[300] text-silver-dark">RSD</span>
          </p>
        </div>
        <div className="border border-silver-light bg-white p-6">
          <p className="font-body font-[400] text-[10px] uppercase tracking-[0.14em] text-silver-mid mb-2">
            Procenjena zarada kreatora
          </p>
          <p className="font-display font-[300] text-[26px] text-ink tabular-nums">
            {fmt(ukupnaZaradaKreatora)}{' '}
            <span className="text-[13px] font-body font-[300] text-silver-dark">RSD</span>
          </p>
          <p className="font-body font-[300] text-[11px] text-silver-mid mt-2 leading-relaxed">
            Zbir provizije po porudžbinama (prema snimljenom procentu).
          </p>
        </div>
        <div className="border border-silver-light bg-white p-6">
          <p className="font-body font-[400] text-[10px] uppercase tracking-[0.14em] text-silver-mid mb-2">
            Kreatori u sistemu
          </p>
          <p className="font-display font-[300] text-[32px] text-ink tabular-nums">
            {creatorCount}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/porudzbine"
          prefetch
          className="inline-flex border border-ink bg-ink px-5 py-3 font-body font-[400] text-[11px] uppercase tracking-[0.12em] text-white hover:bg-transparent hover:text-ink transition-colors"
        >
          Sve porudžbine
        </Link>
        <Link
          href="/admin/kreatori"
          prefetch
          className="inline-flex border border-silver-light px-5 py-3 font-body font-[400] text-[11px] uppercase tracking-[0.12em] text-ink hover:border-ink transition-colors"
        >
          Kreatori i provizije
        </Link>
      </div>
    </div>
  );
}
