# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DeskFix is a React Native (Expo) mobile app - a "micro-physiotherapist in your pocket" for office workers with sedentary jobs. The app provides quick 3-minute exercise routines for pain relief (neck, back, wrists) that can be done at the office without changing clothes or sweating.

## Current Status (2025-12-25)

**Version:** 1.0.0
**Quality Score:** 7.8/10
**Phases Completed:** 1-4 (Critical fixes, Design System, Features, Production)

### What's Working
- Full app flow: Onboarding → Home → Routine → Player → Completion
- Dark mode with system/manual toggle
- Notification scheduling (Hourly Nudge)
- GDPR compliance (data export/deletion)
- Medical disclaimer (mandatory)
- Secure storage for sensitive data
- Error boundaries
- Performance optimizations (React.memo, useMemo)

### Known Issues (See ROADMAP.md)
1. **Streak tracking broken** - `updateStreak()` never called
2. **Only 10 exercises** - PRD requires 15
3. **IAP not implemented** - Monetization is mock only
4. **Type mismatches** - JSON data vs TypeScript interfaces
5. **Zero test coverage**
6. **Audio service placeholder** - Sounds don't work

## Tech Stack

- **Framework**: React Native with Expo SDK 54 (TypeScript strict)
- **Navigation**: Expo Router v4 (file-based routing)
- **State Management**: Zustand with AsyncStorage persistence
- **UI Components**: Custom (Button, Card, Badge, IconButton, ErrorBoundary)
- **Theme**: Custom ThemeProvider with light/dark/system modes
- **Storage**: expo-secure-store (native), AsyncStorage fallback (web)
- **Notifications**: Expo Notifications
- **Media**: expo-av for video, expo-keep-awake

## Build & Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
npx expo start

# Run on specific platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser

# Type checking (ALWAYS run before committing)
npm run typecheck

# Linting
npm run lint
```

## Project Structure

```
DeskFix/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigator (3 tabs)
│   │   ├── _layout.tsx    # Tab bar config
│   │   ├── index.tsx      # Home (Body Map) - useMemo optimized
│   │   ├── prevention.tsx # Hourly Nudge settings
│   │   └── progress.tsx   # Stats & streaks - useMemo optimized
│   ├── routine/           # Routine stack (modal)
│   │   ├── [id].tsx       # Routine preview
│   │   └── player.tsx     # Active player (fullscreen)
│   ├── _layout.tsx        # Root layout + ErrorBoundary
│   ├── onboarding.tsx     # First-run (4 steps, disclaimer mandatory)
│   ├── paywall.tsx        # Pro upgrade (TODO: IAP)
│   └── settings.tsx       # Settings + GDPR export
├── src/
│   ├── components/        # Reusable UI (all React.memo wrapped)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── IconButton.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ExerciseVideo.tsx
│   │   └── index.ts       # Barrel export
│   ├── constants/
│   │   └── theme.ts       # Design tokens (colors, spacing, typography)
│   ├── providers/
│   │   └── ThemeProvider.tsx  # Light/dark/system theme
│   ├── services/
│   │   ├── contentService.ts     # Exercise/routine loading
│   │   ├── notificationService.ts # Hourly nudge scheduling
│   │   ├── audioService.ts       # Sound cues (TODO: fix audio)
│   │   └── secureStorage.ts      # Encrypted storage wrapper
│   ├── stores/            # Zustand stores
│   │   ├── playerStore.ts    # Player state machine
│   │   ├── historyStore.ts   # Exercise logs
│   │   └── settingsStore.ts  # User preferences
│   ├── types/
│   │   └── index.ts       # All TypeScript interfaces
│   └── data/              # JSON content
│       ├── exercises.json # 10 exercises (need 15+)
│       └── routines.json  # 8 routines
└── assets/                # Images, videos, audio
```

## Key Documentation

| File | Description |
|------|-------------|
| `ROADMAP.md` | **PRIMARY** - Current status, all tasks, priorities |
| `PRD.md` | Product Requirements - features, user stories |
| `WIREFRAMES.md` | Screen designs and UX flows |
| `DATA_MODEL.md` | TypeScript interfaces |
| `SECURITY_COMPLIANCE.md` | GDPR, medical disclaimer |

## Architecture Highlights

### State Management (Zustand)
```typescript
// Stores with persistence
playerStore   // Player state machine (IDLE→PREPARING→PLAYING⇄PAUSED→TRANSITIONING→COMPLETED)
historyStore  // Exercise logs with getStats(), getTodayLogs()
settingsStore // User settings (pain_areas, work_hours, is_pro, streaks)
```

### Theme System
```typescript
// ThemeProvider with 3 modes
const { themeMode, setThemeMode, isDark } = useTheme();
const colors = useThemeColors(); // Returns current theme colors
```

### Components (all React.memo)
```typescript
<Button variant="primary|secondary|outline|ghost|danger|pro" />
<Card variant="default|elevated|outlined|pro|streak" />
<Badge variant="pro|free|new|success|warning|info" />
<IconButton icon="emoji" variant="default|filled|ghost" />
```

## Known Type Issues

**IMPORTANT:** There are type mismatches between JSON data and TypeScript:

1. `exercises.json` uses `target_body_part: string[]` but interface expects single `BodyPart`
2. `routines.json` uses `target_body_part: string` but interface expects `target_body_parts: BodyPart[]`
3. Some `duration_override: null` should be explicit numbers

These work at runtime but violate type contracts. See ROADMAP.md Phase 5.3.

## Quick Fixes Needed

Before any new feature work, fix these quick wins:

```typescript
// 1. In historyStore.ts addLog() - ADD THIS LINE:
useSettingsStore.getState().updateStreak();

