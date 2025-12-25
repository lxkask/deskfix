# DeskFix Data Model - Quick Reference

A quick cheat sheet for working with DeskFix data types.

## Import Statements

```typescript
// Core types
import {
  Exercise,
  Routine,
  BodyPart,
  UserSettings,
  HistoryLog,
  NotificationState,
  Difficulty,
} from './types';

// Helper functions
import {
  calculateRoutineDuration,
  filterExercisesByBodyPart,
  formatDuration,
  getRecommendedExercises,
} from './types/helpers';

// Storage utilities
import {
  saveUserSettings,
  loadUserSettings,
  updateUserSetting,
} from './types/storage';

// Zustand store
import { useAppStore } from './types/store';
```

## Common Patterns

### 1. Load Remote Config

```typescript
const config = await loadCachedRemoteConfig();
const exercises = config.exercises;
const routines = config.routines;
```

### 2. Filter Exercises

```typescript
// By body part
const neckExercises = filterExercisesByBodyPart(exercises, BodyPart.Neck);

// By difficulty
const beginnerExercises = exercises.filter(
  ex => ex.difficulty === Difficulty.Beginner
);

// By tag
const officeExercises = exercises.filter(
  ex => ex.tags.includes('office-friendly')
);
```

### 3. Start Workout

```typescript
const { startRoutine, startExercise } = useAppStore();

// Start routine
startRoutine(selectedRoutine);

// Or start single exercise
startExercise(selectedExercise);
```

### 4. Control Playback

```typescript
const {
  pausePlayback,
  resumePlayback,
  nextExercise,
  stopPlayback,
} = useAppStore();

pausePlayback();      // Pause
resumePlayback();     // Resume
nextExercise();       // Next exercise in routine
stopPlayback();       // Stop completely
```

### 5. Save History

```typescript
const log: HistoryLog = {
  id: generateHistoryLogId(),
  date: new Date().toISOString(),
  exercise_id: 'ex_001',
  completed: true,
  duration_actual: 65,
  body_part: BodyPart.Neck,
};

// Save to your SQLite database
```

### 6. User Settings

```typescript
// Load
const settings = await loadUserSettings();

// Update single field
await updateUserSetting('office_mode', true);

// Save entire object
await saveUserSettings(newSettings);
```

### 7. Format Time

```typescript
formatDuration(90);   // "1 min 30 s"
formatDuration(120);  // "2 min"
formatDuration(45);   // "45 s"
```

### 8. Czech Body Part Names

```typescript
getBodyPartDisplayName(BodyPart.Neck);       // "Krk"
getBodyPartDisplayName(BodyPart.Shoulders);  // "Ramena"
getBodyPartDisplayName(BodyPart.UpperBack);  // "Horní část zad"
```

### 9. Check Pro Access

```typescript
if (routine.is_pro && !settings?.is_pro) {
  // Show paywall
} else {
  // Allow access
}
```

### 10. Work Hours Check

```typescript
const shouldNotify = isWithinWorkHours(
  settings.work_hours_start,
  settings.work_hours_end
);
```

## Data Flow

```
Remote JSON (CDN)
    ↓
AsyncStorage Cache ──→ App State (Zustand)
    ↓                      ↓
SQLite (History) ←────── User Actions
```

## Storage Locations

| Data Type | Storage | Key/Table |
|-----------|---------|-----------|
| Exercises | AsyncStorage (cached) | `@deskfix:remote_config_cache` |
| Routines | AsyncStorage (cached) | `@deskfix:remote_config_cache` |
| User Settings | AsyncStorage | `@deskfix:user_settings` |
| Notification State | AsyncStorage | `@deskfix:notification_state` |
| History Logs | SQLite | `history_log` table |
| User Stats | SQLite | `user_stats` table |
| Active Session | Zustand (memory) | N/A |

## Body Part Enum Values

```typescript
BodyPart.Neck         // 'neck'
BodyPart.Shoulders    // 'shoulders'
BodyPart.UpperBack    // 'upper_back'
BodyPart.LowerBack    // 'lower_back'
BodyPart.Wrists       // 'wrists'
BodyPart.Hips         // 'hips'
BodyPart.Eyes         // 'eyes'
```

## Difficulty Enum Values

```typescript
Difficulty.Beginner      // 'beginner'
Difficulty.Intermediate  // 'intermediate'
Difficulty.Advanced      // 'advanced'
```

## Exercise Tags

