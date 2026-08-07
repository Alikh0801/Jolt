import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';

interface MapMockProps {
  style?: ViewStyle;
  dimmed?: boolean;
}

/**
 * Stylised abstract map used across screens instead of a live Google Maps
 * view — this build is a UI/UX prototype with mock data only, no map
 * SDK / API key wired up yet.
 */
export function MapMock({ children, style, dimmed }: PropsWithChildren<MapMockProps>) {
  return (
    <View style={[styles.container, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 400" style={StyleSheet.absoluteFill}>
        <Rect x="0" y="0" width="400" height="400" fill={colors.surface2} />
        <Path d="M-20 60 L420 110" stroke={colors.line} strokeWidth={10} />
        <Path d="M-20 180 L420 150" stroke={colors.line} strokeWidth={14} />
        <Path d="M-20 300 L420 260" stroke={colors.line} strokeWidth={8} />
        <Path d="M40 -20 L90 420" stroke={colors.line} strokeWidth={10} />
        <Path d="M220 -20 L180 420" stroke={colors.line} strokeWidth={16} />
        <Path d="M340 -20 L320 420" stroke={colors.line} strokeWidth={8} />
        <Circle cx="90" cy="110" r="3.5" fill={colors.textFaint} />
        <Circle cx="180" cy="150" r="3.5" fill={colors.textFaint} />
        <Circle cx="320" cy="150" r="3.5" fill={colors.textFaint} />
        <Circle cx="180" cy="260" r="3.5" fill={colors.textFaint} />
      </Svg>
      {dimmed && <View style={styles.dim} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.surface2,
  },
  dim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(14,17,22,0.55)',
  },
});
