import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface RatingStarsProps {
  value: number;
  size?: number;
  onChange?: (value: number) => void;
}

export function RatingStars({ value, size = 16, onChange }: RatingStarsProps) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Feather
          key={i}
          name="star"
          size={size}
          color={i <= value ? colors.amber : colors.textFaint}
          style={{ marginRight: 2 }}
          onPress={onChange ? () => onChange(i) : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
