import ScrollRevealInit from '@/components/ScrollRevealInit';
import AnnouncementTicker from '@/components/layout/AnnouncementTicker';
import Hero from '@/components/sections/Hero';
import BrandStatement from '@/components/sections/BrandStatement';
import StatsSection from '@/components/sections/StatsSection';
import ProductsGrid from '@/components/sections/ProductsGrid';
import IngredientsSection from '@/components/sections/IngredientsSection';
import TestimonialsSectionLazy from '@/components/sections/TestimonialsSectionLazy';
import NewsletterSection from '@/components/sections/NewsletterSection';

export default function HomePageContent() {
  return (
    <main>
      <ScrollRevealInit />
      <div className="flex flex-col">
        <Hero />
        <AnnouncementTicker />
        <BrandStatement />
        <StatsSection />
        <ProductsGrid />
      </div>
      <IngredientsSection />
      <TestimonialsSectionLazy />
      <NewsletterSection />
    </main>
  );
}
