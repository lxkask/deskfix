/**
 * SQLite Database Schema Definitions
 * For local storage of user data, settings, and history
 */

/**
 * SQL Schema for UserSettings table
 */
export const USER_SETTINGS_TABLE = `
CREATE TABLE IF NOT EXISTS user_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  work_hours_start TEXT NOT NULL DEFAULT '09:00',
  work_hours_end TEXT NOT NULL DEFAULT '17:00',
  hourly_nudge_enabled INTEGER NOT NULL DEFAULT 1,
  office_mode INTEGER NOT NULL DEFAULT 0,
  onboarding_completed INTEGER NOT NULL DEFAULT 0,
  selected_pain_areas TEXT NOT NULL DEFAULT '[]',
  is_pro INTEGER NOT NULL DEFAULT 0,
  language TEXT DEFAULT 'cs',
  notification_sound_enabled INTEGER DEFAULT 1,
  daily_reminder_time TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

/**
 * SQL Schema for HistoryLog table
 */
export const HISTORY_LOG_TABLE = `
CREATE TABLE IF NOT EXISTS history_log (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  exercise_id TEXT,
  routine_id TEXT,
  completed INTEGER NOT NULL DEFAULT 1,
  duration_actual INTEGER NOT NULL,
  body_part TEXT NOT NULL,
  pain_level_before INTEGER,
  pain_level_after INTEGER,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_history_log_date ON history_log(date DESC);
CREATE INDEX IF NOT EXISTS idx_history_log_exercise ON history_log(exercise_id);
CREATE INDEX IF NOT EXISTS idx_history_log_routine ON history_log(routine_id);
CREATE INDEX IF NOT EXISTS idx_history_log_body_part ON history_log(body_part);
`;

/**
 * SQL Schema for UserStats table (cached aggregated data)
 */
export const USER_STATS_TABLE = `
CREATE TABLE IF NOT EXISTS user_stats (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total_exercises_completed INTEGER NOT NULL DEFAULT 0,
  total_routines_completed INTEGER NOT NULL DEFAULT 0,
  total_time_exercised INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  most_worked_body_part TEXT,
  last_exercise_date TEXT,
  body_part_counts TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

/**
 * Database initialization queries
 */
export const INIT_QUERIES = [
  USER_SETTINGS_TABLE,
  HISTORY_LOG_TABLE,
  USER_STATS_TABLE,
];

/**
 * Default user settings values
 */
export const DEFAULT_USER_SETTINGS = {
  work_hours_start: '09:00',
  work_hours_end: '17:00',
  hourly_nudge_enabled: true,
  office_mode: false,
  onboarding_completed: false,
  selected_pain_areas: [],
  is_pro: false,
  language: 'cs',
  notification_sound_enabled: true,
};
