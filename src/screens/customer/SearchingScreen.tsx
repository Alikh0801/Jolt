import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { fonts, type } from '../../theme/typography';
import { MapMock } from '../../components/MapMock';
import { MapPin } from '../../components/MapPin';
import { serviceCategories } from '../../data/mock';
import { CustomerStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';

type Props = NativeStackScreenProps<CustomerStackParamList, 'Searching'>;

export function SearchingScreen({ route, navigation }: Props) {
  const { startRequest } = useApp();
  const category = serviceCategories.find((c) => c.id === route.params.category)!;
  const pulse = useRef(new Animated.Value(0)).current;
  const [foundCount, setFoundCount] = useState(0);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true })
    );
    loop.start();

    const tick1 = setTimeout(() => setFoundCount(1), 700);
    const tick2 = setTimeout(() => setFoundCount(3), 1500);
    const tick3 = setTimeout(() => {
      startRequest(route.params.category, route.params.note);
      navigation.replace('Tracking');
    }, 2600);

    return () => {
      loop.stop();
      clearTimeout(tick1);
      clearTimeout(tick2);
      clearTimeout(tick3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  return (
    <View style={styles.container}>
      <MapMock style={styles.map} dimmed>
        <View style={styles.pinCenter}>
          <Animated.View style={[styles.ring, { transform: [{ scale }], opacity }]} />
          <MapPin variant="you" size={44} />
        </View>
      </MapMock>

      <SafeAreaView style={styles.footer} edges={['bottom']}>
        <View style={styles.card}>
          <Text style={styles.title}>Yaxınlıqdakı ustalar axtarılır…</Text>
          <Text style={styles.subtitle}>
            {category.title} problemi üçün {foundCount > 0 ? `${foundCount} usta tapıldı` : 'axtarış davam edir'}
          </Text>

          <View style={styles.dotsRow}>
            {[0, 1, 2].map((i) => (
              <LoadingDot key={i} delay={i * 180} />
            ))}
          </View>

          <Pressable style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Feather name="x" size={14} color={colors.textDim} />
            <Text style={styles.cancelText}>Ləğv et</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function LoadingDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 380, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  return <Animated.View style={[styles.dot, { transform: [{ translateY }] }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  map: { flex: 1 },
  pinCenter: {
    position: 'absolute',
    top: '38%',
    left: '50%',
    marginLeft: -22,
    marginTop: -22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.amber,
  },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  card: {
    margin: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  title: { ...type.h3, marginBottom: 6, textAlign: 'center' },
  subtitle: { ...type.bodyDim, fontSize: 13, textAlign: 'center', marginBottom: 18 },
  dotsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.amber },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6 },
  cancelText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textDim },
});
