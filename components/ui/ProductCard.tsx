import Image from 'next/image';
import Link from 'next/link';
import ProductCardPrice from '@/components/ui/ProductCardPrice';

interface ProductCardProps {
  number: string;
  type: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  price: string;
  bgColor?: 'white' | 'sage-pale';
}

export default function ProductCard({
  number,
  type,
  name,
  description,
  slug,
  image,
  price,
  bgColor = 'white',
}: ProductCardProps) {
  const bg = bgColor === 'sage-pale' ? 'bg-sage-pale' : 'bg-white';
  const imageBg =
    bgColor === 'sage-pale' ? 'bg-off-white' : 'bg-sage-pale';

  return (
    <Link
      href={`/proizvodi/${slug}`}
      className={`group block ${bg} transition-transform duration-300 ease-out hover:-translate-y-1`}
    >
      {/* Mobile: horizontal card */}
      <div className="flex md:hidden">
        <div className={`relative w-[140px] shrink-0 ${imageBg}`}>
          <span className="absolute top-2 right-3 font-display font-[300] text-[40px] leading-none text-silver-light/60 select-none pointer-events-none z-10">
            {number}
          </span>
          <div className="relative h-full min-h-[180px]">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain object-center p-2 transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              sizes="140px"
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center px-5 py-5">
          <span className="block font-body font-[400] text-[9px] uppercase tracking-[0.16em] text-sage-dark mb-1.5">
            {type}
          </span>
          <h3 className="font-display font-[400] text-[22px] leading-[1.15] text-ink mb-2">
            {name}
          </h3>
          <p className="font-body font-[300] text-[13px] leading-[1.6] text-silver-dark mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <ProductCardPrice slug={slug} fallbackPrice={price} compact />
            </div>
            <span className="font-body font-[400] text-[11px] text-ink link-underline shrink-0">
              Detaljnije →
            </span>
          </div>
        </div>
      </div>

      {/* Desktop: vertical card (unchanged) */}
      <div className="hidden md:block">
        <div className="relative">
          <span className="absolute top-4 right-6 font-display font-[300] text-[72px] leading-none text-silver-light select-none pointer-events-none z-10">
            {number}
          </span>
          <div className={`relative aspect-[4/3] w-full overflow-hidden ${imageBg}`}>
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              sizes="50vw"
            />
          </div>
        </div>
        <div className="p-10">
          <span className="block font-body font-[400] text-[10px] uppercase tracking-[0.16em] text-sage-dark mb-3">
            {type}
          </span>
          <h3 className="font-display font-[400] text-[28px] text-ink mb-3">
            {name}
          </h3>
          <p className="font-body font-[300] text-[14px] leading-[1.7] text-silver-dark mb-4 line-clamp-2">
            {description}
          </p>
          <div className="mb-5">
            <ProductCardPrice slug={slug} fallbackPrice={price} />
          </div>
          <span className="inline-block font-body font-[400] text-[12px] text-ink link-underline">
            Saznaj više →
          </span>
        </div>
      </div>
    </Link>
  );
}
