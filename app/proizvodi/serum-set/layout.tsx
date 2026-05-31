import type { Metadata } from 'next';

const description =
  'Serum set — vodeni i uljani serum za lice u kompletu, sa dodatnim paketnim popustom. Hidratacija, nega i obnova kože. Pop Beauty.';

export const metadata: Metadata = {
  title: 'Serum set — Vodeni + Uljani serum',
  description,
  alternates: { canonical: '/proizvodi/serum-set' },
  openGraph: {
    title: 'Serum set — Vodeni + Uljani serum | Pop Beauty',
    description,
    url: '/proizvodi/serum-set',
    images: [{ url: '/Serumi.png', width: 1200, height: 1200, alt: 'Pop Beauty serum set' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serum set — Vodeni + Uljani serum | Pop Beauty',
    description,
    images: ['/Serumi.png'],
  },
};

export default function SerumSetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
