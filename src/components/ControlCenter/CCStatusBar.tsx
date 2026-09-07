import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { BatteryStatus } from '../../types/launcher';
import { LauncherBridge } from '../../services/LauncherBridge';

interface CCStatusBarProps {
  timeStr: string;
  batteryStatus: BatteryStatus;
  onClose: () => void;
}

export function CCStatusBar({
  timeStr,
  batteryStatus,
  onClose,
}: CCStatusBarProps) {
  return (
    <View style={styles.headerBar}>
      {/* Left: Plus / Customize button */}
      <TouchableOpacity
        style={styles.circleBtn}
        activeOpacity={0.7}
        onPress={() => {
          LauncherBridge?.triggerHaptic?.('click');
        }}
      >
        <Text style={styles.plusGlyph}>+</Text>
      </TouchableOpacity>

      {/* Center: Dynamic Island notch spacing */}
      <View style={styles.dynamicIslandSpacer} />

      {/* Right: Power / Sleep & Battery Indicator */}
      <View style={styles.headerRight}>
        <View style={styles.batteryPillContainer}>
          <Text style={styles.batteryPercentText}>{`${batteryStatus.level}%`}</Text>
          <View style={styles.batteryShell}>
            <View
              style={[
                styles.batteryLevelFill,
                {
                  width: `${Math.min(100, Math.max(15, batteryStatus.level))}%`,
                  backgroundColor:
                    batteryStatus.level <= 20
                      ? '#FF453A'
                      : batteryStatus.isCharging
                      ? '#34C759'
                      : '#ffffff',
                },
              ]}
            />
            {batteryStatus.isCharging && (
              <Text style={styles.chargingBolt}>⚡</Text>
            )}
          </View>
          <View style={styles.batteryTip} />
        </View>

        <TouchableOpacity
          style={[styles.circleBtn, styles.powerBtn]}
          activeOpacity={0.7}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('tick');
            onClose();
          }}
        >
          <Text style={styles.powerGlyph}>⏻</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  circleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusGlyph: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 22,
  },
  dynamicIslandSpacer: {
    flex: 1,
    height: 28,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  batteryPercentText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
    letterSpacing: 0.2,
  },
  batteryShell: {
    width: 25,
    height: 13,
    borderRadius: 4,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    padding: 1.2,
    justifyContent: 'center',
    position: 'relative',
  },
  batteryLevelFill: {
    height: '100%',
    borderRadius: 2,
  },
  batteryTip: {
    width: 1.8,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    marginLeft: 1.2,
  },
  chargingBolt: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 9,
    color: '#ffffff',
  },
  powerBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  powerGlyph: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
