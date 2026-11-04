import {
  applyBattleResult,
  calculateBattleReward,
  FULL_CLEAR_BONUS,
  PASS_SCORE,
  WIN_BONUS,
} from './engine';
import { PlayerState, Quest } from '../types';

const player: PlayerState = {
  id: 'player-1',
  name: 'Test Adventurer',
  gradeBand: '1-3',
  teacherCode: '',
  points: 0,
  level: 1,
  xp: 0,
  completedQuestIds: [],
  ownedItemIds: [],
  equippedOutfitId: null,
  equippedPetId: null,
  equippedTrailId: null,
};

const quest: Quest = {
  id: 'forest-math',
  title: 'The Counting Critter',
  description: 'Test quest',
  npcName: 'Wally the Wise',
  npcEmoji: '🧙',
  enemyName: 'Counting Critter',
  enemyEmoji: '🐛',
  subject: 'math',
  gradeBand: '1-3',
  color: '#32D583',
};

describe('battle rewards', () => {
  it('gives a win bonus and a perfect bonus for a perfect score', () => {
    const reward = calculateBattleReward(10, 10);

    expect(reward.won).toBe(true);
    expect(reward.points).toBe(10 * 10 + WIN_BONUS + FULL_CLEAR_BONUS);
    expect(reward.xp).toBe(reward.points);
  });

  it('gives the win bonus at the passing score', () => {
    const reward = calculateBattleReward(PASS_SCORE, 10);

    expect(reward.won).toBe(true);
    expect(reward.points).toBe(PASS_SCORE * 10 + WIN_BONUS);
  });

  it('does not give a win bonus below the passing score', () => {
    const reward = calculateBattleReward(PASS_SCORE - 1, 10);

    expect(reward.won).toBe(false);
    expect(reward.points).toBe((PASS_SCORE - 1) * 10);
  });
});

describe('applyBattleResult', () => {
  it('adds points and xp and records a completed quest after a win', () => {
    const updated = applyBattleResult(player, quest, {
      won: true,
      points: 100,
      xp: 100,
    });

    expect(updated.points).toBe(100);
    expect(updated.xp).toBe(100);
    expect(updated.level).toBe(2);
    expect(updated.completedQuestIds).toEqual([quest.id]);
  });

  it('does not mark the quest complete after a loss', () => {
    const updated = applyBattleResult(player, quest, {
      won: false,
      points: 60,
      xp: 60,
    });

    expect(updated.points).toBe(60);
    expect(updated.completedQuestIds).toEqual([]);
  });
});
