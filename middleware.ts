import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search ?? '';

  let isAdminUser = false;
  let isCreatorUser = false;
  if (user) {
    const [adminRes, creatorRes] = await Promise.all([
      supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle(),
      supabase.from('creators').select('id').eq('id', user.id).maybeSingle(),
    ]);
    isAdminUser = Boolean(adminRes.data);
    isCreatorUser = Boolean(creatorRes.data);
  }

  /** Stare rute prijave → jedna stranica /prijava */
  if (pathname === '/admin/prijava' || pathname.startsWith('/admin/prijava/')) {
    const u = request.nextUrl.clone();
    u.pathname = '/prijava';
    u.search = '';
    const oldNext = request.nextUrl.searchParams.get('next');
    const next =
      oldNext && oldNext.startsWith('/admin') ? oldNext : '/admin';
    u.searchParams.set('next', next);
    return NextResponse.redirect(u);
  }

  if (pathname === '/kreator/prijava' || pathname.startsWith('/kreator/prijava/')) {
    const u = request.nextUrl.clone();
    u.pathname = '/prijava';
    u.search = '';
    const oldNext = request.nextUrl.searchParams.get('next');
    const next =
      oldNext && oldNext.startsWith('/kreator') ? oldNext : '/kreator';
    u.searchParams.set('next', next);
    return NextResponse.redirect(u);
  }

  const isPrijava = pathname === '/prijava' || pathname.startsWith('/prijava/');

  if (isPrijava && user) {
    const nextParam = request.nextUrl.searchParams.get('next');
    if (isAdminUser) {
      const dest =
        nextParam && nextParam.startsWith('/admin') ? nextParam : '/admin';
      return NextResponse.redirect(new URL(dest, request.url));
    }
    if (isCreatorUser) {
      const dest =
        nextParam && nextParam.startsWith('/kreator') ? nextParam : '/kreator';
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  const isAdminArea =
    pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdminArea) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/prijava';
      redirectUrl.search = '';
      redirectUrl.searchParams.set('next', pathname + search);
      return NextResponse.redirect(redirectUrl);
    }

    if (!isAdminUser) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return supabaseResponse;
  }

  const isKreatorArea =
    pathname === '/kreator' || pathname.startsWith('/kreator/');

  if (isKreatorArea && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/prijava';
    redirectUrl.search = '';
    redirectUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/prijava',
    '/prijava/:path*',
    '/admin',
    '/admin/:path*',
    '/kreator',
    '/kreator/:path*',
  ],
};
