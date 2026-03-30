'use client';

import { useState, useMemo } from 'react';
import { computePricing } from '@/lib/pricing-engine';

type Product = {
  slug: string;
  name: string;
  basePriceRsd: number;
};

type CostEntry = { label: number; packaging: number; serum: number; total: number };

type Props = {
  products: Product[];
  costMap: Record<string, CostEntry>;
  currentSiteDiscount: number;
  currentBundleDiscount: number;
};

const PRODUCT_LABELS: Record<string, string> = {
  'vodeni-serum': 'Vodeni serum',
  'uljani-serum': 'Uljani serum',
};

export default function AdminKalkulatorClient({
  products,
  costMap,
  currentSiteDiscount,
  currentBundleDiscount,
}: Props) {
  const [siteDiscount, setSiteDiscount] = useState(currentSiteDiscount);
  const [bundleDiscount, setBundleDiscount] = useState(currentBundleDiscount);
  const [referralDiscount, setReferralDiscount] = useState(15);
  const [commissionPercent, setCommissionPercent] = useState(20);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const fmt = (n: number) =>
    new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const pctFmt = (n: number) => `${n.toFixed(1)}%`;

  const scenarios = useMemo(() => {
    const results: {
      label: string;
      customerPays: number;
      productionCost: number;
      commission: number;
      profit: number;
      margin: number;
    }[] = [];

    for (const p of products) {
      const cost = costMap[p.slug]?.total ?? 0;

      // Single product, no creator
      const singlePricing = computePricing({
        lines: [{ slug: p.slug, quantity: 1, basePriceRsd: p.basePriceRsd }],
        siteDiscountPercent: siteDiscount,
        bundleDiscountPercent: bundleDiscount,
        referralDiscountPercent: 0,
        promoDiscountPercent: 0,
      });
      const singleProfit = singlePricing.totalRsd - cost;
      results.push({
        label: `${PRODUCT_LABELS[p.slug] ?? p.name} — bez kreatora`,
        customerPays: singlePricing.totalRsd,
        productionCost: cost,
        commission: 0,
        profit: singleProfit,
        margin: singlePricing.totalRsd > 0 ? (singleProfit / singlePricing.totalRsd) * 100 : 0,
      });

      // Single product, with creator
      const creatorPricing = computePricing({
        lines: [{ slug: p.slug, quantity: 1, basePriceRsd: p.basePriceRsd }],
        siteDiscountPercent: siteDiscount,
        bundleDiscountPercent: bundleDiscount,
        referralDiscountPercent: referralDiscount,
        promoDiscountPercent: 0,
      });
      const creatorCommission = Math.round(((creatorPricing.totalRsd * commissionPercent) / 100) * 100) / 100;
      const creatorProfit = creatorPricing.totalRsd - cost - creatorCommission;
      results.push({
        label: `${PRODUCT_LABELS[p.slug] ?? p.name} — sa kreatorom`,
        customerPays: creatorPricing.totalRsd,
        productionCost: cost,
        commission: creatorCommission,
        profit: creatorProfit,
        margin: creatorPricing.totalRsd > 0 ? (creatorProfit / creatorPricing.totalRsd) * 100 : 0,
      });

      // Single product + promo (no creator)
      if (promoDiscount > 0) {
        const promoPricing = computePricing({
          lines: [{ slug: p.slug, quantity: 1, basePriceRsd: p.basePriceRsd }],
          siteDiscountPercent: siteDiscount,
          bundleDiscountPercent: bundleDiscount,
          referralDiscountPercent: 0,
          promoDiscountPercent: promoDiscount,
        });
        const promoProfit = promoPricing.totalRsd - cost;
        results.push({
          label: `${PRODUCT_LABELS[p.slug] ?? p.name} — promo kod`,
          customerPays: promoPricing.totalRsd,
          productionCost: cost,
          commission: 0,
          profit: promoProfit,
          margin: promoPricing.totalRsd > 0 ? (promoProfit / promoPricing.totalRsd) * 100 : 0,
        });
      }

      // Single product + promo + creator
      if (promoDiscount > 0) {
        const promoCreatorPricing = computePricing({
          lines: [{ slug: p.slug, quantity: 1, basePriceRsd: p.basePriceRsd }],
          siteDiscountPercent: siteDiscount,
          bundleDiscountPercent: bundleDiscount,
          referralDiscountPercent: referralDiscount,
          promoDiscountPercent: promoDiscount,
        });
        const pcCommission = Math.round(((promoCreatorPricing.totalRsd * commissionPercent) / 100) * 100) / 100;
        const pcProfit = promoCreatorPricing.totalRsd - cost - pcCommission;
        results.push({
          label: `${PRODUCT_LABELS[p.slug] ?? p.name} — promo + kreator`,
          customerPays: promoCreatorPricing.totalRsd,
          productionCost: cost,
          commission: pcCommission,
          profit: pcProfit,
          margin: promoCreatorPricing.totalRsd > 0 ? (pcProfit / promoCreatorPricing.totalRsd) * 100 : 0,
        });
      }
    }

    // Bundle scenarios
    const bundleLines = products.map((p) => ({
      slug: p.slug,
      quantity: 1,
      basePriceRsd: p.basePriceRsd,
    }));
    const bundleCost = products.reduce((s, p) => s + (costMap[p.slug]?.total ?? 0), 0);

    // Bundle no creator
    const bundlePricing = computePricing({
      lines: bundleLines,
      siteDiscountPercent: siteDiscount,
      bundleDiscountPercent: bundleDiscount,
      referralDiscountPercent: 0,
      promoDiscountPercent: 0,
    });
    const bundleProfit = bundlePricing.totalRsd - bundleCost;
    results.push({
      label: 'Paket (oba seruma) — bez kreatora',
      customerPays: bundlePricing.totalRsd,
      productionCost: bundleCost,
      commission: 0,
      profit: bundleProfit,
      margin: bundlePricing.totalRsd > 0 ? (bundleProfit / bundlePricing.totalRsd) * 100 : 0,
    });

    // Bundle with creator
    const bundleCreator = computePricing({
      lines: bundleLines,
      siteDiscountPercent: siteDiscount,
      bundleDiscountPercent: bundleDiscount,
      referralDiscountPercent: referralDiscount,
      promoDiscountPercent: 0,
    });
    const bcCommission = Math.round(((bundleCreator.totalRsd * commissionPercent) / 100) * 100) / 100;
    const bcProfit = bundleCreator.totalRsd - bundleCost - bcCommission;
    results.push({
      label: 'Paket (oba seruma) — sa kreatorom',
      customerPays: bundleCreator.totalRsd,
      productionCost: bundleCost,
      commission: bcCommission,
      profit: bcProfit,
      margin: bundleCreator.totalRsd > 0 ? (bcProfit / bundleCreator.totalRsd) * 100 : 0,
    });

    // Bundle + promo
    if (promoDiscount > 0) {
      const bundlePromo = computePricing({
        lines: bundleLines,
        siteDiscountPercent: siteDiscount,
        bundleDiscountPercent: bundleDiscount,
        referralDiscountPercent: 0,
        promoDiscountPercent: promoDiscount,
      });
      const bpProfit = bundlePromo.totalRsd - bundleCost;
      results.push({
        label: 'Paket — promo kod',
        customerPays: bundlePromo.totalRsd,
        productionCost: bundleCost,
        commission: 0,
        profit: bpProfit,
        margin: bundlePromo.totalRsd > 0 ? (bpProfit / bundlePromo.totalRsd) * 100 : 0,
      });
    }

    // Bundle + promo + creator
    if (promoDiscount > 0) {
      const bundlePromoCreator = computePricing({
        lines: bundleLines,
        siteDiscountPercent: siteDiscount,
        bundleDiscountPercent: bundleDiscount,
        referralDiscountPercent: referralDiscount,
        promoDiscountPercent: promoDiscount,
      });
      const bpcCommission = Math.round(((bundlePromoCreator.totalRsd * commissionPercent) / 100) * 100) / 100;
      const bpcProfit = bundlePromoCreator.totalRsd - bundleCost - bpcCommission;
      results.push({
        label: 'Paket — promo + kreator',
        customerPays: bundlePromoCreator.totalRsd,
        productionCost: bundleCost,
        commission: bpcCommission,
        profit: bpcProfit,
        margin: bundlePromoCreator.totalRsd > 0 ? (bpcProfit / bundlePromoCreator.totalRsd) * 100 : 0,
      });
    }

    return results;
  }, [products, costMap, siteDiscount, bundleDiscount, referralDiscount, commissionPercent, promoDiscount]);

  return (
    <div>
      <h2 className="font-display font-[300] text-[20px] md:text-[24px] text-ink mb-5 md:mb-8">
        Kalkulator profita
      </h2>

      {/* Sliders */}
      <div className="border border-silver-light bg-white p-4 md:p-6 mb-6 md:mb-10">
        <h3 className="font-display font-[300] text-[14px] md:text-[16px] text-ink mb-4">
          Podesi procente
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <SliderInput
            label="Popust na sajtu"
            value={siteDiscount}
            onChange={setSiteDiscount}
            max={50}
            suffix="%"
          />
          <SliderInput
            label="Popust na paket"
            value={bundleDiscount}
            onChange={setBundleDiscount}
            max={50}
            suffix="%"
          />
          <SliderInput
            label="Popust za kupce kreatora"
            value={referralDiscount}
            onChange={setReferralDiscount}
            max={50}
            suffix="%"
          />
          <SliderInput
            label="Provizija kreatora"
            value={commissionPercent}
            onChange={setCommissionPercent}
            max={50}
            suffix="%"
          />
          <SliderInput
            label="Promo kod popust"
            value={promoDiscount}
            onChange={setPromoDiscount}
            max={50}
            suffix="%"
          />
        </div>
      </div>

      {/* Scenarios — stacked cards (no horizontal scroll on phone) */}
      <div className="border border-silver-light bg-white p-4 md:p-6 mb-6 md:mb-10">
        <h3 className="font-display font-[300] text-[14px] md:text-[16px] text-ink mb-4">
          Pregled svih scenarija
        </h3>
        <div className="space-y-2.5 md:space-y-3">
          {scenarios.map((s, i) => (
            <div
              key={i}
              className={`border border-silver-light/70 p-3 md:p-4 ${
                s.label.startsWith('Paket') ? 'bg-off-white/50' : 'bg-white'
              }`}
            >
              <p className="font-body font-[500] text-[11px] md:text-[12px] text-ink leading-snug mb-2.5">
                {s.label}
              </p>
              <div className="space-y-1.5 font-body text-[11px] md:text-[12px]">
                <div className="flex justify-between gap-3">
                  <span className="text-silver-dark shrink-0">Kupac plaća</span>
                  <span className="tabular-nums text-right text-ink">{fmt(s.customerPays)} RSD</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-silver-dark shrink-0">Kreator</span>
                  <span className="tabular-nums text-right text-ink">
                    {s.commission > 0 ? `${fmt(s.commission)} RSD` : '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-silver-dark shrink-0">Profit</span>
                  <span
                    className={`tabular-nums text-right font-[500] ${
                      s.profit >= 0 ? 'text-ink' : 'text-red-600'
                    }`}
                  >
                    {fmt(s.profit)} RSD
                  </span>
                </div>
                <div className="flex justify-between gap-3 pt-1 border-t border-silver-light/40">
                  <span className="text-silver-dark shrink-0">Marža</span>
                  <span
                    className={`tabular-nums text-right font-[500] ${
                      s.margin >= 0 ? 'text-ink' : 'text-red-600'
                    }`}
                  >
                    {pctFmt(s.margin)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production cost reference — below scenarios */}
      <div className="border border-silver-light bg-white p-4 md:p-6">
        <h3 className="font-display font-[300] text-[14px] md:text-[16px] text-ink mb-3">
          Troškovi proizvodnje (referenca)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {products.map((p) => {
            const c = costMap[p.slug];
            return (
              <div key={p.slug} className="border border-silver-light/60 p-3 md:p-4">
                <p className="font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.1em] text-silver-mid mb-2">
                  {PRODUCT_LABELS[p.slug] ?? p.name}
                </p>
                <div className="space-y-1 font-body text-[11px] md:text-[12px] text-ink">
                  <div className="flex justify-between gap-2">
                    <span className="text-silver-dark">Bazna cena:</span>
                    <span className="tabular-nums">{fmt(p.basePriceRsd)} RSD</span>
                  </div>
                  {c && (
                    <>
                      <div className="flex justify-between gap-2">
                        <span className="text-silver-dark">Nalepnica:</span>
                        <span className="tabular-nums">{fmt(c.label)} RSD</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-silver-dark">Ambalaža:</span>
                        <span className="tabular-nums">{fmt(c.packaging)} RSD</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-silver-dark">Serum:</span>
                        <span className="tabular-nums">{fmt(c.serum)} RSD</span>
                      </div>
                      <div className="flex justify-between font-[500] pt-1 border-t border-silver-light/50">
                        <span>Ukupno:</span>
                        <span className="tabular-nums">{fmt(c.total)} RSD</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SliderInput({
  label,
  value,
  onChange,
  max = 100,
  suffix = '',
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="font-body font-[400] text-[10px] md:text-[11px] uppercase tracking-[0.1em] text-silver-mid">
          {label}
        </label>
        <span className="font-body font-[500] text-[12px] md:text-[13px] text-ink tabular-nums">
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-silver-light rounded-full appearance-none cursor-pointer accent-ink"
      />
      <div className="flex justify-between mt-0.5">
        <span className="font-body text-[9px] text-silver-mid">0{suffix}</span>
        <span className="font-body text-[9px] text-silver-mid">{max}{suffix}</span>
      </div>
    </div>
  );
}
