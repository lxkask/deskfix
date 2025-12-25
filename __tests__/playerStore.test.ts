import { usePlayerStore, Routine } from '../src/stores/playerStore';

const mockRoutine: Routine = {
  id: 'test-routine',
  name: 'Test Routine',
  description: 'A test routine',
  target_body_part: 'neck',
  duration_total: 120,
  exercises: [
    {
      exercise_id: 'ex_001',
      exercise: {
        id: 'ex_001',
        name: 'Test Exercise 1',
        description: 'First exercise',
        video_url: 'https://example.com/video1.mp4',
        thumbnail_url: 'https://example.com/thumb1.jpg',
        duration_default: 60,
        target_body_part: ['neck'],
        tags: ['office-friendly'],
        difficulty: 'beginner',
      },
      order: 1,
      duration_override: 45,
    },
    {
      exercise_id: 'ex_002',
      exercise: {
        id: 'ex_002',
        name: 'Test Exercise 2',
        description: 'Second exercise',
        video_url: 'https://example.com/video2.mp4',
        thumbnail_url: 'https://example.com/thumb2.jpg',
        duration_default: 60,
        target_body_part: ['neck'],
        tags: ['office-friendly'],
        difficulty: 'beginner',
      },
      order: 2,
    },
  ],
  is_pro: false,
};

describe('playerStore', () => {
  beforeEach(() => {
    // Reset store to idle state
    usePlayerStore.getState().reset();
  });

  it('should start in idle state', () => {
    const { state, routine } = usePlayerStore.getState();
    expect(state).toBe('idle');
    expect(routine).toBeNull();
  });

  it('should load routine and enter preparing state', () => {
    usePlayerStore.getState().loadRoutine(mockRoutine);

    const store = usePlayerStore.getState();
    expect(store.state).toBe('preparing');
    expect(store.routine).toBe(mockRoutine);
    expect(store.currentExerciseIndex).toBe(0);
    // Should use duration_override (45) instead of default (60)
    expect(store.timeRemaining).toBe(45);
  });

  it('should play and pause correctly', () => {
    usePlayerStore.getState().loadRoutine(mockRoutine);
    usePlayerStore.getState().play();

    expect(usePlayerStore.getState().state).toBe('playing');

    usePlayerStore.getState().pause();

    expect(usePlayerStore.getState().state).toBe('paused');
  });

  it('should resume from paused state', () => {
    usePlayerStore.getState().loadRoutine(mockRoutine);
    usePlayerStore.getState().play();
    usePlayerStore.getState().pause();
    usePlayerStore.getState().resume();

    expect(usePlayerStore.getState().state).toBe('playing');
  });

  it('should tick and decrease time', () => {
    usePlayerStore.getState().loadRoutine(mockRoutine);
    usePlayerStore.getState().play();

    const initialTime = usePlayerStore.getState().timeRemaining;

    usePlayerStore.getState().tick();

    expect(usePlayerStore.getState().timeRemaining).toBe(initialTime - 1);
    expect(usePlayerStore.getState().totalTimeElapsed).toBe(1);
  });

  it('should skip to next exercise', () => {
    usePlayerStore.getState().loadRoutine(mockRoutine);
    usePlayerStore.getState().play();
    usePlayerStore.getState().skip();

    expect(usePlayerStore.getState().state).toBe('transitioning');
  });

  it('should complete when last exercise finishes', () => {
    usePlayerStore.getState().loadRoutine(mockRoutine);
    usePlayerStore.getState().play();

    // Skip to second exercise
    usePlayerStore.getState().skip();

    // Complete transition
    usePlayerStore.getState()._nextExercise();

    expect(usePlayerStore.getState().currentExerciseIndex).toBe(1);

    // Skip last exercise - should complete
    usePlayerStore.getState().skip();

    expect(usePlayerStore.getState().state).toBe('completed');
  });

  it('should reset to idle state', () => {
    usePlayerStore.getState().loadRoutine(mockRoutine);
    usePlayerStore.getState().play();
    usePlayerStore.getState().reset();

    const store = usePlayerStore.getState();
    expect(store.state).toBe('idle');
    expect(store.routine).toBeNull();
    expect(store.currentExerciseIndex).toBe(0);
    expect(store.timeRemaining).toBe(0);
  });

  it('should restart routine', () => {
    usePlayerStore.getState().loadRoutine(mockRoutine);
    usePlayerStore.getState().play();
    usePlayerStore.getState().tick();
    usePlayerStore.getState().tick();
    usePlayerStore.getState().restart();

    const store = usePlayerStore.getState();
    expect(store.state).toBe('playing');
    expect(store.currentExerciseIndex).toBe(0);
    expect(store.timeRemaining).toBe(45); // Reset to duration_override
  });

  it('should track exercise count correctly', () => {
    usePlayerStore.getState().loadRoutine(mockRoutine);

    const store = usePlayerStore.getState();
    expect(store.routine?.exercises.length).toBe(2);
    expect(store.currentExerciseIndex).toBe(0);
  });
});
