import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { fonts, type } from '../../theme/typography';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

export function OtpScreen({ route, navigation }: Props) {
  const { role } = useApp();
  const [code, setCode] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kodu daxil et</Text>
      <Text style={styles.subtitle}>{route.params.phone} nömrəsinə göndərilən 4 rəqəmi yaz</Text>

      <TextInput
        value={code}
        onChangeText={(v) => setCode(v.replace(/[^0-9]/g, '').slice(0, 4))}
        keyboardType="number-pad"
        placeholder="• • • •"
        placeholderTextColor={colors.textFaint}
        style={styles.otpInput}
        maxLength={4}
        autoFocus
      />

      <Text style={styles.hint}>Prototip rejimi: istənilən 4 rəqəm işləyir.</Text>

      <View style={{ flex: 1 }} />

      <Button
        label="Təsdiqlə"
        disabled={code.length < 4}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: role === 'provider' ? 'ProviderRoot' : 'CustomerRoot' }],
          });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 },
  title: { ...type.h1, marginBottom: 8 },
  subtitle: { ...type.bodyDim, fontSize: 15, marginBottom: 32 },
  otpInput: {
    fontFamily: fonts.heading,
    fontSize: 34,
    letterSpacing: 18,
    color: colors.cream,
    textAlign: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    height: 72,
  },
  hint: { ...type.bodyDim, fontSize: 12, textAlign: 'center', marginTop: 14 },
});
