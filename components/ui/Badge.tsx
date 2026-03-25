interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'pill' | 'outlined';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  if (variant === 'pill') {
    return (
      <span
        className={`pill inline-block font-body font-[400] text-[10px] uppercase tracking-[0.14em] text-sage-dark border border-sage-mid px-3 py-1 ${className}`}
      >
        {children}
      </span>
    );
  }

  if (variant === 'outlined') {
    return (
      <span
        className={`inline-block font-body font-[400] text-[10px] uppercase tracking-[0.14em] text-ink border border-ink px-3 py-1 ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-block font-body font-[300] text-[10px] uppercase tracking-[0.16em] text-sage-dark border-b border-sage-mid pb-1 ${className}`}
    >
      {children}
    </span>
  );
}
