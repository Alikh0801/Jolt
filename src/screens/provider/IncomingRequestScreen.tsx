import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { fonts, type } from '../../theme/typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { providerFeed, serviceCategories } from '../../data/mock';
import { ProviderStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProviderStackParamList, 'IncomingRequest'>;

const COUNTDOWN = 15;

export function IncomingRequestScreen({ route, navigation }: Props) {
  const request = providerFeed.find((r) => r.id === route.params.requestId)!;
  const category = serviceCategories.find((c) => c.id === request.category)!;
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN);

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigation.goBack();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, navigation]);

  const progress = secondsLeft / COUNTDOWN;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerRow}>
        <View style={styles.timerTrack}>
          <View style={[styles.timerFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.timerText}>{secondsLeft}s</Text>
      </View>

      <Text style={styles.newBadge}>YENİ SORĞU</Text>

      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <Feather name={category.icon as any} size={24} color={colors.amber} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{category.title}</Text>
            <Text style={styles.customer}>{request.customerName}</Text>
          </View>
          <Text style={styles.offer}>{request.offer}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Feather name="map-pin" size={14} color={colors.textDim} />
          <Text style={styles.infoText}>{request.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="navigation" size={14} color={colors.textDim} />
          <Text style={styles.infoText}>{request.distanceKm} km məsafədə</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="message-square" size={14} color={colors.textDim} />
          <Text style={styles.infoText}>{request.note}</Text>
        </View>
      </Card>

      <View style={{ flex: 1 }} />

      <View style={styles.actions}>
        <Button label="İmtina" variant="secondary" onPress={() => navigation.goBack()} style={{ flex: 1 }} />
        <Button
          label="Qəbul et"
          onPress={() => navigation.replace('ActiveJob', { requestId: request.id })}
          style={{ flex: 2 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  timerTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.surface2, overflow: 'hidden' },
  timerFill: { height: '100%', backgroundColor: colors.amber },
  timerText: { fontFamily: fonts.monoSemi, fontSize: 12, color: colors.amber, width: 28 },
  newBadge: {
    ...type.label,
    color: colors.amber,
    textAlign: 'center',
    marginBottom: 12,
  },
  card: { marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.amberSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.headingMedium, fontSize: 17, color: colors.cream },
  customer: { fontFamily: fonts.body, fontSize: 13, color: colors.textDim, marginTop: 2 },
  offer: { fontFamily: fonts.heading, fontSize: 20, color: colors.amber },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  infoText: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 13.5, color: colors.cream, lineHeight: 19 },
  actions: { flexDirection: 'row', gap: 12 },
});
