import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
} from 'react-native';
import { LauncherBridge } from '../../services/LauncherBridge';
import { SunGlyph, SpeakerGlyph } from './CCIcons';

interface LiquidCapsuleSliderProps {
  type: 'brightness' | 'volume';
  label: string;
  value: number;
  width: number;
  height: number;
  onValueChange: (val: number) => void;
}

export function LiquidCapsuleSlider({
  type,
  value,
  width,
  height,
  onValueChange,
}: LiquidCapsuleSliderProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const stretchAnim = useRef(new Animated.Value(1)).current;
  const lastDetentRef = useRef<number>(Math.round(value * 2) / 2);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        Animated.spring(scaleAnim, {
          toValue: 1.04,
          tension: 200,
          friction: 12,
          useNativeDriver: true,
        }).start();
        LauncherBridge?.triggerHaptic?.('tick');

        const y = evt.nativeEvent.locationY;
        const clampedY = Math.max(0, Math.min(height, y));
        const ratio = Math.round((1 - clampedY / height) * 100) / 100;
        onValueChange(ratio);
      },
      onPanResponderMove: evt => {
        const y = evt.nativeEvent.locationY;
        if (y < 0) {
          const over = -y;
          stretchAnim.setValue(1 + Math.min(0.08, over / 350));
        } else if (y > height) {
          const under = y - height;
          stretchAnim.setValue(1 - Math.min(0.06, under / 350));
        } else {
          stretchAnim.setValue(1);
        }

        const clampedY = Math.max(0, Math.min(height, y));
        const ratio = Math.round((1 - clampedY / height) * 100) / 100;

        const currentDetent = Math.round(ratio * 4) / 4;
        if (currentDetent !== lastDetentRef.current) {
          lastDetentRef.current = currentDetent;
          LauncherBridge?.triggerHaptic?.('tick');
        }

        onValueChange(ratio);
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(scaleAnim, { toValue: 1, tension: 150, friction: 9, useNativeDriver: true }),
          Animated.spring(stretchAnim, { toValue: 1, tension: 150, friction: 9, useNativeDriver: true }),
        ]).start();
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(scaleAnim, { toValue: 1, tension: 150, friction: 9, useNativeDriver: true }),
          Animated.spring(stretchAnim, { toValue: 1, tension: 150, friction: 9, useNativeDriver: true }),
        ]).start();
      },
    }),
  ).current;

  const fillPercent = Math.max(0, Math.min(100, Math.round(value * 100)));
  const isHigh = fillPercent > 50;

  return (
    <Animated.View
      style={[
        styles.capsuleWrapper,
        {
          width,
          height,
          transform: [{ scale: scaleAnim }, { scaleY: stretchAnim }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Liquid white glass fill level */}
      <View
        style={[
          styles.capsuleFill,
          {
            height: `${fillPercent}%`,
          },
        ]}
      />

      {/* Top subtle specular edge */}
      <View style={styles.specularHighlight} pointerEvents="none" />

      {/* Center Icon */}
      <View style={styles.centerIconContainer} pointerEvents="none">
        {type === 'brightness' ? (
          <SunGlyph size={26} dark={isHigh} />
        ) : (
          <SpeakerGlyph size={24} dark={isHigh} volume={value} />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  capsuleWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 36,
    borderWidth: 0,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capsuleFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  specularHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  centerIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
