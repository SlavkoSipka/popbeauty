import { getSiteUrl } from '@/lib/site-url';

/**
 * Organization + WebSite za Google (Rich Results / Knowledge Graph osnova).
 */
export default function JsonLdOrganization() {
  const base = getSiteUrl();
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: 'Pop Beauty',
        url: base,
        description:
          'Prirodni kozmetički brand sa serumima za lice. Čisti botanički sastojci, slow beauty pristup.',
        logo: {
          '@type': 'ImageObject',
          url: `${base}/android-chrome-512x512.png`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: base,
        name: 'Pop Beauty',
        description:
          'Prirodna kozmetika — uljani i vodeni serum za lice. Poručivanje online, dostava.',
        publisher: { '@id': `${base}/#organization` },
        inLanguage: 'bs',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD za pretraživače
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
