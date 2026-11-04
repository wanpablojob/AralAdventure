import { PlayerState, QuestCompletion, SyncResult } from '../types';
import { supabase } from './supabase';

export async function syncToSupabase(
  player: PlayerState,
  pendingCompletions: QuestCompletion[],
): Promise<SyncResult> {
  if (!supabase) {
    return {
      ok: false,
      message:
        'Supabase is not configured yet. Add the environment variables to enable teacher sync.',
    };
  }

  const { data, error: playerError } = await supabase
    .from('players')
    .upsert(
      {
        device_id: player.id,
        name: player.name,
        grade_band: player.gradeBand,
        teacher_code: player.teacherCode || null,
        points: player.points,
        level: player.level,
        xp: player.xp,
        completed_quests: player.completedQuestIds,
        owned_items: player.ownedItemIds,
        equipped_outfit_id: player.equippedOutfitId,
        equipped_pet_id: player.equippedPetId,
        equipped_trail_id: player.equippedTrailId,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: 'device_id' },
    )
    .select('id')
    .single();

  if (playerError) {
    throw new Error(playerError.message);
  }

  const playerRow = data as { id: string } | null;

  if (!playerRow) {
    throw new Error('Supabase did not return a player id.');
  }

  if (pendingCompletions.length > 0) {
    const completionRows = pendingCompletions.map((completion) => ({
      id: completion.id,
      player_id: playerRow.id,
      quest_id: completion.questId,
      subject: completion.subject,
      grade_band: completion.gradeBand,
      score: completion.score,
      total: completion.total,
      answers: completion.answers,
      completed_at: completion.completedAt,
    }));

    const { error: completionError } = await supabase
      .from('quest_completions')
      .upsert(completionRows, { onConflict: 'id' });

    if (completionError) {
      throw new Error(completionError.message);
    }
  }

  return {
    ok: true,
    message:
      pendingCompletions.length > 0
        ? `Progress synced. ${pendingCompletions.length} quest result${
            pendingCompletions.length === 1 ? '' : 's'
          } sent to your teacher.`
        : 'Progress synced with your teacher.',
    syncedCount: pendingCompletions.length,
  };
}
