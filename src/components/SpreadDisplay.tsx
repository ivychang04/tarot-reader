import type { DrawnCard } from '../types/tarot';
import SpreadSlot from './SpreadSlot';

interface SpreadDisplayProps {
  cards: DrawnCard[];
}

const POSITIONS: ReadonlyArray<'Past' | 'Present' | 'Future'> = [
  'Past',
  'Present',
  'Future',
];

/**
 * Horizontal row of 3 spread slots showing the Past/Present/Future positions.
 */
export default function SpreadDisplay({ cards }: SpreadDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      {POSITIONS.map((position, index) => (
        <SpreadSlot
          key={position}
          position={position}
          card={cards.find((c) => c.positionName === position) ?? null}
          index={index}
        />
      ))}
    </div>
  );
}
