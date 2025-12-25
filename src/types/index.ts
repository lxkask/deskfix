/**
 * DeskFix - Mobile Physiotherapy App
 * Data Model Type Definitions
 */

/**
 * Enum for body parts targeted by exercises
 */
export enum BodyPart {
  Neck = 'neck',
  Shoulders = 'shoulders',
  UpperBack = 'upper_back',
  LowerBack = 'lower_back',
  Wrists = 'wrists',
  Hips = 'hips',
  Eyes = 'eyes',
}

/**
 * Difficulty levels for exercises
 */
export enum Difficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

/**
 * Tags for exercise categorization
 */
export type ExerciseTag =
  | 'office-friendly'
  | 'standing'
  | 'sitting'
  | 'desk-based'
  | 'stretching'
  | 'strengthening'
  | 'relaxation';

/**
 * Exercise interface
 * Represents individual physiotherapy exercises
 * Stored in remote JSON config for OTA updates
 */
export interface Exercise {
  /**
   * Unique identifier for the exercise
   */
  id: string;

  /**
   * Exercise name in Czech language (CS)
   */
  name: string;

  /**
   * Detailed description of the exercise in Czech
   */
  description: string;

  /**
   * URL to instructional video
   */
  video_url: string;

  /**
   * Default duration in seconds
   */
  duration_default: number;

  /**
   * Primary body part targeted by this exercise
   */
  target_body_part: BodyPart;

  /**
   * Additional body parts that benefit from this exercise (optional)
   */
  secondary_body_parts?: BodyPart[];

  /**
   * Tags for filtering and categorization
   */
  tags: ExerciseTag[];

  /**
   * Difficulty level (optional, defaults to beginner)
   */
  difficulty?: Difficulty;

  /**
   * Thumbnail image URL (optional)
   */
  thumbnail_url?: string;

  /**
   * Number of repetitions if applicable (optional)
   */
  repetitions?: number;
}

/**
 * Exercise reference in a routine
 * Links exercises with optional duration override
 */
export interface RoutineExercise {
  /**
   * Reference to exercise ID
   */
  exercise_id: string;

  /**
   * Custom duration for this exercise in the routine (seconds)
   * If not specified, uses exercise's duration_default
   */
  duration_override?: number;

  /**
   * Order in the routine sequence (0-based index)
   */
  order: number;
}

/**
 * Routine interface
 * Represents a curated sequence of exercises
 * Stored in remote JSON config for OTA updates
 */
export interface Routine {
  /**
   * Unique identifier for the routine
   */
  id: string;

  /**
   * Routine name in Czech
   */
  name: string;

  /**
   * Description of the routine and its benefits in Czech
   */
  description: string;

  /**
   * Ordered list of exercises in this routine
   */
  exercises: RoutineExercise[];

  /**
   * Total duration in seconds (calculated from exercises)
   */
  total_duration: number;

  /**
   * Body parts targeted by this routine
   */
  target_body_parts: BodyPart[];

  /**
   * Whether this routine requires Pro subscription
   */
  is_pro: boolean;

  /**
   * Thumbnail image URL (optional)
   */
  thumbnail_url?: string;

  /**
   * Recommended frequency (e.g., "2x denně", "každou hodinu")
   */
  recommended_frequency?: string;
}

/**
 * User settings interface
 * Stored in SQLite/AsyncStorage
 */
export interface UserSettings {
  /**
   * Work day start time (24-hour format, e.g., "09:00")
   */
  work_hours_start: string;

  /**
   * Work day end time (24-hour format, e.g., "17:00")
   */
  work_hours_end: string;

  /**
   * Enable hourly nudge notifications during work hours
   */
  hourly_nudge_enabled: boolean;

  /**
   * Office mode - silent notifications without sound
   */
  office_mode: boolean;

  /**
   * Whether user has completed onboarding
   */
  onboarding_completed: boolean;

  /**
   * User-selected pain areas from onboarding
   */
  selected_pain_areas: BodyPart[];

