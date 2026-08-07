import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { navigationRef } from './navigationRef';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { RoleSelectScreen } from '../screens/auth/RoleSelectScreen';
import { PhoneAuthScreen } from '../screens/auth/PhoneAuthScreen';
import { OtpScreen } from '../screens/auth/OtpScreen';
import { CustomerRoot } from './CustomerRoot';
import { ProviderRoot } from './ProviderRoot';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    border: colors.line,
    primary: colors.amber,
    text: colors.cream,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="CustomerRoot" component={CustomerRoot} />
        <Stack.Screen name="ProviderRoot" component={ProviderRoot} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
