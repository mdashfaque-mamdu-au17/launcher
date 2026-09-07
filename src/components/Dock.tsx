import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { AppItem } from '../types/launcher';
import { width } from '../constants/layout';

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
        <View style={styles.liquidGlassRim}>
          <View style={styles.dockIconWrapper}>
            {app.icon ? (
              <Image
                source={{ uri: app.icon }}
                style={styles.dockIcon}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderIcon}>
                <Text style={styles.placeholderText}>
                  {app.label.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.specularShine} />
        </View>
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
      <View style={styles.glassDock}>
        {apps.map((app, index) => (
          <DockIconItem
            key={`dock-${app.packageName}-${index}`}
            app={app}
            onPress={onPressApp}
            onLongPress={onLongPressApp}
          />
        ))}
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
  glassDock: {
    width: width - 32,
    height: 86,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 38,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.65)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },
  dockItem: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liquidGlassRim: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.65)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 1.2,
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 7,
    elevation: 5,
  },
  dockIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    overflow: 'hidden',
  },
  dockIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  specularShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  placeholderIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
