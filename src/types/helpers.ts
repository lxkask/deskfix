/**
 * Helper functions and utilities for working with DeskFix data models
 */

import {
  Exercise,
  Routine,
  RoutineExercise,
  HistoryLog,
  UserStats,
  BodyPart,
  RemoteConfig,
} from './index';

/**
 * Calculate total duration of a routine based on its exercises
 * @param routine - The routine to calculate duration for
 * @param exercises - All available exercises to look up durations
 * @returns Total duration in seconds
 */
export function calculateRoutineDuration(
  routine: Routine,
  exercises: Exercise[]
): number {
  return routine.exercises.reduce((total, routineEx) => {
    const exercise = exercises.find((ex) => ex.id === routineEx.exercise_id);
    if (!exercise) return total;

    const duration = routineEx.duration_override ?? exercise.duration_default;
    return total + duration;
  }, 0);
}

/**
 * Get exercises for a routine in the correct order
 * @param routine - The routine
 * @param allExercises - All available exercises
 * @returns Array of exercises with their durations
 */
export function getRoutineExercises(
  routine: Routine,
  allExercises: Exercise[]
): Array<{ exercise: Exercise; duration: number }> {
  return routine.exercises
    .sort((a, b) => a.order - b.order)
    .map((routineEx) => {
      const exercise = allExercises.find((ex) => ex.id === routineEx.exercise_id);
      if (!exercise) {
        throw new Error(`Exercise ${routineEx.exercise_id} not found`);
      }

      const duration = routineEx.duration_override ?? exercise.duration_default;
      return { exercise, duration };
    });
}

/**
 * Filter exercises by body part
 * @param exercises - All exercises
 * @param bodyPart - Target body part
 * @returns Filtered exercises
 */
export function filterExercisesByBodyPart(
  exercises: Exercise[],
  bodyPart: BodyPart
): Exercise[] {
  return exercises.filter(
    (ex) =>
      ex.target_body_part === bodyPart ||
      ex.secondary_body_parts?.includes(bodyPart)
  );
}

/**
 * Filter routines by body part
 * @param routines - All routines
 * @param bodyPart - Target body part
 * @returns Filtered routines
 */
export function filterRoutinesByBodyPart(
  routines: Routine[],
  bodyPart: BodyPart
): Routine[] {
  return routines.filter((routine) =>
    routine.target_body_parts.includes(bodyPart)
  );
}

/**
 * Get routines available for free users (non-pro)
 * @param routines - All routines
 * @returns Free routines
 */
export function getFreeRoutines(routines: Routine[]): Routine[] {
  return routines.filter((routine) => !routine.is_pro);
}

/**
 * Calculate user statistics from history logs
 * @param historyLogs - All history logs
 * @returns Aggregated statistics
 */
