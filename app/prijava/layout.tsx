import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prijava',
  robots: { index: false, follow: true },
};

export default function PrijavaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
