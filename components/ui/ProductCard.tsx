import Image from 'next/image';
import Link from 'next/link';
import ProductCardPrice from '@/components/ui/ProductCardPrice';

interface ProductCardProps {
  number: string;
  name: string;
  slug: string;
  image: string;
  price: string;
}

function splitName(name: string): [string, string] {
  if (name.includes(' za lice')) {
    return [name.replace(' za lice', ''), 'za lice'];
  }
  return [name, ''];
}

export default function ProductCard({
  name,
  slug,
  image,
  price,
}: ProductCardProps) {
  const [line1, line2] = splitName(name);

  return (
    <Link
      href={`/proizvodi/${slug}`}
      className="group block bg-white p-3 transition-transform duration-300 ease-out hover:-translate-y-1 md:p-4"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-sage-pale md:aspect-square">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-center scale-[1.04] transition-transform duration-500 ease-out group-hover:scale-[1.09]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="flex items-start justify-between gap-4 pt-4">
        <h3 className="font-display font-[500] text-[20px] leading-[1.15] text-ink md:text-[24px] [-webkit-text-stroke:0.4px_currentColor]">
          {line1}
          {line2 ? (
            <>
              <br />
              {line2}
            </>
          ) : null}
        </h3>
        <div className="shrink-0 pt-1">
          <ProductCardPrice slug={slug} fallbackPrice={price} />
        </div>
      </div>

      <span className="mt-4 inline-flex w-full items-center justify-center border border-[#A1A797] bg-[#A1A797] px-4 py-3.5 font-body font-[400] text-[12px] uppercase tracking-[0.14em] text-[#FBFAED] transition-colors duration-200 ease-in-out group-hover:bg-transparent group-hover:text-[#A1A797] md:text-[13px]">
        Dodaj u korpu
      </span>
    </Link>
  );
}
