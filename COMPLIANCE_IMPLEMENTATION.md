# DeskFix - Implementační příručka pro Compliance

## Praktické code snippets pro MVP compliance

---

## 1. ONBOARDING S DISCLAIMEREM

### Soubor: `app/(onboarding)/disclaimer.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DISCLAIMER_TEXT = `⚠️ DŮLEŽITÉ UPOZORNĚNÍ

DeskFix je aplikace pro prevenci a úlevu od nepohodlí spojených se sedavým zaměstnáním. Aplikace NENÍ lékařský prostředek a NEPOSKYTUJE lékařské rady, diagnostiku ani léčbu.

Cvičební programy a doporučení v této aplikaci slouží pouze pro všeobecné informační a vzdělávací účely. Nejsou určeny k nahrazení odborné lékařské péče, konzultace, diagnostiky nebo léčby od kvalifikovaného zdravotnického pracovníka.

PŘED ZAHÁJENÍM jakéhokoli cvičebního programu:
• Konzultujte své zdravotní potíže s lékařem nebo fyzioterapeutem
• Pokud trpíte chronickou bolestí, zraněním nebo akutním onemocněním, nepoužívajte tuto aplikaci bez schválení lékařem
• Pokud během cvičení pociťujete akutní bolest, závratě nebo jiné neobvyklé příznaky, okamžitě přestaňte a vyhledejte lékařskou pomoc

Používáním této aplikace berete na vědomí, že:
• Cvičíte na vlastní riziko a zodpovědnost
• Provozovatel aplikace nenese odpovědnost za případná zranění nebo zdravotní komplikace vzniklé používáním aplikace
• Aplikace negarantuje žádné konkrétní zdravotní výsledky

V případě vážných nebo dlouhodobých zdravotních potíží vždy vyhledejte odbornou lékařskou pomoc.`;

export default function DisclaimerScreen() {
  const router = useRouter();
  const [healthDisclaimerAccepted, setHealthDisclaimerAccepted] = useState(false);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = ({ nativeEvent }: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleContinue = async () => {
    if (!healthDisclaimerAccepted || !privacyPolicyAccepted) {
      Alert.alert(
        'Souhlas vyžadován',
        'Pro pokračování musíte přečíst a souhlasit se zdravotním upozorněním a zásadami ochrany osobních údajů.'
      );
      return;
    }

    if (!hasScrolledToBottom) {
      Alert.alert(
        'Přečtěte celý text',
        'Prosím, přečtěte si celé upozornění před pokračováním.'
      );
      return;
    }

    try {
      await AsyncStorage.setItem('disclaimer_accepted', 'true');
      await AsyncStorage.setItem('disclaimer_version', '1.0');
      await AsyncStorage.setItem('disclaimer_accepted_date', new Date().toISOString());

      router.push('/(onboarding)/work-hours');
    } catch (error) {
      Alert.alert('Chyba', 'Nepodařilo se uložit vaše preference.');
    }
  };

  const openPrivacyPolicy = () => {
    router.push('/(legal)/privacy-policy');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zdravotní upozornění</Text>

      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <Text style={styles.disclaimerText}>{DISCLAIMER_TEXT}</Text>
      </ScrollView>

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={healthDisclaimerAccepted}
          onValueChange={setHealthDisclaimerAccepted}
          color={healthDisclaimerAccepted ? '#2563eb' : undefined}
        />
        <Text style={styles.checkboxLabel}>
          Přečetl/a jsem a souhlasím se zdravotním upozorněním
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <Checkbox
          value={privacyPolicyAccepted}
          onValueChange={setPrivacyPolicyAccepted}
          color={privacyPolicyAccepted ? '#2563eb' : undefined}
        />
        <View style={styles.privacyTextContainer}>
          <Text style={styles.checkboxLabel}>Souhlasím se </Text>
          <TouchableOpacity onPress={openPrivacyPolicy}>
            <Text style={styles.link}>zásadami ochrany osobních údajů</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (!healthDisclaimerAccepted || !privacyPolicyAccepted || !hasScrolledToBottom) &&
          styles.buttonDisabled
        ]}
        onPress={handleContinue}
        disabled={!healthDisclaimerAccepted || !privacyPolicyAccepted || !hasScrolledToBottom}
      >
        <Text style={styles.buttonText}>Pokračovat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fef3c7',
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  privacyTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  link: {
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

## 2. PRIVACY SETTINGS SCREEN

### Soubor: `app/(tabs)/settings/privacy.tsx`

```typescript
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { deleteAllUserData, exportUserData, getUserDataSummary } from '@/utils/dataManagement';

