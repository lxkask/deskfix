import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeColors } from '../providers/ThemeProvider';

type BadgeVariant = 'pro' | 'free' | 'new' | 'success' | 'warning' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge = React.memo(function Badge({
  children,
  variant = 'pro',
  size = 'sm',
  style,
  textStyle,
}: BadgeProps) {
  const colors = useThemeColors();

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'pro':
        return {
          container: { backgroundColor: colors.proBadgeBackground },
          text: { color: colors.proBadgeText },
        };
      case 'free':
        return {
          container: { backgroundColor: colors.secondary + '20' },
          text: { color: colors.secondary },
        };
      case 'new':
        return {
          container: { backgroundColor: colors.primary + '20' },
          text: { color: colors.primary },
        };
      case 'success':
        return {
          container: { backgroundColor: colors.success + '20' },
          text: { color: colors.success },
        };
      case 'warning':
        return {
          container: { backgroundColor: colors.warning + '20' },
          text: { color: colors.warning },
        };
      case 'info':
        return {
          container: { backgroundColor: colors.info + '20' },
          text: { color: colors.info },
        };
      default:
        return {
          container: { backgroundColor: colors.proBadgeBackground },
          text: { color: colors.proBadgeText },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'md':
        return {
          container: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
          text: { fontSize: 12 },
        };
      case 'sm':
      default:
        return {
          container: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
          text: { fontSize: 10 },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        variantStyles.container,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          sizeStyles.text,
          variantStyles.text,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

export default Badge;
