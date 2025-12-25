import { Stack } from 'expo-router';

export default function RoutineLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="[id]"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="player"
        options={{
          presentation: 'fullScreenModal',
          animation: 'fade',
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
