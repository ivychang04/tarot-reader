import { useState } from 'react';
import type { AppScreen, DrawnCard } from './types/tarot';
import StarField from './components/StarField';
import WelcomeScreen from './screens/WelcomeScreen';
import SelectionScreen from './screens/SelectionScreen';
import ReadingScreen from './screens/ReadingScreen';

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
        <ReadingScreen
          question={userQuestion}
          cards={selectedCards}
          onNewReading={handleNewReading}
        />
      )}
    </div>
  );
}

export default App;
