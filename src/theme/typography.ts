import { colors } from './colors';

export const fonts = {
  heading: 'SpaceGrotesk_700Bold',
  headingMedium: 'SpaceGrotesk_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  mono: 'JetBrainsMono_500Medium',
  monoSemi: 'JetBrainsMono_600SemiBold',
} as const;

export const type = {
  h1: { fontFamily: fonts.heading, fontSize: 32, color: colors.cream, letterSpacing: 0.2 },
  h2: { fontFamily: fonts.heading, fontSize: 24, color: colors.cream, letterSpacing: 0.2 },
  h3: { fontFamily: fonts.headingMedium, fontSize: 18, color: colors.cream },
  body: { fontFamily: fonts.body, fontSize: 15, color: colors.cream, lineHeight: 21 },
  bodyDim: { fontFamily: fonts.body, fontSize: 14, color: colors.textDim, lineHeight: 20 },
  label: {
    fontFamily: fonts.monoSemi,
    fontSize: 11,
    color: colors.textDim,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
  },
  button: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.bg },
};
