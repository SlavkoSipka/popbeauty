/**
 * Kanonski javni URL sajta — obavezno postaviti NEXT_PUBLIC_SITE_URL u produkciji.
 * Na Vercelu se koristi VERCEL_URL samo ako eksplicitni URL nije podešen.
 *
 * Mora uvek vratiti string koji je validan za `new URL()` (npr. sa https://).
 * Bez šeme, `new URL("domen.rs")` baca — što ruši ceo layout/metadata i daje 500.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const noTrail = explicit.replace(/\/+$/, '');
    if (/^https?:\/\//i.test(noTrail)) {
      return noTrail;
    }
    return `https://${noTrail}`;
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/+$/, '')}`;
  }
  return 'http://localhost:3000';
}

/** Za `metadataBase` u layoutu — nikad ne baca, čak i ako je env pogrešno podešen. */
export function getMetadataBaseUrl(): URL {
  try {
    return new URL(getSiteUrl());
  } catch {
    return new URL('http://localhost:3000');
  }
}
