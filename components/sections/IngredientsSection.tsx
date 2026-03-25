import IngredientTag from '@/components/ui/IngredientTag';
import { featuredIngredients } from '@/lib/data/ingredients';

export default function IngredientsSection() {
  return (
    <section className="py-[120px] bg-off-white section-padding">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16">
          {/* Left — Text */}
          <div>
            <span
              data-reveal="true"
              className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6"
            >
              Formulacija
            </span>
            <h2
              data-reveal="true"
              data-reveal-delay="100"
              className="font-display font-[300] text-[clamp(32px,4vw,44px)] leading-[1.2] text-ink-soft mb-8"
            >
              Svaka kap ima razlog
            </h2>
            <p
              data-reveal="true"
              data-reveal-delay="200"
              className="font-body font-[300] text-[15px] leading-[1.8] text-silver-dark max-w-[400px]"
            >
              Ne biramo sastojke po trendovima. Svaki aktivni sastojak u našim formulama
              je tu jer ima dokazano djelovanje, čist izvor i specifičnu ulogu u
              zdravlju vaše kože.
            </p>
          </div>

          {/* Right — Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredIngredients.map((ing, i) => (
              <div key={ing.name} data-reveal="true" data-reveal-delay={String(i * 100)}>
                <IngredientTag
                  name={ing.name}
                  detail={`${ing.origin} — ${ing.benefit}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
