import React, { useState, ReactElement } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { LauncherBridge } from '../../services/LauncherBridge';
import {
  FlashlightIcon,
  ScreenRecordIcon,
  ScreenMirrorIcon,
  StopwatchIcon,
  ShazamIcon,
  WaveformIcon,
} from './CCIcons';

// ─── Pure-View drawn icons ─────────────────────────────────────────────────

function LockRotateIcon({ locked = false }: { locked?: boolean }) {
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      {/* Circle representing screen */}
      <View style={{
        width: 14, height: 14, borderRadius: 7,
        borderWidth: 2, borderColor: '#fff',
      }} />
      {/* Lock icon overlaid top-right when locked */}
      {locked && (
        <View style={{ position: 'absolute', top: 1, right: 1 }}>
          <View style={{ width: 7, height: 6, borderRadius: 1.5, borderWidth: 1.5, borderColor: '#fff', borderBottomWidth: 0 }} />
          <View style={{ width: 7, height: 5, backgroundColor: '#fff', borderBottomLeftRadius: 1, borderBottomRightRadius: 1 }} />
        </View>
      )}
      {/* Rotation arrow when unlocked */}
      {!locked && (
        <View style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: '#fff', borderLeftColor: 'transparent' }} />
        </View>
      )}
    </View>
  );
}

function BellIcon({ muted = false }: { muted?: boolean }) {
  const color = muted ? '#FF3B30' : '#fff';
  return (
    <View style={{ width: 20, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      {/* Bell dome */}
      <View style={{
        width: 14, height: 11, borderTopLeftRadius: 7, borderTopRightRadius: 7,
        borderWidth: 2, borderColor: color, borderBottomWidth: 0,
        marginTop: 3,
      }} />
      {/* Bell base */}
      <View style={{ width: 18, height: 2.5, backgroundColor: color, borderRadius: 1 }} />
      {/* Bell clapper */}
      <View style={{ width: 5, height: 5, borderRadius: 2.5, borderWidth: 2, borderColor: color, marginTop: 1 }} />
      {/* Muted diagonal line */}
      {muted && (
        <View style={{
          position: 'absolute', width: 2, height: 26,
          backgroundColor: '#FF3B30', borderRadius: 1,
          transform: [{ rotate: '45deg' }],
        }} />
      )}
    </View>
  );
}

function CalculatorIcon() {
  return (
    <View style={{ width: 20, height: 20, borderWidth: 1.5, borderColor: '#fff', borderRadius: 3, padding: 2 }}>
      {[[1,1],[1,1]].map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row', flex: 1, gap: 2 }}>
          {row.map((_, ci) => (
            <View key={ci} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 1 }} />
          ))}
        </View>
      ))}
    </View>
  );
}

function CameraIcon() {
  return (
    <View style={{ width: 22, height: 17, borderWidth: 1.5, borderColor: '#fff', borderRadius: 3, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: '#fff' }} />
      <View style={{
        position: 'absolute', top: -4, left: 5,
        width: 6, height: 4, borderTopLeftRadius: 2, borderTopRightRadius: 2,
        borderWidth: 1.5, borderColor: '#fff', borderBottomWidth: 0,
      }} />
    </View>
  );
}

