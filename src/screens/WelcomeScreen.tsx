import { useEffect, useState, useCallback } from 'react';
import { Sparkles, Download } from 'lucide-react';
import QuestionInput from '../components/QuestionInput';
import { checkAIAvailability, downloadModel } from '../utils/aiCheck';

interface WelcomeScreenProps {
  onSubmit: (question: string) => void;
}

/**
 * Landing screen: title, Lily introduction, question input, and AI status badge
 * with optional download trigger and progress tracking.
 */
export default function WelcomeScreen({ onSubmit }: WelcomeScreenProps) {
  const [aiStatus, setAiStatus] = useState<string>('checking');
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  useEffect(() => {
    checkAIAvailability().then((result) => {
      setAiStatus(result.status);
    });
  }, []);

  const startDownload = useCallback(() => {
    setAiStatus('preparing');
    setDownloadProgress(0);

    downloadModel(
      (percent) => {
        setDownloadProgress(percent);
      },
      () => {
        setAiStatus('available');
        setDownloadProgress(100);
      },
      (errorMsg) => {
        console.error('Download failed:', errorMsg);
        setAiStatus('unavailable');
      },
    );
  }, []);

  // Determine badge display
  function getBadge(): { text: string; color: string; dotClass: string } {
    switch (aiStatus) {
      case 'checking':
        return {
          text: 'Checking AI...',
          color: 'text-gray-500',
          dotClass: 'bg-gray-400 animate-pulse',
        };
      case 'available':
        return {
          text: 'AI Ready',
          color: 'text-emerald-400',
          dotClass: 'bg-emerald-400 animate-pulse',
        };
      case 'downloadable':
        return {
          text: 'AI Available — Download Required',
          color: 'text-blue-400',
          dotClass: 'bg-blue-400 animate-pulse',
        };
      case 'downloading':
      case 'preparing':
        return {
          text: `AI Preparing... ${downloadProgress}%`,
          color: 'text-amber-400',
          dotClass: 'bg-amber-400 animate-pulse',
        };
      case 'unavailable':
      default:
        return {
          text: 'AI Unavailable',
          color: 'text-red-400/70',
          dotClass: 'bg-red-400',
        };
    }
  }

  const badge = getBadge();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
      {/* AI Status Badge */}
      <div className="absolute top-6 right-6 animate-fade-in">
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2 glass-card rounded-full px-3 py-1.5">
            <span className={`w-2 h-2 rounded-full ${badge.dotClass}`} />
            <span className={`text-xs font-medium ${badge.color}`}>
              {badge.text}
            </span>

            {/* Download button — only shown when downloadable */}
            {aiStatus === 'downloadable' && (
              <button
                type="button"
                onClick={startDownload}
                aria-label="Download AI model"
                className="ml-1 p-1 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Download progress bar — shown during preparing/downloading state */}
          {(aiStatus === 'preparing' || aiStatus === 'downloading') && (
            <div className="w-full px-1 animate-fade-in">
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-8 max-w-2xl w-full">
        {/* Logo / Icon */}
        <div className="animate-float">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-violet-800/30 border border-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-purple-400" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight animate-shimmer">
            TarotTale
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl font-light leading-relaxed max-w-md mx-auto">
            Ask your question. Draw your cards.
            <br />
            <span className="text-purple-400/80">
              Let Lily read your fate.
            </span>
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center gap-4 w-48">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-500/30" />
          <span className="text-purple-500/50 text-xs">✦</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-500/30" />
        </div>

        {/* Question Input */}
        <QuestionInput onSubmit={onSubmit} />

        {/* Helpful Hint */}
        <p className="text-gray-600 text-xs text-center animate-fade-in max-w-sm">
          Tip: Ask an open-ended question about something meaningful to you.
          The cards respond best to genuine curiosity.
        </p>
      </div>
    </div>
  );
}
