import React from 'react';
import { ArrowLeft, Trophy, Flame } from 'lucide-react';
import { GameMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  score: number;
  streak: number;
  mode: GameMode;
  onBack: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, score, streak, mode, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 relative max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          {mode !== GameMode.MENU && (
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
          )}
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        </div>
        
        {mode !== GameMode.MENU && (
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 text-orange-500 font-bold">
              <Flame className="w-5 h-5 fill-current" />
              <span>{streak}</span>
            </div>
            <div className="flex items-center gap-1 text-brand-600 font-bold">
              <Trophy className="w-5 h-5" />
              <span>{score}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};