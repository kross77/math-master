
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Problem, GameMode, FeedbackState } from '../types';
import { LearningManager } from '../utils/learningSystem';
import { NumberPad } from './NumberPad';
import { Sparkles, Star } from 'lucide-react';

interface ModeInputProps {
  mode: GameMode;
  onScore: (correct: boolean) => void;
  problem: Problem;
}

export const ModeInput: React.FC<ModeInputProps> = ({ mode, onScore, problem }) => {
  const [input, setInput] = useState<string>('');
  const [feedback, setFeedback] = useState<FeedbackState>('idle');

  // Reset when problem changes
  useEffect(() => {
    setInput('');
    setFeedback('idle');
  }, [problem]);

  const isYellowMode = mode === GameMode.YELLOW_INPUT;

  const customKeys = useMemo(() => {
    if (!isYellowMode) return undefined;
    const answerDigits = new Set(problem.answer.toString().split('').map(Number));
    const keys = Array.from(answerDigits);
    while (keys.length < 3) {
      const r = Math.floor(Math.random() * 10);
      if (!keys.includes(r)) keys.push(r);
    }
    return keys.sort(() => Math.random() - 0.5);
  }, [problem, isYellowMode]);

  const answerStr = problem.answer.toString();
  const maxLen = isYellowMode ? answerStr.length : 4;

  const handleSubmit = useCallback(() => {
    if (feedback !== 'idle' || input.length === 0) return;

    const val = parseInt(input, 10);
    const isCorrect = val === problem.answer;
    
    LearningManager.recordResult(problem.num1, problem.num2, isCorrect);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setTimeout(() => onScore(true), 1000);
    } else {
      if (isYellowMode) {
        setTimeout(() => { onScore(false); }, 3000); // Wait for visualization
      } else {
        setTimeout(() => { onScore(false); }, 3000);
      }
    }
  }, [feedback, input, problem.answer, problem.num1, problem.num2, onScore, isYellowMode]);

  useEffect(() => {
    if (isYellowMode && input.length === maxLen) {
      handleSubmit();
    }
  }, [input, isYellowMode, maxLen, handleSubmit]);

  const handlePress = (val: string) => { if (feedback !== 'idle') return; if (input.length < maxLen) setInput((prev) => prev + val); };
  const handleDelete = () => { if (feedback !== 'idle') return; setInput((prev) => prev.slice(0, -1)); };
  const handleClear = () => { if (feedback !== 'idle') return; setInput(''); };

  const renderVisualization = () => (
    <div className="flex flex-col gap-1 items-center animate-slide-in mt-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
      <div className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">{problem.num1} {problem.num1 === 1 ? 'ряд' : (problem.num1 < 5 ? 'ряда' : 'рядов')} по {problem.num2}</div>
      {Array.from({ length: problem.num1 }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {Array.from({ length: problem.num2 }).map((_, colIndex) => (
            <div key={colIndex} className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${feedback === 'incorrect' ? 'bg-red-400 scale-110' : 'bg-slate-200'}`} style={{ animationDelay: `${(rowIndex * problem.num2 + colIndex) * 0.05}s` }} />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {isYellowMode && feedback === 'idle' && (
           <div className="mb-6 flex items-center gap-2 text-yellow-700 bg-yellow-100 px-4 py-2 rounded-2xl text-sm font-bold animate-slide-in"><Sparkles className="w-4 h-4 fill-current" /><span>Собери число</span></div>
        )}

        <div className={`flex items-center gap-3 text-5xl md:text-6xl font-black text-slate-800 ${feedback === 'incorrect' ? 'animate-shake' : ''}`}>
          <span>{problem.num1}</span><span className="text-brand-500">&times;</span><span>{problem.num2}</span><span className="text-slate-300">=</span>
          <div className={`min-w-[2.5ch] h-[1.3em] flex items-center justify-center rounded-2xl border-4 transition-all duration-300 px-2 shadow-inner ${isYellowMode ? 'bg-yellow-50 border-yellow-400 text-yellow-900' : 'bg-slate-100 border-slate-200 text-slate-800'} ${feedback === 'correct' ? '!bg-green-100 !border-green-500 !text-green-700 scale-110' : ''} ${feedback === 'incorrect' ? '!bg-red-50 !border-red-300 !text-red-500' : ''}`}>
            {input || <span className="opacity-20 text-4xl">?</span>}
          </div>
        </div>

        {feedback === 'correct' && (
          <div className="mt-8 flex flex-col items-center animate-pop">
            <div className="flex gap-2 mb-2"><Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce" style={{ animationDelay: '0s' }} /><Star className="w-10 h-10 text-yellow-400 fill-yellow-400 animate-bounce" style={{ animationDelay: '0.1s' }} /><Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce" style={{ animationDelay: '0.2s' }} /></div>
            <div className="text-green-600 font-bold text-3xl">Молодец!</div>
          </div>
        )}

        {feedback === 'incorrect' && (
           <div className="mt-4 flex flex-col items-center">
             <div className="text-red-500 font-bold text-xl mb-2">{isYellowMode ? 'Посчитай точки:' : `Это ${problem.answer}`}</div>
             {renderVisualization()}
           </div>
        )}
      </div>
      <NumberPad onPress={handlePress} onDelete={handleDelete} onSubmit={handleSubmit} onClear={handleClear} disabled={feedback !== 'idle'} customKeys={customKeys} />
    </div>
  );
};
