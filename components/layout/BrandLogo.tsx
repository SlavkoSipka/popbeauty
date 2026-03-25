import Image from 'next/image';
import Link from 'next/link';

type BrandLogoProps = {
  /** Header: usklađeno sa nav (h-20). Footer: brand kolona. */
  variant?: 'header' | 'footer';
  className?: string;
};

const sizes = { header: 64, footer: 64 } as const;

export default function BrandLogo({
  variant = 'header',
  className = '',
}: BrandLogoProps) {
  const px = sizes[variant];
  const imgClass =
    variant === 'header'
      ? 'h-14 w-14 md:h-16 md:w-16 rounded-full object-cover shrink-0'
      : 'h-16 w-16 rounded-full object-cover shrink-0';

  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 ${className}`}
    >
      <Image
        src="/loogo.webp"
        alt="Pop Beauty"
        width={px}
        height={px}
        className={imgClass}
        priority={variant === 'header'}
      />
    </Link>
  );
}
