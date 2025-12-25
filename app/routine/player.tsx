import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { usePlayerStore } from '@/stores/playerStore';
import { useHistoryStore, FeedbackEmoji } from '@/stores/historyStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { contentService } from '@/services/contentService';
import { audioService } from '@/services/audioService';
import { ExerciseVideo } from '@/components';

export default function PlayerScreen() {
  const { routineId, exerciseId, source } = useLocalSearchParams<{
    routineId?: string;
    exerciseId?: string;
    source?: string;
  }>();
  const router = useRouter();
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackEmoji>(null);

  // Player store
  const {
    state,
    routine,
    currentExerciseIndex,
    timeRemaining,
    transitionCountdown,
    loadRoutine,
    play,
    pause,
    resume,
    skip,
    reset,
    tick,
    transitionTick,
  } = usePlayerStore();

  // History store
  const { addLog } = useHistoryStore();

  // Settings for office mode
  const officeMode = useSettingsStore((state) => state.office_mode);

  // Timer refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load routine on mount
  useEffect(() => {
    let routineData = null;

    if (exerciseId) {
      // Create micro routine from exercise (from notification or random drill)
      const exercise = contentService.getExerciseById(exerciseId);
      if (exercise) {
        routineData = contentService.createMicroRoutine(exercise);
      }
    } else if (routineId) {
      // Load regular routine
      routineData = contentService.getRoutineById(routineId);
    }

    if (routineData) {
      loadRoutine(routineData);
      play();
    }

    activateKeepAwakeAsync('player');

    return () => {
      deactivateKeepAwake('player');
      reset();
      if (timerRef.current) clearInterval(timerRef.current);
      if (transitionTimerRef.current) clearInterval(transitionTimerRef.current);
    };
  }, [routineId, exerciseId]);

  // Main timer effect
  useEffect(() => {
    if (state === 'playing') {
      timerRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  // Transition timer effect with audio
  useEffect(() => {
    if (state === 'transitioning') {
      Vibration.vibrate([0, 200, 100, 200]);
      audioService.playTransitionBeep(officeMode);
      transitionTimerRef.current = setInterval(() => {
        transitionTick();
      }, 1000);
    } else {
      if (transitionTimerRef.current) {
        clearInterval(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    }

    return () => {
      if (transitionTimerRef.current) clearInterval(transitionTimerRef.current);
    };
  }, [state, officeMode]);

  // Vibrate and play sound on completion
  useEffect(() => {
    if (state === 'completed') {
      Vibration.vibrate([0, 300, 100, 300, 100, 300]);
      audioService.playCompletionSound(officeMode);
    }
  }, [state, officeMode]);

  const currentExercise = routine?.exercises[currentExerciseIndex];
  const totalExercises = routine?.exercises.length ?? 0;

  const progress = (() => {
    if (!routine || totalExercises === 0) return 0;
    const currentEx = currentExercise;
    if (!currentEx) return 1;
    const duration = currentEx.duration_override ?? currentEx.exercise.duration_default;
    const exerciseProgress = (duration - timeRemaining) / duration;
    return (currentExerciseIndex + exerciseProgress) / totalExercises;
  })();

  const handlePlayPause = () => {
    if (state === 'playing') {
      pause();
    } else if (state === 'paused') {
      resume();
    }
  };

  const handleSkip = () => {
    skip();
  };

  const handleExit = () => {
    Alert.alert(
      'Ukončit rutinu?',
      'Opravdu chceš ukončit cvičení?',
      [
        { text: 'Ne, pokračovat', style: 'cancel' },
        {
          text: 'Ano, ukončit',
          style: 'destructive',
          onPress: () => {
            reset();
            router.back();
          },
        },
      ]
    );
  };

  const handleFeedback = (emoji: FeedbackEmoji) => {
    setSelectedFeedback(emoji);
  };

  const handleComplete = () => {
    if (routine) {
      // Save to history
      addLog({
        routine_id: routine.id,
        routine_name: routine.name,
        exercises_completed: routine.exercises.map((e) => e.exercise_id),
        body_parts: [routine.target_body_part],
        duration_total: routine.duration_total,
        feedback: selectedFeedback,
        was_nudge: source === 'nudge',
      });
    }
    reset();
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Transition screen
  if (state === 'transitioning') {
    const nextExercise = routine?.exercises[currentExerciseIndex + 1];
    return (
      <SafeAreaView style={styles.transitionContainer}>
        <Text style={styles.transitionLabel}>Další cvik</Text>
        <Text style={styles.transitionExerciseName}>
          {nextExercise?.exercise.name}
        </Text>
        <View style={styles.transitionCountdownContainer}>
          <Text style={styles.transitionCountdown}>{transitionCountdown}</Text>
        </View>
        <Text style={styles.transitionHint}>Připrav se...</Text>
      </SafeAreaView>
    );
  }

  // Completed screen
  if (state === 'completed') {
    return (
      <SafeAreaView style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>🎉</Text>
        <Text style={styles.completedTitle}>Hotovo!</Text>
        <Text style={styles.completedSubtitle}>Jak se teď cítíš?</Text>
        <View style={styles.feedbackRow}>
          <TouchableOpacity
            style={[
              styles.feedbackButton,
              selectedFeedback === '😔' && styles.feedbackButtonSelected,
            ]}
            onPress={() => handleFeedback('😔')}
          >
            <Text style={styles.feedbackEmoji}>😔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.feedbackButton,
              selectedFeedback === '😐' && styles.feedbackButtonSelected,
            ]}
            onPress={() => handleFeedback('😐')}
          >
            <Text style={styles.feedbackEmoji}>😐</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.feedbackButton,
              selectedFeedback === '😊' && styles.feedbackButtonSelected,
            ]}
            onPress={() => handleFeedback('😊')}
          >
            <Text style={styles.feedbackEmoji}>😊</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.doneButton} onPress={handleComplete}>
          <Text style={styles.doneButtonText}>Uložit a zavřít</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Loading state
  if (!routine || !currentExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Načítání...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Playing/Paused state
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleExit}
          style={styles.exitButton}
          accessibilityLabel="Ukončit cvičení"
          accessibilityRole="button"
        >
          <Text style={styles.exitButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>
          {currentExerciseIndex + 1} / {totalExercises}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Video Area */}
      <View style={styles.videoArea}>
        <ExerciseVideo
          videoUrl={currentExercise.exercise.video_url}
          thumbnailUrl={currentExercise.exercise.thumbnail_url}
          bodyPart={currentExercise.exercise.target_body_part[0] || 'general'}
          isPlaying={state === 'playing'}
        />
      </View>

      {/* Exercise Info */}
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{currentExercise.exercise.name}</Text>
        <Text style={styles.exerciseDescription}>
          {currentExercise.exercise.description}
        </Text>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <View style={[styles.timerCircle, state === 'paused' && styles.timerCirclePaused]}>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          {state === 'paused' && (
            <Text style={styles.pausedLabel}>POZASTAVENO</Text>
          )}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.skipButton} disabled>
          <Text style={styles.skipButtonText}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={handlePlayPause}
          accessibilityLabel={state === 'playing' ? 'Pozastavit' : 'Pokračovat'}
          accessibilityRole="button"
        >
          <Text style={styles.playPauseText}>
            {state === 'playing' ? '⏸' : '▶️'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          accessibilityLabel="Přeskočit na další cvik"
          accessibilityRole="button"
        >
          <Text style={styles.skipButtonText}>⏭</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  exitButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  progressText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  videoArea: {
    flex: 1,
    marginVertical: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  exerciseInfo: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  timerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerCirclePaused: {
    borderColor: '#6B7280',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pausedLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 48,
    gap: 24,
  },
  skipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 24,
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseText: {
    fontSize: 32,
  },
  // Transition screen
  transitionContainer: {
    flex: 1,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  transitionLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  transitionExerciseName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 48,
  },
  transitionCountdownContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  transitionCountdown: {
    fontSize: 64,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  transitionHint: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
  },
  // Completed screen
  completedContainer: {
    flex: 1,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  completedEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  completedTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 18,
    color: '#D1FAE5',
    marginBottom: 32,
  },
  feedbackRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 48,
  },
  feedbackButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackButtonSelected: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  feedbackEmoji: {
    fontSize: 36,
  },
  doneButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
  },
});
