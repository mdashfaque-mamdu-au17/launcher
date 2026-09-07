import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { LauncherBridge } from '../../services/LauncherBridge';
import {
  FlashlightIcon,
  ScreenRecordIcon,
  ScreenMirrorIcon,
  LightbulbIcon,
  StopwatchIcon,
  ShazamIcon,
  WaveformIcon,
} from './CCIcons';

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
  colWidth,
  twoColWidth,
  torchOn,
  onToggleTorch,
  onLaunchCalculator,
  onLaunchCamera,
  onLaunchBattery,
}: QuickControlsProps) {
  const [orientationLocked, setOrientationLocked] = useState(false);
  const [silentActive, setSilentActive] = useState(false);
  const [dndActive, setDndActive] = useState(false);
  const [screenRecording, setScreenRecording] = useState(false);

  // Circle button diameter
  const circleDiameter = Math.min(colWidth, 54);

  return (
    <View style={[styles.middleColContainer, { width: twoColWidth }]}>
      {/* Row 1: Orientation Lock + Silent Mode */}
      <View style={styles.twoBtnRow}>
        <TouchableOpacity
          style={[
            styles.circleCard,
            { width: circleDiameter, height: circleDiameter, borderRadius: circleDiameter / 2 },
            orientationLocked && styles.circleCardActive,
          ]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            setOrientationLocked(!orientationLocked);
          }}
          activeOpacity={0.75}
        >
          <Text style={[styles.lockGlyph, orientationLocked && styles.lockGlyphActive]}>
            🔒
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.circleCard,
            { width: circleDiameter, height: circleDiameter, borderRadius: circleDiameter / 2 },
            silentActive && styles.circleCardRedActive,
          ]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            setSilentActive(!silentActive);
          }}
          activeOpacity={0.75}
        >
          <Text style={styles.bellGlyph}>{silentActive ? '🔕' : '🔔'}</Text>
        </TouchableOpacity>
      </View>

      {/* Row 2: Focus Pill (iOS 18 style) */}
      <TouchableOpacity
        style={[
          styles.dndPill,
          { width: twoColWidth },
          dndActive && styles.dndPillActive,
        ]}
        onPress={() => {
          LauncherBridge?.triggerHaptic?.('click');
          setDndActive(!dndActive);
        }}
        activeOpacity={0.75}
      >
        <View style={styles.focusPillContent}>
          <Text style={[styles.dndMoon, dndActive && styles.dndMoonActive]}>🌙</Text>
          <Text style={[styles.dndTitle, dndActive && styles.dndTitleActive]}>
            Focus
          </Text>
        </View>
      </TouchableOpacity>

      {/* Row 3: 4 Circle Action Buttons (Torch, Screen Record, Screen Mirror, Battery) */}
      <View style={styles.fourCirclesRow}>
        {/* Torch / Flashlight */}
        <TouchableOpacity
          style={[
            styles.miniCircle,
            torchOn && styles.torchActive,
          ]}
          onPress={onToggleTorch}
          activeOpacity={0.75}
        >
          <FlashlightIcon active={torchOn} size={18} />
        </TouchableOpacity>

        {/* Screen Record */}
        <TouchableOpacity
          style={[
            styles.miniCircle,
            screenRecording && styles.recordActive,
          ]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            setScreenRecording(!screenRecording);
          }}
          activeOpacity={0.75}
        >
          <ScreenRecordIcon active={screenRecording} size={18} />
        </TouchableOpacity>

        {/* Screen Mirroring */}
        <TouchableOpacity
          style={styles.miniCircle}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            Alert.alert('Screen Mirroring', 'Searching for AirPlay / Cast displays...');
          }}
          activeOpacity={0.75}
        >
          <ScreenMirrorIcon size={18} />
        </TouchableOpacity>

        {/* Low Power Mode / Battery */}
        <TouchableOpacity
          style={styles.miniCircle}
          onPress={onLaunchBattery}
          activeOpacity={0.75}
        >
          <View style={styles.batteryIconShell}>
            <View style={styles.batteryIconFill} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface BottomPillsProps {
  twoColWidth: number;
  onClose: () => void;
}

export function BottomPillsRow({ twoColWidth, onClose }: BottomPillsProps) {
  // We'll use the twoColWidth/2 for column layout or just fixed widths.
  // The iOS grid usually has 4 columns per row.
  const gap = 12;
  const itemSize = 62; // Circular item size

  return (
    <View style={styles.bottomPillsWrapper}>
      {/* Row 1 */}
      <View style={styles.circularGridRow}>
        <TouchableOpacity style={styles.gridCircle} activeOpacity={0.7} onPress={() => LauncherBridge?.triggerHaptic?.('click')}>
          <FlashlightIcon active={false} size={22} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.gridCircle} activeOpacity={0.7} onPress={() => LauncherBridge?.triggerHaptic?.('click')}>
          <StopwatchIcon size={22} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCircle} activeOpacity={0.7} onPress={() => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.launchApp('com.android.calculator2'); onClose(); }}>
          <Text style={styles.emojiIcon}>🧮</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCircle} activeOpacity={0.7} onPress={() => { LauncherBridge?.triggerHaptic?.('click'); LauncherBridge?.launchApp('com.android.camera2'); onClose(); }}>
          <Text style={styles.emojiIcon}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Row 2 */}
      <View style={styles.circularGridRow}>
        <TouchableOpacity style={styles.gridCircle} activeOpacity={0.7} onPress={() => LauncherBridge?.triggerHaptic?.('click')}>
          <ScreenRecordIcon active={false} size={22} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCircle} activeOpacity={0.7} onPress={() => LauncherBridge?.triggerHaptic?.('click')}>
          <WaveformIcon size={22} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCircle} activeOpacity={0.7} onPress={() => LauncherBridge?.triggerHaptic?.('click')}>
          <ScreenMirrorIcon size={22} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCircle} activeOpacity={0.7} onPress={() => LauncherBridge?.triggerHaptic?.('click')}>
          <ShazamIcon size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  middleColContainer: {
    height: 180,
    justifyContent: 'space-between',
  },
  twoBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  circleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCardActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  circleCardRedActive: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF453A',
  },
  lockGlyph: {
    fontSize: 18,
    color: '#ffffff',
  },
  lockGlyphActive: {
    color: '#121216',
  },
  bellGlyph: {
    fontSize: 18,
  },
  dndPill: {
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  dndPillActive: {
    backgroundColor: '#5856D6',
    borderColor: '#7A79E8',
  },
  focusPillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  dndMoon: {
    fontSize: 16,
    marginRight: 6,
  },
  dndMoonActive: {
    color: '#ffffff',
  },
  dndTextContainer: {
    justifyContent: 'center',
  },
  dndTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  dndTitleActive: {
    color: '#ffffff',
  },
  dndSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.55)',
  },
  dndSubtitleActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  fourCirclesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  torchActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
    shadowColor: '#FFD60A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  recordActive: {
    backgroundColor: 'rgba(255, 59, 48, 0.25)',
    borderColor: '#FF3B30',
  },
  batteryIconShell: {
    width: 18,
    height: 10,
    borderRadius: 2.5,
    borderWidth: 1.2,
    borderColor: '#ffffff',
    padding: 1,
    justifyContent: 'center',
  },
  batteryIconFill: {
    width: '60%',
    height: '100%',
    backgroundColor: '#FFD60A',
    borderRadius: 1,
  },
  bottomPillsWrapper: {
    marginTop: 16,
    gap: 16,
    paddingHorizontal: 6,
  },
  circularGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiIcon: {
    fontSize: 22,
  },
});
