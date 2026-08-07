import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface MapPinProps {
  variant?: 'you' | 'usta' | 'destination';
  size?: number;
}

export function MapPin({ variant = 'you', size = 40 }: MapPinProps) {
  if (variant === 'you') {
    return (
      <View style={[styles.youWrap, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={styles.youDot} />
      </View>
    );
  }
  if (variant === 'usta') {
    return (
      <View style={[styles.ustaPin, { width: size, height: size, borderRadius: size / 2 }]}>
        <Feather name="tool" size={size * 0.5} color={colors.bg} />
      </View>
    );
  }
  return (
    <View style={[styles.destPin, { width: size, height: size, borderRadius: size / 2 }]}>
      <Feather name="map-pin" size={size * 0.5} color={colors.cream} />
    </View>
  );
}

const styles = StyleSheet.create({
  youWrap: {
    backgroundColor: 'rgba(95,168,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  youDot: {
    width: '45%',
    height: '45%',
    borderRadius: 999,
    backgroundColor: colors.info,
    borderWidth: 2,
    borderColor: colors.cream,
  },
  ustaPin: {
    backgroundColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.amber,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  destPin: {
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
