import { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { contentService } from '@/services/contentService';
import { useSettingsStore } from '@/stores/settingsStore';
import { useHistoryStore } from '@/stores/historyStore';
import { useThemeColors } from '@/providers/ThemeProvider';
import { Card, Badge } from '@/components';

const { width: screenWidth } = Dimensions.get('window');
const CARD_GAP = 12;
const PADDING = 16;
const cardWidth = (screenWidth - (PADDING * 2) - CARD_GAP) / 2;

// Body part icon component
const BodyPartIcon = ({ iconName, color, size = 40 }: { iconName: string; color: string; size?: number }) => {
  const iconMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
    neck: 'head-outline',
    shoulders: 'arm-flex-outline',
    upper_back: 'human-handsup',
    lower_back: 'human',
    wrists: 'hand-wave-outline',
    hips: 'meditation',
    legs: 'walk',
  };
  return <MaterialCommunityIcons name={iconMap[iconName] || 'help-circle-outline'} size={size} color={color} />;
};

// Body parts data with routine mapping
const BODY_PARTS = [
  { id: 'neck', name: 'Krk', routineId: 'neck-quick-relief' },
  { id: 'shoulders', name: 'Ramena', routineId: 'shoulders-stretch' },
  { id: 'upper_back', name: 'Horní záda', routineId: 'upper-back-relief' },
  { id: 'lower_back', name: 'Dolní záda', routineId: 'lower-back-relief' },
  { id: 'wrists', name: 'Zápěstí', routineId: 'wrist-stretch' },
  { id: 'hips', name: 'Kyčle', routineId: 'hip-opener' },
  { id: 'legs', name: 'Nohy', routineId: 'dvt-prevention' },
];

export default function HomeScreen() {
  const colors = useThemeColors();
  const isPro = useSettingsStore((state) => state.is_pro);
  const { getTodayLogs, logs } = useHistoryStore();

  // Memoize today's count based on logs
  const todayCount = useMemo(() => getTodayLogs().length, [logs]);

  // Memoize routine info getter - returns cached result per routineId
  const getRoutineInfo = useCallback((routineId: string) => {
    const routine = contentService.getRoutineById(routineId);
    return {
      exists: !!routine,
      isPro: routine?.is_pro ?? false,
      duration: routine?.duration_total ?? 0,
    };
  }, []);

  // Memoize body parts with routine info to avoid recalculating in render
  const bodyPartsWithInfo = useMemo(() =>
    BODY_PARTS.map(part => ({
      ...part,
      info: getRoutineInfo(part.routineId),
    })),
  [getRoutineInfo]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Compact Header with Today's Progress */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.greeting, { color: colors.textPrimary }]}>
              Co tě dnes bolí?
            </Text>
            {todayCount > 0 && (
              <View style={[styles.todayChip, { backgroundColor: colors.secondary + '20' }]}>
                <Feather name="check-circle" size={14} color={colors.secondary} />
                <Text style={[styles.todayChipText, { color: colors.secondary }]}>
                  {todayCount}×
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Body Parts Grid - Larger Cards */}
        <View style={styles.grid}>
          {bodyPartsWithInfo.map((part) => {
            const isLocked = part.info.isPro && !isPro;
            const durationMins = Math.ceil(part.info.duration / 60);

            return (
              <Link
                key={part.id}
                href={`/routine/${part.routineId}`}
                asChild
              >
                <TouchableOpacity
                  style={[
                    styles.bodyPartCard,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.cardBorder,
                    },
                    isLocked && styles.lockedCard,
                  ]}
                  activeOpacity={0.7}
                  accessibilityLabel={`${part.name} rutina, ${durationMins} minut${isLocked ? ', vyžaduje Pro' : ''}`}
                  accessibilityRole="button"
                >
                  {isLocked && (
                    <View style={styles.proBadgeContainer}>
                      <Badge variant="pro">PRO</Badge>
                    </View>
                  )}
                  <View style={[styles.bodyPartIconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <BodyPartIcon iconName={part.id} color={colors.primary} size={36} />
                  </View>
                  <Text style={[styles.bodyPartName, { color: colors.textPrimary }]}>
                    {part.name}
                  </Text>
                  {part.info.exists && (
                    <View style={styles.durationRow}>
                      <Feather name="clock" size={12} color={colors.textTertiary} />
                      <Text style={[styles.durationLabel, { color: colors.textTertiary }]}>
                        {durationMins} min
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Link>
            );
          })}
        </View>

        {/* Hourly Nudge - Compact Banner */}
        <Link href="/settings" asChild>
          <TouchableOpacity
            style={[
              styles.nudgeBanner,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
            accessibilityLabel="Hodinové připomínky, klikni pro nastavení"
            accessibilityRole="button"
          >
            <View style={[styles.nudgeIconSmall, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="bell" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.nudgeBannerText, { color: colors.textSecondary }]}>
              Nastav si hodinové připomínky
            </Text>
            <Feather name="chevron-right" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </Link>
      </ScrollView>

      {/* FAB - Quick Drill */}
      <Link href="/routine/random-micro" asChild>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
          accessibilityLabel="Náhodný micro-drill, 30 sekund"
          accessibilityRole="button"
        >
          <Feather name="zap" size={24} color="#fff" />
        </TouchableOpacity>
      </Link>
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
    padding: PADDING,
    paddingBottom: 100, // Space for FAB
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  todayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  todayChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginBottom: 20,
  },
  bodyPartCard: {
    width: cardWidth,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
    borderWidth: 1,
  },
  lockedCard: {
    opacity: 0.6,
  },
  bodyPartIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bodyPartName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  proBadgeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  nudgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  nudgeIconSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nudgeBannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
