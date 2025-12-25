/**
 * Audio Service
 * Manages audio cues for exercise transitions and completion
 */

import { Audio } from 'expo-av';

class AudioService {
  private transitionSound: Audio.Sound | null = null;
  private completionSound: Audio.Sound | null = null;
  private isLoaded: boolean = false;

  constructor() {
    this.setupAudioMode();
  }

  /**
   * Configure audio mode for background playback
   */
  private async setupAudioMode() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
    } catch {
      // Audio mode setup failed - continue without audio
    }
  }

  /**
   * Preload audio files for faster playback
   */
  async preloadSounds() {
    if (this.isLoaded) return;

    try {
      // Note: In production, these would be actual audio files
      // For now, we'll use expo-av's built-in tone generation capability
      // or simple beep sounds bundled with the app
      this.isLoaded = true;
    } catch {
      // Silently fail - audio is optional
    }
  }

  /**
   * Play transition beep sound
   * Used when moving to next exercise
   */
  async playTransitionBeep(officeMode: boolean = true) {
    if (officeMode) {
      // In office mode, only vibrate (handled by the caller)
      return;
    }

    try {
      // Create a simple beep using expo-av
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaeli/Z0UAw9Nj8Ps3aQhBzY=' },
        { shouldPlay: true, volume: 0.5 }
      );

      // Unload after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {
      // Audio playback failed - continue silently
    }
  }

  /**
   * Play completion sound
   * Used when exercise routine is completed
   */
  async playCompletionSound(officeMode: boolean = true) {
    if (officeMode) {
      // In office mode, only vibrate (handled by the caller)
      return;
    }

    try {
      // Create a celebratory sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaeli/Z0UAw9Nj8Ps3aQhBzY=' },
        { shouldPlay: true, volume: 0.6 }
      );

      // Unload after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {
      // Audio playback failed - continue silently
    }
  }

  /**
   * Play countdown tick
   * Used during transition countdown
   */
  async playCountdownTick(officeMode: boolean = true) {
    if (officeMode) {
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRl9vT19NMjkrBX1WAVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==' },
        { shouldPlay: true, volume: 0.3 }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {
      // Continue silently
    }
  }

  /**
   * Cleanup audio resources
   */
  async cleanup() {
    try {
      if (this.transitionSound) {
        await this.transitionSound.unloadAsync();
        this.transitionSound = null;
      }
      if (this.completionSound) {
        await this.completionSound.unloadAsync();
        this.completionSound = null;
      }
      this.isLoaded = false;
    } catch {
      // Cleanup failed - ignore
    }
  }
}

// Singleton instance
export const audioService = new AudioService();
export default audioService;