export function calculateUserStats(historyLogs: HistoryLog[]): UserStats {
  const completedLogs = historyLogs.filter((log) => log.completed);

  const totalExercises = completedLogs.filter((log) => log.exercise_id).length;
  const totalRoutines = completedLogs.filter((log) => log.routine_id).length;
  const totalTime = completedLogs.reduce(
    (sum, log) => sum + log.duration_actual,
    0
  );

  // Calculate streaks
  const sortedDates = completedLogs
    .map((log) => new Date(log.date).toISOString().split('T')[0])
    .filter((date, index, arr) => arr.indexOf(date) === index) // unique dates
    .sort()
    .reverse();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    const prevDate = sortedDates[i - 1];

    if (i === 0) {
      if (currentDate === today || currentDate === yesterday) {
        currentStreak = 1;
      }
      tempStreak = 1;
    } else {
      const daysDiff = Math.floor(
        (new Date(prevDate).getTime() - new Date(currentDate).getTime()) /
          86400000
      );

      if (daysDiff === 1) {
        tempStreak++;
        if (i === 0 || currentDate === today || currentDate === yesterday) {
          currentStreak++;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  // Calculate body part counts
  const bodyPartCounts = completedLogs.reduce((counts, log) => {
    counts[log.body_part] = (counts[log.body_part] || 0) + 1;
    return counts;
  }, {} as Record<BodyPart, number>);

  const mostWorkedBodyPart = Object.entries(bodyPartCounts).reduce(
    (max, [part, count]) =>
      count > (bodyPartCounts[max as BodyPart] || 0) ? (part as BodyPart) : max,
    Object.keys(bodyPartCounts)[0] as BodyPart
  );

  const lastExerciseDate = completedLogs.length > 0
    ? completedLogs.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0].date
    : undefined;

  return {
    total_exercises_completed: totalExercises,
    total_routines_completed: totalRoutines,
    total_time_exercised: totalTime,
    current_streak: currentStreak,
    longest_streak: longestStreak,
    most_worked_body_part: mostWorkedBodyPart,
    last_exercise_date: lastExerciseDate,
    body_part_counts: bodyPartCounts,
  };
}

/**
 * Format duration in seconds to human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "5 min", "1 min 30 s")
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds} s`;
  } else if (remainingSeconds === 0) {
    return `${minutes} min`;
  } else {
    return `${minutes} min ${remainingSeconds} s`;
  }
}

/**
 * Generate a unique ID for history log entries
 * @returns Unique ID string
 */
export function generateHistoryLogId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if user is within work hours
 * @param workHoursStart - Start time (e.g., "09:00")
 * @param workHoursEnd - End time (e.g., "17:00")
 * @returns True if current time is within work hours
 */
export function isWithinWorkHours(
  workHoursStart: string,
  workHoursEnd: string
): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMin] = workHoursStart.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;

  const [endHour, endMin] = workHoursEnd.split(':').map(Number);
  const endMinutes = endHour * 60 + endMin;

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

/**
 * Get recommended exercises based on user's selected pain areas
 * @param exercises - All available exercises
 * @param painAreas - User's selected pain areas
 * @param limit - Maximum number of exercises to return
 * @returns Recommended exercises
 */
export function getRecommendedExercises(
  exercises: Exercise[],
  painAreas: BodyPart[],
  limit: number = 5
): Exercise[] {
  if (painAreas.length === 0) {
    // Return random beginner exercises if no pain areas selected
    return exercises
      .filter((ex) => ex.difficulty === 'beginner' || !ex.difficulty)
      .slice(0, limit);
  }

  const recommended = exercises.filter(
    (ex) =>
      painAreas.includes(ex.target_body_part) ||
      ex.secondary_body_parts?.some((part) => painAreas.includes(part))
  );

  return recommended.slice(0, limit);
}

/**
 * Validate remote config structure
 * @param config - Remote config object
 * @returns True if valid
 * @throws Error if invalid
 */
export function validateRemoteConfig(config: any): config is RemoteConfig {
  if (!config.version || typeof config.version !== 'string') {
    throw new Error('Invalid config: missing or invalid version');
  }

  if (!config.last_updated || typeof config.last_updated !== 'string') {
    throw new Error('Invalid config: missing or invalid last_updated');
  }

  if (!Array.isArray(config.exercises)) {
    throw new Error('Invalid config: exercises must be an array');
  }

  if (!Array.isArray(config.routines)) {
    throw new Error('Invalid config: routines must be an array');
  }

  // Validate each exercise has required fields
  config.exercises.forEach((ex: any, index: number) => {
    if (!ex.id || !ex.name || !ex.target_body_part) {
      throw new Error(`Invalid exercise at index ${index}: missing required fields`);
    }
  });

  // Validate each routine has required fields
  config.routines.forEach((rt: any, index: number) => {
    if (!rt.id || !rt.name || !Array.isArray(rt.exercises)) {
      throw new Error(`Invalid routine at index ${index}: missing required fields`);
    }
  });

  return true;
}

/**
 * Get body part display name in Czech
 * @param bodyPart - Body part enum value
 * @returns Czech display name
 */
export function getBodyPartDisplayName(bodyPart: BodyPart): string {
  const displayNames: Record<BodyPart, string> = {
    [BodyPart.Neck]: 'Krk',
    [BodyPart.Shoulders]: 'Ramena',
    [BodyPart.UpperBack]: 'Horní část zad',
    [BodyPart.LowerBack]: 'Dolní část zad',
    [BodyPart.Wrists]: 'Zápěstí',
    [BodyPart.Hips]: 'Boky',
    [BodyPart.Eyes]: 'Oči',
  };

  return displayNames[bodyPart] || bodyPart;
}
