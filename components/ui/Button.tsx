import Link from 'next/link';

interface ButtonProps {
  variant?: 'filled' | 'outlined';
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
    border border-ink
    transition-colors duration-200 ease-in-out
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const variants = {
    filled: `bg-ink text-white hover:bg-transparent hover:text-ink`,
    outlined: `bg-transparent text-ink hover:bg-ink hover:text-white`,
  };

  const classes = `${base} ${variants[variant]}`.replace(/\s+/g, ' ').trim();

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
