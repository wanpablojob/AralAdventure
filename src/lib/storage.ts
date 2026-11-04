import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradeBand, PlayerState, QuestCompletion } from '../types';
import { createId } from './id';

const PLAYER_KEY = '@araladventure/player';
const PENDING_KEY = '@araladventure/pending-completions';

export function createPlayer(name: string, gradeBand: GradeBand): PlayerState {
  return {
    id: createId(),
    name: name.trim() || 'Adventurer',
    gradeBand,
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
}

export async function loadPlayer(): Promise<PlayerState | null> {
  try {
    const raw = await AsyncStorage.getItem(PLAYER_KEY);
    return raw ? (JSON.parse(raw) as PlayerState) : null;
  } catch {
    return null;
  }
}

export async function savePlayer(player: PlayerState): Promise<void> {
  await AsyncStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

export async function loadPendingCompletions(): Promise<QuestCompletion[]> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as QuestCompletion[]) : [];
  } catch {
    return [];
  }
}

export async function savePendingCompletions(completions: QuestCompletion[]): Promise<void> {
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(completions));
}

export async function queueCompletion(completion: QuestCompletion): Promise<void> {
  const existing = await loadPendingCompletions();
  const withoutDuplicate = existing.filter((item) => item.id !== completion.id);
  await savePendingCompletions([...withoutDuplicate, completion]);
}

export async function clearPendingCompletions(): Promise<void> {
  await AsyncStorage.removeItem(PENDING_KEY);
}
