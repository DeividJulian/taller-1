import { Level } from './level.model';

export class LevelUpEvent {
  constructor(
    public readonly userId: string,
    public readonly oldLevel: Level,
    public readonly newLevel: Level,
    public readonly timestamp: Date = new Date()
  ) {}
}

/** Outcome returned to the UI after an exercise-completion is processed. */
export interface XpResult {
  xpGained: number;
  totalXp: number;
  currentLevel: Level;
  levelUp: LevelUpEvent | null;
}
