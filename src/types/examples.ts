/**
 * Example usage patterns for DeskFix data model
 * This file demonstrates how to use the types and utilities
 */

import {
  Exercise,
  Routine,
  BodyPart,
  UserSettings,
  HistoryLog,
  NotificationState,
  Difficulty,
  RemoteConfig,
} from './index';

import {
  calculateRoutineDuration,
  getRoutineExercises,
  filterExercisesByBodyPart,
  getRecommendedExercises,
  calculateUserStats,
  formatDuration,
  isWithinWorkHours,
  generateHistoryLogId,
  getBodyPartDisplayName,
} from './helpers';

import {
  saveUserSettings,
  loadUserSettings,
  updateUserSetting,
  loadNotificationState,
  addToLastShownExercises,
  cacheRemoteConfig,
  loadCachedRemoteConfig,
  isRemoteConfigCacheStale,
} from './storage';

import { useAppStore } from './store';

// ============================================================================
// EXAMPLE 1: Loading and caching remote config
// ============================================================================

async function loadRemoteConfigExample() {
  try {
    // Check if cached config is stale (older than 24 hours)
    const isStale = await isRemoteConfigCacheStale(24);

    let config: RemoteConfig;

    if (isStale) {
      console.log('Fetching fresh config from server...');
      // Fetch from your CDN/server
      const response = await fetch('https://api.deskfix.app/config.json');
      config = await response.json();

      // Cache locally
      await cacheRemoteConfig(config);
    } else {
      console.log('Using cached config...');
      config = await loadCachedRemoteConfig();
    }

    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    // Fallback to cached version
    return await loadCachedRemoteConfig();
  }
}

// ============================================================================
// EXAMPLE 2: User onboarding flow
// ============================================================================

async function completeOnboardingExample(selectedPainAreas: BodyPart[]) {
  const settings: UserSettings = {
    work_hours_start: '09:00',
    work_hours_end: '17:00',
    hourly_nudge_enabled: true,
    office_mode: true, // User selected office mode
    onboarding_completed: true,
    selected_pain_areas: selectedPainAreas,
    is_pro: false,
    language: 'cs',
    notification_sound_enabled: false, // Silent in office
  };

  await saveUserSettings(settings);

  // Get recommended exercises based on pain areas
  const config = await loadRemoteConfigExample();
  const recommended = getRecommendedExercises(
    config.exercises,
    selectedPainAreas,
    5
  );

  console.log('Recommended exercises:', recommended);
  return recommended;
}

// ============================================================================
// EXAMPLE 3: Starting a workout session (Zustand store)
// ============================================================================

function startWorkoutExample() {
  // In a React component
  const {
    current_routine,
    is_playing,
    elapsed_time,
    startRoutine,
    pausePlayback,
    resumePlayback,
    nextExercise,
    stopPlayback,
  } = useAppStore();

  // User selects a routine
  const selectedRoutine: Routine = {
    id: 'rt_001',
    name: 'Rychlá kancelářská pauza',
    description: '5minutová rutina...',
    exercises: [
      { exercise_id: 'ex_001', order: 0, duration_override: 45 },
      { exercise_id: 'ex_002', order: 1 },
    ],
    total_duration: 200,
    target_body_parts: [BodyPart.Neck, BodyPart.Shoulders],
    is_pro: false,
  };

  // Start the routine
  startRoutine(selectedRoutine);

  // Later: pause
  // pausePlayback();

  // Resume
  // resumePlayback();

  // Skip to next exercise
  // nextExercise();

  // Stop completely
  // stopPlayback();
}

// ============================================================================
// EXAMPLE 4: Logging completed exercise
// ============================================================================

