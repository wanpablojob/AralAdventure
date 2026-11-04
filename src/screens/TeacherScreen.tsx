import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PixelButton } from '../components/PixelButton';
import { PixelCard } from '../components/PixelCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { PlayerState, SyncStatus } from '../types';
import { colors, pixelFont } from '../theme';

interface TeacherScreenProps {
  player: PlayerState;
  isOnline: boolean;
  pendingCount: number;
  lastSyncedAt: string | null;
  syncStatus: SyncStatus;
  syncMessage: string;
  onBack: () => void;
  onSaveTeacherCode: (teacherCode: string) => void;
  onSync: () => void;
}

export function TeacherScreen({
  player,
  isOnline,
  pendingCount,
  lastSyncedAt,
  syncStatus,
  syncMessage,
  onBack,
  onSaveTeacherCode,
  onSync,
}: TeacherScreenProps) {
  const [teacherCode, setTeacherCode] = useState(player.teacherCode);

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <ScreenHeader title="Teacher Sync" onBack={onBack} />

      <PixelCard style={styles.card}>
        <Text style={styles.cardTitle}>Connect to your teacher</Text>
        <Text style={styles.cardText}>
          Ask your teacher for a class code. Your points and quest results stay on this device while
          offline, then sync when you are online.
        </Text>

        <Text style={styles.label}>Teacher class code</Text>
        <TextInput
          value={teacherCode}
          onChangeText={setTeacherCode}
          placeholder="Example: ARAL-4B"
          placeholderTextColor={colors.muted}
          autoCapitalize="characters"
          style={styles.input}
        />
        <PixelButton
          label="Save Teacher Code"
          onPress={() => onSaveTeacherCode(teacherCode)}
          variant="secondary"
        />
      </PixelCard>

      <PixelCard style={styles.card}>
        <Text style={styles.cardTitle}>Sync status</Text>
        <View style={styles.statusRow}>
          <View
            style={[styles.dot, { backgroundColor: isOnline ? colors.success : colors.muted }]}
          />
          <Text style={styles.statusText}>
            {isOnline ? 'Connected to the internet' : 'Offline mode'}
          </Text>
        </View>
        <Text style={styles.cardText}>{syncMessage}</Text>
        <Text style={styles.meta}>Pending results: {pendingCount}</Text>
        <Text style={styles.meta}>Last synced: {formatDate(lastSyncedAt)}</Text>

        {syncStatus === 'syncing' ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <PixelButton
            label="Sync Now"
            onPress={onSync}
            disabled={!isOnline || !player.teacherCode}
          />
        )}

        {!player.teacherCode ? (
          <Text style={styles.meta}>Add a teacher code before syncing.</Text>
        ) : null}
      </PixelCard>
    </ScrollView>
  );
}

function formatDate(value: string | null): string {
  if (!value) {
    return 'Never';
  }

  return new Date(value).toLocaleString();
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    gap: 10,
    marginTop: 14,
  },
  cardTitle: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 16,
    fontWeight: '900',
  },
  cardText: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 12,
    lineHeight: 18,
  },
  label: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 2,
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    borderRadius: 999,
    height: 9,
    width: 9,
  },
  statusText: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 12,
  },
  meta: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 11,
    lineHeight: 17,
  },
});
