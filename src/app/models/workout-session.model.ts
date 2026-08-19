import { Exercise } from './exercise.model';

export interface CompletedExercise {
  exercise: Exercise;
  reps: number;
  completedAt: Date;
}

export class WorkoutSession {
  private readonly completedExercises: CompletedExercise[] = [];

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly startedAt: Date = new Date()
  ) {}

  addCompletedExercise(exercise: Exercise, reps: number): void {
    this.completedExercises.push({ exercise, reps, completedAt: new Date() });
  }

  getCompletedExercises(): ReadonlyArray<CompletedExercise> {
    return this.completedExercises;
  }

  /** 1 XP per rep on top of the exercise's base XP. */
  getTotalXp(): number {
    return this.completedExercises.reduce(
      (total, entry) => total + entry.exercise.baseXp + entry.reps,
      0
    );
  }
}
