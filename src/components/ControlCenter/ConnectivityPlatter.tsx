import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LauncherBridge } from '../../services/LauncherBridge';

interface ConnectivityPlatterProps {
  size: number;
}

export function ConnectivityPlatter({ size }: ConnectivityPlatterProps) {
  const [airplaneActive, setAirplaneActive] = useState(false);
  const [cellularActive, setCellularActive] = useState(true);
  const [wifiActive, setWifiActive] = useState(true);
  const [btActive, setBtActive] = useState(true);

  // Button diameter is sized to fit nicely inside the platter
  const btnSize = Math.floor((size - 24 - 12) / 2);

  return (
    <View style={[styles.platterCard, { width: size, height: size }]}>
      <View style={styles.gridContainer}>
        {/* Airplane Mode / Hotspot */}
        <TouchableOpacity
          style={[
            styles.circleButton,
            { width: btnSize, height: btnSize, borderRadius: btnSize / 2 },
            airplaneActive ? styles.btnAirplaneActive : styles.btnInactive,
          ]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            const next = !airplaneActive;
            setAirplaneActive(next);
            LauncherBridge?.openAirplaneSettings?.();
          }}
          activeOpacity={0.75}
        >
          <Text style={[styles.glyphText, airplaneActive && styles.glyphActive]}>
            ✈
          </Text>
        </TouchableOpacity>

        {/* Cellular / Mobile Data */}
        <TouchableOpacity
          style={[
            styles.circleButton,
            { width: btnSize, height: btnSize, borderRadius: btnSize / 2 },
            cellularActive ? styles.btnCellularActive : styles.btnInactive,
          ]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            setCellularActive(!cellularActive);
            LauncherBridge?.openInternetPanel?.();
          }}
          activeOpacity={0.75}
        >
          <Text style={[styles.glyphText, cellularActive && styles.glyphActive]}>
            📶
          </Text>
        </TouchableOpacity>

        {/* Wi-Fi */}
        <TouchableOpacity
          style={[
            styles.circleButton,
            { width: btnSize, height: btnSize, borderRadius: btnSize / 2 },
            wifiActive ? styles.btnWifiActive : styles.btnInactive,
          ]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            setWifiActive(!wifiActive);
            LauncherBridge?.openInternetPanel?.();
          }}
          activeOpacity={0.75}
        >
          <Text style={[styles.glyphText, wifiActive && styles.glyphActive]}>
            ᯤ
          </Text>
        </TouchableOpacity>

        {/* Bluetooth */}
        <TouchableOpacity
          style={[
            styles.circleButton,
            { width: btnSize, height: btnSize, borderRadius: btnSize / 2 },
            btActive ? styles.btnBluetoothActive : styles.btnInactive,
          ]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            setBtActive(!btActive);
            LauncherBridge?.openBluetoothSettings?.();
          }}
          activeOpacity={0.75}
        >
          <Text style={[styles.glyphText, btActive && styles.glyphActive]}>
            ᛒ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  platterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 36,
    borderWidth: 0,
    padding: 12,
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
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  btnInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  btnAirplaneActive: {
    backgroundColor: '#FF9500',
    borderColor: '#FFA726',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
  },
  btnCellularActive: {
    backgroundColor: '#34C759',
    borderColor: '#4CD964',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
  },
  btnWifiActive: {
    backgroundColor: '#007AFF',
    borderColor: '#409CFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
  },
  btnBluetoothActive: {
    backgroundColor: '#007AFF',
    borderColor: '#409CFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 6,
  },
  glyphText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '600',
  },
  glyphActive: {
    color: '#ffffff',
  },
});