export default function PrivacySettingsScreen() {
  const router = useRouter();

  const handleViewData = async () => {
    const dataSummary = await getUserDataSummary();
    router.push({
      pathname: '/(settings)/view-data',
      params: { data: JSON.stringify(dataSummary) }
    });
  };

  const handleExportData = async () => {
    try {
      await exportUserData();
      Alert.alert('Export dokončen', 'Vaše data byla exportována.');
    } catch (error) {
      Alert.alert('Chyba', 'Export dat se nezdařil.');
    }
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Smazat všechna data?',
      'Opravdu chcete smazat všechna data?\n\n' +
      '• Historie cvičení\n' +
      '• Nastavení\n' +
      '• Statistiky\n\n' +
      'Tato akce je nevratná.',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Smazat vše',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllUserData();
              Alert.alert('Hotovo', 'Všechna data byla smazána.');
            } catch (error) {
              Alert.alert('Chyba', 'Nepodařilo se smazat data.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteHistory = () => {
    Alert.alert(
      'Smazat historii cvičení?',
      'Statistiky a streaky budou ztraceny. Tato akce je nevratná.',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Smazat',
          style: 'destructive',
          onPress: async () => {
            // Implementace mazání historie
            Alert.alert('Hotovo', 'Historie byla smazána.');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Moje data</Text>

      <TouchableOpacity style={styles.option} onPress={handleViewData}>
        <Text style={styles.optionText}>Zobrazit moje data</Text>
        <Text style={styles.optionDescription}>
          Přehled všech uložených dat
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handleExportData}>
        <Text style={styles.optionText}>Exportovat data jako JSON</Text>
        <Text style={styles.optionDescription}>
          Stáhnout všechna data ve formátu JSON
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Smazání dat</Text>

      <TouchableOpacity style={styles.option} onPress={handleDeleteHistory}>
        <Text style={[styles.optionText, styles.deleteText]}>Smazat historii cvičení</Text>
        <Text style={styles.optionDescription}>
          Vymazat záznamy o dokončených cvicích
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={handleDeleteAllData}>
        <Text style={[styles.optionText, styles.deleteText]}>Smazat všechna data</Text>
        <Text style={styles.optionDescription}>
          Vymazat veškerá data a resetovat aplikaci
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Právní informace</Text>

      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push('/(legal)/privacy-policy')}
      >
        <Text style={styles.optionText}>Ochrana osobních údajů</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push('/(legal)/terms-of-service')}
      >
        <Text style={styles.optionText}>Obchodní podmínky</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push('/(legal)/health-disclaimer')}
      >
        <Text style={styles.optionText}>Zdravotní upozornění</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Verze aplikace: 1.0.0</Text>
        <Text style={styles.footerText}>Privacy Policy verze: 1.0</Text>
        <Text style={styles.footerText}>
          Všechna data jsou uložena pouze na vašem zařízení
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  option: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  optionText: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  deleteText: {
    color: '#dc2626',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
    textAlign: 'center',
  },
});
```

---

## 3. DATA MANAGEMENT UTILS

### Soubor: `utils/dataManagement.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Notifications from 'expo-notifications';
import { database } from '@/database';
import { useAppStore } from '@/store/appStore';

/**
 * Smaže všechna uživatelská data (GDPR Right to Erasure)
 */
export async function deleteAllUserData(): Promise<void> {
  try {
    // 1. Smazat SQLite databázi (historie cvičení)
    await database.dropAllTables();
    await database.recreateTables();

    // 2. Vymazat AsyncStorage (nastavení, preferences)
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);

    // 3. Zrušit všechny naplánované notifikace
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 4. Reset Zustand store
    useAppStore.getState().resetState();

    console.log('[DataManagement] All user data deleted successfully');
  } catch (error) {
    console.error('[DataManagement] Error deleting user data:', error);
    throw error;
  }
}

