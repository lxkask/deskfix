# DeskFix - ROADMAP v3.0

> **Komplexní AI Audit provedeno: 2025-12-25**
>
> **Aktuální stav: DEMO (ne MVP)**

---

## Shrnutí auditu

| Oblast | Skóre | Hlavní problémy |
|--------|-------|-----------------|
| **Code Quality** | 7.2/10 | Player completion broken, IAP mock, audio placeholder |
| **UI/UX** | 5.8/10 | Navigation errors, emoji/icon mix, broken Pro buttons |
| **Content** | 4.5/10 | Hardcoded micro-drill, 22% duplicity v rutinách, špatné cviky |
| **Celkem** | **5.8/10** | **Není připraveno pro uživatele** |

---

## KRITICKÉ PROBLÉMY (Blokují release)

### 1. Player Completion Flow
**Soubor:** `app/routine/player.tsx:171-252`

**Problém:** Success screen se okamžitě zavře - uživatel nikdy nevidí feedback UI.

**Příčina:**
```typescript
const handleComplete = () => {
  addLog({...});
  reset();        // OKAMŽITĚ resetuje
  router.back();  // OKAMŽITĚ zavře
};
```

**Fix:** Přidat stav pro feedback, zavřít až po uživatelské akci.

---

### 2. Micro-Drill NENÍ Náhodný
**Soubory:** `routines.json:90-99`, `index.tsx:167`

**Problém:** FAB vždy spustí `ex_001` (Protažení šíje). PRD vyžaduje náhodný výběr.

**Příčina:** Hardcoded routine ID místo dynamic selection.

**Fix:** Použít existující `contentService.getRandomExercise()`.

---

### 3. Cviky Se Opakují v Rutinách
**Soubor:** `routines.json`

| Rutina | Duplicity | Příklad |
|--------|-----------|---------|
| lower-back-relief | 60% | ex_004 3x v rutině |
| shoulders-stretch | 33% | ex_002 2x v rutině |
| neck-quick-relief | 25% | ex_001 2x + ex_005 (OČI!) |

**Fix:** Přepracovat všechny rutiny, žádné duplicity.

---

### 4. Oční Cvik v Krční Rutině
**Soubor:** `routines.json:15`

**Problém:** `ex_005` (Pravidlo 20-20-20) je v `neck-quick-relief`.

**Fix:** Odstranit, nebo vytvořit separátní "Eye breaks" rutinu.

---

### 5. Pro Tlačítka Nefungují
**Soubor:** `progress.tsx:173-185`

**Problém:** Double-wrapped touch handlers.

```typescript
<Link href="/paywall" asChild>
  <TouchableOpacity>
    <Button onPress={() => {}} />  // Prázdný onPress!
  </TouchableOpacity>
</Link>
```

**Fix:** Odstranit TouchableOpacity, použít Button s router.push.

---

### 6. Hourly Nudge Banner - Špatná Navigace
**Soubor:** `index.tsx:143`

**Problém:** Naviguje do `/settings` místo `/prevention`.

**Fix:** Změnit `href="/settings"` na `href="/(tabs)/prevention"`.

---

### 7. IAP/Paywall Mock
**Soubor:** `paywall.tsx:17-21`

**Problém:** Nákup nic nedělá, jen zavře screen.

**Fix:** Implementovat RevenueCat nebo expo-iap.

---

### 8. Audio Service Placeholder
**Soubor:** `audioService.ts:60-62`

**Problém:** Invalid base64 audio data.

**Fix:** Přidat reálné audio soubory nebo použít tone generation.

---

## FÁZE 1: Critical Fixes (Blokující)

### 1.1 Fix Player Completion
- [ ] Přidat `showFeedback` state
- [ ] Zobrazit success screen min. 3 sekundy
- [ ] Zavřít pouze po user interaction

