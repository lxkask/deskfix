# DeskFix Data Relationships

Visual guide to how data flows and relates in the DeskFix app.

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     REMOTE CDN/SERVER                       │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │ exercises.json   │         │  routines.json   │         │
│  │ - 6+ exercises   │         │  - 4+ routines   │         │
│  │ - Czech content  │         │  - Duration calc │         │
│  └──────────────────┘         └──────────────────┘         │
└───────────────────────┬─────────────────────────────────────┘
                        │ Fetch (24h cache)
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                     ASYNCSTORAGE (LOCAL)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  @deskfix:remote_config_cache                        │  │
│  │  - Cached exercises & routines                       │  │
│  │  - Version tracking                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  @deskfix:user_settings                              │  │
│  │  - Work hours: 09:00 - 17:00                         │  │
│  │  - Office mode: true/false                           │  │
│  │  - Selected pain areas: [BodyPart...]               │  │
│  │  - is_pro: true/false                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  @deskfix:notification_state                         │  │
│  │  - last_shown_exercises: ["ex_001", "ex_003"...]    │  │
│  │  - scheduled_notification_ids: [...]                │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ Read/Write
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                  SQLITE DATABASE (LOCAL)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  history_log                                         │  │
│  │  ├─ id: "log_1703..."                               │  │
│  │  ├─ date: "2025-12-24T10:30:00Z"                    │  │
│  │  ├─ exercise_id: "ex_001" (FK to remote)            │  │
│  │  ├─ routine_id: "rt_001" (FK to remote)             │  │
│  │  ├─ completed: true                                 │  │
│  │  ├─ duration_actual: 65 (seconds)                   │  │
│  │  ├─ body_part: "neck"                               │  │
│  │  ├─ pain_level_before: 7                            │  │
│  │  └─ pain_level_after: 4                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  user_stats (aggregated from history_log)           │  │
│  │  ├─ total_exercises_completed: 142                  │  │
│  │  ├─ total_routines_completed: 38                    │  │
│  │  ├─ total_time_exercised: 8520 (seconds)            │  │
│  │  ├─ current_streak: 7 (days)                        │  │
│  │  ├─ longest_streak: 14 (days)                       │  │
│  │  ├─ most_worked_body_part: "neck"                   │  │
│  │  └─ body_part_counts: {"neck": 45, "shoulders": 38} │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ Query
                        ↓
┌─────────────────────────────────────────────────────────────┐
│               ZUSTAND STORE (IN-MEMORY STATE)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Active Workout Session                              │  │
│  │  ├─ current_routine: Routine | null                  │  │
│  │  ├─ current_exercise: Exercise | null                │  │
│  │  ├─ current_exercise_index: 0                        │  │
│  │  ├─ is_playing: true                                 │  │
│  │  ├─ elapsed_time: 23 (seconds)                       │  │
│  │  ├─ is_paused: false                                 │  │
│  │  └─ routine_progress: 35 (%)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Actions: startRoutine, pausePlayback, nextExercise...      │
└───────────────────────┬─────────────────────────────────────┘
                        │ Render
                        ↓
                  ┌─────────────┐
                  │  REACT UI   │
                  └─────────────┘
```

## Entity Relationships

```
┌────────────────┐
│   Exercise     │
│  (Remote JSON) │
├────────────────┤
│ * id           │◄────────────┐
│   name         │             │
│   description  │             │ Reference
│   video_url    │             │
│   duration     │             │
│   body_part    │             │
│   tags[]       │             │
│   difficulty   │             │
└────────────────┘             │
                               │
                               │
┌────────────────┐             │
│    Routine     │             │
│  (Remote JSON) │             │
├────────────────┤             │
│ * id           │             │
│   name         │             │
│   description  │             │
│   exercises[]  ├─────────────┘
│   duration     │   RoutineExercise {
│   body_parts[] │     exercise_id,
│   is_pro       │     order,
│   frequency    │     duration_override?
└────────────────┘   }
        ▲
        │
        │ routine_id
        │
┌────────────────┐             ┌────────────────┐
│  HistoryLog    │             │  UserSettings  │
│   (SQLite)     │             │ (AsyncStorage) │
├────────────────┤             ├────────────────┤
│ * id           │             │   work_hours   │
│   date         │             │   office_mode  │
│   exercise_id  │─────────┐   │   nudge_on     │
│   routine_id   │         │   │   pain_areas[] │◄─┐
│   completed    │         │   │   is_pro       │  │
│   duration     │         │   │   language     │  │
│   body_part    │─────┐   │   └────────────────┘  │
│   pain_before  │     │   │                       │
│   pain_after   │     │   │                       │
└────────────────┘     │   │   ┌────────────────┐  │
                       │   │   │   BodyPart     │  │
                       │   │   │    (Enum)      │  │
                       │   │   ├────────────────┤  │
                       │   └───┤  neck          │  │
                       │       │  shoulders     │  │
                       └───────┤  upper_back    │──┘
                               │  lower_back    │
                               │  wrists        │
                               │  hips          │
                               │  eyes          │
                               └────────────────┘

┌────────────────┐
│  UserStats     │
│   (SQLite)     │
├────────────────┤   Calculated from HistoryLog:
│   total_ex     │   ← COUNT(exercise_id)
│   total_rt     │   ← COUNT(routine_id)
│   total_time   │   ← SUM(duration_actual)
│   streak       │   ← Date analysis
│   most_worked  │   ← MAX(body_part_counts)
│   body_counts  │   ← GROUP BY body_part
└────────────────┘

