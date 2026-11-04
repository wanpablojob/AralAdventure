import { PlayerState, ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'outfit-scout',
    name: 'Scout Outfit',
    description: 'A bright cap for curious explorers.',
    emoji: '🧢',
    cost: 50,
    type: 'outfit',
  },
  {
    id: 'outfit-mage',
    name: 'Mage Robe',
    description: 'Look like a true quiz wizard.',
    emoji: '🧙',
    cost: 150,
    type: 'outfit',
  },
  {
    id: 'pet-fox',
    name: 'Foxy Friend',
    description: 'A clever fox who loves adventure.',
    emoji: '🦊',
    cost: 100,
    type: 'pet',
  },
  {
    id: 'pet-dragon',
    name: 'Baby Dragon',
    description: 'A tiny dragon with a big heart.',
    emoji: '🐲',
    cost: 250,
    type: 'pet',
  },
  {
    id: 'trail-sparkle',
    name: 'Starlight Trail',
    description: 'Leave a sparkle wherever you go.',
    emoji: '✨',
    cost: 75,
    type: 'trail',
  },
];

export function getShopItem(id: string | null): ShopItem | undefined {
  return id ? SHOP_ITEMS.find((item) => item.id === id) : undefined;
}

export function getEquippedEmojis(player: PlayerState) {
  return {
    outfit: getShopItem(player.equippedOutfitId)?.emoji ?? '🧑‍🚀',
    pet: getShopItem(player.equippedPetId)?.emoji ?? null,
    trail: getShopItem(player.equippedTrailId)?.emoji ?? null,
  };
}
