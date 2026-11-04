import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getEquippedEmojis } from '../data/shop';
import { PlayerState } from '../types';
import { colors, pixelFont } from '../theme';

interface AvatarProps {
  player: PlayerState;
  compact?: boolean;
}

export function Avatar({ player, compact = false }: AvatarProps) {
  const { outfit, pet, trail } = getEquippedEmojis(player);

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {trail ? <Text style={styles.trail}>{trail}</Text> : null}
      <Text style={[styles.character, compact && styles.compactCharacter]}>{outfit}</Text>
      {pet ? <Text style={[styles.pet, compact && styles.compactPet]}>{pet}</Text> : null}
      {!compact ? <Text style={styles.name}>{player.name}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    position: 'relative',
  },
  compactContainer: {
    minHeight: 60,
    width: 72,
  },
  trail: {
    fontSize: 22,
    opacity: 0.9,
    position: 'absolute',
    right: 8,
    top: 4,
  },
  character: {
    fontSize: 72,
  },
  compactCharacter: {
    fontSize: 40,
  },
  pet: {
    bottom: 20,
    fontSize: 34,
    position: 'absolute',
    right: 10,
  },
  compactPet: {
    bottom: 2,
    fontSize: 20,
    right: 0,
  },
  name: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },
});
