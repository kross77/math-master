
import React, { useMemo } from 'react';
import { TopicType } from '../types';
import { Grid3X3, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { LearningManager } from '../utils/learningSystem';

interface TopicSelectorProps {
  onSelect: (topic: TopicType) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect }) => {
  const numbers = [2, 3, 4, 5, 6, 7, 8, 9];

  // Calculate stats for each number
  const statsMap = useMemo(() => {
    const map: Record<number, { progress: number; isPassed: boolean }> = {};
    numbers.forEach(n => {
      map[n] = LearningManager.getTopicStats(n);
    });
    return map;
  }, []);

  return (
    <div className="flex flex-col h-full p-6 animate-slide-in overflow-y-auto">
      <div className="mt-4 mb-8">
        <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
                <Sparkles size={20} />
            </div>
            <span className="text-xs font-bold text-brand-600 tracking-widest uppercase">MathMaster</span>
        </div>
        <h2 className="text-3xl font-black text-slate-800 leading-tight">
          Привет! <br />
          <span className="text-brand-500">Что учим сегодня?</span>
        </h2>
        <p className="text-slate-500 mt-2 font-medium">Выберите число или диапазон, чтобы начать тренировку.</p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        
        {/* Specific Numbers Grid */}
        <div className="bg-white rounded-3xl p-5 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Grid3X3 className="w-4 h-4" />
            <span>Одна цифра</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {numbers.map((num) => {
              const { progress, isPassed } = statsMap[num];
              const isMastered = progress >= 100;
              
              return (
                <button
                  key={num}
                  onClick={() => onSelect(num)}
                  className={`
                    relative aspect-[0.85] rounded-2xl border-2 transition-all shadow-sm flex flex-col items-center justify-between p-2 pb-3
                    ${isPassed ? 'bg-green-50/50 border-green-200' : 'bg-slate-50 border-slate-100'}
                    hover:scale-105 active:scale-95
                  `}
                >
                  {/* Status Indicator Top Right */}
                  <div className="w-full flex justify-end h-4">
                    {isPassed && (
                      <CheckCircle2 className={`w-4 h-4 ${isMastered ? 'text-yellow-500 fill-yellow-100' : 'text-green-500'}`} />
                    )}
                  </div>

                  {/* Number */}
                  <span className={`text-3xl font-black ${isPassed ? 'text-slate-800' : 'text-slate-700'}`}>
                    {num}
                  </span>

                  {/* Progress Bar & Percent */}
                  <div className="w-full space-y-1">
                    <div className="h-1.5 w-full bg-white/60 rounded-full overflow-hidden border border-black/5">
                       <div 
                         className={`h-full rounded-full ${isMastered ? 'bg-yellow-400' : (isPassed ? 'bg-green-500' : 'bg-brand-500')}`} 
                         style={{ width: `${progress}%` }} 
                       />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 text-center leading-none">
                      {progress}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ranges */}
        <div className="flex flex-col gap-3">
           <div className="text-slate-400 text-xs font-bold uppercase tracking-wider px-2">Диапазоны</div>
           
           <div className="grid grid-cols-2 gap-3">
             <button
                onClick={() => onSelect('2-5')}
                className="h-24 rounded-2xl bg-green-50 border-2 border-green-100 text-green-700 font-bold text-lg active:scale-95 transition-all shadow-sm flex flex-col items-center justify-center relative overflow-hidden group"
              >
                <div className="absolute top-[-20%] right-[-20%] w-20 h-20 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 group-hover:scale-150 transition-transform"></div>
                <span className="relative z-10 text-2xl mb-1">2 - 5</span>
                <span className="relative z-10 text-xs font-bold bg-white/60 px-2 py-0.5 rounded-full">Легко</span>
              </button>
              
              <button
                onClick={() => onSelect('6-9')}
                className="h-24 rounded-2xl bg-orange-50 border-2 border-orange-100 text-orange-700 font-bold text-lg active:scale-95 transition-all shadow-sm flex flex-col items-center justify-center relative overflow-hidden group"
              >
                <div className="absolute top-[-20%] right-[-20%] w-20 h-20 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 group-hover:scale-150 transition-transform"></div>
                <span className="relative z-10 text-2xl mb-1">6 - 9</span>
                <span className="relative z-10 text-xs font-bold bg-white/60 px-2 py-0.5 rounded-full">Сложно</span>
              </button>
           </div>

           <button
              onClick={() => onSelect('ALL')}
              className="h-20 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-200 font-bold text-xl active:scale-95 transition-all flex items-center justify-between px-8 mt-2"
           >
              <span>Вся таблица</span>
              <ArrowRight className="w-6 h-6 opacity-80" />
           </button>
        </div>
      </div>
    </div>
  );
};
