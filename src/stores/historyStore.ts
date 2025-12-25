import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettingsStore } from './settingsStore';

export type FeedbackEmoji = '😊' | '😐' | '😔' | null;

export interface HistoryLog {
  id: string;
  timestamp: string; // ISO date string
  routine_id: string;
  routine_name: string;
  exercises_completed: string[]; // exercise IDs
  body_parts: string[];
  duration_total: number; // seconds
  feedback: FeedbackEmoji;
  was_nudge: boolean; // true if triggered by Hourly Nudge
}

interface HistoryState {
  logs: HistoryLog[];

  // Actions
  addLog: (log: Omit<HistoryLog, 'id' | 'timestamp'>) => void;
  updateFeedback: (logId: string, feedback: FeedbackEmoji) => void;
  getLogsForDate: (date: string) => HistoryLog[];
  getLogsForBodyPart: (bodyPart: string) => HistoryLog[];
  getTodayLogs: () => HistoryLog[];
  getRecentLogs: (limit?: number) => HistoryLog[];
  getStats: () => HistoryStats;
  clearHistory: () => void;
}

export interface HistoryStats {
  totalSessions: number;
  totalMinutes: number;
  bodyPartCounts: Record<string, number>;
  weeklyActivity: number[]; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  averageSessionDuration: number;
  positiveFeedbackRate: number;
}

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      logs: [],

      addLog: (logData) => {
        const newLog: HistoryLog = {
          ...logData,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          logs: [newLog, ...state.logs],
        }));

        // Update streak after adding new log
        useSettingsStore.getState().updateStreak();
      },

      updateFeedback: (logId, feedback) => {
        set((state) => ({
          logs: state.logs.map((log) =>
            log.id === logId ? { ...log, feedback } : log
          ),
        }));
      },

      getLogsForDate: (date) => {
        const { logs } = get();
        return logs.filter((log) => log.timestamp.startsWith(date));
      },

      getLogsForBodyPart: (bodyPart) => {
        const { logs } = get();
        return logs.filter((log) => log.body_parts.includes(bodyPart));
      },

      getTodayLogs: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().getLogsForDate(today);
      },

      getRecentLogs: (limit = 10) => {
        const { logs } = get();
        return logs.slice(0, limit);
      },

      getStats: () => {
        const { logs } = get();

        // Total sessions and minutes
        const totalSessions = logs.length;
        const totalMinutes = Math.round(
          logs.reduce((sum, log) => sum + log.duration_total, 0) / 60
        );

        // Body part counts
        const bodyPartCounts: Record<string, number> = {};
        logs.forEach((log) => {
          log.body_parts.forEach((part) => {
            bodyPartCounts[part] = (bodyPartCounts[part] || 0) + 1;
          });
        });

        // Weekly activity (last 7 days)
        const weeklyActivity: number[] = [0, 0, 0, 0, 0, 0, 0];
        const now = new Date();
        logs.forEach((log) => {
          const logDate = new Date(log.timestamp);
          const diffDays = Math.floor(
            (now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (diffDays < 7) {
            const dayIndex = logDate.getDay(); // 0 = Sunday
            // Convert to Monday = 0
            const mondayBasedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
            weeklyActivity[mondayBasedIndex]++;
          }
        });

        // Average session duration
        const averageSessionDuration =
          totalSessions > 0
            ? Math.round(
                logs.reduce((sum, log) => sum + log.duration_total, 0) /
                  totalSessions
              )
            : 0;

        // Positive feedback rate
        const logsWithFeedback = logs.filter((log) => log.feedback !== null);
        const positiveCount = logsWithFeedback.filter(
          (log) => log.feedback === '😊'
        ).length;
        const positiveFeedbackRate =
          logsWithFeedback.length > 0
            ? Math.round((positiveCount / logsWithFeedback.length) * 100)
            : 0;

        return {
          totalSessions,
          totalMinutes,
          bodyPartCounts,
          weeklyActivity,
          averageSessionDuration,
          positiveFeedbackRate,
        };
      },

      clearHistory: () => {
        set({ logs: [] });
      },
    }),
    {
      name: 'deskfix-history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useHistoryStore;
