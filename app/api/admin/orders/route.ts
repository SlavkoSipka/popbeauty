import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchOrdersForAdminList } from '@/lib/supabase/admin-orders-fetch';
import {
  ORDER_LIST_INITIAL_LIMIT,
  ORDER_SEARCH_LIMIT,
} from '@/lib/supabase/query-limits';

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
  }

  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRow) {
    return NextResponse.json({ error: 'Nemate admin pristup.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const status = searchParams.get('status')?.trim() ?? 'all';
  const loadAll = searchParams.get('all') === '1';
  const offset = Math.max(0, Number(searchParams.get('offset') ?? 0) || 0);
  const limitRaw = Number(searchParams.get('limit') ?? 0) || 0;
  const isSearch = q.length > 0;
  const limit = isSearch
    ? Math.min(Math.max(1, limitRaw || ORDER_SEARCH_LIMIT), ORDER_SEARCH_LIMIT)
    : Math.min(Math.max(1, limitRaw || ORDER_LIST_INITIAL_LIMIT), ORDER_LIST_INITIAL_LIMIT);

  const { data, error, hasMore } = await fetchOrdersForAdminList(supabase, {
    search: q || undefined,
    status: status !== 'all' ? status : undefined,
    offset: loadAll ? 0 : offset,
    limit: loadAll ? undefined : limit,
    includeLineItems: isSearch,
    fetchAll: loadAll,
  });

  if (error || !data) {
    const message = error?.message ?? 'Učitavanje nije uspelo.';
    const hint =
      isSearch &&
      (message.includes('search_admin_orders') || message.includes('Could not find the function'))
        ? ' Pokreni migraciju supabase/migrations/20260620120000_admin_orders_search.sql u Supabase SQL Editoru.'
        : '';
    return NextResponse.json({ error: `${message}${hint}` }, { status: 500 });
  }

  return NextResponse.json({
    orders: data,
    hasMore,
    search: isSearch,
  });
}
