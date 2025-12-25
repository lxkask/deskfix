import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from '@/providers/ThemeProvider';
import { contentService } from '@/services/contentService';
import { ErrorBoundary } from '@/components';

// Notification handler configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Security: Validate exerciseId from deep links/notifications
const isValidExerciseId = (id: unknown): id is string => {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{1,50}$/.test(id);
};

function RootLayoutContent() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  // Handle notification tap - navigate to player with exercise
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;

      // Security: Validate exerciseId before navigation
      if (data?.type === 'hourly_nudge' && isValidExerciseId(data?.exerciseId)) {
        // Verify exercise exists in content
        const exercise = contentService.getExerciseById(data.exerciseId);
        if (!exercise) {
          console.warn('Invalid exerciseId in notification:', data.exerciseId);
          return;
        }

        // Navigate to player with validated exercise ID
        router.push({
          pathname: '/routine/player',
          params: { exerciseId: data.exerciseId, source: 'nudge' },
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem('onboarding_completed');
      setIsOnboardingComplete(completed === 'true');
    } catch {
      setIsOnboardingComplete(false);
    }
  };

  // Show nothing while checking onboarding status
  if (isOnboardingComplete === null) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        {!isOnboardingComplete ? (
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        ) : null}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="routine"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="paywall"
          options={{
            presentation: 'modal',
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <ThemeProvider>
            <RootLayoutContent />
          </ThemeProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
