import type { Metadata } from 'next';

/** Zahvalnica nakon porudžbine — bez indeksiranja (tanak duplikat, nema pretragačke vrednosti). */
export const metadata: Metadata = {
  title: 'Hvala na porudžbini',
  robots: { index: false, follow: true },
};

export default function ZahvalnicaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
