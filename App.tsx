import { useNetInfo } from '@react-native-community/netinfo';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { AdventureScreen } from './src/screens/AdventureScreen';
import { BattleScreen } from './src/screens/BattleScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { TeacherScreen } from './src/screens/TeacherScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { applyBattleResult } from './src/game/engine';
import {
  clearPendingCompletions,
  createPlayer,
  loadPendingCompletions,
  loadPlayer,
  queueCompletion,
  savePlayer,
} from './src/lib/storage';
import { syncToSupabase } from './src/lib/sync';
import {
  BattleReward,
  GradeBand,
  PlayerState,
  Quest,
  QuestCompletion,
  ShopItem,
  SyncStatus,
} from './src/types';
import { colors, pixelFont } from './src/theme';

type Screen = 'home' | 'adventure' | 'battle' | 'shop' | 'teacher';

export default function App() {
  const netInfo = useNetInfo();
  const isOnline = netInfo.isConnected === true;

  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [screen, setScreen] = useState<Screen>('home');
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [syncMessage, setSyncMessage] = useState('Progress is saved on this device.');

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const savedPlayer = await loadPlayer();
      const pending = await loadPendingCompletions();

      if (!mounted) {
        return;
      }

      if (savedPlayer) {
        setPlayer(savedPlayer);
      }

      setPendingCount(pending.length);
      setIsLoading(false);
    }

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (player) {
      void savePlayer(player);
    }
  }, [player]);

  const syncNow = useCallback(async () => {
    if (!player) {
      return;
    }

    if (!isOnline) {
      setSyncStatus('error');
      setSyncMessage('You are offline. Progress is saved on this device.');
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage('Sending progress to your teacher...');

    try {
      const pending = await loadPendingCompletions();
      const result = await syncToSupabase(player, pending);

      if (!result.ok) {
        setSyncStatus('error');
        setSyncMessage(result.message);
        return;
      }

      await clearPendingCompletions();
      setPendingCount(0);
      setLastSyncedAt(new Date().toISOString());
      setSyncStatus('success');
      setSyncMessage(result.message);
    } catch (error) {
      setSyncStatus('error');
      setSyncMessage(error instanceof Error ? error.message : 'Sync failed. Please try again.');
    }
  }, [isOnline, player]);

  useEffect(() => {
    if (!player?.teacherCode || !isOnline) {
      return;
    }

    const timer = setTimeout(() => {
      void syncNow();
    }, 1200);

    return () => clearTimeout(timer);
  }, [isOnline, player, syncNow]);

  const handleStart = (name: string, gradeBand: GradeBand) => {
    const newPlayer = createPlayer(name, gradeBand);
    setPlayer(newPlayer);
    setScreen('home');
  };

  const handleStartQuest = (quest: Quest) => {
    setActiveQuest(quest);
    setScreen('battle');
  };

  const handleCompleteBattle = async (completion: QuestCompletion, reward: BattleReward) => {
    if (!player || !activeQuest) {
      return;
    }

    await queueCompletion(completion);
    setPendingCount((previous) => previous + 1);
    setPlayer(applyBattleResult(player, activeQuest, reward));
    setActiveQuest(null);
    setScreen('home');
    setSyncStatus('idle');
    setSyncMessage(
      reward.won
        ? `Quest complete! +${reward.points} points saved.`
        : `You earned ${reward.points} points. Try again to win the quest!`,
    );
  };

  const handleBuy = (item: ShopItem) => {
    if (!player || player.ownedItemIds.includes(item.id) || player.points < item.cost) {
      return;
    }

    setPlayer({
      ...player,
      points: player.points - item.cost,
      ownedItemIds: [...player.ownedItemIds, item.id],
    });
    setSyncMessage(`${item.name} unlocked!`);
  };

  const handleEquip = (item: ShopItem) => {
    if (!player?.ownedItemIds.includes(item.id)) {
      return;
    }

    if (item.type === 'outfit') {
      setPlayer({ ...player, equippedOutfitId: item.id });
    } else if (item.type === 'pet') {
      setPlayer({ ...player, equippedPetId: item.id });
    } else {
      setPlayer({ ...player, equippedTrailId: item.id });
    }
  };

  const handleSaveTeacherCode = (teacherCode: string) => {
    if (!player) {
      return;
    }

    const trimmed = teacherCode.trim();
    setPlayer({ ...player, teacherCode: trimmed });
    setSyncStatus('idle');
    setSyncMessage(
      trimmed
        ? 'Teacher code saved. Your progress will sync when you are online.'
        : 'Teacher code cleared.',
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading your adventure...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!player) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <WelcomeScreen onStart={handleStart} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      {screen === 'battle' && activeQuest ? (
        <BattleScreen
          player={player}
          quest={activeQuest}
          onExit={() => {
            setActiveQuest(null);
            setScreen('adventure');
          }}
          onComplete={handleCompleteBattle}
        />
      ) : screen === 'adventure' ? (
        <AdventureScreen
          player={player}
          onBack={() => setScreen('home')}
          onStartQuest={handleStartQuest}
        />
      ) : screen === 'shop' ? (
        <ShopScreen
          player={player}
          onBack={() => setScreen('home')}
          onBuy={handleBuy}
          onEquip={handleEquip}
        />
      ) : screen === 'teacher' ? (
        <TeacherScreen
          player={player}
          isOnline={isOnline}
          pendingCount={pendingCount}
          lastSyncedAt={lastSyncedAt}
          syncStatus={syncStatus}
          syncMessage={syncMessage}
          onBack={() => setScreen('home')}
          onSaveTeacherCode={handleSaveTeacherCode}
          onSync={() => {
            void syncNow();
          }}
        />
      ) : (
        <HomeScreen
          player={player}
          isOnline={isOnline}
          pendingCount={pendingCount}
          syncStatus={syncStatus}
          syncMessage={syncMessage}
          onAdventure={() => setScreen('adventure')}
          onShop={() => setScreen('shop')}
          onTeacher={() => setScreen('teacher')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 13,
  },
});
