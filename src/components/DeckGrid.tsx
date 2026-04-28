import type { TarotCard as TarotCardType } from '../types/tarot';
import TarotCard from './TarotCard';

interface DeckGridProps {
  cards: TarotCardType[];
  selectedIds: Set<number>;
  onSelect: (card: TarotCardType) => void;
  isSelectionComplete: boolean;
}

/**
 * Responsive grid displaying all 78 face-down tarot cards.
 * Scrollable container with mystical styling.
 */
export default function DeckGrid({
  cards,
  selectedIds,
  onSelect,
  isSelectionComplete,
}: DeckGridProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <p className="text-center text-sm text-purple-300/60 mb-4 font-medium tracking-wide">
          {isSelectionComplete
            ? '✦ Your cards have been chosen ✦'
            : `Choose ${3 - selectedIds.size} more card${3 - selectedIds.size !== 1 ? 's' : ''}...`}
        </p>

        <div className="max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-13 gap-1.5 sm:gap-2 justify-items-center">
            {cards.map((card) => (
              <TarotCard
                key={card.id}
                card={card}
                onSelect={onSelect}
                isSelected={selectedIds.has(card.id)}
                isDisabled={isSelectionComplete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
