// Tipovan wrapper oko Meta Pixel `fbq` + SHA-256 helper za PII.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

function call(...args: unknown[]) {
  if (typeof window === 'undefined') return;
  if (typeof window.fbq !== 'function') return;
  try { window.fbq(...args); } catch { /* no-op */ }
}

export function pixelTrack(event: string, params?: Record<string, unknown>) {
  call('track', event, params ?? {});
}

export function pixelTrackWithUserData(
  event: string,
  params: Record<string, unknown>,
  userData: Record<string, unknown>,
) {
  call('track', event, params, { user_data: userData });
}

// Meta zahteva email/telefon/ime/prezime hashovane SHA-256 (lowercase, trimmed).
export async function sha256Lower(value: string): Promise<string> {
  const v = value.trim().toLowerCase();
  if (!v) return '';
  const bytes = new TextEncoder().encode(v);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Telefon: skidamo sve sem cifara pre hash-a; pretpostavljamo SR (+381) ako kreće sa 0.
export async function sha256Phone(raw: string): Promise<string> {
  let p = String(raw ?? '').replace(/\D/g, '');
  if (p.startsWith('00')) p = p.slice(2);
  if (p.startsWith('0')) p = '381' + p.slice(1);
  if (!p.startsWith('381') && p.length >= 8 && p.length <= 9) p = '381' + p;
  if (!p) return '';
  const bytes = new TextEncoder().encode(p);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export type PurchaseUserPII = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
};

export async function buildHashedUserData(pii: PurchaseUserPII) {
  const [em, ph, fn, ln] = await Promise.all([
    sha256Lower(pii.email),
    sha256Phone(pii.phone),
    sha256Lower(pii.firstName),
    sha256Lower(pii.lastName),
  ]);
  const ud: Record<string, string> = {};
  if (em) ud.em = em;
  if (ph) ud.ph = ph;
  if (fn) ud.fn = fn;
  if (ln) ud.ln = ln;
  return ud;
}
