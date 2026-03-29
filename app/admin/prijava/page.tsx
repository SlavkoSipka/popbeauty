import { redirect } from 'next/navigation';

/** Stara ruta — middleware takođe preusmerava na /prijava */
export default async function AdminPrijavaRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const n = sp.next;
  const next = n && n.startsWith('/admin') ? n : '/admin';
  redirect(`/prijava?next=${encodeURIComponent(next)}`);
}
