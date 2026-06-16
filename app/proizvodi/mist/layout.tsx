import type { Metadata } from 'next';

const description =
  'Glow Mist — osvežavajući mist koji hidrira i daje koži trenutni sjaj. Pop Beauty.';

export const metadata: Metadata = {
  title: 'Glow Mist',
  description,
  alternates: { canonical: '/proizvodi/mist' },
  openGraph: {
    title: 'Glow Mist | Pop Beauty',
    description,
    url: '/proizvodi/mist',
    images: [{ url: '/mist2.webp', width: 1200, height: 1200, alt: 'Pop Beauty Glow Mist' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glow Mist | Pop Beauty',
    description,
    images: ['/mist2.webp'],
  },
};

export default function MistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
