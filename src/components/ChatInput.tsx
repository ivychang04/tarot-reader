import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

/**
 * Sticky bottom input bar for follow-up chat messages.
 * Disabled while AI is generating. Submits on Enter.
 */
export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');

  const isEmpty = input.trim().length === 0;

  function handleSubmit() {
    if (isEmpty || disabled) return;
    onSend(input.trim());
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="glass-card border-t border-purple-500/10 px-4 py-3">
      <div className="flex items-center gap-3 max-w-3xl mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? 'Lily is thinking...' : 'Ask Lily a follow-up question...'}
          className="flex-1 bg-gray-800/50 border border-purple-500/15 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isEmpty || disabled}
          aria-label="Send message"
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center transition-all duration-200 hover:bg-purple-500 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
