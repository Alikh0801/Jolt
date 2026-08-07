import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { fonts, type } from '../../theme/typography';
import { Button } from '../../components/Button';
import { RatingStars } from '../../components/RatingStars';
import { CustomerStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';

type Props = NativeStackScreenProps<CustomerStackParamList, 'Rating'>;

export function RatingScreen({ navigation }: Props) {
  const { activeRequest, clearRequest } = useApp();
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');

  const usta = activeRequest?.usta;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <View style={styles.successCircle}>
          <Text style={styles.successEmoji}>✓</Text>
        </View>
        <Text style={styles.title}>İş tamamlandı!</Text>
        {usta && (
          <Text style={styles.subtitle}>{usta.name} işi bitirdi. Xidməti qiymətləndir.</Text>
        )}

        <View style={styles.starsWrap}>
          <RatingStars value={stars} size={34} onChange={setStars} />
        </View>

        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Rəy yaz (istəyə bağlı)"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          multiline
        />
      </View>

      <Button
        label="Göndər"
        onPress={() => {
          clearRequest();
          navigation.popToTop();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 16 },
  center: { flex: 1, alignItems: 'center' },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successEmoji: { fontSize: 30, color: colors.success, fontFamily: fonts.headingMedium },
  title: { ...type.h2, marginBottom: 8 },
  subtitle: { ...type.bodyDim, textAlign: 'center', marginBottom: 28, paddingHorizontal: 20 },
  starsWrap: { marginBottom: 28 },
  input: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 14,
    minHeight: 90,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.cream,
    textAlignVertical: 'top',
  },
});
