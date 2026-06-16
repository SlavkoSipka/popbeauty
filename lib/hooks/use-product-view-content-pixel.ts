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
  slugs: string[],
  name: string,
  fallbackRsd: number,
) {
  const { loaded } = usePricingData();
  const slugsKey = slugs.join(',');

  useEffect(() => {
    trackViewContent({
      contentIds: slugs,
      contentName: name,
      value: getBundleValueRsd(slugs, fallbackRsd),
      contents: slugs.map((id) => ({ id, quantity: 1 })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugsKey, name, fallbackRsd, loaded]);
}
