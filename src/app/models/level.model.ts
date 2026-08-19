/**
 * Level represents a user's rank inside the gamified workout system.
 * It is a plain value object: no side effects, only pure lookups.
 */
export class Level {
  constructor(
    public readonly levelNumber: number,
    public readonly title: string,
    public readonly xpRequired: number
  ) {}

  /** Ordered thresholds. Index 0 is always the starting level. */
  static readonly LEVELS: Level[] = [
    new Level(1, 'Beginner', 0),
    new Level(2, 'Novice', 100),
    new Level(3, 'Intermediate', 300),
    new Level(4, 'Advanced', 700),
    new Level(5, 'Elite', 1500),
    new Level(6, 'Champion', 3000),
  ];

  /** Returns the highest level whose threshold has been reached by `xp`. */
  static forXp(xp: number): Level {
    let current = Level.LEVELS[0];
    for (const level of Level.LEVELS) {
      if (xp >= level.xpRequired) {
        current = level;
      }
    }
    return current;
  }

  static next(current: Level): Level | null {
    const index = Level.LEVELS.findIndex((l) => l.levelNumber === current.levelNumber);
    return index >= 0 && index < Level.LEVELS.length - 1 ? Level.LEVELS[index + 1] : null;
  }
}
