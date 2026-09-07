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
        <View style={styles.plusIcon}>
          <View style={styles.plusHorizontal} />
          <View style={styles.plusVertical} />
        </View>
      </TouchableOpacity>

      {/* Center: Dynamic Island notch spacing */}
      <View style={styles.dynamicIslandSpacer} />

      {/* Right: Battery Indicator + Power button */}
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
              <View style={styles.chargingBoltContainer}>
                <View style={styles.boltTop} />
                <View style={styles.boltBottom} />
              </View>
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
          {/* Power icon drawn with Views */}
          <View style={styles.powerIconContainer}>
            <View style={styles.powerCircle} />
            <View style={styles.powerLine} />
          </View>
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Plus icon built with two crossing bars
  plusIcon: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    width: 12,
    height: 1.5,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  plusVertical: {
    position: 'absolute',
    width: 1.5,
    height: 12,
    backgroundColor: '#ffffff',
    borderRadius: 1,
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
    marginRight: 10,
  },
  batteryPercentText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 5,
    letterSpacing: 0.2,
  },
  batteryShell: {
    width: 24,
    height: 11,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    padding: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  batteryLevelFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  batteryTip: {
    width: 1.5,
    height: 4.5,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    marginLeft: 0.8,
  },
  chargingBoltContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: 6,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boltTop: {
    width: 0,
    height: 0,
    borderLeftWidth: 3,
    borderRightWidth: 1,
    borderBottomWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ffffff',
  },
  boltBottom: {
    width: 0,
    height: 0,
    borderLeftWidth: 1,
    borderRightWidth: 3,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffffff',
    marginTop: -1,
  },
  powerBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  // Power icon: circle with a line on top
  powerIconContainer: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    borderTopColor: 'transparent',
  },
  powerLine: {
    position: 'absolute',
    top: 0,
    width: 1.5,
    height: 7,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
});
