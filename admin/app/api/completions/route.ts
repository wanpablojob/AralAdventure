import { NextRequest, NextResponse } from 'next/server';
import { requireSupabaseAdmin } from '../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = requireSupabaseAdmin();
    const teacherCode = request.nextUrl.searchParams.get('teacherCode');

    const { data, error } = await supabaseAdmin
      .from('quest_completions')
      .select(
        'id,quest_id,subject,grade_band,score,total,answers,completed_at,players(name,teacher_code)',
      )
      .order('completed_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const completions = (data ?? []).filter((completion) => {
      if (!teacherCode) {
        return true;
      }

      const player = completion.players as { teacher_code?: string } | null;
      return player?.teacher_code === teacherCode;
    });

    return NextResponse.json({ completions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Supabase is not configured.' },
      { status: 503 },
    );
  }
}
