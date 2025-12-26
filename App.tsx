
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { TopicSelector } from './components/TopicSelector';
import { ModeSwipe } from './components/ModeSwipe';
import { ModeChoice } from './components/ModeChoice';
import { ModeInput } from './components/ModeInput';
import { AuthScreen } from './components/AuthScreen';
import { GameMode, User, TopicType, Problem } from './types';
import { generateBatch } from './utils/mathUtils';
import { PartyPopper } from 'lucide-react';

type AppState = 'TOPIC_SELECT' | 'PLAYING' | 'SESSION_COMPLETE';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>('TOPIC_SELECT');
  
  // Session State
  const [problemBatch, setProblemBatch] = useState<Problem[]>([]);
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [currentStage, setCurrentStage] = useState<GameMode>(GameMode.SWIPE);
  
  // Stats
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const handleLogin = (newUser: User) => setUser(newUser);

  const startSession = (topic: TopicType) => {
    // Generate 5 distinct problems for this session
    const batch = generateBatch(topic, 5);
    setProblemBatch(batch);
    setCurrentProblemIdx(0);
    setCurrentStage(GameMode.SWIPE);
    setAppState('PLAYING');
  };

  const handleProblemComplete = (correct: boolean) => {
    if (correct) {
      setScore(s => s + 10 + (streak * 2));
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    // Move to next problem or next stage
    if (currentProblemIdx < problemBatch.length - 1) {
      setCurrentProblemIdx(prev => prev + 1);
    } else {
      // End of batch, change stage?
      if (currentStage === GameMode.SWIPE) {
        // Shuffle batch for variety? Let's keep order for reinforcement or shuffle. Let's shuffle.
        const shuffled = [...problemBatch].sort(() => Math.random() - 0.5);
        setProblemBatch(shuffled);
        setCurrentProblemIdx(0);
        setCurrentStage(GameMode.CHOICE);
      } else if (currentStage === GameMode.CHOICE) {
         // Next stage: Yellow Input
         const shuffled = [...problemBatch].sort(() => Math.random() - 0.5);
         setProblemBatch(shuffled);
         setCurrentProblemIdx(0);
         setCurrentStage(GameMode.YELLOW_INPUT);
      } else {
        // Session Done!
        setAppState('SESSION_COMPLETE');
      }
    }
  };

  const handleBack = () => {
    setAppState('TOPIC_SELECT');
    setStreak(0);
  };

  if (!user) return <AuthScreen onLogin={handleLogin} />;

  const currentProblem = problemBatch[currentProblemIdx];

  const renderContent = () => {
    if (appState === 'TOPIC_SELECT') {
      return <TopicSelector onSelect={startSession} />;
    }

    if (appState === 'SESSION_COMPLETE') {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-slide-in">
          <div className="p-6 bg-yellow-100 rounded-full mb-6">
            <PartyPopper size={64} className="text-yellow-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Отличная работа!</h2>
          <p className="text-slate-500 mb-8">Ты прошел все задания на этот раунд.</p>
          <button 
            onClick={() => setAppState('TOPIC_SELECT')}
            className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-xl shadow-lg active:scale-95 transition-transform"
          >
            Выбрать новую тему
          </button>
        </div>
      );
    }

    switch (currentStage) {
      case GameMode.SWIPE:
        return <ModeSwipe onScore={handleProblemComplete} problem={currentProblem} />;
      case GameMode.CHOICE:
        return <ModeChoice onScore={handleProblemComplete} problem={currentProblem} />;
      case GameMode.YELLOW_INPUT:
        return <ModeInput mode={GameMode.YELLOW_INPUT} onScore={handleProblemComplete} problem={currentProblem} />;
      default: return null;
    }
  };

  let title = "MathMaster";
  if (appState === 'PLAYING') {
    if (currentStage === GameMode.SWIPE) title = "Запоминаем (Свайп)";
    if (currentStage === GameMode.CHOICE) title = "Проверяем (Тест)";
    if (currentStage === GameMode.YELLOW_INPUT) title = "Закрепляем";
  }

  return (
    <Layout 
      title={title} 
      score={score} 
      streak={streak} 
      mode={appState === 'TOPIC_SELECT' ? GameMode.MENU : currentStage}
      onBack={handleBack}
    >
      {renderContent()}
    </Layout>
  );
}
