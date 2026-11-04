import { NextResponse } from 'next/server';
import { requireSupabaseAdmin } from '../../../lib/supabase';

export async function GET() {
  try {
    const supabaseAdmin = requireSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('players')
      .select(
        'id,name,grade_band,teacher_code,points,level,xp,completed_quests,owned_items,equipped_outfit_id,equipped_pet_id,equipped_trail_id,last_synced_at,created_at,updated_at',
      )
      .order('updated_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ students: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Supabase is not configured.' },
      { status: 503 },
    );
  }
}
