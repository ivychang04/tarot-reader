import { useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import type { DrawnCard } from '../types/tarot';
import { useTarotAI } from '../hooks/useTarotAI';
import ReadingHeader from '../components/ReadingHeader';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import LoadingIndicator from '../components/LoadingIndicator';

interface ReadingScreenProps {
  question: string;
  cards: DrawnCard[];
  onNewReading: () => void;
}

/**
 * Full reading & chat interface:
 * - ReadingHeader with drawn cards at top
 * - Scrollable chat area with streamed messages
 * - Loading indicator during generation
 * - Sticky chat input at bottom
 * - "New Reading" button to reset
 */
export default function ReadingScreen({
  question,
  cards,
  onNewReading,
}: ReadingScreenProps) {
  const { messages, isGenerating, error, generateReading, sendMessage, destroySession } =
    useTarotAI();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  // Generate the initial reading when the screen mounts
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      generateReading(question, cards);
    }
  }, [question, cards, generateReading]);

  // Auto-scroll to bottom on new messages or content updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up session on unmount
  useEffect(() => {
    return () => {
      destroySession();
    };
  }, [destroySession]);

  function handleNewReading() {
    destroySession();
    onNewReading();
  }

  return (
    <div className="relative z-10 flex flex-col h-screen">
      {/* Header with cards */}
      <ReadingHeader cards={cards} question={question} />

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {/* Loading indicator — shown when generating and last message isn't being streamed */}
          {isGenerating && (messages.length === 0 || messages[messages.length - 1]?.content === '') && (
            <LoadingIndicator />
          )}

          {/* Error message */}
          {error && (
            <div className="flex justify-center animate-fade-in">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 max-w-md">
                <p className="text-sm text-red-300">
                  <span className="font-medium">✦ </span>
                  {error}
                </p>
                <p className="text-xs text-red-400/60 mt-1">
                  Make sure you're using Chrome Dev/Canary with the Prompt API flag enabled.
                </p>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Bottom bar: chat input + new reading button */}
      <div>
        <ChatInput onSend={sendMessage} disabled={isGenerating} />

        {/* New Reading button */}
        <div className="flex justify-center py-3 bg-gray-950/80">
          <button
            type="button"
            onClick={handleNewReading}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            New Reading
          </button>
        </div>
      </div>
    </div>
  );
}
