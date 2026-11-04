export type GradeBand = '1-3' | '4-6';
export type Subject = 'math' | 'english';
export type Difficulty = 'easy' | 'medium';
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface Question {
  id: string;
  subject: Subject;
  gradeBand: GradeBand;
  prompt: string;
  options: string[];
  correctIndex: number;
  difficulty: Difficulty;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  npcName: string;
  npcEmoji: string;
  enemyName: string;
  enemyEmoji: string;
  subject: Subject;
  gradeBand: GradeBand;
  color: string;
}

export interface AnswerResult {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
}

export interface QuestCompletion {
  id: string;
  playerId: string;
  questId: string;
  subject: Subject;
  gradeBand: GradeBand;
  score: number;
  total: number;
  answers: AnswerResult[];
  completedAt: string;
}

export interface PlayerState {
  id: string;
  name: string;
  gradeBand: GradeBand;
  teacherCode: string;
  points: number;
  level: number;
  xp: number;
  completedQuestIds: string[];
  ownedItemIds: string[];
  equippedOutfitId: string | null;
  equippedPetId: string | null;
  equippedTrailId: string | null;
}

export type ShopItemType = 'outfit' | 'pet' | 'trail';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cost: number;
  type: ShopItemType;
}

export interface BattleReward {
  won: boolean;
  points: number;
  xp: number;
}

export interface SyncResult {
  ok: boolean;
  message: string;
  syncedCount?: number;
}
