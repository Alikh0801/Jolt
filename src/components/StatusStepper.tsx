import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { OrderStatus, orderSteps } from '../data/mock';

interface StatusStepperProps {
  current: OrderStatus;
}

export function StatusStepper({ current }: StatusStepperProps) {
  const currentIndex = orderSteps.findIndex((s) => s.status === current);
  return (
    <View style={styles.row}>
      {orderSteps.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <React.Fragment key={step.status}>
            <View style={styles.stepCol}>
              <View
                style={[
                  styles.dot,
                  done && styles.dotDone,
                  active && styles.dotActive,
                ]}
              >
                {done ? (
                  <Feather name="check" size={11} color={colors.bg} />
                ) : (
                  <View style={active ? styles.innerActive : undefined} />
                )}
              </View>
              <Text
                numberOfLines={1}
                style={[styles.stepLabel, (done || active) && styles.stepLabelActive]}
              >
                {step.label}
              </Text>
            </View>
            {i < orderSteps.length - 1 && (
              <View style={[styles.line, i < currentIndex && styles.lineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  stepCol: { alignItems: 'center', width: 58 },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: colors.amber, borderColor: colors.amber },
  dotActive: { borderColor: colors.amber },
  innerActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.amber,
  },
  stepLabel: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textFaint,
    textAlign: 'center',
  },
  stepLabelActive: { color: colors.cream, fontFamily: fonts.bodyMedium },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.line,
    marginTop: 10,
  },
  lineDone: { backgroundColor: colors.amber },
});
