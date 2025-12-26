
export enum GameMode {
  MENU = 'MENU',
  SWIPE = 'SWIPE',
  CHOICE = 'CHOICE',
  YELLOW_INPUT = 'YELLOW_INPUT',
  DIRECT_INPUT = 'DIRECT_INPUT',
}

export type TopicType = 'ALL' | '2-5' | '6-9' | number;

export interface Problem {
  num1: number;
  num2: number;
  answer: number;
  displayAnswer?: number; // Used for Swipe mode (could be wrong)
  isCorrect?: boolean; // Used for Swipe mode
  options?: number[]; // Used for Choice mode
}

export type FeedbackState = 'idle' | 'correct' | 'incorrect';

export interface User {
  id: string;
  name: string;
  avatar?: string;
}
