'use client';

import { useEffect } from 'react';
import {
  getBundleValueRsd,
  getLineValueRsd,
  trackViewContent,
} from '@/lib/meta-pixel-events';
import { BUNDLE_SLUGS } from '@/lib/pricing-engine';
import { usePricingData } from '@/lib/use-pricing-data';

export function useProductViewContentPixel(
  slug: string,
  name: string,
  fallbackRsd: number,
) {
  const { loaded } = usePricingData();

  useEffect(() => {
    trackViewContent({
      contentIds: [slug],
      contentName: name,
      value: getLineValueRsd(slug, fallbackRsd),
    });
  }, [slug, name, fallbackRsd, loaded]);
}

export function useBundleViewContentPixel(name: string, fallbackRsd: number) {
  const { loaded } = usePricingData();

  useEffect(() => {
    trackViewContent({
      contentIds: [...BUNDLE_SLUGS],
      contentName: name,
      value: getBundleValueRsd(fallbackRsd),
      contents: BUNDLE_SLUGS.map((id) => ({ id, quantity: 1 })),
    });
  }, [name, fallbackRsd, loaded]);
}
