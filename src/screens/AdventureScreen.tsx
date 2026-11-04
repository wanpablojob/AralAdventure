import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { getQuestsForGrade } from '../data/quests';
import { PlayerState, Quest } from '../types';
import { colors, pixelFont } from '../theme';
import { PixelButton } from '../components/PixelButton';
import { PixelCard } from '../components/PixelCard';
import { ScreenHeader } from '../components/ScreenHeader';

interface AdventureScreenProps {
  player: PlayerState;
  onBack: () => void;
  onStartQuest: (quest: Quest) => void;
}

export function AdventureScreen({ player, onBack, onStartQuest }: AdventureScreenProps) {
  const quests = getQuestsForGrade(player.gradeBand);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title="Adventure Map" onBack={onBack} />

      <Text style={styles.intro}>
        Talk to a guide, accept the quest, then defeat the enemy by answering 10 questions.
      </Text>

      {quests.map((quest) => {
        const completed = player.completedQuestIds.includes(quest.id);

        return (
          <PixelCard key={quest.id} style={[styles.questCard, { borderColor: quest.color }]}>
            <View style={styles.questHeader}>
              <Text style={styles.npcEmoji}>{quest.npcEmoji}</Text>
              <View style={styles.questTitleBlock}>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <Text style={styles.questMeta}>
                  {quest.subject === 'math' ? 'Math' : 'English'} · Grades {quest.gradeBand}
                </Text>
              </View>
              {completed ? <Text style={styles.completed}>✓</Text> : null}
            </View>

            <Text style={styles.description}>{quest.description}</Text>

            <View style={styles.npcRow}>
              <Text style={styles.npcText}>Guide: {quest.npcName}</Text>
              <Text style={styles.npcText}>Enemy: {quest.enemyName}</Text>
            </View>

            <View style={styles.enemyRow}>
              <Text style={styles.enemyEmoji}>{quest.enemyEmoji}</Text>
              <Text style={styles.enemyText}>10 questions await!</Text>
            </View>

            <PixelButton
              label={completed ? 'Replay Quest' : 'Accept Quest'}
              onPress={() => onStartQuest(quest)}
              variant={completed ? 'secondary' : 'primary'}
            />
          </PixelCard>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  intro: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
    marginTop: 12,
  },
  questCard: {
    gap: 10,
    marginBottom: 14,
  },
  questHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  npcEmoji: {
    fontSize: 34,
  },
  questTitleBlock: {
    flex: 1,
  },
  questTitle: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 17,
    fontWeight: '900',
  },
  questMeta: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 11,
    marginTop: 2,
  },
  completed: {
    color: colors.success,
    fontFamily: pixelFont,
    fontSize: 22,
    fontWeight: '900',
  },
  description: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 12,
    lineHeight: 18,
  },
  npcRow: {
    gap: 4,
  },
  npcText: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 11,
  },
  enemyRow: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  enemyEmoji: {
    fontSize: 30,
  },
  enemyText: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 11,
  },
});
