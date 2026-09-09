import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LauncherBridge } from '../../services/LauncherBridge';
import { Plane, Wifi, Bluetooth, Antenna, ArrowUpFromLine, Radio } from 'lucide-react-native';

interface ConnectivityPlatterProps {
  size: number;
}

export function ConnectivityPlatter({ size }: ConnectivityPlatterProps) {
  const [isAirplaneOn, setAirplaneOn] = useState(false);

  const btnSize = Math.floor((size - 28 - 12) / 2);
  const iconSize = Math.floor(btnSize * 0.42);

  return (
    <LinearGradient
      colors={['rgba(45, 45, 50, 0.65)', 'rgba(25, 25, 30, 0.65)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.platterCard, { width: size, height: size }]}
    >
      <View style={styles.gridContainer}>
        {/* Airplane */}
        <TouchableOpacity
          style={[styles.quadrantBtn, { backgroundColor: isAirplaneOn ? '#FF9500' : 'rgba(0, 0, 0, 0.25)' }]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setAirplaneOn(!isAirplaneOn); }}
          activeOpacity={0.7}
        >
          <Plane size={iconSize} color="#ffffff" strokeWidth={2.5} />
        </TouchableOpacity>

        {/* Cellular */}
        <TouchableOpacity
          style={[styles.quadrantBtn, { backgroundColor: '#34C759' }]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.openSystemSettings?.('network'); }}
          activeOpacity={0.7}
        >
          <Antenna size={iconSize * 1.1} color="#ffffff" strokeWidth={2.5} />
        </TouchableOpacity>

        {/* Inner small bubbles (AirDrop & Hotspot) */}
        <View style={styles.centerSmallBubble1} pointerEvents="none">
           <Radio size={8} color="rgba(255,255,255,0.7)" strokeWidth={3} />
        </View>
        <View style={styles.centerSmallBubble2} pointerEvents="none">
           <ArrowUpFromLine size={8} color="rgba(255,255,255,0.7)" strokeWidth={3} />
        </View>

        {/* WiFi */}
        <TouchableOpacity
          style={[styles.quadrantBtn, { backgroundColor: '#007AFF' }]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.openSystemSettings?.('wifi'); }}
          activeOpacity={0.7}
        >
          <Wifi size={iconSize * 1.1} color="#ffffff" strokeWidth={2.5} />
        </TouchableOpacity>

        {/* Bluetooth */}
        <TouchableOpacity
          style={[styles.quadrantBtn, { backgroundColor: '#007AFF' }]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.openSystemSettings?.('bluetooth'); }}
          activeOpacity={0.7}
        >
          <Bluetooth size={iconSize * 1.1} color="#ffffff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  platterCard: {
    borderRadius: 36,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightColor: 'rgba(255, 255, 255, 0.12)',
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gridContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  quadrantBtn: {
    width: '46%',
    aspectRatio: 1,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSmallBubble1: {
    position: 'absolute', top: '50%', left: '50%',
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
    marginLeft: -10, marginTop: -22,
    justifyContent: 'center', alignItems: 'center',
  },
  centerSmallBubble2: {
    position: 'absolute', top: '50%', left: '50%',
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
    marginLeft: -10, marginTop: 2,
    justifyContent: 'center', alignItems: 'center',
  }
});