// 2. In _layout.tsx - ADD validation:
const isValidExerciseId = (id: unknown): boolean =>
  typeof id === 'string' && /^[a-zA-Z0-9_-]{1,50}$/.test(id);

// 3. In exercises.json - RENAME:
"Chin Tucks" → "Zatahování brady"
```

## Content Management

### Adding a new exercise:
1. Add to `src/data/exercises.json` with unique ID (ex_XXX)
2. Follow existing format (name, description in Czech)
3. Add to relevant routine in `routines.json`
4. Run `npm run typecheck`

### Current exercise gaps:
- Wrists: Only 1 exercise (need 3)
- Hips: Limited coverage
- Eyes: ex_005 exists but unused in routines

## Testing

**CRITICAL: No tests exist yet.**

Setup needed:
```bash
npm install --save-dev @testing-library/react-native jest
```

Priority test targets:
1. playerStore state transitions
2. historyStore.getStats()
3. settingsStore.updateStreak()
4. contentService loading

## Common Issues

### Expo start fails
```bash
# Clear cache
rm -rf .expo/types
npx expo start --clear
```

### TypeScript errors after changes
```bash
npm run typecheck
# Fix any errors before committing
```

### expo-file-system API (SDK 54)
```typescript
// NEW API (SDK 54):
import { Paths, File } from 'expo-file-system';
const file = new File(Paths.cache, 'filename.json');
await file.write(content);

// OLD API (deprecated):
// FileSystem.documentDirectory - NO LONGER EXISTS
```

## Next Session Priorities

See `ROADMAP.md` for full details. Recommended order:

1. **Sprint 1 - Foundation Fixes:**
   - Fix streak tracking (1 line)
   - Fix type mismatches
   - Setup Jest testing
   - Add input validation

2. **Sprint 2 - Content & UX:**
   - Add 5 more exercises
   - Rebalance routine durations
   - Replace emojis with icons
   - Redesign home screen hierarchy

3. **Sprint 3 - Monetization:**
   - Implement RevenueCat IAP
   - Fix audio service
   - Add Sentry monitoring

## Compliance

- **Medical disclaimer**: Mandatory during onboarding (step 0)
- **GDPR**: Data export/deletion in settings
- **Secure storage**: expo-secure-store for Pro status, tokens
- **Accessibility**: 48dp touch targets, accessibility labels

---

*Last updated: 2025-12-25*
