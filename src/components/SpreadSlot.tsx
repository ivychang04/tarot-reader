import type { DrawnCard } from '../types/tarot';

interface SpreadSlotProps {
  position: 'Past' | 'Present' | 'Future';
  card: DrawnCard | null;
  index: number;
}

const POSITION_LABELS: Record<string, { label: string; sublabel: string }> = {
  Past: { label: 'Past', sublabel: 'What was' },
  Present: { label: 'Present', sublabel: 'What is' },
  Future: { label: 'Future', sublabel: 'What will be' },
};

/**
 * A single slot in the 3-card spread.
 * Shows an empty dashed border when unfilled, and the card face when filled.
 */
export default function SpreadSlot({ position, card, index }: SpreadSlotProps) {
  const info = POSITION_LABELS[position];
  const delay = index * 150;

  if (!card) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-28 h-44 sm:w-32 sm:h-48 rounded-xl border-2 border-dashed border-purple-500/30 flex flex-col items-center justify-center gap-2 transition-all duration-300">
          <span className="text-purple-400/60 text-sm font-medium">
            {info.label}
          </span>
          <span className="text-purple-400/30 text-xs">
            {info.sublabel}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center gap-2 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Card Image */}
      <div className="relative w-28 h-44 sm:w-32 sm:h-48 rounded-xl overflow-hidden border-2 border-purple-500/40 shadow-lg shadow-purple-500/10">
        <img
          src={card.imageUrl}
          alt={`${card.name} - ${card.isReversed ? 'Reversed' : 'Upright'}`}
          className={`w-full h-full object-contain bg-gray-900 ${
            card.isReversed ? 'rotate-180' : ''
          }`}
        />

        {/* Orientation Badge */}
        <div
          className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
            card.isReversed
              ? 'bg-amber-500/90 text-amber-950'
              : 'bg-emerald-500/90 text-emerald-950'
          }`}
        >
          {card.isReversed ? 'REV' : 'UP'}
        </div>
      </div>

      {/* Card Name & Position */}
      <div className="text-center">
        <p className="text-xs text-purple-300 font-medium truncate max-w-28 sm:max-w-32">
          {card.name}
        </p>
        <p className="text-[10px] text-gray-500">{info.label}</p>
      </div>
    </div>
  );
}
