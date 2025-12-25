import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserSettings {
  // Onboarding
  onboarding_completed: boolean;
  pain_areas: string[]; // ['neck', 'shoulders', 'lower_back']

  // Notifications
  hourly_nudge_enabled: boolean;
  work_hours_start: string; // "09:00"
  work_hours_end: string; // "17:00"

  // Preferences
  office_mode: boolean; // Vibration only, no sounds

  // Pro features
  is_pro: boolean;

  // Streak tracking
  current_streak: number;
  longest_streak: number;
  last_exercise_date: string | null; // ISO date string
}

interface SettingsState extends UserSettings {
  // Actions
  setOnboardingComplete: (completed: boolean) => void;
  setPainAreas: (areas: string[]) => void;
  toggleHourlyNudge: (enabled: boolean) => void;
  setWorkHours: (start: string, end: string) => void;
  toggleOfficeMode: (enabled: boolean) => void;
  setPro: (isPro: boolean) => void;
  updateStreak: () => void;
  resetSettings: () => void;
}

const initialState: UserSettings = {
  onboarding_completed: false,
  pain_areas: [],
  hourly_nudge_enabled: false,
  work_hours_start: '09:00',
  work_hours_end: '17:00',
  office_mode: true,
  is_pro: false,
  current_streak: 0,
  longest_streak: 0,
  last_exercise_date: null,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setOnboardingComplete: (completed) => {
        set({ onboarding_completed: completed });
      },

      setPainAreas: (areas) => {
        set({ pain_areas: areas });
      },

      toggleHourlyNudge: (enabled) => {
        set({ hourly_nudge_enabled: enabled });
      },

      setWorkHours: (start, end) => {
        set({ work_hours_start: start, work_hours_end: end });
      },

      toggleOfficeMode: (enabled) => {
        set({ office_mode: enabled });
      },

      setPro: (isPro) => {
        set({ is_pro: isPro });
      },

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { last_exercise_date, current_streak, longest_streak } = get();

        if (last_exercise_date === today) {
          // Already exercised today, no update needed
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak: number;
        if (last_exercise_date === yesterdayStr) {
          // Consecutive day - increment streak
          newStreak = current_streak + 1;
        } else {
          // Streak broken - start fresh
          newStreak = 1;
        }

        const newLongest = Math.max(newStreak, longest_streak);

        set({
          current_streak: newStreak,
          longest_streak: newLongest,
          last_exercise_date: today,
        });
      },

      resetSettings: () => {
        set(initialState);
      },
    }),
    {
      name: 'deskfix-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useSettingsStore;
