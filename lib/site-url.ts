/**
 * Kanonski javni URL sajta — obavezno postaviti NEXT_PUBLIC_SITE_URL u produkciji.
 * Na Vercelu se koristi VERCEL_URL samo ako eksplicitni URL nije podešen.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/+$/, '');
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/+$/, '')}`;
  }
  return 'http://localhost:3000';
}
