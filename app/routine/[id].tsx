import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { contentService } from '@/services/contentService';
import { useSettingsStore } from '@/stores/settingsStore';
import { useThemeColors } from '@/providers/ThemeProvider';
import { Button, IconButton, Badge } from '@/components';

// Body part emoji mapping
const BODY_PART_EMOJIS: Record<string, string> = {
  neck: '🦒',
  shoulders: '💪',
  upper_back: '🔙',
  lower_back: '🦴',
  wrists: '🖐️',
  hips: '🦵',
  eyes: '👁️',
  general: '🧘',
};

export default function RoutinePreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const isPro = useSettingsStore((state) => state.is_pro);

  // Get routine from content service
  const routineData = contentService.getRoutineById(id as string);

  // If routine not found, show fallback
  if (!routineData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <IconButton
            icon="✕"
            onPress={() => router.back()}
            variant="ghost"
            size="md"
            accessibilityLabel="Zavřít"
          />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>🤔</Text>
          <Text style={[styles.errorText, { color: colors.textPrimary }]}>Rutina nenalezena</Text>
          <Button variant="primary" onPress={() => router.back()}>
            Zpět
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const routine = routineData;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins} min`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getExerciseDuration = (re: typeof routine.exercises[0]) => {
    return re.duration_override ?? re.exercise.duration_default;
  };

  const emoji = BODY_PART_EMOJIS[routine.target_body_part] || '🧘';

  const handleStart = () => {
    router.push({
      pathname: '/routine/player',
      params: { routineId: routine.id },
    });
  };

  // Check if this is a Pro routine and user doesn't have Pro
  const isLocked = routine.is_pro && !isPro;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="✕"
          onPress={() => router.back()}
          variant="ghost"
          size="md"
          accessibilityLabel="Zavřít"
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Preview Image */}
        <View style={[styles.previewImage, { backgroundColor: colors.primary + '20' }]}>
          <Text style={styles.previewEmoji}>{emoji}</Text>
        </View>

        {/* Routine Info */}
        <Text style={[styles.routineName, { color: colors.textPrimary }]}>{routine.name}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{formatDuration(routine.duration_total)}</Text>
            <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Délka</Text>
          </View>
          <View style={[styles.metaDivider, { backgroundColor: colors.cardBorder }]} />
          <View style={styles.metaItem}>
            <Text style={[styles.metaValue, { color: colors.textPrimary }]}>{routine.exercises.length}</Text>
            <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Cviků</Text>
          </View>
          <View style={[styles.metaDivider, { backgroundColor: colors.cardBorder }]} />
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{routine.is_pro ? '⭐' : '🆓'}</Text>
            <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>{routine.is_pro ? 'Pro' : 'Free'}</Text>
          </View>
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]}>{routine.description}</Text>

        {/* Exercise List */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Cviky v rutině</Text>
        {routine.exercises.map((routineExercise, index) => (
          <View key={`${routineExercise.exercise_id}-${index}`} style={[styles.exerciseRow, { borderBottomColor: colors.cardBorder }]}>
            <View style={[styles.exerciseNumber, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.exerciseNumberText, { color: colors.primary }]}>{index + 1}</Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={[styles.exerciseName, { color: colors.textPrimary }]}>{routineExercise.exercise.name}</Text>
              <Text style={[styles.exerciseDuration, { color: colors.textSecondary }]}>{getExerciseDuration(routineExercise)}s</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Start Button */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.cardBorder }]}>
        {isLocked ? (
          <Link href="/paywall" asChild>
            <TouchableOpacity>
              <Button variant="pro" fullWidth onPress={() => {}}>
                Odemknout Pro
              </Button>
            </TouchableOpacity>
          </Link>
        ) : (
          <Button variant="primary" fullWidth onPress={handleStart}>
            Začít nyní
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  previewImage: {
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  previewEmoji: {
    fontSize: 80,
  },
  routineName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  metaItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  metaValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  metaLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  metaDivider: {
    width: 1,
    height: 30,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: '600',
  },
  exerciseInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 16,
  },
  exerciseDuration: {
    fontSize: 14,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
});
