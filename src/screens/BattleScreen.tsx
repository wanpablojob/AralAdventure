import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PixelButton } from '../components/PixelButton';
import { PixelCard } from '../components/PixelCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { getQuestions } from '../data/questions';
import { buildCompletion, calculateBattleReward, CORRECT_POINTS } from '../game/engine';
import { AnswerResult, BattleReward, PlayerState, Quest, QuestCompletion } from '../types';
import { colors, pixelFont } from '../theme';

interface BattleScreenProps {
  player: PlayerState;
  quest: Quest;
  onExit: () => void;
  onComplete: (completion: QuestCompletion, reward: BattleReward) => void;
}

export function BattleScreen({ player, quest, onExit, onComplete }: BattleScreenProps) {
  const questions = getQuestions(quest.gradeBand, quest.subject);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const currentQuestion = questions[currentIndex];

  if (questions.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={quest.title} onBack={onExit} />
        <PixelCard>
          <Text style={styles.feedback}>No questions found for this quest yet.</Text>
        </PixelCard>
      </ScrollView>
    );
  }

  const reward = calculateBattleReward(score, questions.length);
  const completion = buildCompletion(player, quest, score, questions.length, answers);

  const handleSelect = (index: number) => {
    if (selectedIndex !== null) {
      return;
    }

    const correct = index === currentQuestion.correctIndex;
    setSelectedIndex(index);
    setAnswers((previous) => [
      ...previous,
      {
        questionId: currentQuestion.id,
        selectedIndex: index,
        correct,
      },
    ]);

    if (correct) {
      setScore((previous) => previous + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setSelectedIndex(null);
  };

  const handleClaim = () => {
    if (claimed) {
      return;
    }

    setClaimed(true);
    onComplete(completion, reward);
  };

  if (finished) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Battle Results" onBack={onExit} />
        <PixelCard style={styles.resultCard}>
          <Text style={styles.resultEmoji}>{reward.won ? '🏆' : '💪'}</Text>
          <Text style={styles.resultTitle}>{reward.won ? 'Quest Complete!' : 'Great Effort!'}</Text>
          <Text style={styles.resultText}>
            You answered {score} out of {questions.length} questions correctly.
          </Text>
          <Text style={styles.rewardText}>+{reward.points} points</Text>
          {!reward.won ? (
            <Text style={styles.resultHint}>
              Score {Math.ceil(questions.length * 0.7)} or more to win the quest. You can try again!
            </Text>
          ) : null}
          <PixelButton label="Claim Reward" onPress={handleClaim} disabled={claimed} />
        </PixelCard>
      </ScrollView>
    );
  }

  const answered = selectedIndex !== null;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title={quest.title} onBack={onExit} />

      <View style={styles.enemyHeader}>
        <Text style={styles.enemyEmoji}>{quest.enemyEmoji}</Text>
        <View>
          <Text style={styles.enemyName}>{quest.enemyName}</Text>
          <Text style={styles.progress}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
        </View>
        <Text style={styles.score}>{score} pts</Text>
      </View>

      <PixelCard style={styles.questionCard}>
        <Text style={styles.prompt}>{currentQuestion.prompt}</Text>

        <View style={styles.options}>
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.correctIndex;
            const isSelected = index === selectedIndex;

            return (
              <Pressable
                key={`${currentQuestion.id}-${option}`}
                accessibilityRole="button"
                onPress={() => handleSelect(index)}
                disabled={answered}
                style={({ pressed }) => [
                  styles.option,
                  pressed && !answered && styles.optionPressed,
                  answered && isCorrect && styles.correctOption,
                  answered && isSelected && !isCorrect && styles.wrongOption,
                ]}
              >
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        {answered ? (
          <View style={styles.feedbackBox}>
            <Text
              style={[
                styles.feedback,
                selectedIndex === currentQuestion.correctIndex
                  ? styles.correctText
                  : styles.wrongText,
              ]}
            >
              {selectedIndex === currentQuestion.correctIndex
                ? `Correct! +${CORRECT_POINTS} points`
                : `Not quite. The answer is ${currentQuestion.options[currentQuestion.correctIndex]}.`}
            </Text>
            <PixelButton
              label={currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}
              onPress={handleNext}
            />
          </View>
        ) : null}
      </PixelCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  enemyHeader: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 3,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    marginTop: 12,
    padding: 12,
  },
  enemyEmoji: {
    fontSize: 42,
  },
  enemyName: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 15,
    fontWeight: '900',
  },
  progress: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 11,
    marginTop: 2,
  },
  score: {
    color: colors.primary,
    fontFamily: pixelFont,
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 'auto',
  },
  questionCard: {
    gap: 14,
  },
  prompt: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 26,
  },
  options: {
    gap: 8,
  },
  option: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  optionPressed: {
    backgroundColor: colors.surfaceLight,
  },
  correctOption: {
    backgroundColor: '#085D3A',
    borderColor: colors.success,
  },
  wrongOption: {
    backgroundColor: '#7A271A',
    borderColor: colors.danger,
  },
  optionText: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 14,
  },
  feedbackBox: {
    gap: 10,
  },
  feedback: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 13,
    lineHeight: 19,
  },
  correctText: {
    color: colors.success,
  },
  wrongText: {
    color: colors.primary,
  },
  resultCard: {
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
  },
  resultEmoji: {
    fontSize: 58,
  },
  resultTitle: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  resultText: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 13,
    textAlign: 'center',
  },
  rewardText: {
    color: colors.primary,
    fontFamily: pixelFont,
    fontSize: 26,
    fontWeight: '900',
  },
  resultHint: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
});
