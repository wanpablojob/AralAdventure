import { GradeBand, Quest } from '../types';

export const QUESTS: Quest[] = [
  {
    id: 'forest-math',
    title: 'The Counting Critter',
    description: 'A fuzzy critter has blocked the forest bridge. Answer its math riddles to pass!',
    npcName: 'Wally the Wise',
    npcEmoji: '🧙‍♂️',
    enemyName: 'Counting Critter',
    enemyEmoji: '🐛',
    subject: 'math',
    gradeBand: '1-3',
    color: '#32D583',
  },
  {
    id: 'forest-english',
    title: 'The Word Goblin',
    description: 'The Word Goblin stole the forest signs. Win a word battle to put them back!',
    npcName: 'Lila the Librarian',
    npcEmoji: '🧚',
    enemyName: 'Word Goblin',
    enemyEmoji: '👺',
    subject: 'english',
    gradeBand: '1-3',
    color: '#FDB022',
  },
  {
    id: 'castle-math',
    title: 'The Multiplication Ogre',
    description: 'The tower is locked by a number puzzle. Defeat the ogre to open the gate!',
    npcName: 'Zara the Sage',
    npcEmoji: '🧙‍♀️',
    enemyName: 'Multiplication Ogre',
    enemyEmoji: '👹',
    subject: 'math',
    gradeBand: '4-6',
    color: '#7A5AF8',
  },
  {
    id: 'castle-english',
    title: 'The Grammar Dragon',
    description: 'A dragon guards the castle library. Use your grammar powers to win!',
    npcName: 'Professor Quill',
    npcEmoji: '🦉',
    enemyName: 'Grammar Dragon',
    enemyEmoji: '🐉',
    subject: 'english',
    gradeBand: '4-6',
    color: '#F04438',
  },
];

export function getQuestsForGrade(gradeBand: GradeBand): Quest[] {
  return QUESTS.filter((quest) => quest.gradeBand === gradeBand);
}
