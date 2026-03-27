import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Porudžbina i dostava',
  description:
    'Unesite podatke za dostavu. Plaćanje pouzećem. Pop Beauty serumi za lice — prirodna kozmetika.',
  alternates: { canonical: '/porudzbina' },
  openGraph: {
    title: 'Porudžbina i dostava | Pop Beauty',
    description:
      'Unesite podatke za dostavu. Plaćanje pouzećem. Prirodni serum za lice.',
    url: '/porudzbina',
  },
};

export default function PorudzbinaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
