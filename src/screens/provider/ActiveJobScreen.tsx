import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, Pressable } from 'react-native';
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
import { providerFeed, serviceCategories, OrderStatus } from '../../data/mock';
import { ProviderStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProviderStackParamList, 'ActiveJob'>;

const flow: OrderStatus[] = ['accepted', 'en_route', 'arrived', 'in_progress', 'completed'];
const nextActionLabel: Record<OrderStatus, string> = {
  searching: '',
  accepted: 'Yola çıxdım',
  en_route: 'Məkana çatdım',
  arrived: 'Təmirə başladım',
  in_progress: 'İşi tamamladım',
  completed: '',
  cancelled: '',
};

export function ActiveJobScreen({ route, navigation }: Props) {
  const request = providerFeed.find((r) => r.id === route.params.requestId)!;
  const category = serviceCategories.find((c) => c.id === request.category)!;
  const [statusIndex, setStatusIndex] = useState(0);
  const status = flow[statusIndex];

  if (status === 'completed') {
    return (
      <SafeAreaView style={styles.doneContainer}>
        <View style={styles.doneCircle}>
          <Feather name="check" size={30} color={colors.success} />
        </View>
        <Text style={styles.doneTitle}>İş tamamlandı</Text>
        <Text style={styles.doneSubtitle}>{request.customerName} üçün {category.title.toLowerCase()} işi bağlandı</Text>

        <Card style={styles.earningCard}>
          <Text style={styles.earningLabel}>Qazanc</Text>
          <Text style={styles.earningValue}>{request.offer}</Text>
        </Card>

        <View style={{ flex: 1 }} />
        <Button label="Panelə qayıt" onPress={() => navigation.replace('ProviderTabs')} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <MapMock style={styles.map}>
        <View style={[styles.pin, { top: '30%', left: '35%', marginLeft: -20, marginTop: -20 }]}>
          <MapPin variant="usta" size={40} />
        </View>
        <View style={[styles.pin, { top: '58%', left: '65%', marginLeft: -18, marginTop: -18 }]}>
          <MapPin variant="destination" size={36} />
        </View>
      </MapMock>

      <SafeAreaView style={styles.sheet} edges={['bottom']}>
        <View style={styles.sheetInner}>
          <View style={styles.sheetHandle} />
          <StatusStepper current={status} />

          <Card>
            <View style={styles.row}>
              <View style={styles.icon}>
                <Feather name={category.icon as any} size={18} color={colors.amber} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{request.customerName}</Text>
                <Text style={styles.address} numberOfLines={1}>
                  {request.address}
                </Text>
              </View>
              <Pressable onPress={() => Linking.openURL('tel:+994501112233')} style={styles.callBtn}>
                <Feather name="phone" size={16} color={colors.bg} />
              </Pressable>
            </View>
          </Card>

          <Button
            label={nextActionLabel[status]}
            onPress={() => setStatusIndex((i) => Math.min(i + 1, flow.length - 1))}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.amberSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.bodySemi, fontSize: 14.5, color: colors.cream },
  address: { fontFamily: fonts.body, fontSize: 12, color: colors.textDim, marginTop: 2 },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneContainer: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24, paddingTop: 60, alignItems: 'center' },
  doneCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  doneTitle: { ...type.h2, marginBottom: 8 },
  doneSubtitle: { ...type.bodyDim, textAlign: 'center', marginBottom: 24, paddingHorizontal: 10 },
  earningCard: { width: '100%', alignItems: 'center', paddingVertical: 22 },
  earningLabel: { ...type.label, marginBottom: 8 },
  earningValue: { fontFamily: fonts.heading, fontSize: 30, color: colors.amber },
});
