# DeskFix Runbook

Tento dokument popisuje jak pracovat s DeskFix projektem - vývoj, testování, přidávání obsahu a deployment.

---

## 1. Lokální vývoj

### Požadavky
- Node.js 18+
- npm nebo yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) nebo Android Emulator
- Expo Go app na fyzickém zařízení

### Spuštění projektu

```bash
# Instalace závislostí
cd DeskFix
npm install

# Spuštění dev serveru
npm start
# nebo
npx expo start

# Spuštění na konkrétní platformě
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

### Vývoj na fyzickém zařízení
1. Nainstaluj Expo Go z App Store / Google Play
2. Spusť `npm start`
3. Naskenuj QR kód z terminálu

---

## 2. Přidání nového cviku

### Krok 1: Připrav video/GIF
- Formát: MP4 (H.264) nebo GIF
- Délka: max 10 sekund (loop)
- Rozlišení: 720p (1280x720) doporučeno
- Velikost: max 2MB per cvik
- Umístění: `assets/videos/` nebo remote URL

### Krok 2: Přidej do exercises.json

```json
// src/data/exercises.json
{
  "exercises": [
    {
      "id": "unique-exercise-id",
      "name": "Název cviku (česky)",
      "description": "Krátký popis jak cvik provést...",
      "video_url": "./assets/videos/exercise-name.mp4",
      "thumbnail_url": "./assets/images/exercise-name-thumb.jpg",
      "duration_default": 30,
      "target_body_part": ["neck"],
      "tags": ["office-friendly", "sitting", "beginner"],
      "difficulty": "beginner"
    }
  ]
}
```

### Krok 3: Přidej do rutiny (volitelné)

```json
// src/data/routines.json
{
  "routines": [
    {
      "id": "routine-id",
      "exercises": [
        {
          "exercise_id": "unique-exercise-id",
          "order": 1,
          "duration_override": null
        }
      ]
    }
  ]
}
```

### Krok 4: Otestuj
```bash
npm start
# Naviguj na rutinu obsahující nový cvik
# Ověř že video se načítá a timer funguje
```

---

## 3. Testování notifikací

### iOS Simulator
```bash
# Notifikace v simulátoru jsou omezené
# Pro plné testování použij fyzické zařízení
```

### Android Emulator
```bash
# Funguje, ale může mít zpoždění
# Ověř že app má povolení v nastavení
```

### Fyzické zařízení (doporučeno)
1. Nainstaluj app přes Expo Go
2. Povol notifikace v onboardingu
3. Nastav work hours v Prevention tabu
4. Počkej na notifikaci nebo:

```typescript
// Pro okamžité testování - přidej do Prevention screen:
import * as Notifications from 'expo-notifications';

const testNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test Nudge",
      body: "Testovací notifikace",
      data: { type: 'hourly_nudge', exerciseId: 'test' },
    },
    trigger: { seconds: 5 },
  });
};
```

### Debug notifikace
```typescript
// Zobraz všechny naplánované notifikace
const scheduled = await Notifications.getAllScheduledNotificationsAsync();
console.log('Scheduled:', scheduled);
```

---

## 4. Buildování pro produkci

### EAS Build (doporučeno)

```bash
# Instalace EAS CLI
npm install -g eas-cli

# Login
eas login

# Konfigurace
eas build:configure

# iOS build
eas build --platform ios

# Android build
eas build --platform android

# Oba najednou
eas build --platform all
```

### Lokální build (advanced)

```bash
# iOS (vyžaduje macOS + Xcode)
npx expo run:ios --configuration Release

# Android
npx expo run:android --variant release
```

---

## 5. Deployment

### App Store (iOS)

1. **EAS Submit**
```bash
eas submit --platform ios
```

2. **Manuálně**
- Build přes EAS nebo Xcode
- Upload přes Transporter app
- Vyplň App Store Connect metadata
- Přidej screenshots (6.5", 5.5")
- Submit for review

### Google Play (Android)

1. **EAS Submit**
```bash
eas submit --platform android
```

2. **Manuálně**
- Build AAB přes EAS
- Upload do Google Play Console
- Vyplň store listing
- Přidej screenshots
- Submit for review

---

## 6. Remote Content Update (OTA)

### Expo Updates

```bash
# Publikování OTA update (JS + assets)
eas update --branch production --message "Nové cviky"

