import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'O nama',
  description:
    'Priča o Pop Beauty brendu, slow beauty filozofiji i prirodnim serumima za njegu lica.',
  alternates: { canonical: '/o-nama' },
  openGraph: {
    title: 'O nama | Pop Beauty',
    description:
      'Priča o Pop Beauty brendu, slow beauty filozofiji i prirodnim serumima za njegu lica.',
    url: '/o-nama',
  },
};

export default function ONamaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
