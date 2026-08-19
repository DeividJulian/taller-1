import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InpBreakdown, PerformanceMetricsService } from '../../services/performance-metrics.service';
import { Metric } from 'web-vitals';

@Component({
  selector: 'app-performance-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './performance-dashboard.component.html',
  styleUrls: ['./performance-dashboard.component.css'],
})
export class PerformanceDashboardComponent implements OnInit {
  breakdownEntries: InpBreakdown[] = [];
  realInp: Metric | null = null;

  constructor(private readonly metrics: PerformanceMetricsService) {}

  ngOnInit(): void {
    this.metrics.breakdownEntries$.subscribe((entries) => (this.breakdownEntries = entries));
    this.metrics.realInpMetric$.subscribe((metric) => (this.realInp = metric));
  }
}
