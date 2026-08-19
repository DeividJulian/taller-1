import { Component } from '@angular/core';
import { CompleteExerciseComponent } from './components/complete-exercise/complete-exercise.component';
import { PerformanceDashboardComponent } from './components/performance-dashboard/performance-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CompleteExerciseComponent, PerformanceDashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'taller-1-app';
}