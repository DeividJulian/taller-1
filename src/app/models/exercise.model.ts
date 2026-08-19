export class Exercise {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly muscleGroup: string,
    public readonly baseXp: number
  ) {}
}

export const EXERCISE_CATALOG: Exercise[] = [
  new Exercise('ex-1', 'Flexiones', 'Pecho', 8),
  new Exercise('ex-2', 'Sentadillas', 'Piernas', 10),
  new Exercise('ex-3', 'Dominadas', 'Espalda', 12),
  new Exercise('ex-4', 'Plancha (60s)', 'Core', 6),
];