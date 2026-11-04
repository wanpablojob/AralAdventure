import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, pixelFont } from '../theme';
import { PixelButton } from './PixelButton';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, onBack, right }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <PixelButton label="← Back" onPress={onBack} variant="secondary" small />
      ) : (
        <View style={styles.spacer} />
      )}
      <Text style={styles.title}>{title}</Text>
      {right ?? <View style={styles.spacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontFamily: pixelFont,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  spacer: {
    minWidth: 72,
  },
});
