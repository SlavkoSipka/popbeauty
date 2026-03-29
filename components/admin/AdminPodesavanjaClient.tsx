'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { invalidatePricingCache } from '@/lib/use-pricing-data';

type Props = {
  initialSiteDiscount: number;
  initialBundleDiscount: number;
};

export default function AdminPodesavanjaClient({
  initialSiteDiscount,
  initialBundleDiscount,
}: Props) {
  const [siteDiscount, setSiteDiscount] = useState(String(initialSiteDiscount));
  const [bundleDiscount, setBundleDiscount] = useState(String(initialBundleDiscount));
  const [savedSite, setSavedSite] = useState(false);
  const [savedBundle, setSavedBundle] = useState(false);
  const [savingSite, setSavingSite] = useState(false);
  const [savingBundle, setSavingBundle] = useState(false);
  const [errorSite, setErrorSite] = useState<string | null>(null);
  const [errorBundle, setErrorBundle] = useState<string | null>(null);

  const parsePct = (raw: string) => {
    const v = parseFloat(raw.replace(',', '.'));
    if (Number.isNaN(v) || v < 0 || v > 100) return null;
    return v;
  };

  const handleSaveSite = async () => {
    const v = parsePct(siteDiscount);
    if (v === null) {
      setErrorSite('Unesite broj između 0 i 100.');
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setSavingSite(true);
    setErrorSite(null);
    setSavedSite(false);

    const { error: err } = await supabase
      .from('site_settings')
      .update({ site_discount_percent: v, updated_at: new Date().toISOString() })
      .eq('id', 1);

    setSavingSite(false);
    if (err) {
      setErrorSite('Čuvanje nije uspelo.');
    } else {
      setSiteDiscount(String(v));
      setSavedSite(true);
      invalidatePricingCache();
    }
  };

  const handleSaveBundle = async () => {
    const v = parsePct(bundleDiscount);
    if (v === null) {
      setErrorBundle('Unesite broj između 0 i 100.');
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setSavingBundle(true);
    setErrorBundle(null);
    setSavedBundle(false);

    const { error: err } = await supabase
      .from('site_settings')
      .update({ bundle_discount_percent: v, updated_at: new Date().toISOString() })
      .eq('id', 1);

    setSavingBundle(false);
    if (err) {
      setErrorBundle('Čuvanje nije uspelo.');
    } else {
      setBundleDiscount(String(v));
      setSavedBundle(true);
      invalidatePricingCache();
    }
  };

  return (
    <div>
      <h2 className="font-display font-[300] text-[20px] md:text-[24px] text-ink mb-2">Podešavanja</h2>
      <p className="font-body font-[300] text-[12px] md:text-[13px] text-silver-dark mb-6 md:mb-10 max-w-[720px] leading-relaxed">
        Upravljanje cenama i popustima na sajtu. Promene odmah važe za nove porudžbine.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-10">
        <div className="border border-silver-light bg-white p-4 md:p-6">
          <p className="font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-3 md:mb-4">
            Popust na sajtu (%)
          </p>
          <p className="font-body font-[300] text-[11px] md:text-[12px] text-silver-mid mb-3 md:mb-4 leading-relaxed">
            Važi kada kupac nema oba seruma u korpi. Kad su oba, koristi se paketni popust.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 md:gap-3 mb-3">
            <input
              type="text"
              inputMode="decimal"
              value={siteDiscount}
              onChange={(e) => {
                setSiteDiscount(e.target.value);
                setSavedSite(false);
              }}
              className="w-20 md:w-24 border border-silver-light px-2.5 py-1.5 md:px-3 md:py-2 font-body text-[13px] md:text-[14px] text-ink focus:border-sage-mid focus:outline-none"
            />
            <span className="font-body text-[12px] md:text-[13px] text-silver-dark">%</span>
            <button
              type="button"
              disabled={savingSite}
              onClick={() => void handleSaveSite()}
              className="border border-ink bg-ink text-white px-3 py-1.5 md:px-4 md:py-2 font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.12em] hover:bg-transparent hover:text-ink transition-colors disabled:opacity-50"
            >
              {savingSite ? 'Čuvam…' : 'Sačuvaj'}
            </button>
          </div>
          {savedSite && (
            <p className="font-body font-[300] text-[12px] text-sage-mid">Sačuvano.</p>
          )}
          {errorSite && (
            <p className="font-body font-[300] text-[12px] text-red-800">{errorSite}</p>
          )}
          <p className="font-body font-[300] text-[10px] md:text-[11px] text-silver-mid mt-2">
            Postavi na 0 da ugasiš popust.
          </p>
        </div>

        <div className="border border-silver-light bg-white p-4 md:p-6">
          <p className="font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-3 md:mb-4">
            Paketni popust (%)
          </p>
          <p className="font-body font-[300] text-[11px] md:text-[12px] text-silver-mid mb-3 md:mb-4 leading-relaxed">
            Automatski kada su u korpi <strong className="font-[400] text-ink">oba seruma</strong>.
            Ne sabira se sa popustom na sajtu.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 md:gap-3 mb-3">
            <input
              type="text"
              inputMode="decimal"
              value={bundleDiscount}
              onChange={(e) => {
                setBundleDiscount(e.target.value);
                setSavedBundle(false);
              }}
              className="w-20 md:w-24 border border-silver-light px-2.5 py-1.5 md:px-3 md:py-2 font-body text-[13px] md:text-[14px] text-ink focus:border-sage-mid focus:outline-none"
            />
            <span className="font-body text-[12px] md:text-[13px] text-silver-dark">%</span>
            <button
              type="button"
              disabled={savingBundle}
              onClick={() => void handleSaveBundle()}
              className="border border-ink bg-ink text-white px-3 py-1.5 md:px-4 md:py-2 font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.12em] hover:bg-transparent hover:text-ink transition-colors disabled:opacity-50"
            >
              {savingBundle ? 'Čuvam…' : 'Sačuvaj'}
            </button>
          </div>
          {savedBundle && (
            <p className="font-body font-[300] text-[12px] text-sage-mid">Sačuvano.</p>
          )}
          {errorBundle && (
            <p className="font-body font-[300] text-[12px] text-red-800">{errorBundle}</p>
          )}
          <p className="font-body font-[300] text-[10px] md:text-[11px] text-silver-mid mt-2">
            Podrazumevano 10%. Postavi na 0 da ugasiš.
          </p>
        </div>
      </div>

      <div className="border border-silver-light bg-off-white/60 p-4 md:p-6 max-w-[720px]">
        <p className="font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-1">
          Popust kupaca kreatora & provizija
        </p>
        <p className="font-body font-[300] text-[11px] md:text-[12px] text-silver-mid leading-relaxed">
          Podešava se <strong className="font-[400] text-ink">po kreatoru</strong> na stranici{' '}
          <a
            href="/admin/kreatori"
            className="underline underline-offset-2 text-ink hover:opacity-70"
          >
            Kreatori
          </a>
          .
        </p>
      </div>
    </div>
  );
}
