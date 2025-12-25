import { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useHistoryStore, HistoryLog } from '@/stores/historyStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useThemeColors } from '@/providers/ThemeProvider';
import { Card, Badge, Button } from '@/components';

// Body part display names
const BODY_PART_NAMES: Record<string, string> = {
  neck: 'Krk',
  shoulders: 'Ramena',
  upper_back: 'Horní záda',
  lower_back: 'Dolní záda',
  wrists: 'Zápěstí',
  hips: 'Kyčle',
  eyes: 'Oči',
  general: 'Celkové',
};

// Day names for chart
const DAY_NAMES = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

export default function ProgressScreen() {
  const colors = useThemeColors();
  const { getTodayLogs, getRecentLogs, getStats, logs } = useHistoryStore();
  const { current_streak, longest_streak, is_pro } = useSettingsStore();

  // Memoize computed values based on logs dependency
  const todayLogs = useMemo(() => getTodayLogs(), [logs]);
  const recentLogs = useMemo(() => getRecentLogs(5), [logs]);
  const stats = useMemo(() => getStats(), [logs]);

  // Calculate today's body parts summary - memoized
  const todayBodyParts = useMemo(() => {
    const counts: Record<string, number> = {};
    todayLogs.forEach((log) => {
      log.body_parts.forEach((part) => {
        counts[part] = (counts[part] || 0) + 1;
      });
    });
    return Object.entries(counts).map(([bodyPart, count]) => ({
      bodyPart: BODY_PART_NAMES[bodyPart] || bodyPart,
      count,
    }));
  }, [todayLogs]);

  // Format relative date - memoized callback
  const formatRelativeDate = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const logDate = timestamp.split('T')[0];
    const time = date.toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (logDate === today) return `Dnes ${time}`;
    if (logDate === yesterday) return `Včera ${time}`;
    return date.toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'short',
    });
  }, []);

  // Get display name for body part from log - memoized callback
  const getBodyPartName = useCallback((log: HistoryLog) => {
    const firstPart = log.body_parts[0];
    return BODY_PART_NAMES[firstPart] || firstPart || 'Cvičení';
  }, []);

  // Weekly chart bars - memoized
  const chartBars = useMemo(() => {
    const maxActivity = Math.max(...stats.weeklyActivity, 1);
    return stats.weeklyActivity.map((count) => {
      const height = Math.round((count / maxActivity) * 4);
      if (height === 0) return '▁';
      if (height === 1) return '▃';
      if (height === 2) return '▅';
      if (height === 3) return '▆';
      return '█';
    });
  }, [stats.weeklyActivity]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Streak Card */}
        <View style={[styles.streakCard, { backgroundColor: colors.streakBackground }]}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={[styles.streakNumber, { color: colors.streakText }]}>
            {current_streak}
          </Text>
          <Text style={[styles.streakLabel, { color: colors.streakText }]}>
            {current_streak === 1 ? 'den v pohybu!' : 'dní v pohybu!'}
          </Text>
          <Text style={[styles.longestStreak, { color: colors.streakText, opacity: 0.8 }]}>
            Nejdelší série: {longest_streak} dní
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.totalSessions}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Celkem cvičení
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.totalMinutes}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Minut
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {stats.positiveFeedbackRate}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Spokojenost
            </Text>
          </View>
        </View>

        {/* Today's Progress */}
        <Card variant="outlined" style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            📅 Dnes
          </Text>
          {todayBodyParts.length > 0 ? (
            todayBodyParts.map((item, index) => (
              <View key={index} style={styles.todayRow}>
                <Text style={styles.checkmark}>✅</Text>
                <Text style={[styles.todayText, { color: colors.textPrimary }]}>
                  {item.bodyPart} - {item.count}x
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Ještě jsi dnes necvičil. Začni teď! 💪
            </Text>
          )}
        </Card>

        {/* Weekly Chart */}
        <Card variant={!is_pro ? 'outlined' : 'outlined'} style={styles.card}>
          <View style={styles.proHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              📊 Týdenní přehled
            </Text>
            {!is_pro && <Badge variant="pro">PRO</Badge>}
          </View>
          <View style={[styles.chartPlaceholder, !is_pro && { opacity: 0.5 }]}>
            <Text style={[styles.chartBars, { color: colors.primary }]}>
              {chartBars.join(' ')}
            </Text>
            <Text style={[styles.chartLabels, { color: colors.textTertiary }]}>
              {DAY_NAMES.join('  ')}
            </Text>
          </View>
          {!is_pro && (
            <Link href="/paywall" asChild>
              <TouchableOpacity>
                <Button
                  variant="pro"
                  fullWidth
                  onPress={() => {}}
                  accessibilityLabel="Odemknout statistiky"
                >
                  Odemknout statistiky
                </Button>
              </TouchableOpacity>
            </Link>
          )}
        </Card>

        {/* Relief Log */}
        <Card variant="outlined" style={styles.card}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            📝 Poslední cvičení
          </Text>
          {recentLogs.length > 0 ? (
            recentLogs.map((log) => (
              <View
                key={log.id}
                style={[styles.logRow, { borderBottomColor: colors.cardBorder }]}
              >
                <View style={styles.logInfo}>
                  <Text style={[styles.logDate, { color: colors.textSecondary }]}>
                    {formatRelativeDate(log.timestamp)}
                  </Text>
                  <Text style={[styles.logBodyPart, { color: colors.textPrimary }]}>
                    {getBodyPartName(log)}
                  </Text>
                </View>
                <Text style={styles.logFeedback}>{log.feedback || '—'}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Zatím nemáš žádné záznamy. Začni cvičit! 🏃
            </Text>
          )}
        </Card>

        {/* Settings Link */}
        <Link href="/settings" asChild>
          <TouchableOpacity
            style={styles.settingsLink}
            accessibilityLabel="Přejít do nastavení"
            accessibilityRole="button"
          >
            <Text style={[styles.settingsLinkText, { color: colors.textSecondary }]}>
              ⚙️ Nastavení
            </Text>
          </TouchableOpacity>
        </Link>
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
  streakCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  streakEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: '800',
  },
  streakLabel: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  longestStreak: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  proHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkmark: {
    fontSize: 18,
    marginRight: 12,
  },
  todayText: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  chartBars: {
    fontSize: 24,
    marginBottom: 4,
    letterSpacing: 4,
  },
  chartLabels: {
    fontSize: 10,
    letterSpacing: 2,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logInfo: {
    flex: 1,
  },
  logDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  logBodyPart: {
    fontSize: 16,
    fontWeight: '500',
  },
  logFeedback: {
    fontSize: 24,
  },
  settingsLink: {
    alignItems: 'center',
    paddingVertical: 16,
    minHeight: 48,
    justifyContent: 'center',
  },
  settingsLinkText: {
    fontSize: 16,
  },
});
