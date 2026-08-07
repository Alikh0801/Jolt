import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Keyboard, Pressable } from 'react-native';
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
  const inputRef = useRef<TextInput>(null);

  const handleChange = (v: string) => {
    const digits = v.replace(/[^0-9]/g, '').slice(0, 4);
    setCode(digits);
    // number-pad has no "done" key on iOS, so close the keyboard ourselves
    // once all 4 digits are entered — this reveals the submit button.
    if (digits.length === 4) {
      Keyboard.dismiss();
    }
  };

  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()} accessible={false}>
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Kodu daxil et</Text>
        <Text style={styles.subtitle}>{route.params.phone} nömrəsinə göndərilən 4 rəqəmi yaz</Text>

        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={handleChange}
          keyboardType="number-pad"
          placeholder="• • • •"
          placeholderTextColor={colors.textFaint}
          style={styles.otpInput}
          maxLength={4}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          autoFocus
        />

        <Text style={styles.hint}>Prototip rejimi: istənilən 4 rəqəm işləyir.</Text>

        <View style={{ flex: 1 }} />

        <Button
          label="Təsdiqlə"
          disabled={code.length < 4}
          onPress={() => {
            Keyboard.dismiss();
            navigation.reset({
              index: 0,
              routes: [{ name: role === 'provider' ? 'ProviderRoot' : 'CustomerRoot' }],
            });
          }}
        />
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 16 },
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
