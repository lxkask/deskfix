import { create } from 'zustand';

/**
 * Player State Machine:
 * IDLE → PREPARING → PLAYING ⇄ PAUSED → TRANSITIONING → COMPLETED
 */
export type PlayerState =
  | 'idle'       // No routine loaded
  | 'preparing'  // Loading routine/exercise
  | 'playing'    // Exercise in progress, timer running
  | 'paused'     // Timer paused
  | 'transitioning' // Between exercises (3s countdown)
  | 'completed'; // Routine finished

export interface Exercise {
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

export interface RoutineExercise {
  exercise_id: string;
  exercise: Exercise;
  order: number;
  duration_override?: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  target_body_part: string;
  duration_total: number;
  exercises: RoutineExercise[];
  is_pro: boolean;
}

interface PlayerStore {
  // State
  state: PlayerState;
  routine: Routine | null;
  currentExerciseIndex: number;
  timeRemaining: number; // seconds
  totalTimeElapsed: number; // seconds
  transitionCountdown: number; // seconds (3, 2, 1)

  // Computed values (derived)
  currentExercise: RoutineExercise | null;
  progress: number; // 0-1
  exerciseProgress: string; // "2/5"

  // Actions
  loadRoutine: (routine: Routine) => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  restart: () => void;
  reset: () => void;

  // Timer actions (called by timer interval)
  tick: () => void;
  transitionTick: () => void;

  // Internal
  _startTransition: () => void;
  _nextExercise: () => void;
  _complete: () => void;
}

const TRANSITION_DURATION = 3; // seconds between exercises

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Initial state
  state: 'idle',
  routine: null,
  currentExerciseIndex: 0,
  timeRemaining: 0,
  totalTimeElapsed: 0,
  transitionCountdown: 0,

  // Computed values as getters
  get currentExercise() {
    const { routine, currentExerciseIndex } = get();
    if (!routine || currentExerciseIndex >= routine.exercises.length) {
      return null;
    }
    return routine.exercises[currentExerciseIndex];
  },

  get progress() {
    const { routine, currentExerciseIndex, timeRemaining } = get();
    if (!routine || routine.exercises.length === 0) return 0;

    const currentEx = routine.exercises[currentExerciseIndex];
    if (!currentEx) return 1;

    const duration = currentEx.duration_override ?? currentEx.exercise.duration_default;
    const exerciseProgress = (duration - timeRemaining) / duration;
    const overallProgress = (currentExerciseIndex + exerciseProgress) / routine.exercises.length;

    return Math.min(1, Math.max(0, overallProgress));
  },

  get exerciseProgress() {
    const { routine, currentExerciseIndex } = get();
    if (!routine) return '0/0';
    return `${currentExerciseIndex + 1}/${routine.exercises.length}`;
  },

  // Actions
  loadRoutine: (routine) => {
    const firstExercise = routine.exercises[0];
    const duration = firstExercise?.duration_override ?? firstExercise?.exercise.duration_default ?? 30;

    set({
      state: 'preparing',
      routine,
      currentExerciseIndex: 0,
      timeRemaining: duration,
      totalTimeElapsed: 0,
      transitionCountdown: 0,
    });
  },

  play: () => {
    const { state } = get();
    if (state === 'preparing' || state === 'paused') {
      set({ state: 'playing' });
    }
  },

  pause: () => {
    const { state } = get();
    if (state === 'playing') {
      set({ state: 'paused' });
    }
  },

  resume: () => {
    const { state } = get();
    if (state === 'paused') {
      set({ state: 'playing' });
    }
  },

  skip: () => {
    const { routine, currentExerciseIndex } = get();
    if (!routine) return;

    if (currentExerciseIndex < routine.exercises.length - 1) {
      get()._startTransition();
    } else {
      get()._complete();
    }
  },

  restart: () => {
    const { routine } = get();
    if (routine) {
      get().loadRoutine(routine);
      get().play();
    }
  },

  reset: () => {
    set({
      state: 'idle',
      routine: null,
      currentExerciseIndex: 0,
      timeRemaining: 0,
      totalTimeElapsed: 0,
      transitionCountdown: 0,
    });
  },

  // Timer tick - called every second while playing
  tick: () => {
    const { state, timeRemaining, routine, currentExerciseIndex } = get();
    if (state !== 'playing') return;

    if (timeRemaining > 1) {
      set({
        timeRemaining: timeRemaining - 1,
        totalTimeElapsed: get().totalTimeElapsed + 1,
      });
    } else {
      // Exercise completed
      set({ totalTimeElapsed: get().totalTimeElapsed + 1 });

      if (routine && currentExerciseIndex < routine.exercises.length - 1) {
        get()._startTransition();
      } else {
        get()._complete();
      }
    }
  },

  // Transition tick - called every second during transition
  transitionTick: () => {
    const { state, transitionCountdown } = get();
    if (state !== 'transitioning') return;

    if (transitionCountdown > 1) {
      set({ transitionCountdown: transitionCountdown - 1 });
    } else {
      get()._nextExercise();
    }
  },

  // Internal methods
  _startTransition: () => {
    set({
      state: 'transitioning',
      transitionCountdown: TRANSITION_DURATION,
    });
  },

  _nextExercise: () => {
    const { routine, currentExerciseIndex } = get();
    if (!routine) return;

    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex >= routine.exercises.length) {
      get()._complete();
      return;
    }

    const nextExercise = routine.exercises[nextIndex];
    const duration = nextExercise.duration_override ?? nextExercise.exercise.duration_default;

    set({
      state: 'playing',
      currentExerciseIndex: nextIndex,
      timeRemaining: duration,
      transitionCountdown: 0,
    });
  },

  _complete: () => {
    set({
      state: 'completed',
      timeRemaining: 0,
      transitionCountdown: 0,
    });
  },
}));

export default usePlayerStore;
