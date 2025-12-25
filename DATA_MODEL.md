# DeskFix Data Model Documentation

Complete TypeScript data model for the DeskFix mobile physiotherapy app.

## Architecture Overview

### Storage Strategy

1. **Remote JSON Config** (exercises.json, routines.json)
   - Exercise and routine content
   - Enables OTA updates without app store deployment
   - Cached locally in AsyncStorage
   - Version controlled with `version` field

2. **SQLite Database**
   - User history logs
   - Aggregated statistics
   - Heavy data queries and analytics

3. **AsyncStorage**
   - User settings
   - Notification state
   - Remote config cache
   - Lightweight key-value data

4. **Zustand Store**
   - In-memory app state
   - Active workout session
   - UI state management

---

## Core Data Types

### BodyPart Enum

Represents body parts targeted by exercises:

```typescript
enum BodyPart {
  Neck = 'neck',
  Shoulders = 'shoulders',
  UpperBack = 'upper_back',
  LowerBack = 'lower_back',
  Wrists = 'wrists',
  Hips = 'hips',
  Eyes = 'eyes',
}
```

Czech display names:
- `neck` → "Krk"
- `shoulders` → "Ramena"
- `upper_back` → "Horní část zad"
- `lower_back` → "Dolní část zad"
- `wrists` → "Zápěstí"
- `hips` → "Boky"
- `eyes` → "Oči"

### Difficulty Enum

```typescript
enum Difficulty {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}
```

### Exercise Tags

```typescript
type ExerciseTag =
  | 'office-friendly'  // Can be done in office
  | 'standing'         // Requires standing
  | 'sitting'          // Can be done sitting
  | 'desk-based'       // Uses desk/chair
  | 'stretching'       // Stretching exercise
  | 'strengthening'    // Strengthening exercise
  | 'relaxation';      // Relaxation/rest exercise
```

---

## Remote Config Types (JSON)

### Exercise

Stored in `exercises.json` for OTA updates.

```typescript
interface Exercise {
  id: string;                          // Unique ID (e.g., "ex_001")
  name: string;                        // Name in Czech
  description: string;                 // Detailed description in Czech
  video_url: string;                   // Video instruction URL
  duration_default: number;            // Default duration in seconds
  target_body_part: BodyPart;          // Primary target
  secondary_body_parts?: BodyPart[];   // Additional targets
  tags: ExerciseTag[];                 // Category tags
  difficulty?: Difficulty;             // Optional difficulty level
  thumbnail_url?: string;              // Preview image
  repetitions?: number;                // Number of reps if applicable
}
```

**Example:**
```json
{
  "id": "ex_001",
  "name": "Protažení šíje do stran",
  "description": "Skvělé cvičení pro uvolnění napětí...",
  "video_url": "https://storage.deskfix.app/videos/neck-side-stretch.mp4",
  "duration_default": 60,
  "target_body_part": "neck",
  "tags": ["office-friendly", "sitting", "stretching"],
  "difficulty": "beginner",
  "repetitions": 3
}
```

### Routine

Stored in `routines.json` for OTA updates.

```typescript
interface Routine {
  id: string;                          // Unique ID (e.g., "rt_001")
  name: string;                        // Name in Czech
  description: string;                 // Description and benefits
  exercises: RoutineExercise[];        // Ordered exercise list
  total_duration: number;              // Total time in seconds
  target_body_parts: BodyPart[];       // All targeted body parts
  is_pro: boolean;                     // Requires Pro subscription
  thumbnail_url?: string;              // Preview image
  recommended_frequency?: string;      // E.g., "Každou hodinu"
}

interface RoutineExercise {
  exercise_id: string;                 // Reference to Exercise.id
  order: number;                       // 0-based index for ordering
  duration_override?: number;          // Custom duration (seconds)
}
```

**Example:**
```json
{
  "id": "rt_001",
  "name": "Rychlá kancelářská pauza",
  "description": "5minutová rutina zaměřená na...",
  "exercises": [
    {
      "exercise_id": "ex_001",
      "order": 0,
      "duration_override": 45
    },
    {
      "exercise_id": "ex_002",
      "order": 1
    }
  ],
  "total_duration": 200,
  "target_body_parts": ["neck", "shoulders", "wrists"],
  "is_pro": false,
  "recommended_frequency": "Každou hodinu"
}
```

