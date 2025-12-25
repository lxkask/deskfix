/**
 * Secure Storage Service
 * Uses expo-secure-store for encrypted storage of sensitive data
 * Falls back to AsyncStorage on web (with warning)
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Keys for secure storage
export const SECURE_KEYS = {
  PRO_STATUS: 'deskfix_pro_status',
  PURCHASE_TOKEN: 'deskfix_purchase_token',
  DISCLAIMER_ACCEPTED: 'deskfix_disclaimer_accepted',
  AUTH_TOKEN: 'deskfix_auth_token',
} as const;

type SecureKey = typeof SECURE_KEYS[keyof typeof SECURE_KEYS];

class SecureStorageService {
  private isSecureAvailable: boolean = false;

  constructor() {
    this.checkAvailability();
  }

  /**
   * Check if secure storage is available (not on web)
   */
  private async checkAvailability() {
    if (Platform.OS === 'web') {
      this.isSecureAvailable = false;
      if (__DEV__) {
        console.warn('SecureStore is not available on web. Using AsyncStorage as fallback.');
      }
    } else {
      this.isSecureAvailable = await SecureStore.isAvailableAsync();
    }
  }

  /**
   * Store a value securely
   */
  async setItem(key: SecureKey, value: string): Promise<void> {
    try {
      if (this.isSecureAvailable && Platform.OS !== 'web') {
        await SecureStore.setItemAsync(key, value, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
      } else {
        // Fallback to AsyncStorage on web
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('SecureStorage setItem error:', error);
      }
      throw error;
    }
  }

  /**
   * Get a value from secure storage
   */
  async getItem(key: SecureKey): Promise<string | null> {
    try {
      if (this.isSecureAvailable && Platform.OS !== 'web') {
        return await SecureStore.getItemAsync(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('SecureStorage getItem error:', error);
      }
      return null;
    }
  }

  /**
   * Delete a value from secure storage
   */
  async deleteItem(key: SecureKey): Promise<void> {
    try {
      if (this.isSecureAvailable && Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('SecureStorage deleteItem error:', error);
      }
    }
  }

  /**
   * Store Pro subscription status securely
   */
  async setProStatus(isPro: boolean, purchaseToken?: string): Promise<void> {
    await this.setItem(SECURE_KEYS.PRO_STATUS, JSON.stringify({ isPro, timestamp: Date.now() }));
    if (purchaseToken) {
      await this.setItem(SECURE_KEYS.PURCHASE_TOKEN, purchaseToken);
    }
  }

  /**
   * Get Pro subscription status
   */
  async getProStatus(): Promise<{ isPro: boolean; timestamp: number } | null> {
    const data = await this.getItem(SECURE_KEYS.PRO_STATUS);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Store disclaimer acceptance securely
   */
  async setDisclaimerAccepted(accepted: boolean): Promise<void> {
    await this.setItem(
      SECURE_KEYS.DISCLAIMER_ACCEPTED,
      JSON.stringify({ accepted, timestamp: Date.now() })
    );
  }

  /**
   * Check if disclaimer was accepted
   */
  async isDisclaimerAccepted(): Promise<boolean> {
    const data = await this.getItem(SECURE_KEYS.DISCLAIMER_ACCEPTED);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        return parsed.accepted === true;
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Clear all secure data (for account deletion / GDPR)
   */
  async clearAll(): Promise<void> {
    const keys = Object.values(SECURE_KEYS);
    await Promise.all(keys.map((key) => this.deleteItem(key)));
  }
}

// Singleton instance
export const secureStorage = new SecureStorageService();
export default secureStorage;