/**
 * Exportuje všechna uživatelská data do JSON (GDPR Data Portability)
 */
export async function exportUserData(): Promise<void> {
  try {
    // 1. Získat všechna data z různých zdrojů
    const [settings, history, stats, notifications] = await Promise.all([
      getAllSettings(),
      database.getAllHistory(),
      database.getStats(),
      getNotificationState(),
    ]);

    // 2. Sestavit kompletní export
    const exportData = {
      exportMetadata: {
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
        dataVersion: '1.0',
      },
      userSettings: settings,
      exerciseHistory: history,
      statistics: stats,
      notificationState: notifications,
    };

    // 3. Uložit jako JSON soubor
    const fileName = `deskfix_data_${new Date().toISOString().split('T')[0]}.json`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(
      fileUri,
      JSON.stringify(exportData, null, 2)
    );

    // 4. Sdílet soubor
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Exportovat moje data z DeskFix',
        UTI: 'public.json',
      });
    }

    console.log('[DataManagement] Data exported successfully');
  } catch (error) {
    console.error('[DataManagement] Error exporting data:', error);
    throw error;
  }
}

/**
 * Vrátí přehled uložených dat (pro "Zobrazit moje data")
 */
export async function getUserDataSummary() {
  const [settings, historyCount, stats] = await Promise.all([
    getAllSettings(),
    database.getHistoryCount(),
    database.getStats(),
  ]);

  return {
    settings: {
      workHoursStart: settings.work_hours_start,
      workHoursEnd: settings.work_hours_end,
      hourlyNudgeEnabled: settings.hourly_nudge_enabled,
      officeModeEnabled: settings.office_mode,
      selectedPainAreas: settings.selected_pain_areas,
      isPro: settings.is_pro,
    },
    statistics: {
      totalExercises: stats.total_exercises_completed,
      totalRoutines: stats.total_routines_completed,
      currentStreak: stats.current_streak,
      totalTimeExercised: formatSeconds(stats.total_time_exercised),
    },
    history: {
      recordCount: historyCount,
      oldestRecord: await database.getOldestHistoryDate(),
      newestRecord: await database.getNewestHistoryDate(),
    },
  };
}

/**
 * Smaže pouze historii cvičení (zachová nastavení)
 */
export async function deleteExerciseHistory(): Promise<void> {
  try {
    await database.clearHistory();
    console.log('[DataManagement] Exercise history deleted');
  } catch (error) {
    console.error('[DataManagement] Error deleting history:', error);
    throw error;
  }
}

/**
 * Pomocné funkce
 */
async function getAllSettings() {
  const settingsJson = await AsyncStorage.getItem('userSettings');
  return settingsJson ? JSON.parse(settingsJson) : {};
}

async function getNotificationState() {
  const stateJson = await AsyncStorage.getItem('notificationState');
  return stateJson ? JSON.parse(stateJson) : {};
}

function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
```

---

## 4. DISCLAIMER PŘED CVIČENÍM (Optional)

### Soubor: `components/ExerciseWarning.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ExerciseWarningProps {
  visible: boolean;
  onDismiss: () => void;
  onAccept: () => void;
}