### RemoteConfig

Container for all remote content:

```typescript
interface RemoteConfig {
  version: string;                     // Content version (e.g., "1.0.0")
  last_updated: string;                // ISO 8601 timestamp
  exercises: Exercise[];               // All exercises
  routines: Routine[];                 // All routines
  min_app_version?: string;            // Minimum app version required
}
```

---

## Local Storage Types (SQLite/AsyncStorage)

### UserSettings

Stored in AsyncStorage (key: `@deskfix:user_settings`).

```typescript
interface UserSettings {
  work_hours_start: string;            // "09:00" format
  work_hours_end: string;              // "17:00" format
  hourly_nudge_enabled: boolean;       // Enable hourly reminders
  office_mode: boolean;                // Silent notifications
  onboarding_completed: boolean;       // Onboarding status
  selected_pain_areas: BodyPart[];     // User's pain areas
  is_pro: boolean;                     // Pro subscription status
  language?: string;                   // Default: "cs"
  notification_sound_enabled?: boolean;
  daily_reminder_time?: string;        // "08:00" format
}
```

**SQLite Schema:**
```sql
CREATE TABLE user_settings (
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
```

### HistoryLog

Stored in SQLite for tracking completed exercises/routines.

```typescript
interface HistoryLog {
  id: string;                          // Unique log ID
  date: string;                        // ISO 8601 timestamp
  exercise_id?: string;                // Reference to exercise
  routine_id?: string;                 // Reference to routine
  completed: boolean;                  // Completion status
  duration_actual: number;             // Actual time spent (seconds)
  body_part: BodyPart;                 // Primary body part worked
  pain_level_before?: number;          // 1-10 scale
  pain_level_after?: number;           // 1-10 scale
  notes?: string;                      // User notes
}
```

**SQLite Schema:**
```sql
CREATE TABLE history_log (
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

CREATE INDEX idx_history_log_date ON history_log(date DESC);
CREATE INDEX idx_history_log_exercise ON history_log(exercise_id);
CREATE INDEX idx_history_log_routine ON history_log(routine_id);
```

### NotificationState

Stored in AsyncStorage (key: `@deskfix:notification_state`).

```typescript
interface NotificationState {
  last_shown_exercises: string[];      // Recently shown exercise IDs
  scheduled_notification_ids: string[]; // Active notification IDs
  last_notification_time?: string;     // ISO 8601 timestamp
  daily_notification_count?: number;   // Count for today
}
```

**Usage:**
- `last_shown_exercises`: Prevents repetition by tracking last 10 shown exercises
- `scheduled_notification_ids`: For canceling/updating scheduled notifications

### UserStats

Aggregated statistics stored in SQLite.

```typescript
interface UserStats {
  total_exercises_completed: number;
  total_routines_completed: number;
  total_time_exercised: number;        // In seconds
  current_streak: number;              // Consecutive days
  longest_streak: number;
  most_worked_body_part?: BodyPart;
  last_exercise_date?: string;         // ISO 8601
  body_part_counts: Record<BodyPart, number>;
}
```

**SQLite Schema:**
```sql
CREATE TABLE user_stats (
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
```

---

## App State (Zustand Store)

In-memory state for active workout sessions.

```typescript
interface AppState {
  // State
  current_routine: Routine | null;
  current_exercise: Exercise | null;
  current_exercise_index: number;
  is_playing: boolean;
  elapsed_time: number;
  is_paused: boolean;
  routine_progress: number;            // 0-100

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
```

**Usage:**
```typescript
import { useAppStore } from './types/store';

// In a component
const { current_routine, is_playing, startRoutine } = useAppStore();

// Start a routine
startRoutine(selectedRoutine);
```

---

## File Structure

