
import React, { useState, useEffect } from 'react';
import { Problem, FeedbackState } from '../types';
import { enrichForChoice } from '../utils/mathUtils';
import { LearningManager } from '../utils/learningSystem';
import { Star } from 'lucide-react';

interface ModeChoiceProps {
  onScore: (correct: boolean) => void;
  problem: Problem;
}

export const ModeChoice: React.FC<ModeChoiceProps> = ({ onScore, problem: rawProblem }) => {
  const [problem, setProblem] = useState<Problem>(() => enrichForChoice(rawProblem));
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    setFeedback('idle');
    setSelectedOption(null);
    setProblem(enrichForChoice(rawProblem));
  }, [rawProblem]);

  const handleSelect = (option: number) => {
    if (feedback !== 'idle') return;

    const isCorrect = option === problem.answer;
    LearningManager.recordResult(problem.num1, problem.num2, isCorrect);
    setSelectedOption(option);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      onScore(isCorrect);
    }, isCorrect ? 800 : 2500); // Wait longer on error to show visualization
  };

  const renderDots = () => (
    <div className="flex flex-col gap-1 items-center mt-2">
      {Array.from({ length: problem.num1 }).map((_, r) => (
        <div key={r} className="flex gap-2">
          {Array.from({ length: problem.num2 }).map((_, c) => (
            <div key={c} className="w-2 h-2 rounded-full bg-red-400" />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full p-6 relative">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 w-full max-w-sm text-center mb-8 animate-slide-in relative overflow-hidden">
          
          {feedback === 'correct' && (
             <div className="absolute inset-0 bg-green-50 flex flex-col items-center justify-center animate-pop z-10">
                <div className="flex gap-2 mb-2"><Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-bounce" /><Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce" style={{animationDelay: '0.1s'}}/><Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-bounce" style={{animationDelay: '0.2s'}}/></div>
                <div className="text-2xl font-bold text-green-600">Верно!</div>
             </div>
          )}

          {feedback === 'incorrect' && (
            <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center animate-slide-in z-10 p-4">
               <div className="text-slate-800 font-bold text-2xl mb-1">{problem.num1} &times; {problem.num2} = {problem.answer}</div>
               {renderDots()}
               <div className="text-xs text-red-500 font-medium mt-2">Посчитай кружочки</div>
            </div>
          )}

          <div className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wide">Решите пример</div>
          <div className="text-6xl font-black text-slate-800 flex items-center justify-center gap-4">
            <span>{problem.num1}</span><span className="text-brand-500">&times;</span><span>{problem.num2}</span><span className="text-slate-300">=</span><span className="text-slate-800">?</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {problem.options?.map((option, idx) => {
            let buttonStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
            if (feedback !== 'idle') {
              if (option === problem.answer) buttonStyle = "bg-green-500 border-green-600 text-white shadow-green-200 scale-105";
              else if (option === selectedOption && option !== problem.answer) buttonStyle = "bg-red-500 border-red-600 text-white shadow-red-200 opacity-50";
              else buttonStyle = "bg-slate-50 border-slate-100 text-slate-300 opacity-20 scale-95";
            }
            return (
              <button key={idx} onClick={() => handleSelect(option)} disabled={feedback !== 'idle'} className={`h-24 rounded-2xl shadow-sm border-b-4 text-3xl font-bold transition-all duration-300 active:scale-95 flex items-center justify-center ${buttonStyle}`}>{option}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