export function ExerciseWarning({ visible, onDismiss, onAccept }: ExerciseWarningProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <MaterialIcons name="warning" size={48} color="#f59e0b" />

          <Text style={styles.title}>Před zahájením cvičení</Text>

          <Text style={styles.message}>
            Přestaňte cvičit, pokud pociťujete:
          </Text>

          <View style={styles.warningList}>
            <Text style={styles.warningItem}>• Akutní nebo ostrá bolest</Text>
            <Text style={styles.warningItem}>• Závratě nebo nevolnost</Text>
            <Text style={styles.warningItem}>• Brnění nebo necitlivost</Text>
            <Text style={styles.warningItem}>• Dušnost</Text>
          </View>

          <Text style={styles.disclaimer}>
            Pokud máte jakékoliv zdravotní obavy, konzultujte lékařa.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onDismiss}
            >
              <Text style={styles.cancelButtonText}>Zrušit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={onAccept}
            >
              <Text style={styles.acceptButtonText}>Rozumím, začít</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
  },
  warningList: {
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  warningItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  disclaimer: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  acceptButton: {
    backgroundColor: '#2563eb',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

**Usage v Routine Player:**

```typescript
import { ExerciseWarning } from '@/components/ExerciseWarning';

export default function RoutinePlayerScreen() {
  const [showWarning, setShowWarning] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartExercise = () => {
    setShowWarning(false);
    setIsPlaying(true);
    // Start exercise logic
  };

  return (
    <View>
      <ExerciseWarning
        visible={showWarning && !isPlaying}
        onDismiss={() => router.back()}
        onAccept={handleStartExercise}
      />

      {/* Rest of player UI */}
    </View>
  );
}
```

---

## 5. ANALYTICS S OPT-IN (Optional)

### Soubor: `utils/analytics.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Analytics from 'expo-firebase-analytics'; // nebo jiná analytics

const ANALYTICS_CONSENT_KEY = 'analytics_consent';

/**
 * Zkontroluje, zda uživatel souhlasil s analytics
 */
export async function hasAnalyticsConsent(): Promise<boolean> {
  const consent = await AsyncStorage.getItem(ANALYTICS_CONSENT_KEY);
  return consent === 'true';
}

/**
 * Nastaví souhlas s analytics
 */
export async function setAnalyticsConsent(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(ANALYTICS_CONSENT_KEY, enabled.toString());

  if (!enabled) {
    // Disable analytics collection
    await Analytics.setAnalyticsCollectionEnabled(false);
  } else {
    await Analytics.setAnalyticsCollectionEnabled(true);
  }
}

/**
 * Privacy-safe event logging - pouze pokud má consent
 */
export async function logEvent(eventName: string, params?: Record<string, any>) {
  const hasConsent = await hasAnalyticsConsent();

  if (!hasConsent) {
    console.log('[Analytics] Event not logged (no consent):', eventName);
    return;
  }

  // Sanitize params - remove any PII or health data
  const sanitizedParams = sanitizeParams(params);

  await Analytics.logEvent(eventName, sanitizedParams);
  console.log('[Analytics] Event logged:', eventName, sanitizedParams);
}

/**
 * Odstraní citlivá data z parametrů
 */
function sanitizeParams(params?: Record<string, any>): Record<string, any> {
  if (!params) return {};

  const sanitized = { ...params };

  // Remove health-related data
  const blacklist = ['pain_level', 'health_issue', 'notes', 'email', 'name'];
  blacklist.forEach(key => delete sanitized[key]);

  return sanitized;
}

/**
 * Příklady použití (jen agregovaná data)
 */
export async function logExerciseCompleted(bodyPart: string, duration: number) {
  await logEvent('exercise_completed', {
    body_part: bodyPart,
    duration_bucket: getDurationBucket(duration), // 0-30s, 31-60s, 60s+
  });
}

export async function logRoutineStarted(routineType: string) {
  await logEvent('routine_started', {
    routine_type: routineType, // 'quick_fix', 'deep_stretch', etc.
  });
}

function getDurationBucket(seconds: number): string {
  if (seconds <= 30) return '0-30s';
  if (seconds <= 60) return '31-60s';
  return '60s+';
}
```

**UI v nastavení:**

```typescript
// app/(tabs)/settings/analytics.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { hasAnalyticsConsent, setAnalyticsConsent } from '@/utils/analytics';

export default function AnalyticsSettingsScreen() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    hasAnalyticsConsent().then(setAnalyticsEnabled);
  }, []);

  const handleToggle = async (value: boolean) => {
    setAnalyticsEnabled(value);
    await setAnalyticsConsent(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anonymní analytika</Text>

      <View style={styles.option}>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Povolit analytiku</Text>
          <Text style={styles.optionDescription}>
            Pomoci nám zlepšit aplikaci sdílením anonymních dat o používání.
            Nesdílíme zdravotní údaje ani osobní informace.
          </Text>
        </View>
        <Switch
          value={analyticsEnabled}
          onValueChange={handleToggle}
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Co sbíráme:</Text>
        <Text style={styles.infoText}>• Typy dokončených cviků (ne konkrétní bolesti)</Text>
        <Text style={styles.infoText}>• Časy používání aplikace</Text>
        <Text style={styles.infoText}>• Navigace v aplikaci</Text>

        <Text style={styles.infoTitle} style={{ marginTop: 12 }}>Co NESBÍRÁME:</Text>
        <Text style={styles.infoText}>• Subjektivní hodnocení bolesti</Text>
        <Text style={styles.infoText}>• Zdravotní poznámky</Text>
        <Text style={styles.infoText}>• Osobní identifikátory</Text>
      </View>
    </View>
  );
}
```

---

## 6. APP STORE METADATA TEMPLATE

### App Store Connect - Privacy Nutrition Label

```yaml
Data Collection:

