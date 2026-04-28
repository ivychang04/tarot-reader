import { useState } from 'react';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
}

const MAX_CHARS = 300;

/**
 * Controlled textarea for the user's tarot question.
 * Includes a live character counter and glassmorphism styling.
 */
export default function QuestionInput({ onSubmit, disabled = false }: QuestionInputProps) {
  const [question, setQuestion] = useState('');

  const charCount = question.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = question.trim().length === 0;

  function handleSubmit() {
    if (isEmpty || isOverLimit || disabled) return;
    onSubmit(question.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in-up">
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <label
          htmlFor="tarot-question"
          className="block text-sm font-medium text-purple-300/80 tracking-wide"
        >
          What weighs on your mind?
        </label>

        <textarea
          id="tarot-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask the cards your question..."
          rows={3}
          className="w-full bg-gray-900/50 border border-purple-500/20 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 text-base leading-relaxed resize-none transition-all duration-300 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-mono transition-colors ${
              isOverLimit ? 'text-red-400' : 'text-gray-500'
            }`}
          >
            {charCount}/{MAX_CHARS}
          </span>

          <button
            id="draw-cards-btn"
            type="button"
            onClick={handleSubmit}
            disabled={isEmpty || isOverLimit || disabled}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium rounded-xl text-sm tracking-wide transition-all duration-300 hover:from-purple-500 hover:to-violet-500 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            Draw Cards ✦
          </button>
        </div>
      </div>
    </div>
  );
}
