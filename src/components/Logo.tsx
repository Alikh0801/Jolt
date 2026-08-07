import React from 'react';
import Svg, { Polygon } from 'react-native-svg';
import { colors } from '../theme/colors';

interface LogoProps {
  size?: number;
  variant?: 'amber' | 'dark' | 'cream';
}

export function LogoMark({ size = 40, variant = 'amber' }: LogoProps) {
  const boltColor = variant === 'amber' ? colors.amber : variant === 'cream' ? colors.cream : colors.bg;
  const notchColor = variant === 'amber' ? colors.bg : variant === 'cream' ? colors.bg : colors.cream;
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Polygon points="118,18 54,106 90,106 74,182 152,88 106,88" fill={boltColor} />
      <Polygon points="106,96 101,87.5 91,87.5 86,96 91,104.5 101,104.5" fill={notchColor} />
    </Svg>
  );
}
