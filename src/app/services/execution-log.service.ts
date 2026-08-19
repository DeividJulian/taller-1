import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ExecutionPhase = 'sync' | 'microtask' | 'paint' | 'task';

export interface LogEntry {
  phase: ExecutionPhase;
  message: string;
  /** performance.now() timestamp, in milliseconds, relative to page load. */
  timestamp: number;
}

/**
 * ExecutionLogService is the "proof" component of the assignment: it timestamps
 * every phase of the Event Loop (synchronous code, microtask queue, paint,
 * macrotask/task queue) as the app actually runs them, instead of just
 * describing the theory.
 */
@Injectable({ providedIn: 'root' })
export class ExecutionLogService {
  private readonly entries$ = new BehaviorSubject<LogEntry[]>([]);
  readonly log$ = this.entries$.asObservable();

  log(phase: ExecutionPhase, message: string): void {
    const entry: LogEntry = { phase, message, timestamp: performance.now() };
    this.entries$.next([...this.entries$.value, entry]);
  }

  clear(): void {
    this.entries$.next([]);
  }
}
