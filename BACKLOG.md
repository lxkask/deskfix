# DeskFix MVP - 10denní Backlog

## Sprint 1: Základ (Den 1-3)

### Den 1: Projektová infrastruktura
- [ ] **ISSUE-001**: Inicializace Expo projektu s TypeScript
  - Setup Expo Router
  - Konfigurace TypeScript paths
  - Základní navigační struktura (tabs + stack)
  - **Estimate**: 4h
  - **Priority**: P0 (Critical)

- [ ] **ISSUE-002**: Implementace datového modelu
  - TypeScript interfaces (Exercise, Routine, UserSettings)
  - Zustand stores (playerStore, settingsStore)
  - AsyncStorage utility funkce
  - **Estimate**: 3h
  - **Priority**: P0 (Critical)

### Den 2: Content pipeline
- [ ] **ISSUE-003**: Exercise JSON struktura a loader
  - Finalizace exercises.json (15 cviků pro 3 partie)
  - Finalizace routines.json (5 rutin)
  - Content loader service
  - **Estimate**: 4h
  - **Priority**: P0 (Critical)

- [ ] **ISSUE-004**: Video/GIF assets
  - Placeholder videa pro všechny cviky
  - Optimalizace pro mobile (max 10s loop, compressed)
  - Asset bundling strategie
  - **Estimate**: 4h
  - **Priority**: P1 (High)

### Den 3: Core UI komponenty
- [ ] **ISSUE-005**: Design system foundations
  - Color palette (calming blues, greens)
  - Typography scale
  - Spacing system
  - Common components (Button, Card, ProgressBar)
  - **Estimate**: 4h
  - **Priority**: P0 (Critical)

- [ ] **ISSUE-006**: Body Map Home screen
  - Body part selection grid
  - Routine cards
  - Navigation to routine preview
  - **Estimate**: 4h
  - **Priority**: P0 (Critical)

---

## Sprint 2: Player (Den 4-5)

### Den 4: Routine Player - Core
- [ ] **ISSUE-007**: Player state management
  - Zustand PlayerStore implementace
  - Timer logic (countdown, pause, transitions)
  - Exercise queue management
  - **Estimate**: 4h
  - **Priority**: P0 (Critical)

- [ ] **ISSUE-008**: Player UI
  - Video/animation area
  - Timer display (circular progress)
  - Exercise info (name, description)
  - Progress indicator (X/Y)
  - **Estimate**: 4h
  - **Priority**: P0 (Critical)

### Den 5: Player - Polish
- [ ] **ISSUE-009**: Player controls a feedback
  - Play/Pause/Skip buttons
  - Completion screen s emoji feedback
  - Vibrační feedback
  - **Estimate**: 3h
  - **Priority**: P0 (Critical)

- [ ] **ISSUE-010**: Audio a Wake Lock
  - Audio cues (transition beep, completion gong)
  - Office Mode (vibration only fallback)
  - expo-keep-awake implementace
  - **Estimate**: 3h
  - **Priority**: P1 (High)

---

## Sprint 3: Notifications & UX (Den 6-7)

### Den 6: Notification Engine
- [ ] **ISSUE-011**: Hourly Nudge scheduler
  - Scheduling logic (work hours, 60min intervals)
  - Notification payload structure
  - Anti-repetition algoritmus
  - **Estimate**: 5h
  - **Priority**: P1 (High)

- [ ] **ISSUE-012**: Notification handlers
  - Permission request flow
  - Deep linking z notifikace do playeru
  - Micro-drill mode (single exercise)
  - **Estimate**: 3h
  - **Priority**: P1 (High)

### Den 7: Onboarding & Settings
- [ ] **ISSUE-013**: Onboarding flow
  - Welcome screen
  - Pain area selection
  - Notification permission request
  - Office Mode default
  - **Estimate**: 4h
  - **Priority**: P0 (Critical)

- [ ] **ISSUE-014**: Settings screen
  - Work hours picker
  - Office Mode toggle
  - Data export/delete (GDPR)
  - Legal links
  - **Estimate**: 3h
  - **Priority**: P1 (High)

---

## Sprint 4: Monetizace & Progress (Den 8-9)

### Den 8: Freemium gates
- [ ] **ISSUE-015**: Paywall screen
  - Feature comparison (Free vs Pro)
  - Pricing cards
  - Trial CTA
  - **Estimate**: 3h
  - **Priority**: P1 (High)

- [ ] **ISSUE-016**: Pro feature gates
  - Lock overlay na Pro rutinách
  - Lock overlay na Hourly Nudge
  - Lock overlay na statistikách
  - isPro flag v settingsStore
  - **Estimate**: 3h
  - **Priority**: P1 (High)

### Den 9: Progress tracking
- [ ] **ISSUE-017**: History logging
  - SQLite/AsyncStorage implementace
  - Log exercise completion
  - Pain feedback storage
  - **Estimate**: 4h
  - **Priority**: P1 (High)

- [ ] **ISSUE-018**: Progress screen
  - Streak counter
  - Today's exercises summary
  - Recent activity log
  - Weekly chart placeholder (Pro)
  - **Estimate**: 3h
  - **Priority**: P1 (High)

---

## Sprint 5: Polish & Launch (Den 10)

### Den 10: Finalizace
- [ ] **ISSUE-019**: Compliance
  - Medical disclaimer v onboardingu
  - Privacy policy link
  - Terms of service link
  - GDPR data deletion funkce
  - **Estimate**: 2h
  - **Priority**: P0 (Critical)

- [ ] **ISSUE-020**: Testing & Bug fixes
  - End-to-end testování hlavních flows
  - Notifikace testování na real device
  - Performance check (video loading)
  - Bug fixes
  - **Estimate**: 4h
  - **Priority**: P0 (Critical)

- [ ] **ISSUE-021**: App Store příprava
  - App icons a splash screen
  - Screenshots
  - App Store metadata (popis, keywords)
  - Privacy nutrition label
  - **Estimate**: 2h
  - **Priority**: P1 (High)

---

## Prioritizace

### P0 (Must Have - MVP blocker)
- ISSUE-001, 002, 003, 005, 006, 007, 008, 009, 013, 019, 020

### P1 (Should Have - launch quality)
- ISSUE-004, 010, 011, 012, 014, 015, 016, 017, 018, 021

### P2 (Nice to Have - post-launch)
- Real IAP implementace
- Advanced analytics
- Apple Health integrace
- Vlastní rutiny builder

---

## Definition of Done

Každý issue je "done" když:
1. Kód je napsaný a funguje
2. Funguje na iOS i Android
3. Respektuje Office Mode (ticho)
4. Má velké touch targets (min 48dp)
5. Používá calming color palette
6. Nemá žádné console errors
7. Je commitnutý do main branch

---

## Denní Standup Template

```
Včera: [co bylo hotové]
Dnes: [plán na dnešek]
Blockers: [co brzdí]
```

---

## Metriky pro MVP Success

1. **Time to first routine** < 3 minuty od instalace
2. **Session completion rate** > 70%
3. **D1 retention** > 40%
4. **Crash-free rate** > 99.5%
5. **App Store rating** > 4.0
