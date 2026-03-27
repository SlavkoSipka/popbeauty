'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { BUNDLE_DISCOUNT_PERCENT } from '@/lib/pricing-engine';

type Props = {
  initialSiteDiscount: number;
};

export default function AdminPodesavanjaClient({ initialSiteDiscount }: Props) {
  const [siteDiscount, setSiteDiscount] = useState(String(initialSiteDiscount));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const v = parseFloat(siteDiscount.replace(',', '.'));
    if (Number.isNaN(v) || v < 0 || v > 100) {
      setError('Unesite broj između 0 i 100.');
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    const { error: err } = await supabase
      .from('site_settings')
      .update({ site_discount_percent: v, updated_at: new Date().toISOString() })
      .eq('id', 1);

    setSaving(false);
    if (err) {
      setError('Čuvanje nije uspelo.');
    } else {
      setSiteDiscount(String(v));
      setSaved(true);
    }
  };

  return (
    <div>
      <h2 className="font-display font-[300] text-[24px] text-ink mb-2">Podešavanja</h2>
      <p className="font-body font-[300] text-[13px] text-silver-dark mb-10 max-w-[720px] leading-relaxed">
        Upravljanje cenama i popustima na sajtu. Promene odmah važe za nove porudžbine.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Site discount */}
        <div className="border border-silver-light bg-white p-6">
          <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-4">
            Popust na sajtu (%)
          </p>
          <p className="font-body font-[300] text-[12px] text-silver-mid mb-4 leading-relaxed">
            Ovaj popust važi za sve proizvode na sajtu. Ako kupac kupi oba seruma (paket), umesto
            ovog popusta automatski važi paketni popust od {BUNDLE_DISCOUNT_PERCENT}%.
          </p>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="text"
              inputMode="decimal"
              value={siteDiscount}
              onChange={(e) => {
                setSiteDiscount(e.target.value);
                setSaved(false);
              }}
              className="w-24 border border-silver-light px-3 py-2 font-body text-[14px] text-ink focus:border-sage-mid focus:outline-none"
            />
            <span className="font-body text-[13px] text-silver-dark">%</span>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="border border-ink bg-ink text-white px-4 py-2 font-body font-[400] text-[11px] uppercase tracking-[0.12em] hover:bg-transparent hover:text-ink transition-colors disabled:opacity-50"
            >
              {saving ? 'Čuvam…' : 'Sačuvaj'}
            </button>
          </div>
          {saved && (
            <p className="font-body font-[300] text-[12px] text-sage-mid">Sačuvano.</p>
          )}
          {error && (
            <p className="font-body font-[300] text-[12px] text-red-800">{error}</p>
          )}
          <p className="font-body font-[300] text-[11px] text-silver-mid mt-2">
            Postavi na 0 da ugasiš popust.
          </p>
        </div>

        {/* Info card */}
        <div className="border border-silver-light bg-off-white/60 p-6 space-y-5">
          <div>
            <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-1">
              Paketni popust (fiksno)
            </p>
            <p className="font-display font-[300] text-[20px] text-ink">
              {BUNDLE_DISCOUNT_PERCENT}%
            </p>
            <p className="font-body font-[300] text-[11px] text-silver-mid mt-1 leading-relaxed">
              Automatski kad kupac uzme oba seruma. Ne sabiraju se sa sajtovskim popustom.
            </p>
          </div>
          <div>
            <p className="font-body font-[400] text-[11px] uppercase tracking-[0.14em] text-silver-dark mb-1">
              Popust kupaca kreatora & provizija
            </p>
            <p className="font-body font-[300] text-[12px] text-silver-mid leading-relaxed">
              Podešava se <strong className="font-[400] text-ink">po kreatoru</strong> na stranici{' '}
              <a
                href="/admin/kreatori"
                className="underline underline-offset-2 text-ink hover:opacity-70"
              >
                Kreatori
              </a>
              . Podrazumevano: 15% popust za kupce, 20% provizija za kreatora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
