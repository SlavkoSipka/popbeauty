'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { DbProduct, DbSiteSettings } from '@/lib/price';

export type PricingData = {
  products: DbProduct[];
  priceMap: Map<string, number>;
  siteDiscountPercent: number;
  bundleDiscountPercent: number;
  loaded: boolean;
};

const EMPTY: PricingData = {
  products: [],
  priceMap: new Map(),
  siteDiscountPercent: 0,
  bundleDiscountPercent: 10,
  loaded: false,
};

let cached: PricingData | null = null;

export function usePricingData(): PricingData {
  const [data, setData] = useState<PricingData>(cached ?? EMPTY);

  useEffect(() => {
    if (cached) {
      setData(cached);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;

    Promise.all([
      supabase.from('products').select('slug, name, base_price_rsd, image_path, volume'),
      supabase
        .from('site_settings')
        .select('site_discount_percent, bundle_discount_percent')
        .eq('id', 1)
        .maybeSingle(),
    ]).then(([prodRes, settRes]) => {
      if (cancelled) return;
      const products = (prodRes.data ?? []) as DbProduct[];
      const priceMap = new Map(products.map((p) => [p.slug, Number(p.base_price_rsd)]));
      const sett = settRes.data as DbSiteSettings | null;
      const siteDiscountPercent = Number(sett?.site_discount_percent ?? 0);
      const bundleDiscountPercent = Number(sett?.bundle_discount_percent ?? 10);
      const result: PricingData = {
        products,
        priceMap,
        siteDiscountPercent,
        bundleDiscountPercent: Number.isFinite(bundleDiscountPercent)
          ? bundleDiscountPercent
          : 10,
        loaded: true,
      };
      cached = result;
      setData(result);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

/** Invalidate cached pricing data (e.g. after admin changes settings). */
export function invalidatePricingCache() {
  cached = null;
}
