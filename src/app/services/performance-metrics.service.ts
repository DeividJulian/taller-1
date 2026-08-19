import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { onINP, Metric } from 'web-vitals';

export interface InpBreakdown {
  interactionName: string;
  tInput: number; // startTime -> processingStart
  tProcess: number; // processingStart -> processingEnd
  tPaint: number; // processingEnd -> next paint
  inp: number; // tInput + tProcess + tPaint
}

/**
 * PerformanceMetricsService covers the "¿Cómo se calcula el INP?" slide.
 *
 * INP = t_input + t_process + t_paint
 *
 *  - t_input   : delay between the user's physical interaction and the
 *                browser being free to start handling it.
 *  - t_process : time the event handler itself takes to run on the main
 *                thread (this is where our task/microtask work lives).
 *  - t_paint   : time from the end of processing until the next frame is
 *                actually painted on screen.
 *
 * We compute the breakdown manually via the Event Timing API (so the
 * numbers can be shown per-interaction, live), AND we subscribe to the
 * real, spec-compliant INP metric via `web-vitals`, which the browser
 * reports once per page (its worst/near-worst interaction).
 */
@Injectable({ providedIn: 'root' })
export class PerformanceMetricsService {
  private readonly breakdown$ = new BehaviorSubject<InpBreakdown[]>([]);
  private readonly realInp$ = new BehaviorSubject<Metric | null>(null);

  readonly breakdownEntries$ = this.breakdown$.asObservable();
  readonly realInpMetric$ = this.realInp$.asObservable();

  /** Call once, e.g. in AppComponent, to start listening for real INP. */
  startTrackingRealInp(): void {
    onINP((metric) => this.realInp$.next(metric), { reportAllChanges: true });
  }

  /**
   * Attaches a manual breakdown observer for a given interaction name.
   * Uses the 'event' PerformanceObserver, which exposes processingStart /
   * processingEnd timestamps that setTimeout/click handlers alone cannot see.
   */
  observeInteraction(interactionName: string): void {
    if (!('PerformanceObserver' in window)) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEventTiming[]) {
        const tInput = Math.max(0, entry.processingStart - entry.startTime);
        const tProcess = Math.max(0, entry.processingEnd - entry.processingStart);

        // t_paint is only known once the browser actually paints the next
        // frame, so we measure it with requestAnimationFrame.
        requestAnimationFrame(() => {
          const paintTimestamp = performance.now();
          const tPaint = Math.max(0, paintTimestamp - entry.processingEnd);
          const inp = tInput + tProcess + tPaint;

          this.breakdown$.next([
            ...this.breakdown$.value,
            { interactionName, tInput, tProcess, tPaint, inp },
          ]);
        });
      }
    });

    observer.observe({ type: 'event', durationThreshold: 0, buffered: false } as PerformanceObserverInit);
  }

  clear(): void {
    this.breakdown$.next([]);
  }
}
