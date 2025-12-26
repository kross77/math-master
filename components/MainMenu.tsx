import React from 'react';
import { GameMode } from '../types';
import { Layers, ListChecks, Keyboard, Highlighter } from 'lucide-react';

interface MainMenuProps {
  onSelect: (mode: GameMode) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelect }) => {
  const modes = [
    {
      id: GameMode.SWIPE,
      title: 'Свайп',
      desc: 'Верно или нет?',
      icon: Layers,
      color: 'bg-blue-500',
      shadow: 'shadow-blue-200'
    },
    {
      id: GameMode.CHOICE,
      title: 'Тест',
      desc: '4 варианта ответа',
      icon: ListChecks,
      color: 'bg-violet-500',
      shadow: 'shadow-violet-200'
    },
    {
      id: GameMode.YELLOW_INPUT,
      title: 'Желтый ввод',
      desc: 'Ввод 3х символов',
      icon: Highlighter,
      color: 'bg-amber-400',
      shadow: 'shadow-amber-200'
    },
    {
      id: GameMode.DIRECT_INPUT,
      title: 'Клавиатура',
      desc: 'Прямой ввод ответа',
      icon: Keyboard,
      color: 'bg-emerald-500',
      shadow: 'shadow-emerald-200'
    }
  ];

  return (
    <div className="p-6 flex flex-col h-full overflow-y-auto">
      <div className="mt-4 mb-8">
        <h2 className="text-3xl font-black text-slate-800 leading-tight">
          Привет! <br />
          <span className="text-brand-500">Учим таблицу</span>
        </h2>
        <p className="text-slate-500 mt-2">Выберите режим тренировки:</p>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-8">
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              className="relative group overflow-hidden rounded-3xl p-6 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 text-left transition-transform active:scale-95"
            >
              <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Icon size={100} className="text-slate-900" />
              </div>
              
              <div className="flex items-start gap-4 relative z-10">
                <div className={`p-4 rounded-2xl ${m.color} text-white shadow-lg ${m.shadow}`}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{m.title}</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">{m.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};