import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { fonts, type } from '../../theme/typography';
import { Button } from '../../components/Button';
import { LogoMark } from '../../components/Logo';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneAuth'>;

export function PhoneAuthScreen({ navigation }: Props) {
  const { role } = useApp();
  const [phone, setPhone] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <LogoMark size={40} />
        <Text style={styles.title}>Nömrəni daxil et</Text>
        <Text style={styles.subtitle}>
          {role === 'provider'
            ? 'Usta hesabına giriş üçün telefon nömrənə təsdiq kodu göndərəcəyik.'
            : 'Hesabına giriş üçün telefon nömrənə təsdiq kodu göndərəcəyik.'}
        </Text>

        <View style={styles.inputRow}>
          <Text style={styles.prefix}>+994</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="50 123 45 67"
            placeholderTextColor={colors.textFaint}
            keyboardType="phone-pad"
            style={styles.input}
            maxLength={12}
          />
        </View>

        <View style={{ flex: 1 }} />

        <Button
          label="Kod göndər"
          disabled={phone.trim().length < 7}
          onPress={() => navigation.navigate('Otp', { phone: `+994 ${phone}` })}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 },
  title: { ...type.h1, marginTop: 20, marginBottom: 8 },
  subtitle: { ...type.bodyDim, fontSize: 15, marginBottom: 32 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 58,
  },
  prefix: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.textDim, marginRight: 10 },
  input: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 16, color: colors.cream },
});
