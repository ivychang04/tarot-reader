import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const MYSTICAL_PHRASES = [
  'The stars are aligning...',
  'Lily is reading the cards...',
  'The veil between worlds thins...',
  'Drawing insight from the cosmos...',
  'The cards whisper their secrets...',
  'Channeling ancient wisdom...',
];

/**
 * Mystical loading indicator with rotating thematic phrases
 * and animated sparkle dots.
 */
export default function LoadingIndicator() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % MYSTICAL_PHRASES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 animate-fade-in">
      {/* Lily avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center animate-pulse">
        <Sparkles className="w-4 h-4 text-purple-200" />
      </div>

      {/* Loading bubble */}
      <div className="bg-gray-800/60 border border-purple-500/10 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Animated dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-purple-400"
                style={{
                  animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>

          <span className="text-sm text-purple-300/70 italic ml-1 transition-all duration-500">
            {MYSTICAL_PHRASES[phraseIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}
