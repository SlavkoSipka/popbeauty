import type { Metadata } from 'next';

const description =
  'Botanički uljani serum za lice — obnova lipidne barijere i prirodan sjaj. Liposolubilni aktivni sastojci, 20ml. Pop Beauty.';

export const metadata: Metadata = {
  title: 'Uljani serum za lice',
  description,
  alternates: { canonical: '/proizvodi/uljani-serum' },
  openGraph: {
    title: 'Uljani serum za lice | Pop Beauty',
    description,
    url: '/proizvodi/uljani-serum',
    images: [{ url: '/zuti.webp', width: 1200, height: 1200, alt: 'Pop Beauty uljani serum' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uljani serum za lice | Pop Beauty',
    description,
    images: ['/zuti.webp'],
  },
};

export default function UljaniSerumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
