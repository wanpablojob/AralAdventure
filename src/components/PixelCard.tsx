import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

interface PixelCardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function PixelCard({ children, style }: PixelCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 3,
    padding: 16,
  },
});
