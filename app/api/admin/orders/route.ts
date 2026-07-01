import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchOrdersForAdminList } from '@/lib/supabase/admin-orders-fetch';
import {
  ORDER_LIST_INITIAL_LIMIT,
  ORDER_SEARCH_LIMIT,
} from '@/lib/supabase/query-limits';

async function requireAdminApi() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase: null, error: NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 }) };
  }

  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRow) {
    return { supabase: null, error: NextResponse.json({ error: 'Nemate admin pristup.' }, { status: 403 }) };
  }

  return { supabase, error: null };
}

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const supabase = auth.supabase!;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const status = searchParams.get('status')?.trim() ?? 'all';
  const offset = Math.max(0, Number(searchParams.get('offset') ?? 0) || 0);
  const limitRaw = Number(searchParams.get('limit') ?? 0) || 0;
  const limit = q
    ? Math.min(Math.max(1, limitRaw || ORDER_SEARCH_LIMIT), ORDER_SEARCH_LIMIT)
    : Math.min(Math.max(1, limitRaw || ORDER_LIST_INITIAL_LIMIT), ORDER_LIST_INITIAL_LIMIT);

  const { data, error, hasMore } = await fetchOrdersForAdminList(supabase, {
    search: q || undefined,
    status: status !== 'all' ? status : undefined,
    offset: q ? 0 : offset,
    limit,
    includeLineItems: q.length > 0,
  });

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? 'Učitavanje nije uspelo.' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    orders: data,
    hasMore,
    search: q.length > 0,
  });
}
