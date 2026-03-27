import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ritual njega',
  description:
    'Dvokorakni ritual: uljani pa vodeni serum za lice. Jednostavan redosled za maksimalan efekat.',
  alternates: { canonical: '/ritual' },
  openGraph: {
    title: 'Ritual njega | Pop Beauty',
    description:
      'Dvokorakni ritual: uljani pa vodeni serum za lice. Jednostavan redosled za maksimalan efekat.',
    url: '/ritual',
  },
};

export default function RitualLayout({ children }: { children: React.ReactNode }) {
  return children;
}
