import React from 'react';
import { Delete, Check, RotateCcw } from 'lucide-react';

interface NumberPadProps {
  onPress: (val: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onClear?: () => void;
  disabled?: boolean;
  customKeys?: number[]; // If present, renders specific keys mode
}

export const NumberPad: React.FC<NumberPadProps> = ({ onPress, onDelete, onSubmit, onClear, disabled, customKeys }) => {
  const standardNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  if (customKeys) {
    return (
      <div className="flex flex-col gap-6 p-6 bg-white border-t border-slate-100 pb-10 animate-slide-in">
        <div className="flex justify-center gap-4">
          {customKeys.map((num) => (
            <button
              key={num}
              onClick={() => onPress(num.toString())}
              disabled={disabled}
              className="w-20 h-20 rounded-2xl bg-yellow-400 border-b-4 border-yellow-500 shadow-yellow-200 shadow-lg text-4xl font-black text-yellow-900 active:bg-yellow-500 active:border-t-4 active:border-b-0 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
            >
              {num}
            </button>
          ))}
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onClear || onDelete}
            disabled={disabled}
            className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 text-slate-400 flex items-center justify-center active:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 hover:text-slate-600 hover:border-slate-300"
          >
            <RotateCcw className="w-8 h-8" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 p-4 bg-white border-t border-slate-100 pb-8">
      {standardNums.map((num) => (
        <button
          key={num}
          onClick={() => onPress(num.toString())}
          disabled={disabled}
          className="h-14 rounded-xl bg-slate-50 border border-slate-200 shadow-sm text-2xl font-bold text-slate-700 active:bg-brand-50 active:border-brand-200 active:text-brand-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {num}
        </button>
      ))}
      
      <button
        onClick={onDelete}
        disabled={disabled}
        className="h-14 rounded-xl bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 active:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
      >
        <Delete className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => onPress('0')}
        disabled={disabled}
        className="h-14 rounded-xl bg-slate-50 border border-slate-200 shadow-sm text-2xl font-bold text-slate-700 active:bg-brand-50 active:border-brand-200 active:text-brand-600 transition-all active:scale-95 disabled:opacity-50"
      >
        0
      </button>

      <button
        onClick={onSubmit}
        disabled={disabled}
        className="h-14 rounded-xl bg-brand-600 shadow-brand-500/30 shadow-lg text-white font-bold text-lg active:bg-brand-700 transition-all active:scale-95 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none"
      >
        OK
      </button>
    </div>
  );
};