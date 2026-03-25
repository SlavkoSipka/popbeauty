import ProductCard from '@/components/ui/ProductCard';
import { products } from '@/lib/data/products';

export default function ProductsGrid() {
  return (
    <section id="proizvodi" className="scroll-mt-20 py-[120px] section-padding">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="text-center mb-16">
          <span
            data-reveal="true"
            className="block font-body font-[300] text-[11px] uppercase tracking-[0.2em] text-silver-dark mb-6"
          >
            Naši proizvodi
          </span>
          <h2
            data-reveal="true"
            data-reveal-delay="100"
            className="font-display font-[300] text-[clamp(32px,4vw,48px)] text-ink-soft"
          >
            Dva seruma. Jedan ritual.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-silver-light">
          {products.map((product, i) => (
            <div key={product.slug} data-reveal="true" data-reveal-delay={String(i * 100)}>
              <ProductCard
                number={String(i + 1).padStart(2, '0')}
                type={product.type}
                name={product.name}
                description={product.description}
                slug={product.slug}
                image={product.image}
                bgColor={i === 0 ? 'white' : 'sage-pale'}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
