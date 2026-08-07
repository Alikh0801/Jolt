import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts, type } from '../../theme/typography';
import { Card } from '../../components/Card';
import { RatingStars } from '../../components/RatingStars';
import { customerHistory, serviceCategories } from '../../data/mock';

export function OrderHistoryScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>Sifarişlərim</Text>
      <FlatList
        data={customerHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const category = serviceCategories.find((c) => c.id === item.category)!;
          return (
            <Card style={styles.card}>
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <Feather name={category.icon as any} size={18} color={colors.amber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{category.title}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
                <Text style={styles.price}>{item.price}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.ustaName}>{item.ustaName}</Text>
                <View style={{ flex: 1 }} />
                <RatingStars value={item.rating} size={13} />
              </View>
            </Card>
          );
        }}
        ListEmptyComponent={
          <Text style={type.bodyDim}>Hələ heç bir sifarişin yoxdur.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { ...type.h2, paddingHorizontal: 20, marginBottom: 16, marginTop: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 24, gap: 12 },
  card: { gap: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.amberSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.bodySemi, fontSize: 14.5, color: colors.cream },
  date: { fontFamily: fonts.body, fontSize: 12, color: colors.textDim, marginTop: 2 },
  price: { fontFamily: fonts.monoSemi, fontSize: 13, color: colors.amber },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 12 },
  ustaName: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textDim },
});
