import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LauncherBridge } from '../../services/LauncherBridge';

interface ConnectivityPlatterProps {
  size: number;
}

// Pure View-drawn WiFi icon (3 arcs)
function WifiIcon({ color = '#fff', size = 22 }: { color?: string; size?: number }) {
  const s = size;
  return (
    <View style={{ width: s, height: s * 0.75, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ width: s * 0.18, height: s * 0.18, borderRadius: s * 0.09, backgroundColor: color }} />
      <View style={{ position: 'absolute', bottom: s * 0.18, width: s * 0.52, height: s * 0.26,
        borderTopLeftRadius: s * 0.26, borderTopRightRadius: s * 0.26,
        borderWidth: 2.2, borderColor: color, borderBottomWidth: 0, backgroundColor: 'transparent' }} />
      <View style={{ position: 'absolute', bottom: s * 0.18, width: s * 0.78, height: s * 0.39,
        borderTopLeftRadius: s * 0.39, borderTopRightRadius: s * 0.39,
        borderWidth: 2.2, borderColor: color, borderBottomWidth: 0, backgroundColor: 'transparent' }} />
      <View style={{ position: 'absolute', bottom: s * 0.18, width: s, height: s * 0.5,
        borderTopLeftRadius: s * 0.5, borderTopRightRadius: s * 0.5,
        borderWidth: 2.2, borderColor: color, borderBottomWidth: 0, backgroundColor: 'transparent' }} />
    </View>
  );
}

// Pure View-drawn Bluetooth "B" glyph
function BluetoothIcon({ color = '#fff', size = 22 }: { color?: string; size?: number }) {
  return (
    <Text style={{ fontSize: size * 0.95, color, fontWeight: '700', fontStyle: 'italic', letterSpacing: -1 }}>
      ᛒ
    </Text>
  );
}

// Airplane icon using text
function AirplaneIcon({ color = '#fff', size = 22 }: { color?: string; size?: number }) {
  return <Text style={{ fontSize: size, color }}>✈</Text>;
}

// Cell signal bars
function CellularIcon({ color = '#fff', size = 22 }: { color?: string; size?: number }) {
  const barW = size * 0.18;
  const gap = size * 0.1;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: size, height: size * 0.7 }}>
      {[0.35, 0.55, 0.75, 1.0].map((h, i) => (
        <View key={i} style={{
          width: barW, height: size * h * 0.65, backgroundColor: color,
          borderRadius: 2, marginLeft: i === 0 ? 0 : gap,
        }} />
      ))}
    </View>
  );
}

export function ConnectivityPlatter({ size }: ConnectivityPlatterProps) {
  const [airplaneActive, setAirplaneActive] = useState(false);
  const [cellularActive, setCellularActive] = useState(true);
  const [wifiActive, setWifiActive] = useState(true);
  const [btActive, setBtActive] = useState(true);

  const btnSize = Math.floor((size - 28 - 12) / 2);
  const iconSize = Math.floor(btnSize * 0.42);

  return (
    <View style={[styles.platterCard, { width: size, height: size }]}>
      <View style={styles.gridContainer}>
        {/* Airplane */}
        <TouchableOpacity
          style={[styles.circleButton, { width: btnSize, height: btnSize, borderRadius: btnSize / 2 },
            airplaneActive ? styles.btnOrange : styles.btnInactive]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setAirplaneActive(!airplaneActive); }}
          activeOpacity={0.75}
        >
          <AirplaneIcon size={iconSize * 1.1} color="#fff" />
        </TouchableOpacity>

        {/* Cellular */}
        <TouchableOpacity
          style={[styles.circleButton, { width: btnSize, height: btnSize, borderRadius: btnSize / 2 },
            cellularActive ? styles.btnGreen : styles.btnInactive]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setCellularActive(!cellularActive); }}
          activeOpacity={0.75}
        >
          <CellularIcon size={iconSize} color="#fff" />
        </TouchableOpacity>

        {/* WiFi */}
        <TouchableOpacity
          style={[styles.circleButton, { width: btnSize, height: btnSize, borderRadius: btnSize / 2 },
            wifiActive ? styles.btnBlue : styles.btnInactive]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setWifiActive(!wifiActive); LauncherBridge?.openInternetPanel?.(); }}
          activeOpacity={0.75}
        >
          <WifiIcon size={iconSize * 1.2} color="#fff" />
        </TouchableOpacity>

        {/* Bluetooth */}
        <TouchableOpacity
          style={[styles.circleButton, { width: btnSize, height: btnSize, borderRadius: btnSize / 2 },
            btActive ? styles.btnBlue : styles.btnInactive]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setBtActive(!btActive); LauncherBridge?.openBluetoothSettings?.(); }}
          activeOpacity={0.75}
        >
          <BluetoothIcon size={iconSize * 1.1} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  platterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderRadius: 32,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  circleButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnInactive: { backgroundColor: 'rgba(255, 255, 255, 0.13)' },
  btnBlue: { backgroundColor: '#007AFF' },
  btnGreen: { backgroundColor: '#34C759' },
  btnOrange: { backgroundColor: '#FF9500' },
});