1. Health & Fitness
   - Exercise and Movement
     • Data Use: App Functionality
     • Linked to User: No
     • Used for Tracking: No

2. App Activity
   - App Interactions
     • Data Use: Analytics (only if consent given)
     • Linked to User: No
     • Used for Tracking: No

3. Identifiers
   - Device ID
     • Data Use: App Functionality (local notifications)
     • Linked to User: No
     • Used for Tracking: No

Data Not Collected:
- Contact Info
- User Content
- Financial Info
- Location
- Browsing History
- Contacts
- Photos/Videos

Privacy Policy URL: https://deskfix.app/privacy
```

### Google Play Console - Data Safety

```yaml
Data Safety Section:

Does your app collect or share any of the required user data types?
☑️ Yes

Health and fitness:
☑️ Health info
   - Exercise data (duration, type)
   - Is this data collected, shared, or both? Collected only
   - Is this data processed ephemerally? No
   - Is this data required or optional? Required
   - Why is this user data collected? App functionality
   - Is this data encrypted in transit? N/A (local only)

App activity:
☑️ App interactions
   - Is this data collected, shared, or both? Collected only
   - Is this data processed ephemerally? No
   - Is this data required or optional? Required
   - Why is this user data collected? Analytics (with consent)

Device or other IDs:
☑️ Device or other IDs
   - Is this data collected, shared, or both? Collected only
   - Why is this user data collected? App functionality (notifications)

Can users request that data be deleted?
☑️ Yes (in-app settings)
```

---

## 7. GDPR COMPLIANCE CHECKLIST (Pre-Launch)

```markdown
## GDPR Implementation Checklist

### Legal Documents
- [ ] Privacy Policy vytvořena (česky + anglicky)
- [ ] Terms of Service vytvořeny (česky + anglicky)
- [ ] Health Disclaimer připraven
- [ ] Privacy Policy publikována na webu (URL: _____________)
- [ ] ToS publikovány na webu (URL: _____________)
- [ ] Právník zkontroloval dokumenty (optional, ale doporučeno)

### In-App Implementation
- [ ] Disclaimer zobrazen při onboardingu (nelze přeskočit)
- [ ] Checkbox "Souhlasím s disclaimerem" funkční
- [ ] Checkbox "Souhlasím s Privacy Policy" funkční
- [ ] Link na Privacy Policy in-app (webview nebo browser)
- [ ] Link na ToS in-app
- [ ] "Zobrazit moje data" screen implementován
- [ ] "Exportovat data" funkce implementována (JSON)
- [ ] "Smazat všechna data" funkce implementována
- [ ] "Smazat historii" funkce implementována
- [ ] Confirmation dialogy pro destruktivní akce
- [ ] Analytics opt-in screen (pokud používáno)
- [ ] Footer s odkazy na Privacy Policy na každé obrazovce

### Data Protection
- [ ] SQLite databáze šifrována (iOS Keychain / Android Keystore)
- [ ] Žádná health data posílána na server (kromě opt-in analytics)
- [ ] AsyncStorage neobsahuje PII (personally identifiable info)
- [ ] Notifikace neobsahují citlivá data v textu
- [ ] Export dat zahrnuje všechny uložené údaje
- [ ] Smazání dat vymaže vše včetně cache

### App Store Metadata
- [ ] Privacy Policy URL vyplněna v App Store Connect
- [ ] Privacy Policy URL vyplněna v Google Play Console
- [ ] Terms of Use URL vyplněny
- [ ] Data Safety section vyplněna (Google Play)
- [ ] Privacy Nutrition Label vyplněn (Apple)
- [ ] Kategorie: Health & Fitness (NE Medical)
- [ ] Disclaimer v app description
- [ ] Screenshots neobsahují medical claims

