import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

const description =
  'Prirodni kozmetički brand sa dva seruma za lice. Čisti botanički sastojci, transparentna formulacija, slow beauty pristup.';

export const metadata: Metadata = {
  title: { absolute: 'Pop Beauty — Prirodna kozmetika' },
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Pop Beauty — Prirodna kozmetika',
    description,
    url: '/',
  },
};

export default function Home() {
  return <HomePageClient />;
}
