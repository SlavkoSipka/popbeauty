'use client';

import dynamic from 'next/dynamic';

const TestimonialsSection = dynamic(
  () => import('@/components/sections/TestimonialsSection'),
  { ssr: false, loading: () => null },
);

export default function TestimonialsSectionLazy() {
  return <TestimonialsSection />;
}
