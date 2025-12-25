import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '@/providers/ThemeProvider';
import { Feather } from '@expo/vector-icons';

const HomeIcon = ({ color }: { color: string }) => (
  <View style={styles.iconContainer}>
    <Feather name="home" size={24} color={color} />
  </View>
);

const PreventionIcon = ({ color }: { color: string }) => (
  <View style={styles.iconContainer}>
    <Feather name="bell" size={24} color={color} />
  </View>
);

const ProgressIcon = ({ color }: { color: string }) => (
  <View style={styles.iconContainer}>
    <Feather name="bar-chart-2" size={24} color={color} />
  </View>
);

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
          backgroundColor: colors.cardBackground,
          borderTopWidth: 1,
          borderTopColor: colors.cardBorder,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.cardBackground,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: colors.textPrimary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Domov',
          headerTitle: 'DeskFix',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="prevention"
        options={{
          title: 'Prevence',
          headerTitle: 'Hourly Nudge',
          tabBarIcon: ({ color }) => <PreventionIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Pokrok',
          headerTitle: 'Tvůj pokrok',
          tabBarIcon: ({ color }) => <ProgressIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