### Testing
- [ ] Test: Disclaimer nelze přeskočit při onboardingu
- [ ] Test: "Smazat data" skutečně vymaže SQLite + AsyncStorage
- [ ] Test: Export dat vytvoří platný JSON
- [ ] Test: "Zobrazit data" zobrazí všechna uložená data
- [ ] Test: Odinstalace + reinstalace = čistá data
- [ ] Test: Analytics opt-out skutečně zastaví logging
- [ ] Test: Notifikace fungují i po smazání dat (po re-enable)

### Compliance Documentation
- [ ] Tento dokument (SECURITY_COMPLIANCE.md) v repository
- [ ] Email templates pro support připraveny
- [ ] Privacy request response template připraven
- [ ] Contact email privacy@deskfix.app funkční

### Post-Launch
- [ ] Monitoring GDPR requests (pokud přijdou)
- [ ] Review Privacy Policy každých 6 měsíců
- [ ] Update dokumentace při změně funkcí (analytics, server features)
```

---

## 8. SUPPORT EMAIL TEMPLATES

### Template 1: Obecný health dotaz

```
Předmět: Re: Zdravotní dotaz k aplikaci DeskFix

Dobrý den [jméno],

Děkujeme za váš zájem o aplikaci DeskFix.

⚠️ DŮLEŽITÉ: DeskFix není lékařský prostředek a neposkytujeme lékařské rady,
diagnostiku ani léčbu. Naše aplikace slouží pouze k prevenci a obecné úlevě
od nepohodlí spojeného se sedavým zaměstnáním.

Pokud trpíte:
• Chronickou bolestí (delší než 6 týdnů)
• Akutním zraněním nebo úrazem
• Neurologickými příznaky (brnění, necitlivost, slabost)
• Bolestí ovlivňující běžné denní aktivity

Důrazně doporučujeme konzultovat váš stav s:
• Praktickým lékařem
• Fyzioterapeutem
• Ortopedickým specialistou

DeskFix je určena pouze pro:
✓ Prevenci nepohodlí ze sezení u počítače
✓ Obecnou úlevu od lehkého svalového napětí
✓ Zvýšení pohybové aktivity během pracovní doby

Před použitím aplikace si prosím přečtěte zdravotní upozornění v aplikaci
(Nastavení > O aplikaci > Zdravotní upozornění).

Pokud máte technické dotazy k aplikaci, rádi vám pomůžeme.

S pozdravem,
DeskFix Support Team
support@deskfix.app
```

---

### Template 2: GDPR Data Deletion Request

```
Předmět: Re: Žádost o výmaz osobních údajů

Dobrý den [jméno],

Vaše žádost o výmaz osobních údajů dle článku 17 GDPR byla přijata.

INFORMACE O ULOŽENÍ DAT:
DeskFix ukládá všechna vaše data POUZE lokálně na vašem zařízení.
Neukládáme žádná data na našich serverech ani je nepředáváme třetím stranám
(kromě Apple/Google pro platby).

JAK SMAZAT DATA:

Varianta 1 - V aplikaci:
1. Otevřete aplikaci DeskFix
2. Přejděte do Nastavení > Soukromí a data
3. Klikněte na "Smazat všechna data"
4. Potvrďte akci

Varianta 2 - Odinstalace:
Odinstalováním aplikace automaticky vymažete všechna lokálně uložená data.

PLATEBNÍ DATA (pokud jste provedli nákup):
• Historie plateb je uložena u Apple/Google (ne u nás)
• Pro výmaz platebních údajů kontaktujte Apple/Google support:
  - Apple: https://support.apple.com/
  - Google: https://support.google.com/googleplay/

Pokud máte další dotazy, neváhejte nás kontaktovat.

S pozdravem,
DeskFix Privacy Team
privacy@deskfix.app

---
[Vaše firma]
IČO: [XXX]
Sídlo: [adresa]
```

---

### Template 3: Data Export Request

```
Předmět: Re: Žádost o export osobních údajů

Dobrý den [jméno],

