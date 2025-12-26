
import React, { useState, useRef, useEffect } from 'react';
import { Check, X, ThumbsUp, Star, Hand } from 'lucide-react';
import { Problem, FeedbackState } from '../types';
import { enrichForSwipe } from '../utils/mathUtils';
import { LearningManager } from '../utils/learningSystem';

interface ModeSwipeProps {
  onScore: (correct: boolean) => void;
  problem: Problem; // Now strictly controlled
}

export const ModeSwipe: React.FC<ModeSwipeProps> = ({ onScore, problem: rawProblem }) => {
  // We need to generate the "Display Answer" (isCorrect true/false) based on the raw problem
  const [problem, setProblem] = useState<Problem>(() => enrichForSwipe(rawProblem));
  
  // Re-enrich when the raw problem changes (next question)
  useEffect(() => {
    setFeedback('idle');
    setDragX(0);
    setProblem(enrichForSwipe(rawProblem));
  }, [rawProblem]);

  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 100;

  const handleChoice = (userSaysTrue: boolean) => {
    if (feedback !== 'idle') return;

    const isWin = (problem.isCorrect && userSaysTrue) || (!problem.isCorrect && !userSaysTrue);
    LearningManager.recordResult(problem.num1, problem.num2, isWin);

    if (isWin) {
      setFeedback('correct');
      setDragX(userSaysTrue ? 1000 : -1000); 
      // Notify parent to switch problem after animation
      setTimeout(() => onScore(true), 800);
    } else {
      setFeedback('incorrect');
      setDragX(0); 
    }
  };

  const handleNextAfterError = () => {
    onScore(false);
  };

  // --- Touch & Mouse Logic ---
  const handleStart = (clientX: number) => { if (feedback === 'idle') { setIsDragging(true); startX.current = clientX; }};
  const handleMove = (clientX: number) => { if (isDragging && feedback === 'idle' && startX.current !== null) setDragX(clientX - startX.current); };
  const handleEnd = () => {
    if (!isDragging || feedback !== 'idle') return;
    setIsDragging(false); startX.current = null;
    if (dragX > SWIPE_THRESHOLD) handleChoice(true);
    else if (dragX < -SWIPE_THRESHOLD) handleChoice(false);
    else setDragX(0);
  };

  const rotateDeg = dragX * 0.05;
  const cardStyle = {
    transform: `translateX(${dragX}px) rotate(${rotateDeg}deg)`,
    transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const yesOpacity = Math.min(Math.max(dragX / (SWIPE_THRESHOLD * 0.8), 0), 1);
  const noOpacity = Math.min(Math.max(-dragX / (SWIPE_THRESHOLD * 0.8), 0), 1);

  const renderDots = () => (
    <div className="flex flex-col gap-1 items-center mt-4 bg-white/50 p-3 rounded-xl animate-pop">
      {Array.from({ length: problem.num1 }).map((_, r) => (
        <div key={r} className="flex gap-2">
          {Array.from({ length: problem.num2 }).map((_, c) => (
            <div key={c} className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500 shadow-sm" />
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full justify-between p-6 overflow-hidden relative bg-slate-50">
      {/* Background Labels */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none select-none z-0">
         <div className={`flex flex-col items-center transition-all duration-300 ${dragX < -50 ? 'opacity-100 scale-110' : 'opacity-20'}`}><div className="text-red-500 font-black text-4xl md:text-6xl tracking-tighter">НЕТ</div><X className="w-8 h-8 text-red-500 mt-2" /></div>
         <div className={`flex flex-col items-center transition-all duration-300 ${dragX > 50 ? 'opacity-100 scale-110' : 'opacity-20'}`}><div className="text-green-500 font-black text-4xl md:text-6xl tracking-tighter">ДА</div><Check className="w-8 h-8 text-green-500 mt-2" /></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full perspective-1000">
        {/* Shadow Cards */}
        {feedback !== 'correct' && (
          <><div className="absolute w-64 h-80 bg-white rounded-3xl border border-slate-200 shadow-lg transform rotate-6 -z-20 scale-90 opacity-60"></div>
            <div className="absolute w-64 h-80 bg-white rounded-3xl border border-slate-200 shadow-lg transform -rotate-3 -z-10 scale-95 opacity-80"></div></>
        )}

        <div className={`relative w-72 h-96 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center justify-center p-6 z-10 touch-none select-none ${feedback === 'incorrect' ? 'animate-shake' : ''}`} style={cardStyle}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)} onTouchMove={(e) => handleMove(e.touches[0].clientX)} onTouchEnd={handleEnd}
          onMouseDown={(e) => handleStart(e.clientX)} onMouseMove={(e) => handleMove(e.clientX)} onMouseUp={handleEnd} onMouseLeave={() => {if(isDragging) handleEnd()}}>
          
          {feedback === 'idle' && (
            <>
              <div className="absolute top-8 right-8 border-4 border-green-500 text-green-500 font-black text-3xl px-2 py-1 rounded-lg transform -rotate-12 opacity-0 transition-opacity z-20 pointer-events-none" style={{ opacity: yesOpacity }}>ВЕРНО</div>
              <div className="absolute top-8 left-8 border-4 border-red-500 text-red-500 font-black text-3xl px-2 py-1 rounded-lg transform rotate-12 opacity-0 transition-opacity z-20 pointer-events-none" style={{ opacity: noOpacity }}>НЕВЕРНО</div>
              <div className="flex flex-col items-center justify-center h-full w-full pointer-events-none">
                <div className="text-slate-400 text-sm font-bold mb-8 tracking-widest uppercase">Верно или нет?</div>
                <div className="text-7xl font-black text-slate-800 mb-6">{problem.num1} <span className="text-brand-500">&times;</span> {problem.num2}</div>
                <div className="w-full h-1 bg-slate-100 rounded-full mb-6"></div>
                <div className="text-7xl font-black text-brand-600">{problem.displayAnswer}</div>
                <div className="absolute bottom-6 text-slate-300 text-sm animate-pulse flex items-center gap-2"><Hand className="w-4 h-4" /><span>Свайпай карту</span></div>
             </div>
            </>
          )}

          {feedback === 'correct' && (
            <div className="flex flex-col items-center justify-center h-full w-full bg-green-50 rounded-2xl border-4 border-green-400">
               <div className="absolute -top-10 flex w-full justify-center gap-6"><Star className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-bounce" /><Star className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-bounce" style={{ animationDelay: '0.1s' }} /></div>
               <ThumbsUp className="w-32 h-32 text-green-600 fill-green-100" />
               <div className="mt-6 text-green-700 font-black text-3xl">СУПЕР!</div>
            </div>
          )}

          {feedback === 'incorrect' && (
            <div className="flex flex-col items-center justify-center h-full w-full bg-red-50 rounded-2xl border-4 border-red-400 p-2 text-center">
               <div className="text-red-400 text-xs uppercase font-bold mb-1">Ой! На самом деле:</div>
               <div className="text-3xl font-black text-slate-800">{problem.num1} <span className="text-red-500">&times;</span> {problem.num2} = {problem.answer}</div>
               {renderDots()}
               <button onClick={(e) => { e.stopPropagation(); handleNextAfterError(); }} className="mt-auto w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform">Понятно</button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-6 mb-4 z-20">
        <button onClick={() => { if (feedback === 'idle') handleChoice(false); }} disabled={feedback !== 'idle'} className="w-16 h-16 rounded-full bg-white shadow-lg shadow-red-100 border-2 border-red-100 flex items-center justify-center text-red-500 active:scale-90 transition-transform active:bg-red-50 disabled:opacity-50"><X className="w-8 h-8" strokeWidth={3} /></button>
        <button onClick={() => { if (feedback === 'idle') handleChoice(true); }} disabled={feedback !== 'idle'} className="w-16 h-16 rounded-full bg-white shadow-lg shadow-green-100 border-2 border-green-100 flex items-center justify-center text-green-500 active:scale-90 transition-transform active:bg-green-50 disabled:opacity-50"><Check className="w-8 h-8" strokeWidth={3} /></button>
      </div>
    </div>
  );
};
