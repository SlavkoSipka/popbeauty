'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

/**
 * Direktan ulaz na /korpa otvara sidebar korpe i vraća na početnu (bez posebne stranice).
 */
export default function KorpaPage() {
  const { openCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    openCart();
    router.replace('/');
  }, [openCart, router]);

  return (
    <main className="min-h-[30vh] flex items-center justify-center section-padding">
      <p className="font-body font-[300] text-[14px] text-silver-mid">Otvaranje korpe…</p>
    </main>
  );
}
