import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useThemeColors } from '../providers/ThemeProvider';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'pro' | 'streak' | 'stat';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Card = React.memo(function Card({
  children,
  variant = 'default',
  onPress,
  style,
  padding = 'md',
  accessibilityLabel,
  accessibilityHint,
}: CardProps) {
  const colors = useThemeColors();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 0,
          ...Platform.select({
            ios: {
              shadowColor: colors.textPrimary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 4,
            },
          }),
        };
      case 'outlined':
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        };
      case 'pro':
        return {
          backgroundColor: colors.proBadgeBackground,
          borderWidth: 0,
        };
      case 'streak':
        return {
          backgroundColor: colors.streakBackground,
          borderWidth: 0,
        };
      case 'stat':
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        };
    }
  };

  const getPaddingStyles = (): ViewStyle => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'sm':
        return { padding: 12 };
      case 'lg':
        return { padding: 24 };
      case 'md':
      default:
        return { padding: 16 };
    }
  };

  const cardStyles = [
    styles.container,
    getVariantStyles(),
    getPaddingStyles(),
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={cardStyles}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default Card;
