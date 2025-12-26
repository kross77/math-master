
import { Problem, GameMode, TopicType } from '../types';
import { LearningManager } from './learningSystem';

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isProblemMatchingTopic = (num1: number, num2: number, topic: TopicType): boolean => {
  if (topic === 'ALL') return true;
  
  if (typeof topic === 'number') {
    return num1 === topic || num2 === topic;
  }

  if (topic === '2-5') {
    return num1 >= 2 && num1 <= 5 && num2 >= 2 && num2 <= 5;
  }

  if (topic === '6-9') {
    return num1 >= 6 && num1 <= 9 && num2 >= 6 && num2 <= 9;
  }

  return true;
};

// Generates a single random problem based on topic
export const generateProblem = (mode: GameMode, topic: TopicType = 'ALL'): Problem => {
  let due = LearningManager.getDueProblem();
  let num1, num2;
  
  const isDueValid = due && isProblemMatchingTopic(due.num1, due.num2, topic);

  if (isDueValid && due) {
    num1 = due.num1;
    num2 = due.num2;
  } else {
    if (typeof topic === 'number') {
      num1 = topic;
      num2 = getRandomInt(2, 9);
      if (Math.random() > 0.5) [num1, num2] = [num2, num1];
    } else if (topic === '2-5') {
      num1 = getRandomInt(2, 5);
      num2 = getRandomInt(2, 5);
    } else if (topic === '6-9') {
      num1 = getRandomInt(6, 9);
      num2 = getRandomInt(6, 9);
    } else {
      num1 = getRandomInt(2, 9);
      num2 = getRandomInt(2, 9);
    }
  }

  const answer = num1 * num2;
  return { num1, num2, answer };
};

// Generates a batch of distinct problems for a session
export const generateBatch = (topic: TopicType, count: number): Problem[] => {
  const problems: Problem[] = [];
  const signatures = new Set<string>();
  let attempts = 0;

  while (problems.length < count && attempts < 100) {
    attempts++;
    const p = generateProblem(GameMode.SWIPE, topic); // Mode doesn't matter for raw numbers
    const sig = `${p.num1}x${p.num2}`;
    
    if (!signatures.has(sig)) {
      signatures.add(sig);
      problems.push(p);
    }
  }
  
  return problems;
};

// Helper helpers to enrich problems for specific modes
export const enrichForSwipe = (p: Problem): Problem => {
  const isCorrect = Math.random() > 0.5;
  let displayAnswer = p.answer;
  
  if (!isCorrect) {
    let wrong = p.answer + getRandomInt(-5, 5);
    while (wrong === p.answer || wrong <= 0) {
      wrong = p.answer + getRandomInt(-5, 5);
    }
    displayAnswer = wrong;
  }

  return { ...p, isCorrect, displayAnswer };
};

export const enrichForChoice = (p: Problem): Problem => {
  const options = new Set<number>();
  options.add(p.answer);
  while (options.size < 4) {
    let wrong = p.answer + getRandomInt(-10, 10);
    if (wrong > 0 && wrong !== p.answer) {
      options.add(wrong);
    }
  }
  return { ...p, options: Array.from(options).sort(() => Math.random() - 0.5) };
};
