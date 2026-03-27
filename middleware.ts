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

  const isAdminLogin =
    pathname === '/admin/prijava' || pathname.startsWith('/admin/prijava/');
  const isAdminArea =
    pathname === '/admin' || pathname.startsWith('/admin/');

  let isAdminUser = false;
  if (user) {
    const { data: adminRow } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();
    isAdminUser = Boolean(adminRow);
  }

  if (isAdminArea) {
    if (isAdminLogin) {
      if (user && isAdminUser) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/admin';
        redirectUrl.searchParams.delete('next');
        return NextResponse.redirect(redirectUrl);
      }
      if (user && !isAdminUser) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return supabaseResponse;
    }

    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin/prijava';
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (!isAdminUser) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return supabaseResponse;
  }

  const isKreatorLogin =
    pathname === '/kreator/prijava' || pathname.startsWith('/kreator/prijava/');
  const isKreatorArea =
    pathname === '/kreator' || pathname.startsWith('/kreator/');

  if (isKreatorArea && !isKreatorLogin && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/kreator/prijava';
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isKreatorLogin && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/kreator';
    redirectUrl.searchParams.delete('next');
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/kreator', '/kreator/:path*', '/admin', '/admin/:path*'],
};
