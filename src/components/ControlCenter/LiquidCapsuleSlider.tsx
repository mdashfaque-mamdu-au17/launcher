import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LauncherBridge } from '../../services/LauncherBridge';
import { Sun, Volume2 } from 'lucide-react-native';

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
  const isHigh = fillPercent > 20;

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
      {/* Glass gradient background */}
      <LinearGradient
        colors={['rgba(45, 45, 50, 0.65)', 'rgba(25, 25, 30, 0.65)']}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Liquid white glass fill level */}
      <View
        style={[
          styles.capsuleFill,
          {
            height: `${fillPercent}%`,
          }
        ]}
      />

      {/* Center Icon */}
      <View style={styles.centerIconContainer} pointerEvents="none">
        {type === 'brightness' ? (
          <Sun size={24} color={fillPercent > 50 ? '#14151b' : '#ffffff'} strokeWidth={2.5} />
        ) : (
          <Volume2 size={24} color={fillPercent > 50 ? '#14151b' : '#ffffff'} strokeWidth={2.5} />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  capsuleWrapper: {
    borderRadius: 36,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightColor: 'rgba(255, 255, 255, 0.12)',
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  centerIconContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
