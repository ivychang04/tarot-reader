import { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { TarotCard, DrawnCard } from '../types/tarot';
import { shuffleDeck, drawCard } from '../utils/cardUtils';
import SpreadDisplay from '../components/SpreadDisplay';
import DeckGrid from '../components/DeckGrid';
import tarotDeck from '../data/tarotDeck.json';

interface SelectionScreenProps {
  userQuestion: string;
  onCardsSelected: (cards: DrawnCard[]) => void;
  onBack: () => void;
}

/**
 * Card selection screen: displays the 3-card spread at top, a grid of
 * 78 face-down cards below, and handles the selection logic.
 */
export default function SelectionScreen({
  userQuestion,
  onCardsSelected,
  onBack,
}: SelectionScreenProps) {
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showCta, setShowCta] = useState(false);

  // Shuffle deck once when screen mounts
  const shuffledDeck = useMemo(
    () => shuffleDeck(tarotDeck as TarotCard[]),
    []
  );

  const isSelectionComplete = selectedCards.length >= 3;

  const handleCardSelect = useCallback(
    (card: TarotCard) => {
      if (selectedCards.length >= 3) return;

      const positionIndex = selectedCards.length;
      const drawn = drawCard(card, positionIndex);

      const newCards = [...selectedCards, drawn];
      setSelectedCards(newCards);
      setSelectedIds((prev) => new Set(prev).add(card.id));

      // If this was the 3rd card, show CTA after a brief delay
      if (newCards.length === 3) {
        setTimeout(() => setShowCta(true), 1200);
      }
    },
    [selectedCards]
  );

  return (
    <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-purple-300 transition-colors"
          aria-label="Go back to question"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="glass-card rounded-full px-3 py-1.5 max-w-xs sm:max-w-sm">
          <p className="text-xs text-purple-300/70 truncate">
            "{userQuestion}"
          </p>
        </div>
      </div>

      {/* Spread Display */}
      <div className="mb-8 animate-fade-in-up">
        <SpreadDisplay cards={selectedCards} />
      </div>

      {/* CTA Button — appears after 3 cards are selected */}
      {showCta && (
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <button
            type="button"
            onClick={() => onCardsSelected(selectedCards)}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl text-base tracking-wide transition-all duration-300 hover:from-purple-500 hover:to-violet-500 hover:shadow-xl hover:shadow-purple-500/30 active:scale-[0.98] animate-pulse-glow"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Read my Fate
            </span>
          </button>
        </div>
      )}

      {/* Deck Grid */}
      <div className="flex-1 flex items-start justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <DeckGrid
          cards={shuffledDeck}
          selectedIds={selectedIds}
          onSelect={handleCardSelect}
          isSelectionComplete={isSelectionComplete}
        />
      </div>
    </div>
  );
}
