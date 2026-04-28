/**
 * Checks if the Chrome LanguageModel (Gemini Nano) API is available.
 * Returns both a boolean and the detailed status string.
 */
export async function checkAIAvailability(): Promise<{
  available: boolean;
  status: string;
}> {
  if (typeof LanguageModel === 'undefined') {
    return { available: false, status: 'unavailable' };
  }

  try {
    const availability = await LanguageModel.availability();
    return {
      available: availability !== 'unavailable',
      status: availability,
    };
  } catch (error) {
    console.error('Error checking AI availability:', error);
    return { available: false, status: 'unavailable' };
  }
}
