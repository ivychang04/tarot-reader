/** Base card shape matching tarotDeck.json */
export interface TarotCard {
  id: number;
  name: string;
  type: 'major' | 'minor';
  suit: 'trumps' | 'pentacles' | 'wands' | 'cups' | 'swords';
  meaningUpright: string;
  meaningReversed: string;
  description: string;
  imageUrl: string;
}

/** A card after being drawn — extends with orientation & position */
export interface DrawnCard extends TarotCard {
  isReversed: boolean;
  positionName: 'Past' | 'Present' | 'Future';
}

/** Chat message for the reading/chat UI */
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

/** App screen states */
export type AppScreen = 'WELCOME' | 'SELECTION' | 'READING';
