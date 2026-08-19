import { Level } from './level.model';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public currentXp: number,
    public level: Level
  ) {}

  gainXp(amount: number): void {
    this.currentXp += amount;
    this.level = Level.forXp(this.currentXp);
  }
}
