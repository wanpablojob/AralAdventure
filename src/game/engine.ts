import { AnswerResult, BattleReward, PlayerState, Quest, QuestCompletion } from '../types';
import { createId } from '../lib/id';

export const CORRECT_POINTS = 10;
export const WIN_BONUS = 40;
export const FULL_CLEAR_BONUS = 10;
export const PASS_SCORE = 7;

export function calculateBattleReward(score: number, total: number): BattleReward {
  const won = score >= PASS_SCORE;
  const bonus = won ? WIN_BONUS : 0;
  const perfectBonus = score === total ? FULL_CLEAR_BONUS : 0;
  const points = score * CORRECT_POINTS + bonus + perfectBonus;

  return {
    won,
    points,
    xp: points,
  };
}

export function buildCompletion(
  player: PlayerState,
  quest: Quest,
  score: number,
  total: number,
  answers: AnswerResult[],
): QuestCompletion {
  return {
    id: createId(),
    playerId: player.id,
    questId: quest.id,
    subject: quest.subject,
    gradeBand: quest.gradeBand,
    score,
    total,
    answers,
    completedAt: new Date().toISOString(),
  };
}

export function applyBattleResult(
  player: PlayerState,
  quest: Quest,
  reward: BattleReward,
): PlayerState {
  const xp = player.xp + reward.xp;
  const level = Math.floor(xp / 100) + 1;
  const completedQuestIds =
    reward.won && !player.completedQuestIds.includes(quest.id)
      ? [...player.completedQuestIds, quest.id]
      : player.completedQuestIds;

  return {
    ...player,
    points: player.points + reward.points,
    xp,
    level,
    completedQuestIds,
  };
}
