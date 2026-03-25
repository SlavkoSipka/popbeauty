import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  number: string;
  type: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  bgColor?: 'white' | 'sage-pale';
}

export default function ProductCard({
  number,
  type,
  name,
  description,
  slug,
  image,
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
            sizes="(max-width: 768px) 100vw, 50vw"
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
        <p className="font-body font-[300] text-[14px] leading-[1.7] text-silver-dark mb-6 line-clamp-2">
          {description}
        </p>
        <span className="inline-block font-body font-[400] text-[12px] text-ink link-underline">
          Saznaj više →
        </span>
      </div>
    </Link>
  );
}
