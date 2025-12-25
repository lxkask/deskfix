# DeskFix - Mobile Physiotherapy App

A mobile app for office workers to prevent and alleviate desk-related pain through guided physiotherapy exercises.

## Project Structure

```
DeskFix/
├── src/
│   ├── types/
│   │   ├── index.ts          # Core type definitions
│   │   ├── store.ts          # Zustand store implementation
│   │   ├── database.ts       # SQLite schemas
│   │   ├── storage.ts        # AsyncStorage utilities
│   │   ├── helpers.ts        # Helper functions
│   │   └── examples.ts       # Usage examples
│   └── data/
│       ├── exercises.json    # Exercise content (6 samples)
│       └── routines.json     # Routine content (4 samples)
├── DATA_MODEL.md             # Complete documentation
├── QUICK_REFERENCE.md        # Quick reference guide
├── tsconfig.json             # TypeScript configuration
└── package.json.example      # Example dependencies

```

## Data Model Overview

### Remote Config (JSON)
- **Exercises**: Individual physiotherapy exercises with videos
- **Routines**: Curated sequences of exercises
- Stored remotely for OTA updates
- Cached locally in AsyncStorage

### Local Storage

#### AsyncStorage
- User settings (work hours, notifications, preferences)
- Notification state (rotation, scheduling)
- Remote config cache

#### SQLite Database
- History logs (completed exercises/routines)
- User statistics (streaks, totals, progress)

#### Zustand Store (In-Memory)
- Active workout session state
- Playback controls
- Real-time UI state

## Key Features

### Exercise System
- 7 body part targets: neck, shoulders, upper_back, lower_back, wrists, hips, eyes
- Difficulty levels: beginner, intermediate, advanced
- Tags: office-friendly, standing, sitting, etc.
- Video instructions with thumbnails
- Customizable durations

### Routine System
- Pre-built exercise sequences
- Pro/Free tier support
- Auto-calculated total duration
- Multiple body part targeting
- Recommended frequency

### User Features
- Onboarding with pain area selection
- Customizable work hours
- Office mode (silent notifications)
- Hourly nudge reminders
- Progress tracking and statistics
- Streak counting

### Smart Notifications
- Exercise rotation (avoid repetition)
- Work hours awareness
- Pain area targeting
- Configurable frequency

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Import Types

```typescript
import {
  Exercise,
  Routine,
  BodyPart,
  UserSettings,
} from './src/types';
```

### 3. Initialize Database

```typescript
import { INIT_QUERIES } from './src/types/database';

// Run all initialization queries
for (const query of INIT_QUERIES) {
  await db.execAsync(query);
}
```

### 4. Load Remote Config

```typescript
import { loadCachedRemoteConfig } from './src/types/storage';

const config = await loadCachedRemoteConfig();
const exercises = config.exercises;
const routines = config.routines;
```

### 5. Set Up Zustand Store

```typescript
import { useAppStore } from './src/types/store';

function WorkoutScreen() {
  const { startRoutine, is_playing } = useAppStore();

  return (
    // Your component
  );
}
```

## Sample Data

### Exercises (6 Czech exercises)
1. Protažení šíje do stran (Neck side stretch)
2. Krouživé pohyby rameny (Shoulder circles)
3. Protažení zápěstí (Wrist stretch)
4. Protažení dolní části zad (Lower back stretch)
5. Pravidlo 20-20-20 pro oči (20-20-20 eye rule)
6. Otevírání hrudníku vstoje (Standing chest opener)

### Routines (4 Czech routines)
1. Rychlá kancelářská pauza (Quick office break - 3.3 min)
2. Kompletní protažení horní části těla (Full upper body - 6.3 min, Pro)
3. SOS pro bolavá záda (Back pain SOS - 5 min)
4. Ochrana zraku a prevence únavy (Eye protection - 3 min)

## Documentation

### Complete Documentation
See [DATA_MODEL.md](./DATA_MODEL.md) for:
- Detailed type definitions
- Database schemas
- Storage strategies
- Helper functions
- Best practices

### Quick Reference
See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for:
- Common patterns
- Code snippets
- Function reference
- Data flow diagrams

### Usage Examples
See [src/types/examples.ts](./src/types/examples.ts) for:
- 11 complete usage examples
- Remote config loading
- Onboarding flow
- Workout sessions
- Statistics calculation
- Notification scheduling

## TypeScript

All code is fully typed with TypeScript for:
- Compile-time error checking
- IDE autocomplete
- Type safety
- Better refactoring

### Type-Checking

```bash
npm run type-check
```

## Core Technologies

- **TypeScript** - Type-safe development
- **Zustand** - State management
- **AsyncStorage** - Key-value storage
- **expo-sqlite** - Local database
- **expo-notifications** - Smart reminders

## Architecture Highlights

### Remote Config Pattern
Exercise and routine content stored as JSON files:
- Enables instant content updates (no app store approval)
- Version controlled with `version` field
- Locally cached with staleness checking
- Fallback to cached version on network errors

### Data Separation
- **Content** (exercises/routines) → Remote JSON
- **User data** (settings/history) → SQLite/AsyncStorage
- **Session state** (active workout) → Zustand

### Offline-First
- All content cached locally
- Works without internet connection
- Periodic cache refresh (24h default)
- Graceful degradation

## Key Helper Functions

```typescript
// Calculate routine duration
const duration = calculateRoutineDuration(routine, exercises);

// Filter by body part
const neckExercises = filterExercisesByBodyPart(exercises, BodyPart.Neck);

// Format duration
formatDuration(90); // "1 min 30 s"

// Get recommendations
const recommended = getRecommendedExercises(exercises, painAreas, 5);

// Calculate statistics
const stats = calculateUserStats(historyLogs);

// Czech body part names
getBodyPartDisplayName(BodyPart.Neck); // "Krk"
```

## Next Steps

1. **Implement UI Components**
   - Exercise player with video
   - Routine selector
   - Progress tracker
   - Settings screen

2. **Set Up Remote Config**
   - Upload JSON to CDN
   - Implement fetch logic
   - Add version checking

3. **Implement Database Layer**
   - SQLite connection
   - CRUD operations
   - Statistics queries

4. **Add Notifications**
   - Schedule hourly nudges
   - Implement rotation logic
   - Handle user interactions

5. **Integrate Payment**
   - RevenueCat or similar
   - Pro feature gating
   - Subscription management

## License

Proprietary - DeskFix Mobile App

---

Built with Claude Code by Anthropic
