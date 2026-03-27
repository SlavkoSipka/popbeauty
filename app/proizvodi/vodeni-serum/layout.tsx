import type { Metadata } from 'next';

const description =
  'Vodeni serum za lice sa hialuronskom kiselinom — intenzivna hidratacija i svjež ten. 30ml. Pop Beauty.';

export const metadata: Metadata = {
  title: 'Vodeni serum za lice',
  description,
  alternates: { canonical: '/proizvodi/vodeni-serum' },
  openGraph: {
    title: 'Vodeni serum za lice | Pop Beauty',
    description,
    url: '/proizvodi/vodeni-serum',
    images: [{ url: '/zeleni.webp', width: 1200, height: 1200, alt: 'Pop Beauty vodeni serum' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vodeni serum za lice | Pop Beauty',
    description,
    images: ['/zeleni.webp'],
  },
};

export default function VodeniSerumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
