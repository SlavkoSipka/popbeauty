'use client';

import { useEffect } from 'react';
import {
  getBundleValueRsd,
  getLineValueRsd,
  trackViewContent,
} from '@/lib/meta-pixel-events';
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

export function useBundleViewContentPixel(
  bundleId: string,
  name: string,
  fallbackRsd: number,
) {
  const { loaded } = usePricingData();

  useEffect(() => {
    trackViewContent({
      contentIds: [bundleId],
      contentName: name,
      value: getBundleValueRsd(bundleId, fallbackRsd),
      contents: [{ id: bundleId, quantity: 1 }],
    });
  }, [bundleId, name, fallbackRsd, loaded]);
}
