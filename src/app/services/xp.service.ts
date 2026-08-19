import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Level } from '../models/level.model';
import { Exercise } from '../models/exercise.model';
import { User } from '../models/user.model';
import { WorkoutSession } from '../models/workout-session.model';
import { LevelUpEvent, XpResult } from '../models/level-up-event.model';
import { ExecutionLogService } from './execution-log.service';


@Injectable({ providedIn: 'root' })
export class XpService {
  constructor(private readonly log: ExecutionLogService) {}

  completeExercise(
    session: WorkoutSession,
    exercise: Exercise,
    reps: number,
    user: User
  ): Observable<XpResult> {
    return new Observable<XpResult>((subscriber) => {
     
      session.addCompletedExercise(exercise, reps);
      this.log.log('sync', `Se registraron ${reps} repeticiones de "${exercise.name}"`);

    
      Promise.resolve().then(() => {
        const xpGained = exercise.baseXp + reps;
        const totalXp = user.currentXp + xpGained;
        const previousLevel = user.level;
        const nextLevel = Level.forXp(totalXp);

        this.log.log('microtask', `XP calculado: +${xpGained} (total ${totalXp})`);

        user.gainXp(xpGained);

        const levelUp =
          nextLevel.levelNumber > previousLevel.levelNumber
            ? new LevelUpEvent(user.id, previousLevel, nextLevel)
            : null;

        if (levelUp) {
          this.log.log('microtask', `Subida de nivel detectada: ${previousLevel.title} → ${nextLevel.title}`);
        }

        subscriber.next({ xpGained, totalXp, currentLevel: nextLevel, levelUp });
        subscriber.complete();

     
        requestAnimationFrame(() => {
          this.log.log('paint', 'El navegador pintó la barra de XP actualizada');
        });
      });

      
      setTimeout(() => {
        this.log.log('task', `Guardando la sesión "${session.id}" en el servidor...`);
        
        this.log.log('task', `Sesión "${session.id}" guardada`);
      }, 0);
    });
  }
}