### 1.2 Fix Content Duplicity
- [ ] Odstranit všechny duplicitní cviky z rutin
- [ ] Odstranit ex_005 z neck-quick-relief
- [ ] Opravit lower-back-relief (3x ex_004 → 3 různé cviky)

### 1.3 Implement Random Micro-Drill
- [ ] Změnit FAB na volání `getRandomExercise()`
- [ ] Vytvořit dynamickou micro-rutinu
- [ ] Přidat anti-repeat logiku (ne 2x stejný cvik za den)

### 1.4 Fix Navigation
- [ ] Hourly Nudge banner → `/(tabs)/prevention`
- [ ] Pro buttons → fungující `router.push('/paywall')`
- [ ] "Zobrazit pro výhody" → paywall

### 1.5 Fix UI Consistency
- [ ] Nahradit VŠECHNY emoji ikonami
- [ ] Screens: progress.tsx, settings.tsx, routine/[id].tsx
- [ ] Standardizovat na Feather + MaterialCommunityIcons

---

## FÁZE 2: Content Quality

### 2.1 Routine Redesign
**Cíl:** Každá rutina má unikátní cviky, logické složení.

| Rutina | Současný stav | Cílový stav |
|--------|---------------|-------------|
| neck-quick-relief | 3 unique + eye | 4 unique neck cviky |
| shoulders-stretch | 2 unique | 3 unique shoulder cviky |
| lower-back-relief | 2 unique, 3 wrong | 4 unique lower-back cviky |
| wrist-stretch | 3 unique | OK |
| hip-opener | 3 unique | OK |

### 2.2 Evidence-Based Exercise Review
- [ ] Verifikovat všechny cviky vs fyzioterapeutické guidelines
- [ ] Přidat chybějící: thoracic rotation, scapular retraction, hamstring stretch
- [ ] Překlasifikovat ex_005 (20-20-20) na reminder, ne exercise

### 2.3 Add Missing Exercises
- [ ] Upper back: Thoracic spine mobilization
- [ ] Legs: Hamstring stretch, calf pumps
- [ ] Eyes: Eye circles, palming (pokud retained)

---

## FÁZE 3: UX Improvements

### 3.1 Home Screen
- [ ] FAB: 64x64dp, accent color, lepší ikona
- [ ] Nudge banner: vypadat jako tlačítko
- [ ] Body part cards: haptic feedback

### 3.2 Prevention Tab
- [ ] Odstranit "Zkusit náhodný cvik" (duplicitní)
- [ ] Posunout Pro badge pod Hourly Nudge
- [ ] Implementovat time pickers pro work hours

### 3.3 Routine Detail
- [ ] Klikatelné cviky pro preview
- [ ] Nahradit emoji za Badge component
- [ ] Přidat thumbnail obrázky cviků

### 3.4 Player Screen
- [ ] Respektovat theme preference (ne hardcoded dark)
- [ ] Implementovat skip backward
- [ ] Smart exit confirmation (jen pokud >30% hotovo)

### 3.5 Settings
- [ ] Vytvořit dedicated disclaimer screen
- [ ] Implementovat restore purchases
- [ ] Lepší loading states

---

## FÁZE 4: Technical Debt

### 4.1 Audio Service
- [ ] Přidat reálné audio soubory
- [ ] Nebo odstranit audio feature temporarily

### 4.2 Video Component
- [ ] Lepší error handling
- [ ] Fallback UI s retry button
- [ ] Offline video caching (Pro feature)

### 4.3 Testing
- [ ] Přidat unit testy (ROADMAP tvrdil 30, ale jsou 0)
- [ ] playerStore state transitions
- [ ] historyStore.getStats()
- [ ] contentService

### 4.4 Error Tracking
- [ ] Integrace Sentry
- [ ] Odstranit console.* v production
- [ ] Centralizovaný error handling

---

## FÁZE 5: Monetization

### 5.1 IAP Implementation
- [ ] RevenueCat integration
- [ ] Purchase flow
- [ ] Restore purchases
- [ ] Receipt validation