function TorchIcon({ on = false }: { on?: boolean }) {
  const c = on ? '#14151b' : '#fff';
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: 12, height: 4, backgroundColor: c, borderTopLeftRadius: 2, borderTopRightRadius: 2 }} />
      <View style={{ width: 8, height: 3, backgroundColor: c }} />
      <View style={{ width: 6, height: 10, backgroundColor: c, borderBottomLeftRadius: 1.5, borderBottomRightRadius: 1.5 }} />
    </View>
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

  const D = Math.min(colWidth, 54);

  return (
    <View style={[styles.middleCol, { width: twoColWidth }]}>

      {/* Row 1: Orientation + Bell */}
      <View style={styles.twoRow}>
        <TouchableOpacity
          style={[styles.circle, { width: D, height: D, borderRadius: D / 2 },
            orientationLocked && styles.circleYellow]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setOrientationLocked(!orientationLocked); }}
          activeOpacity={0.75}
        >
          <LockRotateIcon locked={orientationLocked} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.circle, { width: D, height: D, borderRadius: D / 2 },
            silentActive && styles.circleRed]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setSilentActive(!silentActive); }}
          activeOpacity={0.75}
        >
          <BellIcon muted={silentActive} />
        </TouchableOpacity>
      </View>

      {/* Row 2: Focus Pill */}
      <TouchableOpacity
        style={[styles.focusPill, { width: twoColWidth }, dndActive && styles.focusPillActive]}
        onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setDndActive(!dndActive); }}
        activeOpacity={0.75}
      >
        <View style={styles.focusInner}>
          {/* Moon crescent drawn with Views */}
          <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#fff',
            borderRightColor: 'transparent', transform: [{ rotate: '150deg' }] }} />
          <Text style={styles.focusLabel}> Focus</Text>
        </View>
      </TouchableOpacity>

      {/* Row 3: 4 mini circles */}
      <View style={styles.miniRow}>
        <TouchableOpacity style={[styles.mini, torchOn && styles.miniWhite]} onPress={onToggleTorch} activeOpacity={0.75}>
          <TorchIcon on={torchOn} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mini, screenRecording && styles.miniRed]}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); setScreenRecording(!screenRecording); }}
          activeOpacity={0.75}
        >
          <ScreenRecordIcon active={screenRecording} size={16} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mini}
          onPress={() => { LauncherBridge?.triggerHaptic?.('click'); Alert.alert('Screen Mirror', 'Searching for displays...'); }}
          activeOpacity={0.75}
        >
          <ScreenMirrorIcon size={16} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mini} onPress={onLaunchBattery} activeOpacity={0.75}>
          {/* Battery icon */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 18, height: 9, borderRadius: 2, borderWidth: 1.5, borderColor: '#FFD60A', justifyContent: 'center', paddingHorizontal: 1.5 }}>
              <View style={{ width: '60%', height: 5, backgroundColor: '#FFD60A', borderRadius: 1 }} />
            </View>
            <View style={{ width: 2, height: 5, backgroundColor: '#FFD60A', borderRadius: 1, marginLeft: 1 }} />
          </View>
        </TouchableOpacity>
      </View>
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
  const S = colWidth;
  const iconSz = Math.floor(S * 0.42);

  type Item = { icon: ReactElement; bg: string; onPress: () => void };

  const items: Item[] = [
    { icon: <TorchIcon />, bg: 'rgba(255,255,255,0.13)',
      onPress: () => LauncherBridge?.triggerHaptic?.('click') },
    { icon: <StopwatchIcon size={iconSz} />, bg: 'rgba(255,255,255,0.13)',
      onPress: () => LauncherBridge?.triggerHaptic?.('click') },
    { icon: <CalculatorIcon />, bg: 'rgba(255,255,255,0.13)',
      onPress: () => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.launchApp?.('com.android.calculator2'); onClose(); } },
    { icon: <CameraIcon />, bg: 'rgba(255,255,255,0.13)',
      onPress: () => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.launchApp?.('com.android.camera2'); onClose(); } },
    { icon: <ScreenRecordIcon active={false} size={iconSz} />, bg: 'rgba(255,255,255,0.13)',
      onPress: () => LauncherBridge?.triggerHaptic?.('click') },
    { icon: <WaveformIcon size={iconSz} />, bg: 'rgba(255,255,255,0.13)',
      onPress: () => LauncherBridge?.triggerHaptic?.('click') },
    { icon: <ScreenMirrorIcon size={iconSz} />, bg: 'rgba(255,255,255,0.13)',
      onPress: () => LauncherBridge?.triggerHaptic?.('click') },
    { icon: <ShazamIcon size={iconSz} />, bg: '#007AFF',
      onPress: () => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.launchApp?.('com.shazam.android'); onClose(); } },
  ];

  const rows: Item[][] = [items.slice(0, 4), items.slice(4, 8)];

  return (
    <View style={styles.bottomWrapper}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.gridRow}>
          {row.map((item, ci) => (
            <TouchableOpacity
              key={ci}
              style={[styles.gridCircle, { width: S, height: S, borderRadius: S / 2, backgroundColor: item.bg }]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              {item.icon}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const GLASS = 'rgba(255, 255, 255, 0.13)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.22)';

const styles = StyleSheet.create({
  middleCol: { gap: 10, alignItems: 'flex-start' },
  twoRow: { flexDirection: 'row', gap: 12 },
  circle: { backgroundColor: GLASS, borderWidth: 0.5, borderColor: GLASS_BORDER, justifyContent: 'center', alignItems: 'center' },
  circleYellow: { backgroundColor: '#FFD60A', borderColor: '#FFD60A' },
  circleRed: { backgroundColor: '#FF3B30', borderColor: '#FF3B30' },
  focusPill: {
    height: 44, borderRadius: 22,
    backgroundColor: GLASS,
    borderWidth: 0.5, borderColor: GLASS_BORDER,
    justifyContent: 'center', paddingHorizontal: 16,
  },
  focusPillActive: { backgroundColor: '#5856D6', borderColor: '#7A79E8' },
  focusInner: { flexDirection: 'row', alignItems: 'center' },
  focusLabel: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginLeft: 8 },
  miniRow: { flexDirection: 'row', gap: 8 },
  mini: { width: 38, height: 38, borderRadius: 19, backgroundColor: GLASS, borderWidth: 0.5, borderColor: GLASS_BORDER, justifyContent: 'center', alignItems: 'center' },
  miniWhite: { backgroundColor: '#ffffff', borderColor: '#ffffff' },
  miniRed: { backgroundColor: 'rgba(255,59,48,0.2)', borderColor: '#FF3B30' },
  bottomWrapper: { marginTop: 12, gap: 12 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between' },
  gridCircle: { justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, borderColor: GLASS_BORDER },
});
