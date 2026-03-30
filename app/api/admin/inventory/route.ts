import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type Body = {
  action: 'purchase' | 'adjustment';
  product_slug: string;
  component_type: string;
  quantity: number;
  unit_cost_rsd?: number;
  note?: string;
};

export async function POST(request: Request) {
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

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON.' }, { status: 400 });
  }

  const { action, product_slug, component_type, quantity, unit_cost_rsd, note } = body;

  if (!product_slug || !component_type || typeof quantity !== 'number' || quantity === 0) {
    return NextResponse.json(
      { error: 'Obavezna polja: product_slug, component_type, quantity (!=0).' },
      { status: 400 },
    );
  }

  if (!['purchase', 'adjustment'].includes(action)) {
    return NextResponse.json({ error: 'Action mora biti "purchase" ili "adjustment".' }, { status: 400 });
  }

  const validComponents = ['nalepnica', 'ambalaza', 'serum'];
  if (!validComponents.includes(component_type)) {
    return NextResponse.json({ error: 'Nevažeći component_type.' }, { status: 400 });
  }

  const totalCost =
    action === 'purchase' && unit_cost_rsd
      ? Math.round(quantity * unit_cost_rsd * 100) / 100
      : null;

  const { error: txError } = await supabase.from('inventory_transactions').insert({
    product_slug,
    component_type,
    quantity_change: quantity,
    type: action,
    note: note || null,
    total_cost_rsd: totalCost,
  });

  if (txError) {
    return NextResponse.json({ error: `Greška: ${txError.message}` }, { status: 500 });
  }

  const { data: current } = await supabase
    .from('inventory')
    .select('quantity, unit_cost_rsd')
    .eq('product_slug', product_slug)
    .eq('component_type', component_type)
    .maybeSingle();

  if (current) {
    const newQty = Number(current.quantity) + quantity;
    const updates: Record<string, unknown> = {
      quantity: Math.max(0, newQty),
      updated_at: new Date().toISOString(),
    };
    if (action === 'purchase' && unit_cost_rsd != null) {
      updates.unit_cost_rsd = unit_cost_rsd;
    }
    const { error: updateError } = await supabase
      .from('inventory')
      .update(updates)
      .eq('product_slug', product_slug)
      .eq('component_type', component_type);

    if (updateError) {
      return NextResponse.json({ error: `Greška ažuriranja: ${updateError.message}` }, { status: 500 });
    }
  } else {
    const { error: insertError } = await supabase.from('inventory').insert({
      product_slug,
      component_type,
      quantity: Math.max(0, quantity),
      unit_cost_rsd: unit_cost_rsd ?? 0,
    });

    if (insertError) {
      return NextResponse.json({ error: `Greška unosa: ${insertError.message}` }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
