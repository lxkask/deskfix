/**
 * Zustand Store Implementation for DeskFix
 * Manages app state during workout sessions
 */

import { create } from 'zustand';
import { Exercise, Routine } from './index';

interface AppState {
  // State
  current_routine: Routine | null;
  current_exercise: Exercise | null;
  current_exercise_index: number;
  is_playing: boolean;
  elapsed_time: number;
  is_paused: boolean;
  routine_progress: number;

  // Actions
  startRoutine: (routine: Routine) => void;
  startExercise: (exercise: Exercise) => void;
  pausePlayback: () => void;
  resumePlayback: () => void;
  stopPlayback: () => void;
  nextExercise: () => void;
  previousExercise: () => void;
  updateElapsedTime: (time: number) => void;
  resetState: () => void;
}

/**
 * Zustand store for managing workout session state
 */
export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  current_routine: null,
  current_exercise: null,
  current_exercise_index: 0,
  is_playing: false,
  elapsed_time: 0,
  is_paused: false,
  routine_progress: 0,

  // Start a routine
  startRoutine: (routine: Routine) => {
    set({
      current_routine: routine,
      current_exercise: null,
      current_exercise_index: 0,
      is_playing: true,
      elapsed_time: 0,
      is_paused: false,
      routine_progress: 0,
    });
  },

  // Start a standalone exercise
  startExercise: (exercise: Exercise) => {
    set({
      current_routine: null,
      current_exercise: exercise,
      current_exercise_index: 0,
      is_playing: true,
      elapsed_time: 0,
      is_paused: false,
      routine_progress: 0,
    });
  },

  // Pause playback
  pausePlayback: () => {
    set({ is_paused: true, is_playing: false });
  },

  // Resume playback
  resumePlayback: () => {
    set({ is_paused: false, is_playing: true });
  },

  // Stop playback completely
  stopPlayback: () => {
    set({
      is_playing: false,
      is_paused: false,
    });
  },

  // Move to next exercise in routine
  nextExercise: () => {
    const { current_routine, current_exercise_index } = get();
    if (current_routine && current_exercise_index < current_routine.exercises.length - 1) {
      const newIndex = current_exercise_index + 1;
      const progress = (newIndex / current_routine.exercises.length) * 100;

      set({
        current_exercise_index: newIndex,
        elapsed_time: 0,
        routine_progress: progress,
      });
    } else {
      // Routine completed
      get().stopPlayback();
    }
  },

  // Move to previous exercise in routine
  previousExercise: () => {
    const { current_routine, current_exercise_index } = get();
    if (current_routine && current_exercise_index > 0) {
      const newIndex = current_exercise_index - 1;
      const progress = (newIndex / current_routine.exercises.length) * 100;

      set({
        current_exercise_index: newIndex,
        elapsed_time: 0,
        routine_progress: progress,
      });
    }
  },

  // Update elapsed time
  updateElapsedTime: (time: number) => {
    set({ elapsed_time: time });
  },

  // Reset state to initial
  resetState: () => {
    set({
      current_routine: null,
      current_exercise: null,
      current_exercise_index: 0,
      is_playing: false,
      elapsed_time: 0,
      is_paused: false,
      routine_progress: 0,
    });
  },
}));
