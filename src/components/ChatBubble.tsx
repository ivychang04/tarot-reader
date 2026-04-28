import { Sparkles } from 'lucide-react';
import type { ChatMessage } from '../types/tarot';

interface ChatBubbleProps {
  message: ChatMessage;
}

/**
 * Single chat message bubble.
 * Assistant messages: left-aligned with Lily avatar, purple accent.
 * User messages: right-aligned, subtle gray.
 */
export default function ChatBubble({ message }: ChatBubbleProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`flex gap-3 animate-fade-in ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Lily Avatar */}
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center mt-1">
          <Sparkles className="w-4 h-4 text-purple-200" />
        </div>
      )}

      {/* Message Content */}
      <div
        className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? 'bg-gray-800/60 text-gray-200 border border-purple-500/10 rounded-tl-sm'
            : 'bg-purple-600/20 text-purple-100 border border-purple-500/15 rounded-tr-sm'
        }`}
      >
        {/* Render content with line breaks preserved */}
        {message.content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < message.content.split('\n').length - 1 && <br />}
          </span>
        ))}

        {/* Empty content — streaming hasn't started yet */}
        {message.content.length === 0 && isAssistant && (
          <span className="text-gray-500 italic">Lily is preparing...</span>
        )}
      </div>
    </div>
  );
}
