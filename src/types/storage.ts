/**
 * AsyncStorage utilities for DeskFix
 * Handles storage and retrieval of user settings and notification state
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings, NotificationState } from './index';

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  USER_SETTINGS: '@deskfix:user_settings',
  NOTIFICATION_STATE: '@deskfix:notification_state',
  REMOTE_CONFIG_CACHE: '@deskfix:remote_config_cache',
  LAST_CONFIG_FETCH: '@deskfix:last_config_fetch',
} as const;

/**
 * Save user settings to AsyncStorage
 * @param settings - User settings object
 */
export async function saveUserSettings(
  settings: UserSettings
): Promise<void> {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, jsonValue);
  } catch (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
}

/**
 * Load user settings from AsyncStorage
 * @returns User settings or null if not found
 */
export async function loadUserSettings(): Promise<UserSettings | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading user settings:', error);
    return null;
  }
}

/**
 * Update specific user setting
 * @param key - Setting key to update
 * @param value - New value
 */
export async function updateUserSetting<K extends keyof UserSettings>(
  key: K,
  value: UserSettings[K]
): Promise<void> {
  try {
    const settings = await loadUserSettings();
    if (settings) {
      settings[key] = value;
      await saveUserSettings(settings);
    }
  } catch (error) {
    console.error('Error updating user setting:', error);
    throw error;
  }
}

/**
 * Save notification state to AsyncStorage
 * @param state - Notification state object
 */
export async function saveNotificationState(
  state: NotificationState
): Promise<void> {
  try {
    const jsonValue = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_STATE, jsonValue);
  } catch (error) {
    console.error('Error saving notification state:', error);
    throw error;
  }
}

/**
 * Load notification state from AsyncStorage
 * @returns Notification state or default state if not found
 */
export async function loadNotificationState(): Promise<NotificationState> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_STATE);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }

    // Return default state
    const defaultState: NotificationState = {
      last_shown_exercises: [],
      scheduled_notification_ids: [],
      daily_notification_count: 0,
    };
    await saveNotificationState(defaultState);
    return defaultState;
  } catch (error) {
    console.error('Error loading notification state:', error);
    return {
      last_shown_exercises: [],
      scheduled_notification_ids: [],
      daily_notification_count: 0,
    };
  }
}

/**
 * Add exercise to last shown list (for rotation)
 * @param exerciseId - Exercise ID to add
 * @param maxHistory - Maximum number of exercises to keep in history
 */
export async function addToLastShownExercises(
  exerciseId: string,
  maxHistory: number = 10
): Promise<void> {
  try {
    const state = await loadNotificationState();
    state.last_shown_exercises = [
      exerciseId,
      ...state.last_shown_exercises.filter((id) => id !== exerciseId),
    ].slice(0, maxHistory);

    await saveNotificationState(state);
  } catch (error) {
    console.error('Error adding to last shown exercises:', error);
    throw error;
  }
}

/**
 * Update scheduled notification IDs
 * @param notificationIds - Array of active notification IDs
 */
export async function updateScheduledNotifications(
  notificationIds: string[]
): Promise<void> {
  try {
    const state = await loadNotificationState();
    state.scheduled_notification_ids = notificationIds;
    await saveNotificationState(state);
  } catch (error) {
    console.error('Error updating scheduled notifications:', error);
    throw error;
  }
}

/**
 * Clear all app data (for logout/reset)
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_SETTINGS,
      STORAGE_KEYS.NOTIFICATION_STATE,
      STORAGE_KEYS.REMOTE_CONFIG_CACHE,
      STORAGE_KEYS.LAST_CONFIG_FETCH,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
}

/**
 * Cache remote config locally
 * @param config - Remote config object
 */
export async function cacheRemoteConfig(config: any): Promise<void> {
  try {
    const jsonValue = JSON.stringify(config);
    await AsyncStorage.setItem(STORAGE_KEYS.REMOTE_CONFIG_CACHE, jsonValue);
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_CONFIG_FETCH,
      new Date().toISOString()
    );
  } catch (error) {
    console.error('Error caching remote config:', error);
    throw error;
  }
}

/**
 * Load cached remote config
 * @returns Cached config or null
 */
export async function loadCachedRemoteConfig(): Promise<any | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.REMOTE_CONFIG_CACHE);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading cached remote config:', error);
    return null;
  }
}

/**
 * Check if remote config cache is stale
 * @param maxAgeHours - Maximum cache age in hours (default 24)
 * @returns True if cache should be refreshed
 */
export async function isRemoteConfigCacheStale(
  maxAgeHours: number = 24
): Promise<boolean> {
  try {
    const lastFetch = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CONFIG_FETCH);
    if (!lastFetch) return true;

    const lastFetchTime = new Date(lastFetch).getTime();
    const now = Date.now();
    const ageHours = (now - lastFetchTime) / (1000 * 60 * 60);

    return ageHours >= maxAgeHours;
  } catch (error) {
    console.error('Error checking cache staleness:', error);
    return true;
  }
}
