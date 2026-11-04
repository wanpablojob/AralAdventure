import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../components/Avatar';
import { PixelButton } from '../components/PixelButton';
import { PixelCard } from '../components/PixelCard';
import { PlayerState, SyncStatus } from '../types';
import { colors, pixelFont } from '../theme';

interface HomeScreenProps {
  player: PlayerState;
  isOnline: boolean;
  pendingCount: number;
  syncStatus: SyncStatus;
  syncMessage: string;
  onAdventure: () => void;
  onShop: () => void;
  onTeacher: () => void;
}

export function HomeScreen({
  player,
  isOnline,
  pendingCount,
  syncStatus,
  syncMessage,
  onAdventure,
  onShop,
  onTeacher,
}: HomeScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.kicker}>ARAL ADVENTURE</Text>
          <Text style={styles.title}>Your Quest</Text>
        </View>
        <View style={styles.connectionPill}>
          <View
            style={[styles.dot, { backgroundColor: isOnline ? colors.success : colors.muted }]}
          />
          <Text style={styles.connectionText}>{isOnline ? 'Online' : 'Offline'}</Text>
        </View>
      </View>

      <PixelCard style={styles.heroCard}>
        <Avatar player={player} />
        <View style={styles.statsRow}>
          <Stat label="Points" value={player.points.toString()} />
          <Stat label="Level" value={player.level.toString()} />
          <Stat label="Quests" value={`${player.completedQuestIds.length}`} />
        </View>
      </PixelCard>

      <View style={styles.actions}>
        <PixelButton label="Enter the Adventure" onPress={onAdventure} />
        <PixelButton label="Visit the Shop" onPress={onShop} variant="secondary" />
        <PixelButton label="Teacher Sync" onPress={onTeacher} variant="ghost" />
      </View>

      <PixelCard style={styles.syncCard}>
        <Text style={styles.syncTitle}>Teacher connection</Text>
        <Text style={styles.syncText}>{syncMessage}</Text>
        <Text style={styles.syncMeta}>
          {pendingCount > 0
            ? `${pendingCount} quest result${pendingCount === 1 ? '' : 's'} waiting to sync`
            : 'All available progress is saved locally'}
        </Text>
        {syncStatus === 'error' ? (
          <Text style={styles.errorText}>Sync needs attention. Open Teacher Sync to retry.</Text>
        ) : null}
      </PixelCard>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  kicker: {
    color: colors.primary,
    fontFamily: pixelFont,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3,
  },
  title: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },
  connectionPill: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  connectionText: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 11,
    fontWeight: '700',
  },
  heroCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    width: '100%',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: colors.primary,
    fontFamily: pixelFont,
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 11,
    marginTop: 2,
  },
  actions: {
    gap: 10,
    marginBottom: 16,
  },
  syncCard: {
    gap: 6,
  },
  syncTitle: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 14,
    fontWeight: '900',
  },
  syncText: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 12,
    lineHeight: 18,
  },
  syncMeta: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 11,
    fontStyle: 'italic',
  },
  errorText: {
    color: colors.danger,
    fontFamily: pixelFont,
    fontSize: 11,
    marginTop: 4,
  },
});
