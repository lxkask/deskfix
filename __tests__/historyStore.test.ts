import { useHistoryStore } from '../src/stores/historyStore';

describe('historyStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useHistoryStore.setState({ logs: [] });
  });

  it('should start with empty logs', () => {
    const { logs } = useHistoryStore.getState();
    expect(logs).toEqual([]);
  });

  it('should add a log entry', () => {
    const { addLog } = useHistoryStore.getState();

    addLog({
      routine_id: 'test-routine',
      routine_name: 'Test Routine',
      exercises_completed: ['ex_001', 'ex_002'],
      body_parts: ['neck', 'shoulders'],
      duration_total: 180,
      feedback: null,
      was_nudge: false,
    });

    const { logs } = useHistoryStore.getState();
    expect(logs).toHaveLength(1);
    expect(logs[0].routine_id).toBe('test-routine');
    expect(logs[0].body_parts).toContain('neck');
  });

  it('should update feedback on a log', () => {
    const { addLog } = useHistoryStore.getState();

    addLog({
      routine_id: 'test-routine',
      routine_name: 'Test Routine',
      exercises_completed: ['ex_001'],
      body_parts: ['neck'],
      duration_total: 60,
      feedback: null,
      was_nudge: false,
    });

    const logId = useHistoryStore.getState().logs[0].id;
    const { updateFeedback } = useHistoryStore.getState();
    updateFeedback(logId, '😊');

    const updatedLogs = useHistoryStore.getState().logs;
    expect(updatedLogs[0].feedback).toBe('😊');
  });

  it('should calculate stats correctly', () => {
    const { addLog } = useHistoryStore.getState();

    // Add two logs
    addLog({
      routine_id: 'routine-1',
      routine_name: 'Routine 1',
      exercises_completed: ['ex_001'],
      body_parts: ['neck'],
      duration_total: 120,
      feedback: '😊',
      was_nudge: false,
    });

    addLog({
      routine_id: 'routine-2',
      routine_name: 'Routine 2',
      exercises_completed: ['ex_002'],
      body_parts: ['shoulders'],
      duration_total: 180,
      feedback: '😊',
      was_nudge: true,
    });

    const stats = useHistoryStore.getState().getStats();

    expect(stats.totalSessions).toBe(2);
    expect(stats.totalMinutes).toBe(5); // (120 + 180) / 60 = 5
    expect(stats.positiveFeedbackRate).toBe(100);
    expect(stats.bodyPartCounts['neck']).toBe(1);
    expect(stats.bodyPartCounts['shoulders']).toBe(1);
  });

  it('should get today logs', () => {
    const { addLog } = useHistoryStore.getState();

    addLog({
      routine_id: 'today-routine',
      routine_name: 'Today Routine',
      exercises_completed: ['ex_001'],
      body_parts: ['neck'],
      duration_total: 60,
      feedback: null,
      was_nudge: false,
    });

    const todayLogs = useHistoryStore.getState().getTodayLogs();
    expect(todayLogs).toHaveLength(1);
    expect(todayLogs[0].routine_id).toBe('today-routine');
  });

  it('should clear history', () => {
    const { addLog } = useHistoryStore.getState();

    addLog({
      routine_id: 'test-routine',
      routine_name: 'Test',
      exercises_completed: ['ex_001'],
      body_parts: ['neck'],
      duration_total: 60,
      feedback: null,
      was_nudge: false,
    });

    expect(useHistoryStore.getState().logs).toHaveLength(1);

    useHistoryStore.getState().clearHistory();

    expect(useHistoryStore.getState().logs).toHaveLength(0);
  });
});
