import ProductCard from '@/components/ui/ProductCard';
import BundleCard from '@/components/ui/BundleCard';
import { products } from '@/lib/data/products';

export default function ProductsGrid() {
  return (
    <section id="proizvodi" className="scroll-mt-20 py-[120px] section-padding">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="text-left mb-8 md:mb-10">
          <h2
            data-reveal="true"
            data-reveal-delay="100"
            className="font-display font-[500] text-[clamp(32px,4vw,48px)] text-ink-soft"
          >
            Proizvodi za lice
          </h2>
        </div>

        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-6">
          {products.map((product, i) => (
            <div key={product.slug} data-reveal="true" data-reveal-delay={String(i * 100)}>
              <ProductCard
                number={String(i + 1).padStart(2, '0')}
                name={product.name}
                slug={product.slug}
                image={product.image}
                price={product.price}
              />
            </div>
          ))}
          {(() => {
            const uljani = products.find((p) => p.slug === 'uljani-serum');
            const vodeni = products.find((p) => p.slug === 'vodeni-serum');
            if (!uljani || !vodeni) return null;
            return (
              <div data-reveal="true" data-reveal-delay="200">
                <BundleCard
                  image="/Serumi.png"
                  uljani={{ slug: uljani.slug, name: uljani.name, price: uljani.price, image: uljani.image }}
                  vodeni={{ slug: vodeni.slug, name: vodeni.name, price: vodeni.price, image: vodeni.image }}
                />
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
