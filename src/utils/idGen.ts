let counter = 0;

/**
 * Generates a simple unique ID for chat messages.
 * Combines timestamp + incrementing counter to guarantee uniqueness.
 */
export function generateId(): string {
  counter += 1;
  return `msg-${Date.now()}-${counter}`;
}
