import { useState } from 'react';
import type { AppScreen, DrawnCard } from './types/tarot';
import StarField from './components/StarField';
import WelcomeScreen from './screens/WelcomeScreen';
import SelectionScreen from './screens/SelectionScreen';

function App() {
  const [screen, setScreen] = useState<AppScreen>('WELCOME');
  const [userQuestion, setUserQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);

  function handleQuestionSubmit(question: string) {
    setUserQuestion(question);
    setScreen('SELECTION');
  }

  function handleCardsSelected(cards: DrawnCard[]) {
    setSelectedCards(cards);
    setScreen('READING');
  }

  function handleBackToWelcome() {
    setScreen('WELCOME');
  }

  function handleNewReading() {
    setUserQuestion('');
    setSelectedCards([]);
    setScreen('WELCOME');
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <StarField />

      {screen === 'WELCOME' && (
        <WelcomeScreen onSubmit={handleQuestionSubmit} />
      )}

      {screen === 'SELECTION' && (
        <SelectionScreen
          userQuestion={userQuestion}
          onCardsSelected={handleCardsSelected}
          onBack={handleBackToWelcome}
        />
      )}

      {screen === 'READING' && (
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <p className="text-gray-400">
            Reading screen — Phase 5
            {/* selectedCards: {selectedCards.length}, question: {userQuestion} */}
          </p>
          <button
            type="button"
            onClick={handleNewReading}
            className="ml-4 text-purple-400 underline"
          >
            New Reading
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
