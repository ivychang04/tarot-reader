import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { DrawnCard } from '../types/tarot';

interface ReadingHeaderProps {
  cards: DrawnCard[];
  question: string;
}

/**
 * Compact header showing the 3 drawn cards and the user's question.
 * Collapsible on mobile for more chat space.
 */
export default function ReadingHeader({ cards, question }: ReadingHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="glass-card border-b border-purple-500/10">
      {/* Toggle bar */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-400 hover:text-purple-300 transition-colors"
      >
        <span className="truncate max-w-[80%] text-left">
          <span className="text-purple-400/70 font-medium">Your reading: </span>
          "{question}"
        </span>
        {isCollapsed ? (
          <ChevronDown className="w-4 h-4 flex-shrink-0" />
        ) : (
          <ChevronUp className="w-4 h-4 flex-shrink-0" />
        )}
      </button>

      {/* Card strip — collapsible */}
      {!isCollapsed && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {cards.map((card) => (
              <div key={card.id} className="flex flex-col items-center gap-1.5">
                {/* Card thumbnail */}
                <div className="relative w-14 h-20 sm:w-16 sm:h-24 rounded-lg overflow-hidden border border-purple-500/25 shadow-md">
                  <img
                    src={card.imageUrl}
                    alt={`${card.name} - ${card.isReversed ? 'Reversed' : 'Upright'}`}
                    className={`w-full h-full object-contain bg-gray-900 ${
                      card.isReversed ? 'rotate-180' : ''
                    }`}
                  />
                  {/* Tiny orientation badge */}
                  <div
                    className={`absolute top-0.5 right-0.5 px-1 py-px rounded text-[8px] font-bold ${
                      card.isReversed
                        ? 'bg-amber-500/90 text-amber-950'
                        : 'bg-emerald-500/90 text-emerald-950'
                    }`}
                  >
                    {card.isReversed ? 'R' : 'U'}
                  </div>
                </div>

                {/* Card info */}
                <div className="text-center">
                  <p className="text-[10px] text-purple-300/80 font-medium truncate max-w-14 sm:max-w-16">
                    {card.name}
                  </p>
                  <p className="text-[9px] text-gray-500">{card.positionName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
