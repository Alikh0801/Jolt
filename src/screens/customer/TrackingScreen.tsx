import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { fonts, type } from '../../theme/typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { MapMock } from '../../components/MapMock';
import { MapPin } from '../../components/MapPin';
import { StatusStepper } from '../../components/StatusStepper';
import { serviceCategories, OrderStatus } from '../../data/mock';
import { CustomerStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';

type Props = NativeStackScreenProps<CustomerStackParamList, 'Tracking'>;

const flow: OrderStatus[] = ['accepted', 'en_route', 'arrived', 'in_progress', 'completed'];

const statusCopy: Record<OrderStatus, string> = {
  searching: '',
  accepted: 'Usta sifarişi qəbul etdi',
  en_route: 'Usta sənə doğru yoldadır',
  arrived: 'Usta məkana çatdı',
  in_progress: 'Təmir işi davam edir',
  completed: 'İş tamamlandı',
  cancelled: 'Sifariş ləğv olundu',
};

export function TrackingScreen({ navigation }: Props) {
  const { activeRequest } = useApp();
  const [statusIndex, setStatusIndex] = useState(0);
  const status = flow[statusIndex];

  useEffect(() => {
    if (statusIndex >= flow.length - 1) return;
    const t = setTimeout(() => setStatusIndex((i) => i + 1), 2600);
    return () => clearTimeout(t);
  }, [statusIndex]);

  if (!activeRequest) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={type.bodyDim}>Aktiv sifariş yoxdur.</Text>
        <Button label="Ana səhifəyə qayıt" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
      </SafeAreaView>
    );
  }

  const { usta } = activeRequest;
  const category = serviceCategories.find((c) => c.id === activeRequest.category)!;

  return (
    <View style={styles.container}>
      <MapMock style={styles.map}>
        <View style={[styles.pin, { top: '46%', left: '50%', marginLeft: -22, marginTop: -22 }]}>
          <MapPin variant="you" size={44} />
        </View>
        <View
          style={[
            styles.pin,
            {
              top: statusIndex <= 1 ? '20%' : '46%',
              left: statusIndex <= 1 ? '22%' : '50%',
              marginLeft: -20,
              marginTop: -20,
            },
          ]}
        >
          <MapPin variant="usta" size={40} />
        </View>
      </MapMock>

      <SafeAreaView style={styles.sheet} edges={['bottom']}>
        <View style={styles.sheetInner}>
          <View style={styles.sheetHandle} />

          <Text style={styles.statusLine}>{statusCopy[status]}</Text>

          <StatusStepper current={status} />

          <Card style={styles.ustaCard}>
            <View style={styles.ustaRow}>
              <View style={[styles.avatar, { backgroundColor: usta.avatarColor }]}>
                <Text style={styles.avatarText}>{usta.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ustaName}>{usta.name}</Text>
                <Text style={styles.ustaVehicle}>{usta.vehicle}</Text>
              </View>
              <View style={styles.actionCol}>
                <Pressable style={styles.actionBtn} onPress={() => Linking.openURL('tel:+994501234567')}>
                  <Feather name="phone" size={16} color={colors.bg} />
                </Pressable>
                <Pressable style={[styles.actionBtn, styles.actionBtnGhost]}>
                  <Feather name="message-circle" size={16} color={colors.amber} />
                </Pressable>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Feather name={category.icon as any} size={15} color={colors.textDim} />
              <Text style={styles.summaryText}>{category.title}</Text>
              <View style={{ flex: 1 }} />
              <Text style={styles.summaryPrice}>{category.avgPrice}</Text>
            </View>
          </Card>

          {status === 'completed' ? (
            <Button label="Sifarişi qiymətləndir" onPress={() => navigation.replace('Rating')} />
          ) : (
            <Button label="Sifarişi ləğv et" variant="danger" onPress={() => navigation.popToTop()} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  map: { flex: 1 },
  pin: { position: 'absolute' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheetInner: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 18,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.line, alignSelf: 'center' },
  statusLine: { fontFamily: fonts.headingMedium, fontSize: 17, color: colors.cream, textAlign: 'center' },
  ustaCard: { gap: 0 },
  ustaRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.bg },
  ustaName: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.cream },
  ustaVehicle: { fontFamily: fonts.body, fontSize: 12, color: colors.textDim, marginTop: 2 },
  actionCol: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnGhost: { backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.amberDim },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 14 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textDim },
  summaryPrice: { fontFamily: fonts.monoSemi, fontSize: 12.5, color: colors.amber },
});
