import type { Product } from '@/lib/data/products';

type Tab = 'opis' | 'sastojci' | 'upotreba';

type Props = {
  activeTab: Tab;
  bundleProducts: Product[];
  intro?: string;
};

export default function BundleProductSections({ activeTab, bundleProducts, intro }: Props) {
  if (activeTab === 'opis') {
    return (
      <div className="flex flex-col gap-10">
        {intro ? (
          <p className="font-body font-[400] text-[16px] leading-[1.9] text-ink md:text-[16px]">
            {intro}
          </p>
        ) : null}
        {bundleProducts.map((product) => (
          <div key={product.slug}>
            <h2 className="font-body font-[600] text-[14px] uppercase tracking-[0.14em] text-ink mb-1 md:text-[15px]">
              {product.name}
            </h2>
            <p className="mb-4 font-body font-[400] text-[13px] uppercase tracking-[0.1em] text-silver-dark md:text-[14px]">
              {product.tagline}
            </p>
            <p className="font-body font-[400] text-[16px] leading-[1.9] text-ink md:text-[16px]">
              {product.fullDescription}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (activeTab === 'sastojci') {
    return (
      <div className="flex flex-col gap-10">
        {bundleProducts.map((product) => (
          <div key={product.slug} className="flex flex-col gap-6">
            <h2 className="font-body font-[600] text-[14px] uppercase tracking-[0.14em] text-ink md:text-[15px]">
              {product.name}
            </h2>
            {product.inci ? (
              <div>
                <h3 className="font-body font-[600] text-[13px] uppercase tracking-[0.12em] text-ink mb-3 md:text-[14px]">
                  INCI
                </h3>
                <p className="font-body font-[400] text-[15px] leading-[1.8] text-ink md:text-[16px]">
                  {product.inci}
                </p>
              </div>
            ) : null}
            {product.ingredients.length > 0 ? (
              <div>
                <h3 className="font-body font-[600] text-[13px] uppercase tracking-[0.12em] text-ink mb-4 md:text-[14px]">
                  Sastav
                </h3>
                <ul className="flex flex-col gap-3">
                  {product.ingredients.map((ing) => (
                    <li key={ing.name} className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#A1A797]" />
                      <span className="font-body font-[500] text-[16px] text-ink md:text-[16px]">
                        {ing.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {bundleProducts.map((product) => (
        <div key={product.slug} className="flex flex-col gap-4">
          <h2 className="font-body font-[600] text-[14px] uppercase tracking-[0.14em] text-ink md:text-[15px]">
            {product.name}
          </h2>
          <p className="font-body font-[400] text-[16px] leading-[1.9] text-ink md:text-[16px]">
            {product.howToUse}
          </p>
          {product.warning ? (
            <p className="font-body font-[400] text-[15px] leading-[1.8] text-ink md:text-[16px]">
              <span className="font-[600]">Upozorenje: </span>
              {product.warning}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