```
src/
├── types/
│   ├── index.ts          # Core type definitions
│   ├── store.ts          # Zustand store implementation
│   ├── database.ts       # SQLite schemas
│   ├── storage.ts        # AsyncStorage utilities
│   └── helpers.ts        # Helper functions
└── data/
    ├── exercises.json    # Exercise content (remote)
    └── routines.json     # Routine content (remote)
```

---

## Helper Functions

### Calculate Routine Duration

```typescript
import { calculateRoutineDuration } from './types/helpers';

const duration = calculateRoutineDuration(routine, allExercises);
// Returns total duration in seconds
```

### Get Routine Exercises

```typescript
import { getRoutineExercises } from './types/helpers';

const exercises = getRoutineExercises(routine, allExercises);
// Returns: Array<{ exercise: Exercise; duration: number }>
```

### Filter by Body Part

```typescript
import { filterExercisesByBodyPart } from './types/helpers';

const neckExercises = filterExercisesByBodyPart(
  allExercises,
  BodyPart.Neck
);
```

### Calculate Statistics

```typescript
import { calculateUserStats } from './types/helpers';

const stats = calculateUserStats(historyLogs);
// Returns: UserStats object with streaks, totals, etc.
```

### Format Duration

```typescript
import { formatDuration } from './types/helpers';

formatDuration(90);   // "1 min 30 s"
formatDuration(120);  // "2 min"
formatDuration(45);   // "45 s"
```

### Work Hours Check

```typescript
import { isWithinWorkHours } from './types/helpers';

const shouldNotify = isWithinWorkHours("09:00", "17:00");
```

### Storage Operations

```typescript
import {
  saveUserSettings,
  loadUserSettings,
  updateUserSetting,
} from './types/storage';

// Save settings
await saveUserSettings(settings);

// Load settings
const settings = await loadUserSettings();

// Update single setting
await updateUserSetting('office_mode', true);
```

---

## Sample Data

See complete sample data in:
- `src/data/exercises.json` - 6 sample exercises in Czech
- `src/data/routines.json` - 4 sample routines with different durations and targets

---

## Best Practices

### 1. Remote Config Updates

```typescript
import {
  cacheRemoteConfig,
  loadCachedRemoteConfig,
  isRemoteConfigCacheStale,
} from './types/storage';

async function loadContent() {
  // Check if cache is stale
  if (await isRemoteConfigCacheStale(24)) {
    // Fetch fresh from server
    const config = await fetchRemoteConfig();
    await cacheRemoteConfig(config);
    return config;
  }

  // Use cached version
  return await loadCachedRemoteConfig();
}
```

### 2. History Logging

```typescript
import { generateHistoryLogId } from './types/helpers';

const log: HistoryLog = {
  id: generateHistoryLogId(),
  date: new Date().toISOString(),
  exercise_id: 'ex_001',
  completed: true,
  duration_actual: 65,
  body_part: BodyPart.Neck,
};

// Save to SQLite
await saveHistoryLog(log);
```

### 3. Notification Rotation

```typescript
import { addToLastShownExercises } from './types/storage';

// After showing exercise in notification
await addToLastShownExercises(exercise.id);

// When selecting next exercise to show
const state = await loadNotificationState();
const availableExercises = exercises.filter(
  ex => !state.last_shown_exercises.includes(ex.id)
);
```

### 4. Pro Feature Gating

```typescript
const settings = await loadUserSettings();

if (routine.is_pro && !settings?.is_pro) {
  // Show paywall
  showProUpgradeScreen();
} else {
  // Start routine
  startRoutine(routine);
}
```

---

## Type Safety

All types are fully typed with TypeScript for:
- Compile-time error checking
- IDE autocomplete
- Refactoring safety
- JSDoc documentation

Import types:
```typescript
import {
  Exercise,
  Routine,
  BodyPart,
  UserSettings,
  HistoryLog,
  NotificationState,
  AppState,
} from './types';
```

---

## Migration Path

When updating remote config:

1. Increment `version` in JSON files
2. Update `last_updated` timestamp
3. Optionally set `min_app_version` for breaking changes
4. App checks version on fetch and handles migrations

---

Generated with Claude Code for DeskFix mobile app.
