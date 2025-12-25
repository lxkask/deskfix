import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  AccessibilityRole,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../providers/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'pro';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

export const Button = React.memo(function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  accessibilityLabel,
  accessibilityHint,
  style,
  textStyle,
  haptic = true,
}: ButtonProps) {
  const colors = useThemeColors();

  const handlePress = () => {
    if (disabled || loading) return;
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: colors.primary,
            borderWidth: 0,
          },
          text: { color: '#FFFFFF' },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.secondary,
            borderWidth: 0,
          },
          text: { color: '#FFFFFF' },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.primary,
          },
          text: { color: colors.primary },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          text: { color: colors.primary },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: colors.error,
            borderWidth: 0,
          },
          text: { color: '#FFFFFF' },
        };
      case 'pro':
        return {
          container: {
            backgroundColor: colors.accent,
            borderWidth: 0,
          },
          text: { color: '#FFFFFF' },
        };
      default:
        return {
          container: { backgroundColor: colors.primary },
          text: { color: '#FFFFFF' },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
          text: { fontSize: 14 },
        };
      case 'lg':
        return {
          container: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 16 },
          text: { fontSize: 18 },
        };
      case 'md':
      default:
        return {
          container: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
          text: { fontSize: 16 },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      style={[
        styles.container,
        sizeStyles.container,
        variantStyles.container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.text.color}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              sizeStyles.text,
              variantStyles.text,
              icon ? styles.textWithIcon : undefined,
              textStyle,
            ]}
          >
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // Accessibility: minimum touch target
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textWithIcon: {
    marginLeft: 8,
  },
});

export default Button;
