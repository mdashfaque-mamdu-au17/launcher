import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppItem } from '../types/launcher';
import { width } from '../constants/layout';
import { IOSAppIcon } from './IOSAppIcon';

interface DockIconProps {
  app: AppItem;
  onPress: (pkg: string) => void;
  onLongPress: () => void;
}

export function DockIconItem({ app, onPress, onLongPress }: DockIconProps) {
  const pressScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.86,
      useNativeDriver: true,
      speed: 60,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 35,
      bounciness: 8,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onPress(app.packageName)}
      onLongPress={onLongPress}
      delayLongPress={350}
    >
      <Animated.View
        style={[styles.dockItem, { transform: [{ scale: pressScale }] }]}
      >
        <IOSAppIcon app={app} size={58} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

interface DockProps {
  apps: AppItem[];
  onPressApp: (pkg: string) => void;
  onLongPressApp: () => void;
}

export function Dock({ apps, onPressApp, onLongPressApp }: DockProps) {
  return (
    <View style={styles.dockContainer}>
      <View style={styles.glassDockWrapper}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.28)', 'rgba(255, 255, 255, 0.12)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.glassDockGradient}
        >
          {/* Top specular curvature reflection */}
          <View style={styles.specularShine} pointerEvents="none" />

          {apps.map((app, index) => (
            <DockIconItem
              key={`dock-${app.packageName}-${index}`}
              app={app}
              onPress={onPressApp}
              onLongPress={onLongPressApp}
            />
          ))}
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dockContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 6,
  },
  glassDockWrapper: {
    width: width - 32,
    height: 86,
    borderRadius: 38,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  glassDockGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.65)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.40)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  specularShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '44%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
  },
  dockItem: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