  /**
   * Whether user has Pro subscription
   */
  is_pro: boolean;

  /**
   * User's preferred language (default: 'cs')
   */
  language?: string;

  /**
   * Notification sound enabled (separate from office_mode)
   */
  notification_sound_enabled?: boolean;

  /**
   * Daily reminder time (e.g., "08:00")
   */
  daily_reminder_time?: string;
}

/**
 * History log entry interface
 * Tracks completed exercises and routines
 * Stored in SQLite
 */
export interface HistoryLog {
  /**
   * Unique identifier for this log entry
   */
  id: string;

  /**
   * ISO 8601 timestamp of completion
   */
  date: string;

  /**
   * Reference to exercise ID (if single exercise was completed)
   */
  exercise_id?: string;

  /**
   * Reference to routine ID (if routine was completed)
   */
  routine_id?: string;

  /**
   * Whether the exercise/routine was completed or skipped
   */
  completed: boolean;

  /**
   * Actual duration spent (in seconds)
   */
  duration_actual: number;

  /**
   * Primary body part that was worked on
   */
  body_part: BodyPart;

  /**
   * User's pain level before exercise (1-10 scale, optional)
   */
  pain_level_before?: number;

  /**
   * User's pain level after exercise (1-10 scale, optional)
   */
  pain_level_after?: number;

  /**
   * Additional notes from user (optional)
   */
  notes?: string;
}

/**
 * Notification state interface
 * Manages notification scheduling and history
 * Stored in AsyncStorage
 */
export interface NotificationState {
  /**
   * IDs of recently shown exercises (for rotation)
   * Prevents showing same exercises repeatedly
   */
  last_shown_exercises: string[];

  /**
   * Active scheduled notification IDs
   * Used to cancel/update notifications
   */
  scheduled_notification_ids: string[];

  /**
   * Last notification shown timestamp (ISO 8601)
   */
  last_notification_time?: string;

  /**
   * Number of notifications shown today
   */
  daily_notification_count?: number;
}

/**
 * App state interface for Zustand store
 * Manages active workout session state
 */
export interface AppState {
  /**
   * Currently active routine (null if not in routine mode)
   */
  current_routine: Routine | null;

  /**
   * Currently active standalone exercise (null if in routine mode)
   */
  current_exercise: Exercise | null;

  /**
   * Current exercise index in the routine (0-based)
   */
  current_exercise_index: number;

  /**
   * Whether exercise/routine is actively playing
   */
  is_playing: boolean;

  /**
   * Elapsed time in current exercise (seconds)
   */
  elapsed_time: number;

  /**
   * Whether playback is paused
   */
  is_paused: boolean;

  /**
   * Total routine progress (0-1 for progress bar)
   */
  routine_progress?: number;

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
 * Statistics interface
 * Aggregated user progress data
 */
export interface UserStats {
  /**
   * Total exercises completed
   */
  total_exercises_completed: number;

  /**
   * Total routines completed
   */
  total_routines_completed: number;

  /**
   * Total time spent exercising (seconds)
   */
  total_time_exercised: number;

  /**
   * Current streak (consecutive days)
   */
  current_streak: number;

  /**
   * Longest streak achieved
   */
  longest_streak: number;

  /**
   * Most worked body part
   */
  most_worked_body_part?: BodyPart;

  /**
   * Last exercise date (ISO 8601)
   */
  last_exercise_date?: string;

  /**
   * Breakdown by body part
   */
  body_part_counts: Record<BodyPart, number>;
}

/**
 * Remote config structure
 * Container for exercises and routines loaded from JSON
 */
export interface RemoteConfig {
  /**
   * App content version
   */
  version: string;

  /**
   * Last updated timestamp (ISO 8601)
   */
  last_updated: string;

  /**
   * All available exercises
   */
  exercises: Exercise[];

  /**
   * All available routines
   */
  routines: Routine[];

  /**
   * Minimum app version required for this config
   */
  min_app_version?: string;
}
