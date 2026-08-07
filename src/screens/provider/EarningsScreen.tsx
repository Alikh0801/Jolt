import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts, type } from '../../theme/typography';
import { Card } from '../../components/Card';
import { earningsWeek, customerHistory, serviceCategories } from '../../data/mock';

const maxAmount = Math.max(...earningsWeek.map((d) => d.amount));
const weekTotal = earningsWeek.reduce((sum, d) => sum + d.amount, 0);

export function EarningsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Qazanc</Text>

        <Card style={styles.totalCard}>
          <Text style={styles.totalLabel}>Bu həftə</Text>
          <Text style={styles.totalValue}>{weekTotal} AZN</Text>
          <View style={styles.chartRow}>
            {earningsWeek.map((d) => (
              <View key={d.label} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${(d.amount / maxAmount) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{d.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Feather name="check-circle" size={16} color={colors.success} />
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Tamamlanan iş</Text>
          </Card>
          <Card style={styles.statCard}>
            <Feather name="star" size={16} color={colors.amber} />
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Reytinq</Text>
          </Card>
          <Card style={styles.statCard}>
            <Feather name="clock" size={16} color={colors.info} />
            <Text style={styles.statValue}>6 dəq</Text>
            <Text style={styles.statLabel}>Orta çatma</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Son işlər</Text>
        <View style={{ gap: 10 }}>
          {customerHistory.map((item) => {
            const category = serviceCategories.find((c) => c.id === item.category)!;
            return (
              <Card key={item.id} style={styles.jobRow}>
                <View style={styles.jobIcon}>
                  <Feather name={category.icon as any} size={16} color={colors.amber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.jobTitle}>{category.title}</Text>
                  <Text style={styles.jobDate}>{item.date}</Text>
                </View>
                <Text style={styles.jobPrice}>{item.price}</Text>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  header: { ...type.h2, marginBottom: 16, marginTop: 4 },
  totalCard: { marginBottom: 16 },
  totalLabel: { ...type.label, marginBottom: 6 },
  totalValue: { fontFamily: fonts.heading, fontSize: 30, color: colors.amber, marginBottom: 18 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', height: 90, alignItems: 'flex-end' },
  barCol: { alignItems: 'center', gap: 6, flex: 1 },
  barTrack: {
    width: 14,
    height: 70,
    borderRadius: 7,
    backgroundColor: colors.surface2,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', backgroundColor: colors.amber, borderRadius: 7 },
  barLabel: { fontFamily: fonts.body, fontSize: 10, color: colors.textFaint },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 16 },
  statValue: { fontFamily: fonts.headingMedium, fontSize: 16, color: colors.cream },
  statLabel: { fontFamily: fonts.body, fontSize: 10.5, color: colors.textDim, textAlign: 'center' },
  sectionTitle: { ...type.h3, marginBottom: 12 },
  jobRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  jobIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.amberSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobTitle: { fontFamily: fonts.bodySemi, fontSize: 13.5, color: colors.cream },
  jobDate: { fontFamily: fonts.body, fontSize: 11.5, color: colors.textDim, marginTop: 1 },
  jobPrice: { fontFamily: fonts.monoSemi, fontSize: 12.5, color: colors.amber },
});
