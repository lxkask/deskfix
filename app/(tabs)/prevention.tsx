import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useThemeColors } from '@/providers/ThemeProvider';
import { Button } from '@/components';
import { useSettingsStore } from '@/stores/settingsStore';
import { notificationService } from '@/services/notificationService';

export default function PreventionScreen() {
  const colors = useThemeColors();
  const {
    hourly_nudge_enabled,
    office_mode,
    work_hours_start,
    work_hours_end,
    is_pro,
    toggleHourlyNudge,
    toggleOfficeMode,
  } = useSettingsStore();

  const [nextNudgeTime, setNextNudgeTime] = useState<string | null>(null);

  // Calculate next nudge time
  const calculateNextNudge = useCallback(() => {
    if (!hourly_nudge_enabled) {
      setNextNudgeTime(null);
      return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const [startHour] = work_hours_start.split(':').map(Number);
    const [endHour] = work_hours_end.split(':').map(Number);

    let nextHour: number;
    let isToday = true;

    if (currentHour < startHour) {
      // Before work hours - next nudge at start
      nextHour = startHour;
    } else if (currentHour >= endHour) {
      // After work hours - next nudge tomorrow
      nextHour = startHour;
      isToday = false;
    } else {
      // During work hours - next nudge at next hour
      nextHour = currentHour + 1;
      if (nextHour >= endHour) {
        nextHour = startHour;
        isToday = false;
      }
    }

    const dayLabel = isToday ? 'Dnes' : 'Zítra';
    setNextNudgeTime(`${dayLabel} v ${nextHour}:00`);
  }, [hourly_nudge_enabled, work_hours_start, work_hours_end]);

  useEffect(() => {
    calculateNextNudge();
    // Recalculate every minute
    const interval = setInterval(calculateNextNudge, 60000);
    return () => clearInterval(interval);
  }, [calculateNextNudge]);

  const handleNudgeToggle = async (value: boolean) => {
    if (value) {
      // Check permissions first
      const hasPermission = await notificationService.requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Povolení zamítnuto',
          'Pro hodinové připomínky je potřeba povolit notifikace v nastavení telefonu.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Schedule notifications
      await notificationService.scheduleHourlyNudges({
        workStart: work_hours_start,
        workEnd: work_hours_end,
        officeMode: office_mode,
      });
    } else {
      // Cancel all notifications
      await notificationService.cancelAllNudges();
    }

    toggleHourlyNudge(value);
  };

  const handleOfficeModeToggle = async (value: boolean) => {
    toggleOfficeMode(value);

    // Reschedule notifications if nudge is enabled
    if (hourly_nudge_enabled) {
      await notificationService.scheduleHourlyNudges({
        workStart: work_hours_start,
        workEnd: work_hours_end,
        officeMode: value,
      });
    }
  };

  const handleTestNudge = async () => {
    await notificationService.scheduleTestNotification(office_mode);
    Alert.alert('Test notifikace', 'Za 5 sekund dostaneš testovací připomínku.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Main Toggle */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>Hourly Nudge</Text>
              <Text style={[styles.toggleDescription, { color: colors.textSecondary }]}>
                Automatické připomínky na protažení každou hodinu
              </Text>
            </View>
            <Switch
              value={hourly_nudge_enabled}
              onValueChange={handleNudgeToggle}
              trackColor={{ false: colors.cardBorder, true: colors.primary + '60' }}
              thumbColor={hourly_nudge_enabled ? colors.primary : colors.textTertiary}
              accessibilityLabel="Zapnout hodinové připomínky"
              accessibilityRole="switch"
            />
          </View>
        </View>

        {/* Work Hours */}
        {hourly_nudge_enabled && (
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Pracovní doba</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeBlock}>
                <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Od</Text>
                <View style={[styles.timePicker, { backgroundColor: colors.background }]}>
                  <Text style={[styles.timeValue, { color: colors.textPrimary }]}>{work_hours_start}</Text>
                </View>
              </View>
              <Text style={[styles.timeSeparator, { color: colors.textTertiary }]}>→</Text>
              <View style={styles.timeBlock}>
                <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Do</Text>
                <View style={[styles.timePicker, { backgroundColor: colors.background }]}>
                  <Text style={[styles.timeValue, { color: colors.textPrimary }]}>{work_hours_end}</Text>
                </View>
              </View>
            </View>
            {nextNudgeTime && (
              <Text style={[styles.nextNudge, { color: colors.primary }]}>
                Příští připomínka: {nextNudgeTime}
              </Text>
            )}

            {/* Test button */}
            <TouchableOpacity
              style={[styles.testButton, { borderColor: colors.cardBorder }]}
              onPress={handleTestNudge}
              accessibilityLabel="Otestovat notifikaci"
              accessibilityRole="button"
            >
              <Text style={[styles.testButtonText, { color: colors.textSecondary }]}>
                Otestovat notifikaci
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Office Mode */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.toggleTitle, { color: colors.textPrimary }]}>Office Mode</Text>
              <Text style={[styles.toggleDescription, { color: colors.textSecondary }]}>
                Pouze vibrace, žádné zvuky (pro open-space)
              </Text>
            </View>
            <Switch
              value={office_mode}
              onValueChange={handleOfficeModeToggle}
              trackColor={{ false: colors.cardBorder, true: colors.primary + '60' }}
              thumbColor={office_mode ? colors.primary : colors.textTertiary}
              accessibilityLabel="Zapnout tichý režim"
              accessibilityRole="switch"
            />
          </View>
        </View>

        {/* Quick Drill Button */}
        <Link href="/routine/random-micro?source=prevention" asChild>
          <TouchableOpacity
            style={[styles.drillButton, { backgroundColor: colors.secondary }]}
            accessibilityLabel="Zkusit náhodný cvik"
            accessibilityRole="button"
          >
            <Text style={styles.drillButtonText}>
              Zkusit náhodný cvik teď
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Pro Upgrade */}
        {!is_pro && (
          <View style={[styles.proPrompt, { backgroundColor: colors.proBadgeBackground }]}>
            <Text style={[styles.proPromptText, { color: colors.proBadgeText }]}>
              Hourly Nudge je součástí DeskFix Pro
            </Text>
            <Link href="/paywall" asChild>
              <TouchableOpacity>
                <Button variant="pro" onPress={() => {}}>
                  Zobrazit Pro výhody
                </Button>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timeBlock: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  timePicker: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  timeSeparator: {
    fontSize: 24,
    marginHorizontal: 16,
  },
  nextNudge: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  testButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  testButtonText: {
    fontSize: 14,
  },
  drillButton: {
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  drillButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  proPrompt: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  proPromptText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});
