import ReviewCard from '@/components/ui/ReviewCard';
import { testimonials } from '@/lib/data/testimonials';

export default function TestimonialsSection() {
  const featured = testimonials.slice(0, 3);

  return (
    <section className="py-[120px] bg-white section-padding">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="text-center mb-16">
          <span
            data-reveal="true"
            className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6"
          >
            Iskustva
          </span>
          <h2
            data-reveal="true"
            data-reveal-delay="100"
            className="font-display font-[300] text-[clamp(32px,4vw,48px)] text-ink-soft"
          >
            Šta kažu naše korisnice
          </h2>
        </div>

        {/* Desktop grid / Mobile horizontal scroll */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featured.map((t, i) => (
            <div key={t.name} data-reveal="true" data-reveal-delay={String(i * 100)}>
              <ReviewCard quote={t.quote} name={t.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