async function logCompletedExerciseExample(
  exerciseId: string,
  durationActual: number,
  bodyPart: BodyPart
) {
  const log: HistoryLog = {
    id: generateHistoryLogId(),
    date: new Date().toISOString(),
    exercise_id: exerciseId,
    completed: true,
    duration_actual: durationActual,
    body_part: bodyPart,
    pain_level_before: 7, // Optional: user rated pain before
    pain_level_after: 4,  // Optional: user rated pain after
    notes: 'Cítil jsem velkou úlevu v krční páteři',
  };

  // Save to SQLite (implement your DB save function)
  // await saveHistoryLogToDatabase(log);

  console.log('Exercise logged:', log);

  // Also update notification state to avoid showing same exercise soon
  await addToLastShownExercises(exerciseId);
}

// ============================================================================
// EXAMPLE 5: Calculating and displaying user statistics
// ============================================================================

async function displayUserStatsExample(historyLogs: HistoryLog[]) {
  const stats = calculateUserStats(historyLogs);

  console.log(`Total exercises completed: ${stats.total_exercises_completed}`);
  console.log(`Total routines completed: ${stats.total_routines_completed}`);
  console.log(`Total time exercised: ${formatDuration(stats.total_time_exercised)}`);
  console.log(`Current streak: ${stats.current_streak} days`);
  console.log(`Longest streak: ${stats.longest_streak} days`);

  if (stats.most_worked_body_part) {
    const bodyPartName = getBodyPartDisplayName(stats.most_worked_body_part);
    console.log(`Most worked body part: ${bodyPartName}`);
  }

  console.log('\nBreakdown by body part:');
  Object.entries(stats.body_part_counts).forEach(([part, count]) => {
    const displayName = getBodyPartDisplayName(part as BodyPart);
    console.log(`  ${displayName}: ${count} times`);
  });

  return stats;
}

// ============================================================================
// EXAMPLE 6: Filtering exercises by body part
// ============================================================================

async function getExercisesForPainAreaExample(bodyPart: BodyPart) {
  const config = await loadRemoteConfigExample();

  // Get exercises targeting this body part
  const exercises = filterExercisesByBodyPart(config.exercises, bodyPart);

  console.log(`Found ${exercises.length} exercises for ${getBodyPartDisplayName(bodyPart)}`);

  // Sort by difficulty
  const beginnerExercises = exercises.filter(
    ex => ex.difficulty === Difficulty.Beginner || !ex.difficulty
  );

  console.log(`${beginnerExercises.length} beginner-friendly exercises`);

  return exercises;
}

// ============================================================================
// EXAMPLE 7: Smart notification system
// ============================================================================

async function scheduleSmartNotificationExample() {
  // Load user settings
  const settings = await loadUserSettings();
  if (!settings) return;

  // Check if we should send notification
  if (!settings.hourly_nudge_enabled) {
    console.log('Hourly nudges disabled');
    return;
  }

  // Check if within work hours
  if (!isWithinWorkHours(settings.work_hours_start, settings.work_hours_end)) {
    console.log('Outside work hours');
    return;
  }

  // Load notification state
  const notifState = await loadNotificationState();

  // Load exercises
  const config = await loadRemoteConfigExample();

  // Get exercises user hasn't seen recently
  const availableExercises = config.exercises.filter(
    (ex: Exercise) => !notifState.last_shown_exercises.includes(ex.id)
  );

  // If all exercises shown, reset the list
  const exercisesToChooseFrom = availableExercises.length > 0
    ? availableExercises
    : config.exercises;

  // Filter by user's pain areas
  const recommended = getRecommendedExercises(
    exercisesToChooseFrom,
    settings.selected_pain_areas,
    3
  );

  // Pick a random one
  const selectedExercise = recommended[Math.floor(Math.random() * recommended.length)];

  // Create notification
  const notification = {
    title: 'Čas na protažení!',
    body: `${selectedExercise.name} - ${formatDuration(selectedExercise.duration_default)}`,
    data: { exercise_id: selectedExercise.id },
    sound: settings.office_mode ? undefined : 'default',
  };

  // Schedule notification (implement with expo-notifications or similar)
  // const notificationId = await scheduleNotification(notification);

  // Track this exercise as shown
  await addToLastShownExercises(selectedExercise.id);

  console.log('Notification scheduled:', notification);
}

