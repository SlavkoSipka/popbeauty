import type { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { Suspense } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import CartDrawerLazy from '@/components/cart/CartDrawerLazy';
import RouteProgressBar from '@/components/layout/RouteProgressBar';
import JsonLdOrganization from '@/components/seo/JsonLdOrganization';
import { CartProvider } from '@/lib/cart-context';
import { getSiteUrl } from '@/lib/site-url';
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

const siteUrl = getSiteUrl();
const siteDescription =
  'Prirodni kozmetički brand sa dva seruma za lice. Čisti botanički sastojci, transparentna formulacija, slow beauty pristup.';
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Pop Beauty — Prirodna kozmetika',
    template: '%s | Pop Beauty',
  },
  description: siteDescription,
  applicationName: 'Pop Beauty',
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'bs_BA',
    url: '/',
    siteName: 'Pop Beauty',
    title: 'Pop Beauty — Prirodna kozmetika',
    description: siteDescription,
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Pop Beauty',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pop Beauty — Prirodna kozmetika',
    description: siteDescription,
    images: ['/android-chrome-512x512.png'],
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
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
        <JsonLdOrganization />
        <CartProvider>
          <Suspense fallback={null}>
            <RouteProgressBar />
          </Suspense>
          <Navigation />
          <CartDrawerLazy />
          <div className="flex-1 pt-20">
            {children}
          </div>
          <Footer />
        </CartProvider>
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      </body>
    </html>
  );
}
