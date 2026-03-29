import { redirect } from 'next/navigation';

/** Stara ruta — middleware takođe preusmerava na /prijava */
export default async function KreatorPrijavaRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const n = sp.next;
  const next = n && n.startsWith('/kreator') ? n : '/kreator';
  redirect(`/prijava?next=${encodeURIComponent(next)}`);
}
