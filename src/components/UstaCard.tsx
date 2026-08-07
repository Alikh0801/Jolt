import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { Usta } from '../data/mock';

interface UstaCardProps {
  usta: Usta;
  status?: string;
}

export function UstaCard({ usta, status }: UstaCardProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: usta.avatarColor }]}>
        <Text style={styles.avatarText}>{usta.initials}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{usta.name}</Text>
        <Text style={styles.vehicle} numberOfLines={1}>
          {usta.vehicle}
        </Text>
        <View style={styles.metaRow}>
          <Feather name="star" size={12} color={colors.amber} />
          <Text style={styles.metaText}>{usta.rating.toFixed(1)}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{usta.jobsDone} iş</Text>
        </View>
      </View>
      <View style={styles.etaBox}>
        <Text style={styles.etaValue}>{usta.etaMinutes} dəq</Text>
        <Text style={styles.etaSub}>{usta.distanceKm} km</Text>
        {status ? <Text style={styles.statusPill}>{status}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.bg },
  name: { fontFamily: fonts.bodySemi, fontSize: 15.5, color: colors.cream },
  vehicle: { fontFamily: fonts.body, fontSize: 12.5, color: colors.textDim, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  metaText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.textDim },
  metaDot: { color: colors.textFaint, fontSize: 12 },
  etaBox: { alignItems: 'flex-end' },
  etaValue: { fontFamily: fonts.headingMedium, fontSize: 16, color: colors.amber },
  etaSub: { fontFamily: fonts.body, fontSize: 11.5, color: colors.textDim, marginTop: 1 },
  statusPill: {
    marginTop: 6,
    fontFamily: fonts.monoSemi,
    fontSize: 9.5,
    color: colors.success,
    letterSpacing: 0.6,
  },
});
