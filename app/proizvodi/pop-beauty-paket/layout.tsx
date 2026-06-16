import type { Metadata } from 'next';

const description =
  'Pop Beauty paket — vodeni i uljani serum, Glow Marmelada i Glow Mist u kompletu, uz najveću uštedu. Pop Beauty.';

export const metadata: Metadata = {
  title: 'Pop Beauty paket',
  description,
  alternates: { canonical: '/proizvodi/pop-beauty-paket' },
  openGraph: {
    title: 'Pop Beauty paket | Pop Beauty',
    description,
    url: '/proizvodi/pop-beauty-paket',
    images: [{ url: '/paket.webp', width: 1200, height: 1200, alt: 'Pop Beauty paket' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pop Beauty paket | Pop Beauty',
    description,
    images: ['/paket.webp'],
  },
};

export default function PopBeautyPaketLayout({ children }: { children: React.ReactNode }) {
  return children;
}
