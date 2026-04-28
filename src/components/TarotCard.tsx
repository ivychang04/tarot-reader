import { useState } from 'react';
import type { TarotCard as TarotCardType } from '../types/tarot';

interface TarotCardProps {
  card: TarotCardType;
  onSelect: (card: TarotCardType) => void;
  isSelected: boolean;
  isDisabled: boolean;
}

const CARD_BACK_URL = '/cards/card-back.jpg';

/**
 * Individual clickable card in the deck grid.
 * Shows card-back when face-down, with a flip animation on selection.
 */
export default function TarotCard({
  card,
  onSelect,
  isSelected,
  isDisabled,
}: TarotCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);

  function handleClick() {
    if (isSelected || isDisabled || isFlipping) return;

    setIsFlipping(true);

    // Brief delay for flip animation before triggering select
    setTimeout(() => {
      onSelect(card);
    }, 300);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSelected || isDisabled}
      aria-label={`Select tarot card ${isSelected ? '(already selected)' : ''}`}
      className={`
        card-flip-container w-16 h-24 sm:w-20 sm:h-28 md:w-[72px] md:h-[104px]
        rounded-lg overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-purple-500/50
        ${isSelected
          ? 'opacity-20 scale-90 cursor-not-allowed'
          : isDisabled
            ? 'cursor-not-allowed opacity-60'
            : 'hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 active:scale-100'
        }
      `}
    >
      <div
        className={`card-flip-inner w-full h-full ${isFlipping ? 'flipped' : ''}`}
      >
        {/* Front: Card Back */}
        <div className="card-flip-front w-full h-full">
          <img
            src={CARD_BACK_URL}
            alt="Tarot card face-down"
            className="w-full h-full object-cover rounded-lg"
            draggable={false}
          />
        </div>

        {/* Back: Card Face (shown after flip) */}
        <div className="card-flip-back w-full h-full">
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-full object-cover rounded-lg"
            draggable={false}
          />
        </div>
      </div>
    </button>
  );
}