// ============================================================================
// EXAMPLE 8: Pro feature gating
// ============================================================================

async function checkProAccessExample(routine: Routine): Promise<boolean> {
  if (!routine.is_pro) {
    return true; // Free routine
  }

  const settings = await loadUserSettings();

  if (settings?.is_pro) {
    return true; // User has Pro
  }

  // Show paywall
  console.log('This routine requires Pro subscription');
  // showPaywallScreen(routine);

  return false;
}

// ============================================================================
// EXAMPLE 9: Building a routine from exercises
// ============================================================================

function createCustomRoutineExample(exercises: Exercise[]): Routine {
  // User selects exercises for custom routine
  const selectedExercises: Exercise[] = [
    exercises.find(ex => ex.id === 'ex_001')!,
    exercises.find(ex => ex.id === 'ex_003')!,
    exercises.find(ex => ex.id === 'ex_005')!,
  ];

  // Calculate total duration
  const totalDuration = selectedExercises.reduce(
    (sum, ex) => sum + ex.duration_default,
    0
  );

  // Extract all targeted body parts
  const bodyParts = new Set<BodyPart>();
  selectedExercises.forEach(ex => {
    bodyParts.add(ex.target_body_part);
    ex.secondary_body_parts?.forEach(bp => bodyParts.add(bp));
  });

  // Create routine object
  const customRoutine: Routine = {
    id: `custom_${Date.now()}`,
    name: 'Moje vlastní rutina',
    description: 'Vlastní kombinace cvičení',
    exercises: selectedExercises.map((ex, index) => ({
      exercise_id: ex.id,
      order: index,
    })),
    total_duration: totalDuration,
    target_body_parts: Array.from(bodyParts),
    is_pro: false, // Custom routines are free
  };

  console.log(`Created custom routine: ${formatDuration(totalDuration)}`);

  return customRoutine;
}

// ============================================================================
// EXAMPLE 10: Updating user settings
// ============================================================================

async function updateUserSettingsExample() {
  // Load current settings
  const settings = await loadUserSettings();

  if (settings) {
    // Update individual setting
    await updateUserSetting('office_mode', true);
    await updateUserSetting('work_hours_start', '08:00');
    await updateUserSetting('work_hours_end', '16:00');

    console.log('Settings updated');
  } else {
    // First time - create default settings
    const defaultSettings: UserSettings = {
      work_hours_start: '09:00',
      work_hours_end: '17:00',
      hourly_nudge_enabled: true,
      office_mode: false,
      onboarding_completed: false,
      selected_pain_areas: [],
      is_pro: false,
    };

    await saveUserSettings(defaultSettings);
    console.log('Default settings created');
  }
}

// ============================================================================
// EXAMPLE 11: Exercise timer with progress
// ============================================================================

function exerciseTimerExample(exercise: Exercise) {
  const { updateElapsedTime, elapsed_time } = useAppStore();

  // Timer interval (run every second)
  const interval = setInterval(() => {
    const newElapsed = elapsed_time + 1;
    updateElapsedTime(newElapsed);

    // Calculate progress
    const progress = (newElapsed / exercise.duration_default) * 100;
    console.log(`Progress: ${progress.toFixed(1)}%`);

    // Check if completed
    if (newElapsed >= exercise.duration_default) {
      clearInterval(interval);
      console.log('Exercise completed!');

      // Log completion
      logCompletedExerciseExample(
        exercise.id,
        newElapsed,
        exercise.target_body_part
      );
    }
  }, 1000);

  return interval;
}

// ============================================================================
// Export all examples for reference
// ============================================================================

export {
  loadRemoteConfigExample,
  completeOnboardingExample,
  startWorkoutExample,
  logCompletedExerciseExample,
  displayUserStatsExample,
  getExercisesForPainAreaExample,
  scheduleSmartNotificationExample,
  checkProAccessExample,
  createCustomRoutineExample,
  updateUserSettingsExample,
  exerciseTimerExample,
};
