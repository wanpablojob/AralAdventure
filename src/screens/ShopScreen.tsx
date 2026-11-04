import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../components/Avatar';
import { PixelButton } from '../components/PixelButton';
import { PixelCard } from '../components/PixelCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { SHOP_ITEMS } from '../data/shop';
import { PlayerState, ShopItem } from '../types';
import { colors, pixelFont } from '../theme';

interface ShopScreenProps {
  player: PlayerState;
  onBack: () => void;
  onBuy: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
}

export function ShopScreen({ player, onBack, onBuy, onEquip }: ShopScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title="Adventure Shop" onBack={onBack} />

      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>Your points</Text>
        <Text style={styles.balance}>{player.points}</Text>
      </View>

      <PixelCard style={styles.avatarCard}>
        <Avatar player={player} />
      </PixelCard>

      <Text style={styles.intro}>Spend points on outfits, pets, and trails.</Text>

      {SHOP_ITEMS.map((item) => {
        const owned = player.ownedItemIds.includes(item.id);
        const equipped = isEquipped(player, item);
        const canAfford = player.points >= item.cost;

        return (
          <PixelCard key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemEmoji}>{item.emoji}</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <Text style={styles.itemType}>{item.type.toUpperCase()}</Text>
            </View>

            <View style={styles.itemFooter}>
              <Text style={styles.cost}>{owned ? 'Owned' : `${item.cost} pts`}</Text>
              <PixelButton
                label={equipped ? 'Equipped' : owned ? 'Equip' : 'Buy'}
                onPress={() => (owned ? onEquip(item) : onBuy(item))}
                disabled={equipped || (!owned && !canAfford)}
                variant={equipped ? 'secondary' : 'primary'}
                small
              />
            </View>
          </PixelCard>
        );
      })}
    </ScrollView>
  );
}

function isEquipped(player: PlayerState, item: ShopItem): boolean {
  if (item.type === 'outfit') {
    return player.equippedOutfitId === item.id;
  }

  if (item.type === 'pet') {
    return player.equippedPetId === item.id;
  }

  return player.equippedTrailId === item.id;
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  balanceRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 12,
  },
  balanceLabel: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 13,
  },
  balance: {
    color: colors.primary,
    fontFamily: pixelFont,
    fontSize: 30,
    fontWeight: '900',
  },
  avatarCard: {
    marginTop: 12,
  },
  intro: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 12,
    marginBottom: 12,
    marginTop: 14,
  },
  itemCard: {
    gap: 10,
    marginBottom: 12,
  },
  itemHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  itemEmoji: {
    fontSize: 34,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: colors.text,
    fontFamily: pixelFont,
    fontSize: 15,
    fontWeight: '900',
  },
  itemDescription: {
    color: colors.muted,
    fontFamily: pixelFont,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  itemType: {
    color: colors.info,
    fontFamily: pixelFont,
    fontSize: 9,
    fontWeight: '900',
  },
  itemFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cost: {
    color: colors.primary,
    fontFamily: pixelFont,
    fontSize: 13,
    fontWeight: '900',
  },
});