- `'office-friendly'` - Can be done in office
- `'standing'` - Requires standing
- `'sitting'` - Can be done sitting
- `'desk-based'` - Uses desk/chair
- `'stretching'` - Stretching exercise
- `'strengthening'` - Strengthening exercise
- `'relaxation'` - Relaxation/rest exercise

## Sample Exercise Object

```typescript
{
  id: "ex_001",
  name: "Protažení šíje do stran",
  description: "Skvělé cvičení pro uvolnění...",
  video_url: "https://storage.deskfix.app/videos/...",
  duration_default: 60,
  target_body_part: "neck",
  tags: ["office-friendly", "sitting", "stretching"],
  difficulty: "beginner",
  repetitions: 3
}
```

## Sample Routine Object

```typescript
{
  id: "rt_001",
  name: "Rychlá kancelářská pauza",
  description: "5minutová rutina...",
  exercises: [
    { exercise_id: "ex_001", order: 0, duration_override: 45 },
    { exercise_id: "ex_002", order: 1 }
  ],
  total_duration: 200,
  target_body_parts: ["neck", "shoulders"],
  is_pro: false,
  recommended_frequency: "Každou hodinu"
}
```

## Zustand Store State

```typescript
const {
  // State
  current_routine,        // Active routine or null
  current_exercise,       // Active exercise or null
  current_exercise_index, // Index in routine
  is_playing,             // Is actively playing
  elapsed_time,           // Seconds elapsed
  is_paused,              // Is paused
  routine_progress,       // 0-100

  // Actions
  startRoutine,
  startExercise,
  pausePlayback,
  resumePlayback,
  stopPlayback,
  nextExercise,
  previousExercise,
  updateElapsedTime,
  resetState,
} = useAppStore();
```

## Database Schema Quick Ref

```sql
-- User Settings (single row, id = 1)
CREATE TABLE user_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  work_hours_start TEXT DEFAULT '09:00',
  work_hours_end TEXT DEFAULT '17:00',
  hourly_nudge_enabled INTEGER DEFAULT 1,
  office_mode INTEGER DEFAULT 0,
  onboarding_completed INTEGER DEFAULT 0,
  selected_pain_areas TEXT DEFAULT '[]',
  is_pro INTEGER DEFAULT 0
);

-- History Log (many rows)
CREATE TABLE history_log (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  exercise_id TEXT,
  routine_id TEXT,
  completed INTEGER DEFAULT 1,
  duration_actual INTEGER NOT NULL,
  body_part TEXT NOT NULL,
  pain_level_before INTEGER,
  pain_level_after INTEGER,
  notes TEXT
);

-- User Stats (single row, id = 1)
CREATE TABLE user_stats (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total_exercises_completed INTEGER DEFAULT 0,
  total_routines_completed INTEGER DEFAULT 0,
  total_time_exercised INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  most_worked_body_part TEXT,
  last_exercise_date TEXT,
  body_part_counts TEXT DEFAULT '{}'
);
```

## Helper Function Quick Ref

| Function | Purpose |
|----------|---------|
| `calculateRoutineDuration()` | Get total routine duration |
| `getRoutineExercises()` | Get exercises in order with durations |
| `filterExercisesByBodyPart()` | Filter exercises by body part |
| `filterRoutinesByBodyPart()` | Filter routines by body part |
| `getFreeRoutines()` | Get non-Pro routines |
| `calculateUserStats()` | Calculate stats from history |
| `formatDuration()` | Format seconds to readable string |
| `generateHistoryLogId()` | Generate unique log ID |
| `isWithinWorkHours()` | Check if in work hours |
| `getRecommendedExercises()` | Get exercises for pain areas |
| `validateRemoteConfig()` | Validate config structure |
| `getBodyPartDisplayName()` | Get Czech body part name |

## TypeScript Files

```
src/types/
├── index.ts          ← Core types (Exercise, Routine, etc.)
├── store.ts          ← Zustand store implementation
├── database.ts       ← SQLite schemas
├── storage.ts        ← AsyncStorage utilities
├── helpers.ts        ← Helper functions
└── examples.ts       ← Usage examples
```

## JSON Files

```
src/data/
├── exercises.json    ← 6 sample exercises (Czech)
└── routines.json     ← 4 sample routines (Czech)
```

---

For complete documentation, see `DATA_MODEL.md`.
For detailed examples, see `src/types/examples.ts`.
