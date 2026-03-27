'use client';

import dynamic from 'next/dynamic';

const CartDrawer = dynamic(() => import('./CartDrawer'), {
  ssr: false,
  loading: () => null,
});

export default function CartDrawerLazy() {
  return <CartDrawer />;
}
