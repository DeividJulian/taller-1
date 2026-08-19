import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exercise, EXERCISE_CATALOG } from '../../models/exercise.model';
import { User } from '../../models/user.model';
import { Level } from '../../models/level.model';
import { WorkoutSession } from '../../models/workout-session.model';
import { XpResult } from '../../models/level-up-event.model';
import { XpService } from '../../services/xp.service';
import { PerformanceMetricsService } from '../../services/performance-metrics.service';
import { ExecutionLogService, LogEntry } from '../../services/execution-log.service';

@Component({
  selector: 'app-complete-exercise',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complete-exercise.component.html',
  styleUrls: ['./complete-exercise.component.css'],
})
export class CompleteExerciseComponent implements OnInit {
  readonly catalog: Exercise[] = EXERCISE_CATALOG;

  selectedExercise: Exercise = this.catalog[0];
  reps = 10;

  user = new User('user-1', 'Deivid', 0, Level.forXp(0));
  session = new WorkoutSession('session-1', this.user.id);

  lastResult: XpResult | null = null;
  logEntries: LogEntry[] = [];

  constructor(
    private readonly xpService: XpService,
    private readonly metrics: PerformanceMetricsService,
    private readonly executionLog: ExecutionLogService
  ) {}

  ngOnInit(): void {
    this.metrics.observeInteraction('complete-exercise-click');
    this.metrics.startTrackingRealInp();
    this.executionLog.log$.subscribe((entries) => (this.logEntries = entries));
  }

  onComplete(): void {
    this.xpService
      .completeExercise(this.session, this.selectedExercise, this.reps, this.user)
      .subscribe((result) => {
        this.lastResult = result;
      });
  }

  clearLog(): void {
    this.executionLog.clear();
  }
}
