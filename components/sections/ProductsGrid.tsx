import type { ReactNode } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import BundleCard from '@/components/ui/BundleCard';
import { products, serumSet, dzemMistSet, popBeautyPaket } from '@/lib/data/products';

function productCard(slug: string, badge?: string): ReactNode {
  const p = products.find((x) => x.slug === slug);
  if (!p) return null;
  return (
    <ProductCard
      name={p.name}
      slug={p.slug}
      image={p.image}
      price={p.price}
      badge={badge}
    />
  );
}

export default function ProductsGrid() {
  const items: { key: string; node: ReactNode }[] = [];

  const dzem = productCard('dzem', 'NOVO');
  if (dzem) items.push({ key: 'dzem', node: dzem });

  const mist = productCard('mist', 'NOVO');
  if (mist) items.push({ key: 'mist', node: mist });

  items.push({
    key: 'dzem-mist',
    node: (
      <BundleCard
        bundleId={dzemMistSet.slug}
        image={dzemMistSet.image}
        href={`/proizvodi/${dzemMistSet.slug}`}
        titleTop="Glow Marmelada"
        titleBottom="+ Glow Mist"
        alt="Glow Marmelada + Glow Mist set"
        badge="NOVO"
      />
    ),
  });

  const uljani = productCard('uljani-serum');
  if (uljani) items.push({ key: 'uljani-serum', node: uljani });

  const vodeni = productCard('vodeni-serum');
  if (vodeni) items.push({ key: 'vodeni-serum', node: vodeni });

  items.push({
    key: 'serum-set',
    node: (
      <BundleCard
        bundleId={serumSet.slug}
        image={serumSet.image}
        href={`/proizvodi/${serumSet.slug}`}
        titleTop="Serum set"
        titleBottom="Vodeni + Uljani"
        alt="Serum set — Uljani i Vodeni serum"
      />
    ),
  });

  items.push({
    key: 'pop-beauty-paket',
    node: (
      <BundleCard
        bundleId={popBeautyPaket.slug}
        image={popBeautyPaket.image}
        href={`/proizvodi/${popBeautyPaket.slug}`}
        titleTop="Pop Beauty"
        titleBottom="paket"
        alt="Pop Beauty paket — sva 4 proizvoda"
      />
    ),
  });

  return (
    <section id="proizvodi" className="scroll-mt-20 py-[120px] section-padding">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="text-left mb-8 md:mb-10">
          <h2
            data-reveal="true"
            data-reveal-delay="100"
            className="font-display font-[500] text-[clamp(32px,4vw,48px)] text-ink-soft"
          >
            Naši proizvodi
          </h2>
        </div>

        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-6">
          {items.map((item, i) => (
            <div key={item.key} data-reveal="true" data-reveal-delay={String(i * 100)}>
              {item.node}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
