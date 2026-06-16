import type { Metadata } from 'next';

const description =
  'Glow Marmelada + Glow Mist u kompletu, sa dodatnim popustom. Pop Beauty.';

export const metadata: Metadata = {
  title: 'Glow Marmelada + Glow Mist set',
  description,
  alternates: { canonical: '/proizvodi/dzem-mist' },
  openGraph: {
    title: 'Glow Marmelada + Glow Mist set | Pop Beauty',
    description,
    url: '/proizvodi/dzem-mist',
    images: [{ url: '/dzem-mist1.webp', width: 1200, height: 1200, alt: 'Pop Beauty Glow Marmelada + Glow Mist set' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glow Marmelada + Glow Mist set | Pop Beauty',
    description,
    images: ['/dzem-mist1.webp'],
  },
};

export default function DzemMistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