# Toto aktualizuje:
# ✅ JavaScript kód
# ✅ JSON data (exercises, routines)
# ✅ Assets (images, videos do 50MB)
# ❌ Nativní moduly (vyžaduje nový build)
```

### Remote Config pattern
Pro větší flexibilitu můžeš hostovat JSON na CDN:

```typescript
// src/services/contentLoader.ts
const REMOTE_EXERCISES_URL = 'https://cdn.deskfix.app/content/exercises.json';

export async function loadExercises(): Promise<Exercise[]> {
  try {
    const response = await fetch(REMOTE_EXERCISES_URL);
    const data = await response.json();
    // Cache do AsyncStorage
    await AsyncStorage.setItem('exercises_cache', JSON.stringify(data));
    return data.exercises;
  } catch {
    // Fallback na cache nebo bundled data
    const cached = await AsyncStorage.getItem('exercises_cache');
    return cached ? JSON.parse(cached).exercises : require('@/data/exercises.json').exercises;
  }
}
```

---

## 7. Debugging

### React Native Debugger
```bash
# Instalace
brew install react-native-debugger

# Spuštění
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Expo Dev Tools
- Shake device → "Open Dev Menu"
- `j` v terminálu → JavaScript debugger
- `m` v terminálu → Menu

### Logování
```typescript
// Pro produkci používej strukturované logy
console.log('[Player]', 'Exercise completed:', exerciseId);
console.error('[Notifications]', 'Schedule failed:', error);
```

---

## 8. Monitoring & Analytics

### Crash reporting (doporučeno)
```bash
# Sentry
npm install @sentry/react-native
```

### Analytics (privacy-first)
```typescript
// Pouze anonymní metriky
// Nesbírej PII bez souhlasu
interface AnalyticsEvent {
  event: 'routine_started' | 'routine_completed' | 'nudge_tapped';
  properties?: {
    routine_id?: string;
    body_part?: string;
    duration?: number;
  };
}
```

---

## 9. Checklist před releasem

### Funkční testy
- [ ] Onboarding flow (3 kroky)
- [ ] Body Map → Routine Preview → Player (3 tapy)
- [ ] Player timer a controls
- [ ] Notifikace scheduling a handling
- [ ] Office Mode (žádné zvuky)
- [ ] Settings - export/delete data
- [ ] Paywall zobrazení

### Performance
- [ ] App start < 3s
- [ ] Video loading < 2s
- [ ] Smooth 60fps animace
- [ ] Memory leaks check

### Compliance
- [ ] Medical disclaimer v onboardingu
- [ ] Privacy policy link
- [ ] GDPR delete funkce
- [ ] App Store metadata

### Assets
- [ ] App icon (1024x1024)
- [ ] Splash screen
- [ ] Screenshots (iPhone 6.5", iPhone 5.5", iPad)
- [ ] Feature graphic (Android)

---

## 10. Troubleshooting

### "Metro bundler stuck"
```bash
# Reset cache
npx expo start --clear
# nebo
rm -rf node_modules/.cache
```

### "Notification not showing"
1. Ověř permission status v nastavení
2. Zkontroluj že app není v "battery optimization"
3. Testuj na fyzickém zařízení

### "Video not loading"
1. Ověř URL/path je správný
2. Zkontroluj CORS pokud remote
3. Fallback na placeholder image

### "Build failed"
```bash
# Clean build
rm -rf node_modules
rm -rf .expo
npm install
npx expo start --clear
```

---

## Kontakty

- **Tech lead**: [email]
- **Content**: [email]
- **Support**: support@deskfix.app

---

*Poslední aktualizace: 2025-12-24*
