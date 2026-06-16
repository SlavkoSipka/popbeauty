import type { Metadata } from 'next';

const description =
  'Glow Marmelada — bogata, hranljiva nega za lice koja hrani i obnavlja kožu. Pop Beauty.';

export const metadata: Metadata = {
  title: 'Glow Marmelada',
  description,
  alternates: { canonical: '/proizvodi/dzem' },
  openGraph: {
    title: 'Glow Marmelada | Pop Beauty',
    description,
    url: '/proizvodi/dzem',
    images: [{ url: '/dzem2.webp', width: 1200, height: 1200, alt: 'Pop Beauty Glow Marmelada' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glow Marmelada | Pop Beauty',
    description,
    images: ['/dzem2.webp'],
  },
};

export default function DzemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