┌────────────────┐
│ NotifState     │
│ (AsyncStorage) │
├────────────────┤
│ last_shown[]   │   Rotation logic:
│ scheduled_ids[]│   - Track last 10 exercises
│ last_time      │   - Avoid repetition
│ daily_count    │   - Schedule reminders
└────────────────┘
```

## Data Dependencies

```
User Opens App
    │
    ├─► Load AsyncStorage
    │   ├─► user_settings
    │   ├─► notification_state
    │   └─► remote_config_cache (if exists)
    │
    ├─► Check cache staleness
    │   └─► If stale: Fetch from CDN
    │       └─► Update cache
    │
    └─► Initialize SQLite
        ├─► Create tables if needed
        └─► Load user_stats

User Selects Routine
    │
    ├─► Check is_pro && !user.is_pro
    │   ├─► YES: Show paywall
    │   └─► NO: Continue
    │
    ├─► Load exercises for routine
    │   └─► Apply duration_override if set
    │
    └─► Start Zustand session
        ├─► current_routine = routine
        ├─► current_exercise_index = 0
        ├─► is_playing = true
        └─► elapsed_time = 0

User Completes Exercise
    │
    ├─► Create HistoryLog entry
    │   ├─► id = generateHistoryLogId()
    │   ├─► date = now()
    │   ├─► exercise_id or routine_id
    │   ├─► duration_actual
    │   └─► body_part
    │
    ├─► Save to SQLite
    │
    ├─► Update UserStats (aggregated)
    │   ├─► Increment totals
    │   ├─► Recalculate streak
    │   └─► Update body_part_counts
    │
    └─► Update NotificationState
        └─► Add to last_shown_exercises[]

Notification Trigger
    │
    ├─► Check user_settings
    │   ├─► hourly_nudge_enabled?
    │   └─► isWithinWorkHours?
    │
    ├─► Load notification_state
    │   └─► Get last_shown_exercises[]
    │
    ├─► Filter available exercises
    │   ├─► Not in last_shown_exercises
    │   ├─► Match pain_areas
    │   └─► Random selection
    │
    └─► Schedule notification
        ├─► Title: "Čas na protažení!"
        ├─► Body: exercise.name
        └─► Silent if office_mode
```

## Storage Size Estimates

```
AsyncStorage (Lightweight):
├─ user_settings:        ~1 KB
├─ notification_state:   ~1 KB
└─ remote_config_cache:  ~50-100 KB (6 exercises + 4 routines)
   TOTAL: ~102 KB

SQLite (Grows over time):
├─ history_log:          ~200 bytes per entry
│  └─ 1 year @ 2/day:    ~146 KB
└─ user_stats:           ~1 KB (single row)
   TOTAL (1 year): ~147 KB

Remote JSON (CDN):
├─ exercises.json:       ~30-50 KB (depends on # of exercises)
└─ routines.json:        ~20-30 KB (depends on # of routines)
   TOTAL: ~80 KB (before compression)

In-Memory (Zustand):
└─ AppState:             ~1 KB (active session only)
```

## Type Hierarchy

```
RemoteConfig
├─ version: string
├─ last_updated: string
├─ exercises: Exercise[]
│  └─ Exercise
│     ├─ id: string
│     ├─ name: string (CS)
│     ├─ description: string (CS)
│     ├─ video_url: string
│     ├─ duration_default: number
│     ├─ target_body_part: BodyPart
│     ├─ secondary_body_parts?: BodyPart[]
│     ├─ tags: ExerciseTag[]
│     ├─ difficulty?: Difficulty
│     ├─ thumbnail_url?: string
│     └─ repetitions?: number
│
└─ routines: Routine[]
   └─ Routine
      ├─ id: string
      ├─ name: string (CS)
      ├─ description: string (CS)
      ├─ exercises: RoutineExercise[]
      │  └─ RoutineExercise
      │     ├─ exercise_id: string → Exercise.id
      │     ├─ order: number
      │     └─ duration_override?: number
      ├─ total_duration: number
      ├─ target_body_parts: BodyPart[]
      ├─ is_pro: boolean
      ├─ thumbnail_url?: string
      └─ recommended_frequency?: string

Enums:
├─ BodyPart
│  ├─ Neck = 'neck'
│  ├─ Shoulders = 'shoulders'
│  ├─ UpperBack = 'upper_back'
│  ├─ LowerBack = 'lower_back'
│  ├─ Wrists = 'wrists'
│  ├─ Hips = 'hips'
│  └─ Eyes = 'eyes'
│
└─ Difficulty
   ├─ Beginner = 'beginner'
   ├─ Intermediate = 'intermediate'
   └─ Advanced = 'advanced'
```

## Data Validation Flow

```
1. Remote Config Fetch
   ├─ validateRemoteConfig(config)
   ├─ Check version field
   ├─ Check last_updated field
   ├─ Validate exercises[] structure
   ├─ Validate routines[] structure
   └─ Verify exercise references in routines

2. Before Starting Routine
   ├─ Check routine.is_pro
   ├─ Verify user.is_pro status
   ├─ Validate all exercise_ids exist
   └─ Calculate total_duration

3. Before Logging History
   ├─ Validate HistoryLog structure
   ├─ Check exercise_id OR routine_id exists
   ├─ Validate body_part is valid enum
   └─ Ensure duration_actual > 0

4. Before Saving Settings
   ├─ Validate work_hours format (HH:MM)
   ├─ Check work_hours_start < work_hours_end
   ├─ Validate selected_pain_areas are valid BodyPart
   └─ Serialize to JSON
```

---

This visualization helps understand:
- How data flows between storage layers
- Relationships between entities
- Dependencies and references
- Storage optimization
- Validation points
