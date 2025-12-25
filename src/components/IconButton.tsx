import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../providers/ThemeProvider';

type IconButtonVariant = 'default' | 'filled' | 'ghost';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps {
  icon: string; // emoji or text
  onPress: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  accessibilityLabel: string; // Required for accessibility
  accessibilityHint?: string;
  style?: ViewStyle;
  haptic?: boolean;
}

export const IconButton = React.memo(function IconButton({
  icon,
  onPress,
  variant = 'default',
  size = 'md',
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  style,
  haptic = true,
}: IconButtonProps) {
  const colors = useThemeColors();

  const handlePress = () => {
    if (disabled) return;
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
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

  // All sizes meet 48dp minimum touch target
  const getSizeStyles = (): { container: ViewStyle; fontSize: number } => {
    switch (size) {
      case 'sm':
        return {
          container: { width: 48, height: 48, borderRadius: 24 },
          fontSize: 18,
        };
      case 'lg':
        return {
          container: { width: 64, height: 64, borderRadius: 32 },
          fontSize: 28,
        };
      case 'md':
      default:
        return {
          container: { width: 56, height: 56, borderRadius: 28 },
          fontSize: 24,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={[
        styles.container,
        sizeStyles.container,
        getVariantStyles(),
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={{ fontSize: sizeStyles.fontSize }}>{icon}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default IconButton;
