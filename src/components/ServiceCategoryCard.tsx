import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { ServiceCategory } from '../data/mock';

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  selected?: boolean;
  onPress?: () => void;
}

export function ServiceCategoryCard({ category, selected, onPress }: ServiceCategoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Feather
        name={category.icon as any}
        size={22}
        color={selected ? colors.amber : colors.textDim}
      />
      <Text style={[styles.title, selected && styles.titleSelected]}>{category.title}</Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {category.subtitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 128,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: 14,
    gap: 6,
  },
  cardSelected: {
    borderColor: colors.amber,
    backgroundColor: colors.amberSoft,
  },
  title: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.cream, marginTop: 4 },
  titleSelected: { color: colors.amber },
  subtitle: { fontFamily: fonts.body, fontSize: 11.5, color: colors.textDim },
});
