import { useState, useRef, useCallback } from 'react';
import type { ChatMessage, DrawnCard } from '../types/tarot';
import { LILY_SYSTEM_PROMPT, buildReadingPrompt } from '../utils/promptBuilder';
import { generateId } from '../utils/idGen';

/**
 * Custom hook managing the entire Gemini Nano AI lifecycle:
 * - Session creation with Lily persona
 * - Initial reading generation via streaming
 * - Follow-up chat via prompt()
 * - Cleanup on unmount or new reading
 */
export function useTarotAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<LanguageModel | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  /**
   * Creates a new LanguageModel session with the Lily system prompt.
   */
  const initSession = useCallback(async (): Promise<LanguageModel> => {
    // Clean up existing session
    if (sessionRef.current) {
      sessionRef.current.destroy();
      sessionRef.current = null;
    }

    const session = await LanguageModel.create({
      initialPrompts: [
        {
          role: 'system' as const,
          content: LILY_SYSTEM_PROMPT,
        },
      ],
      expectedInputs: [{ type: 'text', languages: ['en'] }],
      expectedOutputs: [{ type: 'text', languages: ['en'] }],
    });

    sessionRef.current = session;
    return session;
  }, []);

  /**
   * Generates the initial tarot reading using streaming.
   * Creates a session, builds the prompt, and streams Lily's response.
   */
  const generateReading = useCallback(
    async (question: string, cards: DrawnCard[]): Promise<void> => {
      setError(null);
      setIsGenerating(true);
      setMessages([]);

      try {
        // Check availability first
        if (typeof LanguageModel === 'undefined') {
          throw new Error(
            'Gemini Nano is not available in this browser. Please use Chrome Dev/Canary with the Prompt API flag enabled.'
          );
        }

        const session = await initSession();

        // Build the reading prompt
        const readingPrompt = buildReadingPrompt(question, cards);

        // Create abort controller for this generation
        abortRef.current = new AbortController();

        // Create a placeholder message for the streaming response
        const assistantMessageId = generateId();
        const assistantMessage: ChatMessage = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        };
        setMessages([assistantMessage]);

        // Stream the response
        const stream = session.promptStreaming(readingPrompt, {
          signal: abortRef.current.signal,
        });

        const reader = stream.getReader();
        let fullText = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            fullText += value;

            setMessages([
              {
                id: assistantMessageId,
                role: 'assistant',
                content: fullText,
                timestamp: assistantMessage.timestamp,
              },
            ]);
          }
        } finally {
          reader.releaseLock();
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // User cancelled — not an error
          return;
        }
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Error generating reading:', err);
      } finally {
        setIsGenerating(false);
        abortRef.current = null;
      }
    },
    [initSession]
  );

  /**
   * Sends a follow-up chat message in the existing session.
   * Uses prompt() (non-streaming) for simpler request/response.
   */
  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!sessionRef.current) {
        setError('No active session. Please start a new reading.');
        return;
      }

      setError(null);

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsGenerating(true);

      try {
        abortRef.current = new AbortController();

        // Create placeholder for assistant response
        const assistantMessageId = generateId();
        const placeholderMessage: ChatMessage = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, placeholderMessage]);

        // Stream the follow-up response too for a better UX
        const stream = sessionRef.current.promptStreaming(content, {
          signal: abortRef.current.signal,
        });

        const reader = stream.getReader();
        let fullText = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            fullText += value;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: fullText }
                  : msg
              )
            );
          }
        } finally {
          reader.releaseLock();
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const errorMessage =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        console.error('Error sending message:', err);
      } finally {
        setIsGenerating(false);
        abortRef.current = null;
      }
    },
    []
  );

  /**
   * Destroys the current session and resets all state.
   */
  const destroySession = useCallback((): void => {
    // Abort any in-progress generation
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    // Destroy the session
    if (sessionRef.current) {
      sessionRef.current.destroy();
      sessionRef.current = null;
    }

    setMessages([]);
    setIsGenerating(false);
    setError(null);
  }, []);

  return {
    messages,
    isGenerating,
    error,
    generateReading,
    sendMessage,
    destroySession,
  };
}
