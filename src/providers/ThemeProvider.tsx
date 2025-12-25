import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { TamaguiProvider, Theme } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tamaguiConfig from '../../tamagui.config';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'deskfix-theme-mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
          setThemeModeState(saved);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Resolve actual theme based on mode
  const resolvedTheme: 'light' | 'dark' =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode;

  const contextValue: ThemeContextType = {
    theme: resolvedTheme,
    themeMode,
    setThemeMode,
    isDark: resolvedTheme === 'dark',
  };

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={resolvedTheme}>
        <Theme name={resolvedTheme}>{children}</Theme>
      </TamaguiProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function useThemeColors() {
  const { isDark } = useTheme();

  return {
    // Backgrounds
    background: isDark ? '#0F172A' : '#F8FAFC',
    backgroundStrong: isDark ? '#1E293B' : '#FFFFFF',
    cardBackground: isDark ? '#1E293B' : '#FFFFFF',
    cardBorder: isDark ? '#334155' : '#E2E8F0',

    // Text
    textPrimary: isDark ? '#F1F5F9' : '#0F172A',
    textSecondary: isDark ? '#CBD5E1' : '#64748B',
    textTertiary: isDark ? '#94A3B8' : '#94A3B8',
    textInverse: isDark ? '#0F172A' : '#FFFFFF',

    // Brand
    primary: isDark ? '#60A5FA' : '#4A90E2',
    primaryHover: '#3B82F6',
    secondary: isDark ? '#34D399' : '#10B981',
    accent: isDark ? '#FBBF24' : '#F59E0B',

    // Status
    success: isDark ? '#34D399' : '#10B981',
    warning: isDark ? '#FBBF24' : '#F59E0B',
    error: isDark ? '#F87171' : '#EF4444',
    info: isDark ? '#38BDF8' : '#0EA5E9',

    // Pro badge
    proBadgeBackground: isDark ? '#422006' : '#FEF3C7',
    proBadgeText: isDark ? '#FBBF24' : '#D97706',

    // Streak
    streakBackground: isDark ? '#422006' : '#FEF3C7',
    streakText: isDark ? '#D97706' : '#D97706',

    // Player (always dark-ish)
    playerBackground: isDark ? '#0F172A' : '#1F2937',
    playerText: '#FFFFFF',
    playerSecondary: '#9CA3AF',
  };
}
