import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LauncherBridge } from '../../services/LauncherBridge';
import { Plane, Wifi, Bluetooth, SignalHigh, ArrowUpFromLine, Radio } from 'lucide-react-native';

interface ConnectivityPlatterProps {
  size: number;
}

export function ConnectivityPlatter({ size }: ConnectivityPlatterProps) {
  const [isAirplaneOn, setAirplaneOn] = useState(false);

  const padding = 20;
  const gap = 12;
  const btnSize = Math.floor((size - (padding * 2) - gap) / 2);
  const iconSize = Math.floor(btnSize * 0.45);

  return (
    <View style={[styles.platterCard, { width: size, height: size }]}>
      <LinearGradient
        colors={['rgba(45, 45, 50, 0.65)', 'rgba(25, 25, 30, 0.65)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: 36 }]}
      />
      <View style={{ width: '100%', height: '100%', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Airplane */}
          <TouchableOpacity
            style={[{ width: btnSize, height: btnSize, borderRadius: btnSize / 2, backgroundColor: isAirplaneOn ? '#FF9500' : 'rgba(0, 0, 0, 0.25)' }, styles.centerAll]}
            onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setAirplaneOn(!isAirplaneOn); }}
            activeOpacity={0.7}
          >
            <Plane size={iconSize} color="#ffffff" strokeWidth={2.5} />
          </TouchableOpacity>
  
          {/* Cellular */}
          <TouchableOpacity
            style={[{ width: btnSize, height: btnSize, borderRadius: btnSize / 2, backgroundColor: '#34C759' }, styles.centerAll]}
            onPress={() => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.openSystemSettings?.('network'); }}
            activeOpacity={0.7}
          >
            <SignalHigh size={iconSize * 1.1} color="#ffffff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* WiFi */}
          <TouchableOpacity
            style={[{ width: btnSize, height: btnSize, borderRadius: btnSize / 2, backgroundColor: '#007AFF' }, styles.centerAll]}
            onPress={() => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.openSystemSettings?.('wifi'); }}
            activeOpacity={0.7}
          >
            <Wifi size={iconSize * 1.1} color="#ffffff" strokeWidth={2.5} />
          </TouchableOpacity>
  
          {/* Bluetooth */}
          <TouchableOpacity
            style={[{ width: btnSize, height: btnSize, borderRadius: btnSize / 2, backgroundColor: '#007AFF' }, styles.centerAll]}
            onPress={() => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.openSystemSettings?.('bluetooth'); }}
            activeOpacity={0.7}
          >
            <Bluetooth size={iconSize * 1.1} color="#ffffff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
