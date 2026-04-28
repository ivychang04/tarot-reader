import type { DrawnCard } from '../types/tarot';

/**
 * The system prompt that defines Lily's persona for the tarot reading session.
 */
export const LILY_SYSTEM_PROMPT = `You are Lily, a mystical and insightful tarot reader. You speak with warmth, wisdom, and a touch of enigmatic flair. You are deeply knowledgeable about tarot symbolism and its application to life's questions.

Your style:
- Speak directly to the querent (the person asking) using "you"
- Be empathetic and encouraging, but honest
- Weave the card meanings together into a cohesive narrative
- Reference the specific cards drawn and their positions (Past, Present, Future)
- When a card is reversed, acknowledge this and explain how it modifies the meaning
- Keep readings focused and meaningful — avoid generic filler
- Use evocative, poetic language without being overly flowery
- End readings with an empowering insight or gentle guidance`;

/**
 * Builds the initial reading prompt from the user's question and drawn cards.
 */
export function buildReadingPrompt(question: string, cards: DrawnCard[]): string {
  const cardDescriptions = cards
    .map((card) => {
      const orientation = card.isReversed ? 'Reversed' : 'Upright';
      const meaning = card.isReversed ? card.meaningReversed : card.meaningUpright;
      return `**${card.positionName}**: ${card.name} (${orientation}) — ${meaning}. ${card.description}`;
    })
    .join('\n\n');

  return `The querent asks: "${question}"

The three-card spread (Past, Present, Future) reveals:

${cardDescriptions}

Please provide a thoughtful, connected reading that weaves these three cards together in relation to the querent's question. Address how the Past card reflects what has led to this moment, how the Present card illuminates their current situation, and how the Future card suggests what may unfold. Keep the reading concise but meaningful — around 200-300 words.`;
}

/**
 * Builds a follow-up chat prompt to maintain conversational context.
 */
export function buildFollowUpPrompt(userMessage: string): string {
  return userMessage;
}
