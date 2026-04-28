import type { TarotCard, DrawnCard } from '../types/tarot';

/** Position names in the 3-card spread */
const POSITION_NAMES: ReadonlyArray<'Past' | 'Present' | 'Future'> = [
  'Past',
  'Present',
  'Future',
];

/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 */
export function shuffleDeck(cards: ReadonlyArray<TarotCard>): TarotCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Randomly determines if a card is reversed (50/50 chance).
 */
export function determineReversed(): boolean {
  return Math.random() > 0.5;
}

/**
 * Returns the position name for a given index (0-2) in the spread.
 */
export function getPositionName(index: number): 'Past' | 'Present' | 'Future' {
  if (index < 0 || index >= POSITION_NAMES.length) {
    throw new Error(`Invalid position index: ${index}. Must be 0, 1, or 2.`);
  }
  return POSITION_NAMES[index];
}

/**
 * Creates a DrawnCard from a TarotCard at a given spread position.
 */
export function drawCard(card: TarotCard, positionIndex: number): DrawnCard {
  return {
    ...card,
    isReversed: determineReversed(),
    positionName: getPositionName(positionIndex),
  };
}
