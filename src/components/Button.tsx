import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  fullWidth = true,
  style,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isGhost && styles.ghost,
        isDanger && styles.danger,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.bg : colors.amber} />
      ) : (
        <Text
          style={[
            styles.label,
            isPrimary && { color: colors.bg },
            isSecondary && { color: colors.cream },
            isGhost && { color: colors.amber },
            isDanger && { color: colors.cream },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  fullWidth: { alignSelf: 'stretch' },
  primary: { backgroundColor: colors.amber },
  secondary: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.amberDim },
  danger: { backgroundColor: colors.dangerSoft, borderWidth: 1, borderColor: colors.danger },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  label: { fontFamily: fonts.bodySemi, fontSize: 15.5 },
});
