import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GradeBand } from '../types';
import { colors, pixelFont } from '../theme';
import { PixelButton } from '../components/PixelButton';
import { PixelCard } from '../components/PixelCard';

interface WelcomeScreenProps {
  onStart: (name: string, gradeBand: GradeBand) => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [gradeBand, setGradeBand] = useState<GradeBand>('1-3');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>WELCOME TO</Text>
        <Text style={styles.title}>AralAdventure</Text>
        <Text style={styles.subtitle}>A quiz adventure for grades 1 to 6</Text>

        <PixelCard style={styles.card}>
          <Text style={styles.label}>What should we call you?</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Adventurer name"
            placeholderTextColor={colors.muted}
            style={styles.input}
            maxLength={20}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Choose your grade band</Text>
          <View style={styles.gradeRow}>
            <PixelButton
              label="Grades 1–3"
              onPress={() => setGradeBand('1-3')}
              variant={gradeBand === '1-3' ? 'primary' : 'secondary'}
              style={styles.gradeButton}
            />
            <PixelButton
              label="Grades 4–6"
              onPress={() => setGradeBand('4-6')}
              variant={gradeBand === '4-6' ? 'primary' : 'secondary'}
              style={styles.gradeButton}
            />
          </View>

          <PixelButton label="Start Adventure" onPress={() => onStart(name, gradeBand)} />
        </PixelCard>

        <Text style={styles.hint}>
          Play offline anytime. When you are online, progress can be synced to your teacher.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  kicker: {
    color: colors.primary,
    fontFamily: pixelFont,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 4,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 38,
    fontWeight: '900',
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 14,
    marginBottom: 24,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    gap: 10,
  },
  label: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 14,
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
    fontSize: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  gradeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  gradeButton: {
    flex: 1,
  },
  hint: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 20,
    textAlign: 'center',
  },
});
