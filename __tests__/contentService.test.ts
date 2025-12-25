import { contentService } from '../src/services/contentService';

describe('contentService', () => {
  it('should load exercises from JSON', () => {
    const exercises = contentService.getAllExercises();
    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises[0]).toHaveProperty('id');
    expect(exercises[0]).toHaveProperty('name');
    expect(exercises[0]).toHaveProperty('duration_default');
  });

  it('should load routines from JSON', () => {
    const routines = contentService.getAllRoutines();
    expect(routines.length).toBeGreaterThan(0);
    expect(routines[0]).toHaveProperty('id');
    expect(routines[0]).toHaveProperty('name');
    expect(routines[0]).toHaveProperty('exercises');
  });

  it('should get exercise by ID', () => {
    const exercise = contentService.getExerciseById('ex_001');
    expect(exercise).toBeDefined();
    expect(exercise?.id).toBe('ex_001');
  });

  it('should return undefined for non-existent exercise', () => {
    const exercise = contentService.getExerciseById('non_existent');
    expect(exercise).toBeUndefined();
  });

  it('should get routine by ID', () => {
    const routine = contentService.getRoutineById('neck-quick-relief');
    expect(routine).toBeDefined();
    expect(routine?.id).toBe('neck-quick-relief');
    expect(routine?.exercises.length).toBeGreaterThan(0);
  });

  it('should return undefined for non-existent routine', () => {
    const routine = contentService.getRoutineById('non_existent');
    expect(routine).toBeUndefined();
  });

  it('should get exercises by body part', () => {
    const neckExercises = contentService.getExercisesByBodyPart('neck');
    expect(neckExercises.length).toBeGreaterThan(0);
    neckExercises.forEach((ex) => {
      expect(ex.target_body_part).toContain('neck');
    });
  });

  it('should get routines by body part', () => {
    const neckRoutines = contentService.getRoutinesByBodyPart('neck');
    expect(neckRoutines.length).toBeGreaterThan(0);
    neckRoutines.forEach((routine) => {
      expect(routine.target_body_part).toBe('neck');
    });
  });

  it('should get free routines', () => {
    const freeRoutines = contentService.getFreeRoutines();
    expect(freeRoutines.length).toBeGreaterThan(0);
    freeRoutines.forEach((routine) => {
      expect(routine.is_pro).toBe(false);
    });
  });

  it('should get pro routines', () => {
    const proRoutines = contentService.getProRoutines();
    proRoutines.forEach((routine) => {
      expect(routine.is_pro).toBe(true);
    });
  });

  it('should get random exercise', () => {
    const exercise = contentService.getRandomExercise();
    expect(exercise).toBeDefined();
    expect(exercise).toHaveProperty('id');
  });

  it('should get random exercise for specific body part', () => {
    const exercise = contentService.getRandomExercise('neck');
    expect(exercise).toBeDefined();
    expect(exercise?.target_body_part).toContain('neck');
  });

  it('should create micro routine from exercise', () => {
    const exercise = contentService.getExerciseById('ex_001');
    if (!exercise) throw new Error('Exercise not found');

    const microRoutine = contentService.createMicroRoutine(exercise);

    expect(microRoutine.id).toBe('micro-ex_001');
    expect(microRoutine.duration_total).toBe(30);
    expect(microRoutine.exercises).toHaveLength(1);
    expect(microRoutine.exercises[0].duration_override).toBe(30);
    expect(microRoutine.is_pro).toBe(false);
  });

  it('should resolve exercise references in routines', () => {
    const routine = contentService.getRoutineById('neck-quick-relief');
    expect(routine).toBeDefined();

    routine?.exercises.forEach((re) => {
      expect(re.exercise).toBeDefined();
      expect(re.exercise.id).toBe(re.exercise_id);
    });
  });
});
