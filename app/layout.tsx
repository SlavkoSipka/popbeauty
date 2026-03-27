import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import CartDrawerLazy from '@/components/cart/CartDrawerLazy';
import { CartProvider } from '@/lib/cart-context';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#6B7D5E',
};

export const metadata: Metadata = {
  title: 'Pop Beauty — Prirodna kozmetika',
  description: 'Prirodni kozmetički brand sa dva seruma za lice. Čisti botanički sastojci, transparentna formulacija, slow beauty pristup.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bs" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-ink antialiased">
        <CartProvider>
          <Navigation />
          <CartDrawerLazy />
          <div className="flex-1 pt-20">
            {children}
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
