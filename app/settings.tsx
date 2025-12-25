import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useSettingsStore } from '@/stores/settingsStore';
import { useHistoryStore } from '@/stores/historyStore';
import { useTheme, useThemeColors } from '@/providers/ThemeProvider';
import { Card, Button, Badge, IconButton } from '@/components';
import Constants from 'expo-constants';
import { secureStorage } from '@/services/secureStorage';

type ThemeMode = 'light' | 'dark' | 'system';

const THEME_OPTIONS: { value: ThemeMode; label: string; emoji: string }[] = [
  { value: 'light', label: 'Světlý', emoji: '☀️' },
  { value: 'dark', label: 'Tmavý', emoji: '🌙' },
  { value: 'system', label: 'Systém', emoji: '📱' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { themeMode, setThemeMode } = useTheme();
  const settingsState = useSettingsStore();
  const { is_pro, resetSettings } = settingsState;
  const historyState = useHistoryStore();
  const { clearHistory, logs } = historyState;
  const [isExporting, setIsExporting] = useState(false);

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Gather all user data for GDPR export
      const exportData = {
        exportDate: new Date().toISOString(),
        appVersion,
        settings: {
          onboarding_completed: settingsState.onboarding_completed,
          pain_areas: settingsState.pain_areas,
          hourly_nudge_enabled: settingsState.hourly_nudge_enabled,
          work_hours_start: settingsState.work_hours_start,
          work_hours_end: settingsState.work_hours_end,
          office_mode: settingsState.office_mode,
          is_pro: settingsState.is_pro,
          current_streak: settingsState.current_streak,
          longest_streak: settingsState.longest_streak,
          last_exercise_date: settingsState.last_exercise_date,
        },
        exerciseHistory: logs,
        statistics: historyState.getStats(),
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const fileName = `deskfix-data-${new Date().toISOString().split('T')[0]}.json`;

      // Check if we can share (not available on web)
      if (Platform.OS === 'web') {
        // For web, create a download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        Alert.alert('Export dokončen', 'Data byla stažena jako JSON soubor.');
      } else {
        // For native, use new expo-file-system API
        const file = new File(Paths.cache, fileName);
        await file.write(jsonString);

        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(file.uri, {
            mimeType: 'application/json',
            dialogTitle: 'Export DeskFix dat',
          });
        } else {
          Alert.alert('Export dokončen', `Data byla uložena do: ${file.uri}`);
        }
      }
    } catch (error) {
      Alert.alert('Chyba', 'Nepodařilo se exportovat data. Zkuste to prosím znovu.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Smazat všechna data?',
      'Tato akce je nevratná. Veškerá historie cvičení a nastavení budou smazána.',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Smazat',
          style: 'destructive',
          onPress: async () => {
            clearHistory();
            resetSettings();
            // Also clear secure storage (GDPR compliance)
            await secureStorage.clearAll();
            Alert.alert('Hotovo', 'Všechna data byla smazána.');
          },
        },
      ]
    );
  };

  const handleOpenLink = async (url: string) => {
    // Security: Validate URL before opening
    if (!url.startsWith('https://')) {
      console.warn('Blocked non-HTTPS URL:', url);
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.cardBorder }]}>
        <IconButton
          icon="✕"
          onPress={() => router.back()}
          variant="ghost"
          size="sm"
          accessibilityLabel="Zavřít nastavení"
        />
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Nastavení
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            O aplikaci
          </Text>
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View style={[styles.infoRow, { borderBottomColor: colors.cardBorder }]}>
              <Text style={[styles.infoLabel, { color: colors.textPrimary }]}>Verze</Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{appVersion}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textPrimary }]}>Stav</Text>
              <Badge variant={is_pro ? 'pro' : 'info'} size="md">
                {is_pro ? 'PRO' : 'FREE'}
              </Badge>
            </View>
          </View>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Vzhled
          </Text>
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <Text style={[styles.themeLabel, { color: colors.textPrimary }]}>
              Barevný režim
            </Text>
            <View style={styles.themeOptions}>
              {THEME_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor:
                        themeMode === option.value
                          ? colors.primary + '20'
                          : colors.background,
                      borderColor:
                        themeMode === option.value
                          ? colors.primary
                          : colors.cardBorder,
                    },
                  ]}
                  onPress={() => setThemeMode(option.value)}
                  accessibilityLabel={`${option.label} režim`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: themeMode === option.value }}
                >
                  <Text style={styles.themeEmoji}>{option.emoji}</Text>
                  <Text
                    style={[
                      styles.themeOptionLabel,
                      {
                        color:
                          themeMode === option.value
                            ? colors.primary
                            : colors.textPrimary,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Upgrade */}
        {!is_pro && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Upgrade
            </Text>
            <Link href="/paywall" asChild>
              <TouchableOpacity
                style={[styles.upgradeCard, { backgroundColor: colors.proBadgeBackground }]}
                accessibilityLabel="Přejít na Pro verzi"
                accessibilityRole="button"
              >
                <Text style={styles.upgradeEmoji}>⭐</Text>
                <View style={styles.upgradeInfo}>
                  <Text style={[styles.upgradeTitle, { color: colors.proBadgeText }]}>
                    Přejít na Pro
                  </Text>
                  <Text style={[styles.upgradeSubtitle, { color: colors.proBadgeText }]}>
                    Odemkni všechny funkce
                  </Text>
                </View>
                <Text style={[styles.upgradeArrow, { color: colors.proBadgeText }]}>→</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Správa dat
          </Text>
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: colors.cardBorder }]}
              onPress={handleExportData}
              disabled={isExporting}
              accessibilityLabel="Exportovat data"
              accessibilityRole="button"
            >
              <Text style={styles.menuIcon}>{isExporting ? '⏳' : '📤'}</Text>
              <Text style={[styles.menuText, { color: colors.textPrimary }]}>
                {isExporting ? 'Exportování...' : 'Exportovat data (GDPR)'}
              </Text>
              <Text style={[styles.menuArrow, { color: colors.textTertiary }]}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDeleteData}
              accessibilityLabel="Smazat všechna data"
              accessibilityRole="button"
            >
              <Text style={styles.menuIcon}>🗑️</Text>
              <Text style={[styles.menuText, { color: colors.error }]}>Smazat všechna data</Text>
              <Text style={[styles.menuArrow, { color: colors.textTertiary }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Právní informace
          </Text>
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: colors.cardBorder }]}
              onPress={() => handleOpenLink('https://deskfix.app/terms')}
              accessibilityLabel="Podmínky použití"
              accessibilityRole="link"
            >
              <Text style={styles.menuIcon}>📜</Text>
              <Text style={[styles.menuText, { color: colors.textPrimary }]}>Podmínky použití</Text>
              <Text style={[styles.menuArrow, { color: colors.textTertiary }]}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: colors.cardBorder }]}
              onPress={() => handleOpenLink('https://deskfix.app/privacy')}
              accessibilityLabel="Zásady ochrany soukromí"
              accessibilityRole="link"
            >
              <Text style={styles.menuIcon}>🔒</Text>
              <Text style={[styles.menuText, { color: colors.textPrimary }]}>Zásady ochrany soukromí</Text>
              <Text style={[styles.menuArrow, { color: colors.textTertiary }]}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                Alert.alert(
                  'Zdravotní upozornění',
                  'DeskFix není náhrada lékařské péče. Při vážné nebo přetrvávající bolesti konzultujte odborníka. Cvičení provádějte opatrně a v mezích svých možností.'
                )
              }
              accessibilityLabel="Zdravotní upozornění"
              accessibilityRole="button"
            >
              <Text style={styles.menuIcon}>⚕️</Text>
              <Text style={[styles.menuText, { color: colors.textPrimary }]}>Zdravotní upozornění</Text>
              <Text style={[styles.menuArrow, { color: colors.textTertiary }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          Vytvořeno s ❤️ pro zdravější pracovní dny
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingTop: 8,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  themeEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  themeOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  upgradeCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  upgradeInfo: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  upgradeSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  upgradeArrow: {
    fontSize: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    minHeight: 56,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  menuArrow: {
    fontSize: 18,
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 32,
  },
});