### 5.2 Pro Features Enhancement
- [ ] Více exclusive routines
- [ ] Offline mode
- [ ] Custom routines
- [ ] Advanced statistics

---

## Priority Matrix

| Issue | Priority | Effort | Impact | Sprint |
|-------|----------|--------|--------|--------|
| Player completion fix | P0 | Low | Critical | 1 |
| Random micro-drill | P0 | Medium | Critical | 1 |
| Routine duplicity fix | P0 | Medium | Critical | 1 |
| Navigation fixes | P0 | Low | High | 1 |
| Pro buttons fix | P0 | Low | High | 1 |
| Emoji→Icons | P1 | Medium | Medium | 1-2 |
| Evidence-based content | P1 | High | High | 2 |
| Time pickers | P2 | Medium | Medium | 2 |
| Exercise preview | P2 | Medium | Medium | 2 |
| Audio service | P2 | Medium | Low | 3 |
| IAP implementation | P1 | High | Critical | 3 |
| Error tracking | P2 | Medium | Medium | 3 |
| Testing | P2 | High | High | 3-4 |

---

## Metrics Target

| Metrika | Aktuální | Cíl MVP | Cíl v1.0 |
|---------|----------|---------|----------|
| Code Quality | 7.2/10 | 8.5/10 | 9.0/10 |
| UI/UX | 5.8/10 | 8.0/10 | 8.5/10 |
| Content | 4.5/10 | 7.5/10 | 8.5/10 |
| Test Coverage | 0% | 50% | 70% |
| Crash-free rate | N/A | 99% | 99.5% |

---

## Sprint Plan

### Sprint 1: Critical Fixes
**Cíl:** Opravit vše co blokuje základní user flow.

1. Player completion flow
2. Random micro-drill
3. Navigation fixes
4. Pro buttons fix
5. Remove routine duplicates
6. Basic icon consistency

**Výstup:** Aplikace je použitelná od začátku do konce.

### Sprint 2: Content & UX
**Cíl:** Kvalitní obsah a konzistentní UX.

1. Complete icon standardization
2. Evidence-based routine review
3. Time pickers
4. Exercise preview in routine detail
5. Theme consistency

**Výstup:** Aplikace vypadá profesionálně.

### Sprint 3: Monetization & Polish
**Cíl:** Fungující business model.

1. RevenueCat IAP
2. Audio service fix
3. Error tracking (Sentry)
4. Performance optimization

**Výstup:** Aplikace je připravena na monetizaci.

### Sprint 4: Quality & Launch
**Cíl:** Produkční kvalita.

1. Unit test suite
2. Integration tests
3. App Store assets
4. Beta testing
5. Bug fixes

**Výstup:** Aplikace je připravena pro App Store.

---

## Files Requiring Immediate Attention

### Critical (Sprint 1):
1. `app/routine/player.tsx` - lines 171-252
2. `app/(tabs)/index.tsx` - lines 143, 167
3. `app/(tabs)/progress.tsx` - lines 173-185, 213-217
4. `src/data/routines.json` - all duplicates
5. `src/services/contentService.ts` - micro-drill logic

### High Priority (Sprint 1-2):
6. `app/(tabs)/prevention.tsx` - lines 193-204, 206-220
7. `app/settings.tsx` - emoji replacements
8. `app/routine/[id].tsx` - emoji, click handlers
9. `src/data/exercises.json` - content review

### Medium Priority (Sprint 2-3):
10. `app/paywall.tsx` - IAP implementation
11. `src/services/audioService.ts` - real audio
12. `app/onboarding.tsx` - progress animations

---

## Audit Reports

Kompletní audit reporty jsou dostupné:
- Code Quality Audit: Provedl code-reviewer agent
- UI/UX Audit: Provedl ui-ux-designer agent
- Content Audit: Provedl product-strategist agent

---

*Dokument vytvořen: 2025-12-25*
*Verze: 3.0*
*Stav: DEMO → MVP*
