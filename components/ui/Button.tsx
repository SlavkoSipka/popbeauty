import Link from 'next/link';

interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'nav';
  href?: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({
  variant = 'filled',
  href,
  children,
  className = '',
  fullWidth = false,
  type = 'button',
  onClick,
  disabled,
}: ButtonProps) {
  const base = `
    inline-flex items-center justify-center
    font-body font-[400] text-[11px] uppercase tracking-[0.14em]
    px-6 py-[10px]
    border
    transition-colors duration-200 ease-in-out
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    filled: `border-ink bg-ink text-white hover:bg-transparent hover:text-ink`,
    outlined: `border-ink bg-transparent text-ink hover:bg-ink hover:text-white`,
    nav: `border-[#A1A797] bg-[#A1A797] text-[#FBFAED] text-[15px] tracking-[0.1em] hover:bg-transparent hover:text-[#A1A797] md:text-[16px]`,
  };

  const classes = `${base} ${variants[variant]} ${className}`.replace(/\s+/g, ' ').trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${classes} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {children}
    </button>
  );
}
