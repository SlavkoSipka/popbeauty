'use client';

import { useScrollReveal } from '@/lib/animations';
import Hero from '@/components/sections/Hero';
import BrandStatement from '@/components/sections/BrandStatement';
import ProductsGrid from '@/components/sections/ProductsGrid';
import IngredientsSection from '@/components/sections/IngredientsSection';
import RitualSection from '@/components/sections/RitualSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import NewsletterSection from '@/components/sections/NewsletterSection';

export default function HomePageClient() {
  useScrollReveal();

  return (
    <main>
      <Hero />
      {/* Na mobilnom: proizvodi pa filozofija; na md+: kao ranije (filozofija, proizvodi). */}
      <div className="flex flex-col">
        <div className="order-1 md:order-2">
          <ProductsGrid />
        </div>
        <div className="order-2 md:order-1">
          <BrandStatement />
        </div>
      </div>
      <IngredientsSection />
      <RitualSection />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  );
}
