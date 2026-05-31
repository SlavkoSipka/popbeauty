'use client';

import { usePricingData } from '@/lib/use-pricing-data';

/** Mounts once in root layout to prefetch Supabase prices into module cache. */
export default function PricingWarmup() {
  usePricingData();
  return null;
}
