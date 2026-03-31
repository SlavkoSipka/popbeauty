'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { invalidatePricingCache } from '@/lib/use-pricing-data';

const NIL_UUID = '00000000-0000-0000-0000-000000000000';

type Props = {
  initialSiteDiscount: number;
  initialBundleDiscount: number;
  initialCreatorCommission: number | null;
  initialCreatorCustomerDiscount: number | null;
  creatorCommissionMixed: boolean;
  creatorCustomerDiscountMixed: boolean;
  creatorCount: number;
};

export default function AdminPodesavanjaClient({
  initialSiteDiscount,
  initialBundleDiscount,
  initialCreatorCommission,
  initialCreatorCustomerDiscount,
  creatorCommissionMixed,
  creatorCustomerDiscountMixed,
  creatorCount,
}: Props) {
  const [siteDiscount, setSiteDiscount] = useState(String(initialSiteDiscount));
  const [bundleDiscount, setBundleDiscount] = useState(String(initialBundleDiscount));
  const [creatorCommission, setCreatorCommission] = useState(
    initialCreatorCommission == null ? '' : String(initialCreatorCommission),
  );
  const [creatorCustomerDiscount, setCreatorCustomerDiscount] = useState(
    initialCreatorCustomerDiscount == null ? '' : String(initialCreatorCustomerDiscount),
  );

  const [savedSite, setSavedSite] = useState(false);
  const [savedBundle, setSavedBundle] = useState(false);
  const [savedCommission, setSavedCommission] = useState(false);
  const [savedCustomerDisc, setSavedCustomerDisc] = useState(false);

  const [savingSite, setSavingSite] = useState(false);
  const [savingBundle, setSavingBundle] = useState(false);
  const [savingCommission, setSavingCommission] = useState(false);
  const [savingCustomerDisc, setSavingCustomerDisc] = useState(false);

  const [errorSite, setErrorSite] = useState<string | null>(null);
  const [errorBundle, setErrorBundle] = useState<string | null>(null);
  const [errorCommission, setErrorCommission] = useState<string | null>(null);
  const [errorCustomerDisc, setErrorCustomerDisc] = useState<string | null>(null);

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

  const handleSaveCreatorCommission = async () => {
    const v = parsePct(creatorCommission);
    if (v === null) {
      setErrorCommission('Unesite broj između 0 i 100.');
      return;
    }
    if (creatorCount === 0) {
      setErrorCommission('Nema kreatora u sistemu.');
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setSavingCommission(true);
    setErrorCommission(null);
    setSavedCommission(false);

    const { error: err } = await supabase
      .from('creators')
      .update({ commission_percent: v })
      .neq('id', NIL_UUID);

    setSavingCommission(false);
    if (err) {
      setErrorCommission('Čuvanje nije uspelo.');
    } else {
      setCreatorCommission(String(v));
      setSavedCommission(true);
      invalidatePricingCache();
    }
  };

  const handleSaveCreatorCustomerDiscount = async () => {
    const v = parsePct(creatorCustomerDiscount);
    if (v === null) {
      setErrorCustomerDisc('Unesite broj između 0 i 100.');
      return;
    }
    if (creatorCount === 0) {
      setErrorCustomerDisc('Nema kreatora u sistemu.');
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setSavingCustomerDisc(true);
    setErrorCustomerDisc(null);
    setSavedCustomerDisc(false);

    const { error: err } = await supabase
      .from('creators')
      .update({ customer_discount_percent: v })
      .neq('id', NIL_UUID);

    setSavingCustomerDisc(false);
    if (err) {
      setErrorCustomerDisc('Čuvanje nije uspelo.');
    } else {
      setCreatorCustomerDiscount(String(v));
      setSavedCustomerDisc(true);
      invalidatePricingCache();
    }
  };

  return (
    <div>
      <h2 className="font-display font-[300] text-[20px] md:text-[24px] text-ink mb-2">Podešavanja</h2>
      <p className="font-body font-[300] text-[12px] md:text-[13px] text-silver-dark mb-6 md:mb-10 max-w-[720px] leading-relaxed">
        Upravljanje cenama i popustima na sajtu. Promene odmah važe za nove porudžbine. Provizija i popust za kupce
        kreatora primenjuju se na <strong className="font-[400] text-ink">sve kreatore odjednom</strong>.
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

        <div className="border border-silver-light bg-white p-4 md:p-6">
          <p className="font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-3 md:mb-4">
            Provizija kreatora (%)
          </p>
          <p className="font-body font-[300] text-[11px] md:text-[12px] text-silver-mid mb-3 md:mb-4 leading-relaxed">
            Procenat od iznosa porudžbine za sve kreatore. Važi za nove porudžbine (snapshot u porudžbini).
          </p>
          {creatorCommissionMixed && (
            <p className="font-body font-[300] text-[10px] md:text-[11px] text-silver-dark mb-2 leading-relaxed">
              Trenutno kreatori imaju <strong className="font-[400] text-ink">različite</strong> provizije. Unesite novu
              vrednost i sačuvajte da je primenite <strong className="font-[400] text-ink">svima</strong>.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2.5 md:gap-3 mb-3">
            <input
              type="text"
              inputMode="decimal"
              value={creatorCommission}
              onChange={(e) => {
                setCreatorCommission(e.target.value);
                setSavedCommission(false);
              }}
              placeholder={creatorCommissionMixed ? 'npr. 20' : undefined}
              disabled={creatorCount === 0}
              className="w-20 md:w-24 border border-silver-light px-2.5 py-1.5 md:px-3 md:py-2 font-body text-[13px] md:text-[14px] text-ink focus:border-sage-mid focus:outline-none disabled:opacity-40"
            />
            <span className="font-body text-[12px] md:text-[13px] text-silver-dark">%</span>
            <button
              type="button"
              disabled={savingCommission || creatorCount === 0}
              onClick={() => void handleSaveCreatorCommission()}
              className="border border-ink bg-ink text-white px-3 py-1.5 md:px-4 md:py-2 font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.12em] hover:bg-transparent hover:text-ink transition-colors disabled:opacity-50"
            >
              {savingCommission ? 'Čuvam…' : 'Primeni svima'}
            </button>
          </div>
          {savedCommission && (
            <p className="font-body font-[300] text-[12px] text-sage-mid">Sačuvano za {creatorCount} kreatora.</p>
          )}
          {errorCommission && (
            <p className="font-body font-[300] text-[12px] text-red-800">{errorCommission}</p>
          )}
          <p className="font-body font-[300] text-[10px] md:text-[11px] text-silver-mid mt-2">
            {creatorCount === 0
              ? 'Još nema kreatora.'
              : 'Individualno i dalje možeš menjati na stranici Kreatori.'}
          </p>
        </div>

        <div className="border border-silver-light bg-white p-4 md:p-6">
          <p className="font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-3 md:mb-4">
            Popust za kupce kreatora (%)
          </p>
          <p className="font-body font-[300] text-[11px] md:text-[12px] text-silver-mid mb-3 md:mb-4 leading-relaxed">
            Referral popust koji kupci dobijaju preko koda kreatora — za sve kreatore odjednom.
          </p>
          {creatorCustomerDiscountMixed && (
            <p className="font-body font-[300] text-[10px] md:text-[11px] text-silver-dark mb-2 leading-relaxed">
              Trenutno su vrednosti <strong className="font-[400] text-ink">različite</strong>. Unesite novi procenat i
              sačuvajte da primenite <strong className="font-[400] text-ink">svima</strong>.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2.5 md:gap-3 mb-3">
            <input
              type="text"
              inputMode="decimal"
              value={creatorCustomerDiscount}
              onChange={(e) => {
                setCreatorCustomerDiscount(e.target.value);
                setSavedCustomerDisc(false);
              }}
              placeholder={creatorCustomerDiscountMixed ? 'npr. 15' : undefined}
              disabled={creatorCount === 0}
              className="w-20 md:w-24 border border-silver-light px-2.5 py-1.5 md:px-3 md:py-2 font-body text-[13px] md:text-[14px] text-ink focus:border-sage-mid focus:outline-none disabled:opacity-40"
            />
            <span className="font-body text-[12px] md:text-[13px] text-silver-dark">%</span>
            <button
              type="button"
              disabled={savingCustomerDisc || creatorCount === 0}
              onClick={() => void handleSaveCreatorCustomerDiscount()}
              className="border border-ink bg-ink text-white px-3 py-1.5 md:px-4 md:py-2 font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.12em] hover:bg-transparent hover:text-ink transition-colors disabled:opacity-50"
            >
              {savingCustomerDisc ? 'Čuvam…' : 'Primeni svima'}
            </button>
          </div>
          {savedCustomerDisc && (
            <p className="font-body font-[300] text-[12px] text-sage-mid">Sačuvano za {creatorCount} kreatora.</p>
          )}
          {errorCustomerDisc && (
            <p className="font-body font-[300] text-[12px] text-red-800">{errorCustomerDisc}</p>
          )}
          <p className="font-body font-[300] text-[10px] md:text-[11px] text-silver-mid mt-2">
            {creatorCount === 0
              ? 'Još nema kreatora.'
              : 'Individualno i dalje možeš menjati na stranici Kreatori.'}
          </p>
        </div>
      </div>

      <div className="border border-silver-light bg-off-white/60 p-4 md:p-6 max-w-[720px]">
        <p className="font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-1">
          Pojedinačno po kreatoru
        </p>
        <p className="font-body font-[300] text-[11px] md:text-[12px] text-silver-mid leading-relaxed">
          Za jednog kreatora posebno i dalje koristi stranicu{' '}
          <a href="/admin/kreatori" className="underline underline-offset-2 text-ink hover:opacity-70">
            Kreatori
          </a>
          .
        </p>
      </div>
    </div>
  );
}
