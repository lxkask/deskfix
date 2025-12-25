/**
 * Notification Service
 * Manages Hourly Nudge notifications for exercise reminders
 */

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { contentService } from './contentService';

const LAST_EXERCISES_KEY = 'deskfix_last_exercises';
const MAX_STORED_EXERCISES = 3;
const NOTIFICATION_CHANNEL_ID = 'hourly-nudge';

interface ScheduleOptions {
  workStart: string; // "09:00"
  workEnd: string; // "17:00"
  officeMode: boolean;
}

class NotificationService {
  private lastExerciseIds: string[] = [];

  constructor() {
    this.loadLastExercises();
    this.setupNotificationChannel();
  }

  /**
   * Setup Android notification channel
   */
  private async setupNotificationChannel() {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'Hodinové připomínky',
      description: 'Připomínky na protažení každou hodinu',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 200, 100, 200],
      enableVibrate: true,
    });
  }

  /**
   * Load last shown exercise IDs from storage
   */
  private async loadLastExercises() {
    try {
      const stored = await AsyncStorage.getItem(LAST_EXERCISES_KEY);
      if (stored) {
        this.lastExerciseIds = JSON.parse(stored);
      }
    } catch {
      this.lastExerciseIds = [];
    }
  }

  /**
   * Save last shown exercise IDs to storage
   */
  private async saveLastExercises() {
    try {
      await AsyncStorage.setItem(
        LAST_EXERCISES_KEY,
        JSON.stringify(this.lastExerciseIds)
      );
    } catch {
      // Silently fail
    }
  }

  /**
   * Get a random exercise that wasn't shown recently (anti-repetition)
   */
  getRandomExerciseWithoutRepetition(): ReturnType<typeof contentService.getRandomExercise> {
    const allExercises = contentService.getAllExercises();

    // Filter out recently shown exercises
    const availableExercises = allExercises.filter(
      (ex) => !this.lastExerciseIds.includes(ex.id)
    );

    // If all exercises were recently shown, use any exercise
    const exercisesToPickFrom = availableExercises.length > 0
      ? availableExercises
      : allExercises;

    if (exercisesToPickFrom.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * exercisesToPickFrom.length);
    const selectedExercise = exercisesToPickFrom[randomIndex];

    // Update last shown exercises
    this.lastExerciseIds.push(selectedExercise.id);
    if (this.lastExerciseIds.length > MAX_STORED_EXERCISES) {
      this.lastExerciseIds.shift();
    }
    this.saveLastExercises();

    return selectedExercise;
  }

  /**
   * Parse time string to hours and minutes
   */
  private parseTime(timeStr: string): { hours: number; minutes: number } {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
  }

  /**
   * Check if current time is within work hours
   */
  isWithinWorkHours(workStart: string, workEnd: string): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const start = this.parseTime(workStart);
    const end = this.parseTime(workEnd);
    const startTime = start.hours * 60 + start.minutes;
    const endTime = end.hours * 60 + end.minutes;

    return currentTime >= startTime && currentTime < endTime;
  }

  /**
   * Get next work hour timestamp
   */
  private getNextWorkHour(workStart: string, workEnd: string): Date | null {
    const now = new Date();
    const start = this.parseTime(workStart);
    const end = this.parseTime(workEnd);

    // Start from next hour
    const nextHour = new Date(now);
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(nextHour.getHours() + 1);

    // Check if next hour is within work hours
    const nextHourValue = nextHour.getHours();

    if (nextHourValue >= start.hours && nextHourValue < end.hours) {
      return nextHour;
    }

    // If after work hours, schedule for tomorrow's start
    if (nextHourValue >= end.hours) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(start.hours, start.minutes, 0, 0);
      return tomorrow;
    }

    // If before work hours, schedule for today's start
    const todayStart = new Date(now);
    todayStart.setHours(start.hours, start.minutes, 0, 0);
    return todayStart;
  }

  /**
   * Schedule all hourly notifications for work hours
   */
  async scheduleHourlyNudges(options: ScheduleOptions): Promise<void> {
    // Cancel existing notifications first
    await this.cancelAllNudges();

    const start = this.parseTime(options.workStart);
    const end = this.parseTime(options.workEnd);

    // Schedule notifications for each hour during work hours
    for (let hour = start.hours; hour < end.hours; hour++) {
      const exercise = this.getRandomExerciseWithoutRepetition();
      if (!exercise) continue;

      const trigger: Notifications.DailyTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Čas na protažení! 🧘',
          body: exercise.name,
          data: {
            type: 'hourly_nudge',
            exerciseId: exercise.id,
          },
          sound: options.officeMode ? undefined : 'default',
          vibrate: [0, 200, 100, 200],
          categoryIdentifier: 'hourly-nudge',
        },
        trigger,
      });
    }
  }

  /**
   * Schedule a single immediate test notification
   */
  async scheduleTestNotification(officeMode: boolean = true): Promise<void> {
    const exercise = this.getRandomExerciseWithoutRepetition();
    if (!exercise) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Čas na protažení! 🧘',
        body: exercise.name,
        data: {
          type: 'hourly_nudge',
          exerciseId: exercise.id,
        },
        sound: officeMode ? undefined : 'default',
        vibrate: [0, 200, 100, 200],
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
      },
    });
  }

  /**
   * Cancel all scheduled nudge notifications
   */
  async cancelAllNudges(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all scheduled notifications (for debugging)
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Check if notifications are enabled
   */
  async areNotificationsEnabled(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }
}

// Singleton instance
export const notificationService = new NotificationService();
export default notificationService;
