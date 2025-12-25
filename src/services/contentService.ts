/**
 * Content Service
 * Loads exercises and routines from local JSON or remote source
 */

import exercisesData from '@/data/exercises.json';
import routinesData from '@/data/routines.json';
import type { Exercise, Routine, RoutineExercise } from '@/stores/playerStore';

// Types for raw JSON data
interface RawExercise {
  id: string;
  name: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration_default: number;
  target_body_part: string[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface RawRoutineExercise {
  exercise_id: string;
  order: number;
  duration_override?: number;
}

interface RawRoutine {
  id: string;
  name: string;
  description: string;
  target_body_part: string;
  duration_total: number;
  exercises: RawRoutineExercise[];
  is_pro: boolean;
}

class ContentService {
  private exercises: Map<string, Exercise> = new Map();
  private routines: Map<string, Routine> = new Map();
  private loaded: boolean = false;

  constructor() {
    this.loadData();
  }

  private loadData() {
    // Load exercises
    const rawExercises = (exercisesData as { exercises: RawExercise[] }).exercises;
    rawExercises.forEach((ex) => {
      this.exercises.set(ex.id, ex);
    });

    // Load routines with resolved exercises
    const rawRoutines = (routinesData as { routines: RawRoutine[] }).routines;
    rawRoutines.forEach((routine) => {
      const resolvedExercises: RoutineExercise[] = routine.exercises
        .reduce<RoutineExercise[]>((acc, re) => {
          const exercise = this.exercises.get(re.exercise_id);
          if (!exercise) {
            console.warn(`Exercise not found: ${re.exercise_id}`);
            return acc;
          }
          acc.push({
            exercise_id: re.exercise_id,
            exercise,
            order: re.order,
            duration_override: re.duration_override,
          });
          return acc;
        }, [])
        .sort((a, b) => a.order - b.order);

      this.routines.set(routine.id, {
        id: routine.id,
        name: routine.name,
        description: routine.description,
        target_body_part: routine.target_body_part,
        duration_total: routine.duration_total,
        exercises: resolvedExercises,
        is_pro: routine.is_pro,
      });
    });

    this.loaded = true;
  }

  getAllExercises(): Exercise[] {
    return Array.from(this.exercises.values());
  }

  getExerciseById(id: string): Exercise | undefined {
    return this.exercises.get(id);
  }

  getExercisesByBodyPart(bodyPart: string): Exercise[] {
    return Array.from(this.exercises.values()).filter((ex) =>
      ex.target_body_part.includes(bodyPart)
    );
  }

  getAllRoutines(): Routine[] {
    return Array.from(this.routines.values());
  }

  getRoutineById(id: string): Routine | undefined {
    return this.routines.get(id);
  }

  getRoutinesByBodyPart(bodyPart: string): Routine[] {
    return Array.from(this.routines.values()).filter(
      (r) => r.target_body_part === bodyPart
    );
  }

  getFreeRoutines(): Routine[] {
    return Array.from(this.routines.values()).filter((r) => !r.is_pro);
  }

  getProRoutines(): Routine[] {
    return Array.from(this.routines.values()).filter((r) => r.is_pro);
  }

  getRandomExercise(bodyPart?: string): Exercise | undefined {
    const exercises = bodyPart
      ? this.getExercisesByBodyPart(bodyPart)
      : this.getAllExercises();

    if (exercises.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * exercises.length);
    return exercises[randomIndex];
  }

  // Create a micro routine from a single exercise
  createMicroRoutine(exercise: Exercise): Routine {
    return {
      id: `micro-${exercise.id}`,
      name: `Micro: ${exercise.name}`,
      description: 'Rychlý 30sekundový cvik',
      target_body_part: exercise.target_body_part[0] || 'general',
      duration_total: 30,
      exercises: [
        {
          exercise_id: exercise.id,
          exercise,
          order: 1,
          duration_override: 30,
        },
      ],
      is_pro: false,
    };
  }
}

// Singleton instance
export const contentService = new ContentService();
export default contentService;
