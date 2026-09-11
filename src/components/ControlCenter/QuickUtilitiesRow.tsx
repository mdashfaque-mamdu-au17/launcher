import React, { useState, ReactElement } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LauncherBridge } from '../../services/LauncherBridge';
import {
  RotateCcw,
  Bell,
  BellOff,
  Moon,
  Flashlight,
  Camera,
  Calculator,
  Disc,
  ScreenShare,
  Battery,
  Timer,
  Activity,
  Music,
} from 'lucide-react-native';

function GlassBackground({ borderRadius }: { borderRadius: number }) {
  return (
    <LinearGradient
      colors={['rgba(45, 45, 50, 0.65)', 'rgba(25, 25, 30, 0.65)']}
      start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
      style={[StyleSheet.absoluteFill, { 
        borderRadius, 
        overflow: 'hidden',
        borderWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.3)',
        borderLeftColor: 'rgba(255, 255, 255, 0.12)',
        borderRightColor: 'rgba(255, 255, 255, 0.12)',
        borderBottomColor: 'rgba(255, 255, 255, 0.12)',
      }]}
    />
  );
}

// ─── MiddleControls ────────────────────────────────────────────────────────

interface QuickControlsProps {
  colWidth: number;
  twoColWidth: number;
  torchOn: boolean;
  onToggleTorch: () => void;
  onLaunchCalculator: () => void;
  onLaunchCamera: () => void;
  onLaunchBattery: () => void;
}

export function MiddleControls({
  colWidth, twoColWidth, torchOn, onToggleTorch,
  onLaunchCalculator, onLaunchCamera, onLaunchBattery,
}: QuickControlsProps) {
  const [orientationLocked, setOrientationLocked] = useState(false);
  const [silentActive, setSilentActive] = useState(false);
  const [dndActive, setDndActive] = useState(false);
  const [screenRecording, setScreenRecording] = useState(false);

  const D = Math.min(colWidth, 82);

  return (
    <View style={[{ width: twoColWidth, height: 180, justifyContent: 'space-between' }]}>

      {/* Row 1: Orientation + Bell */}
      <View style={styles.twoRow}>
        <TouchableOpacity
          style={[styles.circle, { width: D, height: D, borderRadius: D / 2 },
            orientationLocked && styles.circleYellow]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setOrientationLocked(!orientationLocked); }}
          activeOpacity={0.75}
        >
          {!orientationLocked && <GlassBackground borderRadius={D / 2} />}
          <RotateCcw size={20} color={orientationLocked ? '#fff' : '#fff'} strokeWidth={2.5} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.circle, { width: D, height: D, borderRadius: D / 2 },
            silentActive && styles.circleRed]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setSilentActive(!silentActive); }}
          activeOpacity={0.75}
        >
          {!silentActive && <GlassBackground borderRadius={D / 2} />}
          {silentActive ? <BellOff size={20} color="#fff" strokeWidth={2.5} /> : <Bell size={20} color="#fff" strokeWidth={2.5} />}
        </TouchableOpacity>
      </View>

      {/* Row 2: Focus Pill */}
      <TouchableOpacity
        style={[styles.focusPill, { width: twoColWidth, height: D, borderRadius: D / 2 }, dndActive && styles.focusPillActive]}
        onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setDndActive(!dndActive); }}
        activeOpacity={0.75}
      >
        {!dndActive && <GlassBackground borderRadius={D / 2} />}
        <View style={styles.focusInner}>
          <Moon size={20} color="#ffffff" strokeWidth={2.5} />
          <Text style={styles.focusLabel}> Focus</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── BottomPillsRow ────────────────────────────────────────────────────────

interface BottomPillsProps {
  twoColWidth: number;
  colWidth: number;
  onClose: () => void;
}

export function BottomPillsRow({ twoColWidth, colWidth, onClose }: BottomPillsProps) {
  const S = Math.min(colWidth, 54);
  const iconSz = Math.floor(S * 0.45);

  type Item = { icon: ReactElement; bg: string; onPress: () => void };

  const items: Item[] = [
    { icon: <Flashlight size={iconSz} color="#ffffff" strokeWidth={2.5} />, bg: 'glass',
      onPress: () => LauncherBridge?.triggerHaptic?.('click') },
    { icon: <Timer size={iconSz} color="#ffffff" strokeWidth={2.5} />, bg: 'glass',
      onPress: () => LauncherBridge?.triggerHaptic?.('click') },
    { icon: <Calculator size={iconSz} color="#ffffff" strokeWidth={2.5} />, bg: 'glass',
      onPress: () => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.launchApp?.('com.android.calculator2'); onClose(); } },
    { icon: <Camera size={iconSz} color="#ffffff" strokeWidth={2.5} />, bg: 'glass',
      onPress: () => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.launchApp?.('com.android.camera2'); onClose(); } },
    { icon: <Disc size={iconSz} color="#ffffff" strokeWidth={2.5} />, bg: 'glass',
      onPress: () => LauncherBridge?.triggerHaptic?.('click') },
    { icon: <Activity size={iconSz} color="#ffffff" strokeWidth={2.5} />, bg: 'glass',
      onPress: () => LauncherBridge?.triggerHaptic?.('click') },
    { icon: <ScreenShare size={iconSz} color="#ffffff" strokeWidth={2.5} />, bg: 'glass',
      onPress: () => LauncherBridge?.triggerHaptic?.('click') },
    { icon: <Music size={iconSz} color="#ffffff" strokeWidth={2.5} />, bg: 'glass',
      onPress: () => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.launchApp?.('com.shazam.android'); onClose(); } },
  ];

  const rows: Item[][] = [items.slice(0, 4), items.slice(4, 8)];

  return (
    <View style={styles.bottomWrapper}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.gridRow}>
          {row.map((item, ci) => (
            <View key={ci} style={{ width: colWidth, alignItems: 'center' }}>
              <TouchableOpacity
                style={[styles.gridCircle, { width: S, height: S, borderRadius: S / 2, backgroundColor: item.bg === 'glass' ? 'transparent' : item.bg }]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                {item.bg === 'glass' && <GlassBackground borderRadius={S / 2} />}
                {item.icon}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const GLASS_BORDER = 'rgba(255, 255, 255, 0.22)';

const styles = StyleSheet.create({
  middleCol: { gap: 10, alignItems: 'flex-start' },
  twoRow: { flexDirection: 'row', gap: 12 },
  circle: { justifyContent: 'center', alignItems: 'center' },
  circleYellow: { backgroundColor: '#FFD60A' },
  circleRed: { backgroundColor: '#FF3B30' },
  focusPill: {
    justifyContent: 'center', paddingHorizontal: 20,
  },
  focusPillActive: { backgroundColor: '#5856D6' },
  focusInner: { flexDirection: 'row', alignItems: 'center' },
  focusLabel: { fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginLeft: 8 },
  bottomWrapper: { marginTop: 12, gap: 12 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between' },
  gridCircle: { justifyContent: 'center', alignItems: 'center' },
});
