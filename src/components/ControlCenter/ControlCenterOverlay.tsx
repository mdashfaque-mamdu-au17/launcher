import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ControlCenterProps } from '../../types/launcher';
import { width, height } from '../../constants/layout';
import { LauncherBridge } from '../../services/LauncherBridge';

import { CCStatusBar } from './CCStatusBar';
import { ConnectivityPlatter } from './ConnectivityPlatter';
import { MediaPlayerPlatter } from './MediaPlayerPlatter';
import { LiquidCapsuleSlider } from './LiquidCapsuleSlider';
import { MiddleControls, BottomPillsRow } from './QuickUtilitiesRow';

export function ControlCenterOverlay({
  visible,
  slideAnim,
  fadeAnim,
  onClose,
  apps,
}: ControlCenterProps) {
  const insets = useSafeAreaInsets();

  const [brightness, setBrightness] = useState(0.65);
  const [volume, setVolume] = useState(0.5);
  const [torchOn, setTorchOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [batteryStatus, setBatteryStatus] = useState<{ level: number; isCharging: boolean }>({
    level: 85,
    isCharging: false,
  });
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [visible]);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  // Read system states on open
  useEffect(() => {
    if (visible && LauncherBridge) {
      if (LauncherBridge.getBrightness) {
        LauncherBridge.getBrightness()
          .then((b: number) => setBrightness(b))
          .catch(() => {});
      }
      if (LauncherBridge.getVolume) {
        LauncherBridge.getVolume()
          .then((v: number) => setVolume(v))
          .catch(() => {});
      }
      if (LauncherBridge.getBatteryStatus) {
        LauncherBridge.getBatteryStatus()
          .then((b: { level: number; isCharging: boolean }) => setBatteryStatus(b))
          .catch(() => {});
      }
      if (LauncherBridge.isMusicActive) {
        LauncherBridge.isMusicActive()
          .then((active: boolean) => setIsPlaying(active))
          .catch(() => {});
      }
    }
  }, [visible]);

  // Interactive drag-up dismissal PanResponder
  const sheetPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy < -12 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.3;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < 0) {
          slideAnim.setValue(gestureState.dy);
          fadeAnim.setValue(Math.max(0, 1 + gestureState.dy / 350));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy < -80 || gestureState.vy < -0.35) {
          LauncherBridge?.triggerHaptic?.('tick');
          Animated.parallel([
            Animated.timing(slideAnim, { toValue: -height, duration: 220, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
          ]).start(onClose);
        } else {
          Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 11, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
          ]).start();
        }
      },
    }),
  ).current;

  const handleBrightnessChange = useCallback((val: number) => {
    setBrightness(val);
    if (LauncherBridge?.setBrightness) {
      LauncherBridge.setBrightness(val).catch(() => {});
    }
  }, []);

  const handleVolumeChange = useCallback((val: number) => {
    setVolume(val);
    if (LauncherBridge?.setVolume) {
      LauncherBridge.setVolume(val).catch(() => {});
    }
  }, []);

  const handleToggleTorch = useCallback(async () => {
    try {
      LauncherBridge?.triggerHaptic?.('click');
      const next = !torchOn;
      setTorchOn(next);
      if (LauncherBridge?.toggleTorch) {
        await LauncherBridge.toggleTorch(next);
      }
    } catch (e: any) {
      Alert.alert('Flashlight', e?.message || 'Could not toggle flashlight');
    }
  }, [torchOn]);

  const handleMediaPlayPause = useCallback(async () => {
    LauncherBridge?.triggerHaptic?.('click');
    setIsPlaying(prev => !prev);
    try {
      await LauncherBridge?.sendMediaKeyEvent?.(85);
    } catch (e) {
      console.warn('Failed media play/pause', e);
    }
  }, []);

  const handleMediaNext = useCallback(async () => {
    LauncherBridge?.triggerHaptic?.('tick');
    try {
      await LauncherBridge?.sendMediaKeyEvent?.(87);
    } catch (e) {
      console.warn('Failed media next', e);
    }
  }, []);

  const handleMediaPrev = useCallback(async () => {
    LauncherBridge?.triggerHaptic?.('tick');
    try {
      await LauncherBridge?.sendMediaKeyEvent?.(88);
    } catch (e) {
      console.warn('Failed media prev', e);
    }
  }, []);

  const handleLaunchCalculator = useCallback(() => {
    LauncherBridge?.triggerHaptic?.('click');
    const match = apps.find(
      a =>
        a.packageName.toLowerCase().includes('calc') ||
        a.label.toLowerCase().includes('calc'),
    );
    if (match && LauncherBridge?.launchApp) {
      onClose();
      LauncherBridge.launchApp(match.packageName).catch(() => {});
    } else {
      Alert.alert('Calculator', 'Calculator app not found');
    }
  }, [apps, onClose]);

  const handleLaunchCamera = useCallback(() => {
    LauncherBridge?.triggerHaptic?.('click');
    const match = apps.find(
      a =>
        a.packageName.toLowerCase().includes('camera') ||
        a.label.toLowerCase().includes('camera'),
    );
    if (match && LauncherBridge?.launchApp) {
      onClose();
      LauncherBridge.launchApp(match.packageName).catch(() => {});
    } else {
      Alert.alert('Camera', 'Camera app not found');
    }
  }, [apps, onClose]);

  const handleLaunchBattery = useCallback(() => {
    LauncherBridge?.triggerHaptic?.('click');
    if (LauncherBridge?.openBatterySettings) {
      LauncherBridge.openBatterySettings();
    }
  }, []);

  if (!visible) return null;

  // Responsive 4-Column Grid Geometry
  const usableWidth = width - 32;
  const colGap = 12;
  const colWidth = Math.floor((usableWidth - colGap * 3) / 4);
  const twoColWidth = colWidth * 2 + colGap;
  const sliderHeight = 180;

  return (
    <View style={[StyleSheet.absoluteFill, styles.rootOverlay]} pointerEvents="box-none">
      {/* 100% Full-Screen Immersive Frosted Blur Backdrop */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.fullScreenBackdrop,
          { opacity: fadeAnim },
        ]}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Sliding Control Center Canvas */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.controlCenterCanvas,
          {
            paddingTop: insets.top + 4,
            paddingBottom: insets.bottom + 8,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        {...sheetPanResponder.panHandlers}
      >
        {/* iOS Top Status Header */}
        <CCStatusBar
          timeStr={timeStr}
          batteryStatus={batteryStatus}
          onClose={onClose}
        />

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Row 1: Connectivity Platter + Media Player Platter */}
          <View style={[styles.gridRow, { gap: colGap }]}>
            <ConnectivityPlatter size={twoColWidth} />
            <MediaPlayerPlatter
              size={twoColWidth}
              isPlaying={isPlaying}
              onPlayPause={handleMediaPlayPause}
              onNext={handleMediaNext}
              onPrev={handleMediaPrev}
            />
          </View>

          {/* Row 2: Middle Controls (Cols 1 & 2) + Dual Sliders (Cols 3 & 4) */}
          <View style={[styles.gridRow, { gap: colGap, marginTop: 12 }]}>
            <MiddleControls
              colWidth={colWidth}
              twoColWidth={twoColWidth}
              torchOn={torchOn}
              onToggleTorch={handleToggleTorch}
              onLaunchCalculator={handleLaunchCalculator}
              onLaunchCamera={handleLaunchCamera}
              onLaunchBattery={handleLaunchBattery}
            />

            {/* Dual Tall Vertical Liquid Capsule Sliders */}
            <View style={[styles.slidersWrapper, { gap: colGap }]}>
              <LiquidCapsuleSlider
                type="brightness"
                label="Brightness"
                value={brightness}
                width={colWidth}
                height={sliderHeight}
                onValueChange={handleBrightnessChange}
              />
              <LiquidCapsuleSlider
                type="volume"
                label="Volume"
                value={volume}
                width={colWidth}
                height={sliderHeight}
                onValueChange={handleVolumeChange}
              />
            </View>
          </View>

          {/* Row 3: Smart Utility & Action Pills */}
          <BottomPillsRow twoColWidth={twoColWidth} onClose={onClose} />
        </ScrollView>

        {/* Authentic iOS Bottom Grabber Bar */}
        <View style={styles.bottomIndicatorArea} pointerEvents="none">
          <View style={styles.homeIndicatorBar} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootOverlay: {
    zIndex: 99999,
  },
  fullScreenBackdrop: {
    backgroundColor: 'rgba(10, 10, 20, 0.88)',
  },
  controlCenterCanvas: {
    backgroundColor: 'rgba(18, 18, 30, 0.55)',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slidersWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomIndicatorArea: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  homeIndicatorBar: {
    width: 140,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
});
