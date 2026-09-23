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
  dockColor?: string | null;
  isDarkText?: boolean;
  onPressApp: (pkg: string) => void;
  onLongPressApp: () => void;
}

function parseHex(hex?: string | null) {
  if (!hex) return null;
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }
  return null;
}

export function Dock({
  apps,
  dockColor,
  isDarkText = false,
  onPressApp,
  onLongPressApp,
}: DockProps) {
  const gradientColors = React.useMemo(() => {
    if (isDarkText) {
      // Light wallpaper -> Frosted milky glass diffusion
      return [
        'rgba(255, 255, 255, 0.88)',
        'rgba(244, 244, 248, 0.82)',
        'rgba(235, 235, 242, 0.78)',
      ];
    }

    const rgb = parseHex(dockColor);
    if (rgb) {
      // Wallpaper-adaptive vibrant glass with rich body diffusion
      const rTop = Math.round(rgb.r * 0.78 + 255 * 0.22);
      const gTop = Math.round(rgb.g * 0.78 + 255 * 0.22);
      const bTop = Math.round(rgb.b * 0.78 + 255 * 0.22);

      const rBot = Math.round(rgb.r * 0.92);
      const gBot = Math.round(rgb.g * 0.92);
      const bBot = Math.round(rgb.b * 0.92);

      return [
        `rgba(${rTop}, ${gTop}, ${bTop}, 0.74)`,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.70)`,
        `rgba(${rBot}, ${gBot}, ${bBot}, 0.66)`,
      ];
    }

    // Default frosted glass
    return [
      'rgba(255, 255, 255, 0.44)',
      'rgba(255, 255, 255, 0.34)',
      'rgba(255, 255, 255, 0.26)',
    ];
  }, [dockColor, isDarkText]);

  const borderColor = isDarkText
    ? 'rgba(255, 255, 255, 0.60)'
    : 'rgba(255, 255, 255, 0.24)';

  return (
    <View style={styles.dockContainer}>
      <View style={styles.glassDockWrapper}>
        <LinearGradient
          colors={gradientColors}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.glassDockGradient, { borderColor }]}
        >
          {/* Subtle frosted sheen to soften underlying details */}
          <View style={styles.frostedSheen} pointerEvents="none" />

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
    marginBottom: 8,
  },
  glassDockWrapper: {
    width: width - 32,
    height: 90,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 1,
  },
  glassDockGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    borderWidth: 0.65,
    borderColor: 'rgba(255, 255, 255, 0.24)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  frostedSheen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  dockItem: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
