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

      {/* Row 2: Focus / Do Not Disturb Horizontal Pill */}
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
        <Text style={[styles.dndMoon, dndActive && styles.dndMoonActive]}>🌙</Text>
        <View style={styles.dndTextContainer}>
          <Text style={[styles.dndTitle, dndActive && styles.dndTitleActive]}>
            Do Not Disturb
          </Text>
          <Text style={[styles.dndSubtitle, dndActive && styles.dndSubtitleActive]}>
            {dndActive ? 'On' : 'Off'}
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
  const [lightsActive, setLightsActive] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);

  return (
    <View style={styles.bottomPillsWrapper}>
      {/* Row 1 */}
      <View style={styles.pillRow}>
        <TouchableOpacity
          style={[
            styles.utilityPill,
            { width: twoColWidth },
            lightsActive && styles.utilityPillActive,
          ]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            setLightsActive(!lightsActive);
          }}
          activeOpacity={0.75}
        >
          <View style={styles.pillIconBox}>
            <LightbulbIcon active={lightsActive} size={18} />
          </View>
          <View style={styles.pillTextBox}>
            <Text style={styles.pillHeading}>Bedroom Lights</Text>
            <Text style={styles.pillSubheading}>{lightsActive ? 'On' : 'Off'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.utilityPill,
            { width: twoColWidth },
            timerRunning && styles.utilityPillOrange,
          ]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            setTimerRunning(!timerRunning);
          }}
          activeOpacity={0.75}
        >
          <View style={styles.pillIconBox}>
            <StopwatchIcon size={18} />
          </View>
          <View style={styles.pillTextBox}>
            <Text style={styles.pillHeading}>Timer</Text>
            <Text style={styles.pillSubheading}>{timerRunning ? '00:15' : 'Ready'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Row 2 */}
      <View style={styles.pillRow}>
        <TouchableOpacity
          style={[styles.utilityPill, { width: twoColWidth }]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            Alert.alert('Music Recognition', 'Listening for songs via Shazam...');
          }}
          activeOpacity={0.75}
        >
          <View style={styles.pillIconBox}>
            <ShazamIcon size={18} />
          </View>
          <View style={styles.pillTextBox}>
            <Text style={styles.pillHeading}>Recognize Music</Text>
            <Text style={styles.pillSubheading}>Shazam</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.utilityPill, { width: twoColWidth }]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            Alert.alert('Voice Memo', 'Opening Voice Recorder...');
          }}
          activeOpacity={0.75}
        >
          <View style={styles.pillIconBox}>
            <WaveformIcon size={18} />
          </View>
          <View style={styles.pillTextBox}>
            <Text style={styles.pillHeading}>Voice Memo</Text>
            <Text style={styles.pillSubheading}>Tap to Record</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Row 3 */}
      <View style={styles.pillRow}>
        <TouchableOpacity
          style={[styles.utilityPill, { width: twoColWidth }]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            Alert.alert('Home Scenes', 'Select a smart home preset');
          }}
          activeOpacity={0.75}
        >
          <View style={styles.pillIconBox}>
            <Text style={styles.homeEmoji}>🏠</Text>
          </View>
          <View style={styles.pillTextBox}>
            <Text style={styles.pillHeading}>Choose Scene...</Text>
            <Text style={styles.pillSubheading}>Home Automation</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.utilityPill, { width: twoColWidth }]}
          onPress={() => {
            LauncherBridge?.triggerHaptic?.('click');
            LauncherBridge?.openDefaultAppsSettings?.();
          }}
          activeOpacity={0.75}
        >
          <View style={styles.pillIconBox}>
            <Text style={styles.homeEmoji}>⚙️</Text>
          </View>
          <View style={styles.pillTextBox}>
            <Text style={styles.pillHeading}>System Settings</Text>
            <Text style={styles.pillSubheading}>Preferences</Text>
          </View>
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
    backgroundColor: '#1c1f2b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
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
    backgroundColor: '#1c1f2b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  dndPillActive: {
    backgroundColor: '#5856D6',
    borderColor: '#7A79E8',
  },
  dndMoon: {
    fontSize: 18,
    marginRight: 10,
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
    backgroundColor: '#1c1f2b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
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
    marginTop: 12,
    gap: 10,
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  utilityPill: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1c1f2b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  utilityPillActive: {
    backgroundColor: 'rgba(255, 214, 10, 0.22)',
    borderColor: '#FFD60A',
  },
  utilityPillOrange: {
    backgroundColor: 'rgba(255, 149, 0, 0.22)',
    borderColor: '#FF9500',
  },
  pillIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pillTextBox: {
    justifyContent: 'center',
  },
  pillHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  pillSubheading: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.55)',
  },
  homeEmoji: {
    fontSize: 16,
  },
});