Vaše žádost o export osobních údajů dle článku 20 GDPR byla přijata.

JAK EXPORTOVAT DATA:

1. Otevřete aplikaci DeskFix
2. Přejděte do Nastavení > Soukromí a data
3. Klikněte na "Exportovat data jako JSON"
4. Soubor bude uložen do vašeho zařízení nebo můžete sdílet

CO EXPORT OBSAHUJE:
• Vaše nastavení (pracovní doba, preferované cviky)
• Historie cvičení (datum, čas, dokončené cviky)
• Statistiky (streaky, celkový čas cvičení)
• Stav předplatného (free/pro)

FORMÁT:
Data jsou exportována ve formátu JSON, který lze otevřít v libovolném
textovém editoru nebo importovat do jiných aplikací.

Pokud potřebujete data v jiném formátu (CSV, Excel), dejte nám vědět.

S pozdravem,
DeskFix Support Team
support@deskfix.app
```

---

## 9. APP REVIEW NOTES (Pro App Store Connect / Play Console)

### Apple App Store Review Notes

```
App Review Team,

Thank you for reviewing DeskFix.

IMPORTANT CLARIFICATIONS:

1. Health & Fitness Category (NOT Medical):
   - DeskFix is a wellness app for office workers, NOT a medical device
   - We do NOT provide medical advice, diagnosis, or treatment
   - Clear medical disclaimer shown during onboarding (mandatory acceptance)

2. Privacy & Data:
   - All user data is stored LOCALLY on device (SQLite/AsyncStorage)
   - NO data is transmitted to our servers
   - Privacy Policy available in-app and at: https://deskfix.app/privacy

3. In-App Purchases:
   - Free tier: 2 body parts (Neck, Wrists)
   - Pro tier: All body parts + Hourly Nudge + custom routines
   - Clear pricing displayed before purchase
   - Cancellation instructions in Settings

4. Test Account (if needed):
   - Email: Contact support@deskfix.app for test credentials
   - Pro features can be activated for review upon request

5. Testing Instructions:
   - First launch: You'll see onboarding with health disclaimer
   - Must accept disclaimer to continue (required for compliance)
   - Main screen: Body map with pain areas
   - Tap any area → see exercise routines
   - Settings > Privacy & Data: GDPR features (view/export/delete data)

Please contact us if you have any questions.

Email: support@deskfix.app

Thank you!
```

---

### Google Play Review Notes

```
Milý Play Console Review Team,

KATEGORIE: Health & Fitness (ne Medical)

DeskFix je wellness aplikace pro prevenci bolesti z dlouhého sezení.
NENÍ to lékařský prostředek.

COMPLIANCE:
✓ Zdravotní disclaimer v onboardingu (povinný souhlas)
✓ Privacy Policy: https://deskfix.app/privacy
✓ Data Safety vyplněna (všechna data lokální)
✓ GDPR: export/smazání dat v nastavení

PŘEDPLATNÉ:
• Free: 2 partie těla
• Pro: všechny partie + notifikace
• Zrušení: přes Google Play account

TESTOVÁNÍ:
1. První spuštění → onboarding s disclaimerem
2. Dashboard → výběr bolavé části těla
3. Nastavení > Soukromí → GDPR funkce

Kontakt: support@deskfix.app

Děkujeme!
```

---

## 10. CHANGELOG & VERSION TRACKING

```typescript
// constants/ComplianceVersion.ts

export const COMPLIANCE_VERSION = {
  privacyPolicy: '1.0',
  termsOfService: '1.0',
  healthDisclaimer: '1.0',
  lastUpdated: '2026-01-01',
};

// Check if user needs to re-accept updated policies
export async function checkComplianceVersion() {
  const acceptedVersion = await AsyncStorage.getItem('privacy_policy_version');

  if (acceptedVersion !== COMPLIANCE_VERSION.privacyPolicy) {
    // Show updated Privacy Policy screen
    return false;
  }

  return true;
}
```

---

**Konec implementační příručky**

Tento dokument obsahuje všechny potřebné code snippets pro GDPR a compliance
implementaci v DeskFix MVP. Pro kompletní kontext viz hlavní dokument
SECURITY_COMPLIANCE.md.
