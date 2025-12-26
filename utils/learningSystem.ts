
// Spaced Repetition System (Wave Learning)
// Level 0: Error/New -> Review in 30 seconds
// Level 1: -> 2 minutes
// Level 2: -> 10 minutes
// Level 3: -> 1 hour
// Level 4: -> 5 hours
// Level 5: -> 1 day
// Level 6+: -> Exponential days

interface LearningItem {
  id: string; // key like "2x3"
  num1: number;
  num2: number;
  level: number;
  nextReview: number; // timestamp
}

const STORAGE_KEY = 'math_master_progress';

const INTERVALS_MS = [
  30 * 1000,       // L0: 30s (Immediate retry)
  2 * 60 * 1000,   // L1: 2m
  10 * 60 * 1000,  // L2: 10m
  60 * 60 * 1000,  // L3: 1h
  5 * 60 * 60 * 1000, // L4: 5h
  24 * 60 * 60 * 1000 // L5: 1d
];

export class LearningManager {
  private static items: Record<string, LearningItem> = {};

  static init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      this.items = JSON.parse(saved);
    } else {
      // Initialize all facts 2x2 to 9x9
      for (let i = 2; i <= 9; i++) {
        for (let j = 2; j <= 9; j++) {
          const key = `${i}x${j}`;
          this.items[key] = {
            id: key,
            num1: i,
            num2: j,
            level: 0,
            nextReview: 0 // Ready immediately
          };
        }
      }
      this.save();
    }
  }

  private static save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  }

  // Get a problem that is due for review or new
  static getDueProblem(): { num1: number, num2: number } | null {
    const now = Date.now();
    const dueItems = Object.values(this.items).filter(item => item.nextReview <= now);
    
    if (dueItems.length === 0) return null;

    // Prioritize lower levels (errors) first
    dueItems.sort((a, b) => a.level - b.level);
    
    // Take a random one from the top 5 most urgent to add variety
    const poolSize = Math.min(dueItems.length, 5);
    const randomIdx = Math.floor(Math.random() * poolSize);
    
    return {
      num1: dueItems[randomIdx].num1,
      num2: dueItems[randomIdx].num2
    };
  }

  static recordResult(num1: number, num2: number, isCorrect: boolean) {
    const key = `${num1}x${num2}`;
    const reverseKey = `${num2}x${num1}`;
    
    // We update both 2x3 and 3x2 as they are effectively the same concept for the child
    this.updateItem(key, isCorrect);
    if (num1 !== num2) {
      this.updateItem(reverseKey, isCorrect);
    }
    this.save();
  }

  private static updateItem(key: string, isCorrect: boolean) {
    const item = this.items[key];
    if (!item) return;

    if (isCorrect) {
      // Increase level, schedule further out
      const nextInterval = INTERVALS_MS[item.level] || (24 * 60 * 60 * 1000 * Math.pow(2, item.level - 5));
      item.level = item.level + 1;
      item.nextReview = Date.now() + nextInterval;
    } else {
      // Error: Reset to level 0 (Wave crash), review very soon
      item.level = 0;
      item.nextReview = Date.now() + INTERVALS_MS[0]; 
    }
  }

  static getTopicStats(num: number): { progress: number; isPassed: boolean } {
    const items = Object.values(this.items).filter(i => i.num1 === num || i.num2 === num);
    if (items.length === 0) return { progress: 0, isPassed: false };

    const MAX_TRACKED_LEVEL = 5;
    let totalLevelScore = 0;
    let passedCount = 0; // Items that are at least level 1 (known/started)

    items.forEach(item => {
      // Cap contribution of a single item
      totalLevelScore += Math.min(item.level, MAX_TRACKED_LEVEL);
      if (item.level > 0) passedCount++;
    });

    // Progress percentage based on mastery levels
    const progress = Math.round((totalLevelScore / (items.length * MAX_TRACKED_LEVEL)) * 100);
    
    // Passed if all items have level > 0 (meaning we've successfully answered them at least once recently)
    const isPassed = passedCount === items.length;

    return { progress, isPassed };
  }

  static resetProgress() {
    this.items = {};
    this.init();
  }
}

// Initialize immediately
LearningManager.init();
