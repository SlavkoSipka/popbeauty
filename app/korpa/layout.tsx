import type { Metadata } from 'next';

/** Stranica samo otvara overlay korpe — ne treba indeks. */
export const metadata: Metadata = {
  title: 'Korpa',
  robots: { index: false, follow: true },
};

export default function KorpaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
