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
    console.log(availability);
    return {
      available: availability !== 'unavailable',
      status: availability,
    };
  } catch (error) {
    console.error('Error checking AI availability:', error);
    return { available: false, status: 'unavailable' };
  }
}

/**
 * Triggers the LanguageModel download (if needed) and reports progress.
 * Call this when status is 'downloadable' or 'downloading' to start/monitor the download.
 * The onProgress callback receives a value from 0 to 100.
 * When the download finishes, it destroys the temporary session — the real
 * session will be created later by useTarotAI.
 */
export async function downloadModel(
  onProgress: (percent: number) => void,
  onComplete: () => void,
  onError: (error: string) => void,
): Promise<void> {
  try {
    const session = await LanguageModel.create({
      monitor: (monitor: CreateMonitor) => {
        monitor.addEventListener('downloadprogress', (e: ProgressEvent) => {
          if (e.total > 0) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        });
      },
    });

    // Download complete — destroy the temporary session
    session.destroy();
    onComplete();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to download AI model';
    console.error('Error downloading model:', error);
    onError(message);
  }
}
