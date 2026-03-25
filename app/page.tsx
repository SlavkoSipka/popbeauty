'use client';

import { useScrollReveal } from '@/lib/animations';
import Hero from '@/components/sections/Hero';
import BrandStatement from '@/components/sections/BrandStatement';
import ProductsGrid from '@/components/sections/ProductsGrid';
import IngredientsSection from '@/components/sections/IngredientsSection';
import RitualSection from '@/components/sections/RitualSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import NewsletterSection from '@/components/sections/NewsletterSection';

export default function Home() {
  useScrollReveal();

  return (
    <main>
      <Hero />
      <BrandStatement />
      <ProductsGrid />
      <IngredientsSection />
      <RitualSection />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  );
}
