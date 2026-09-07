import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { AppIconProps } from '../types/launcher';
import { ITEM_WIDTH } from '../constants/layout';
import { IOSAppIcon } from './IOSAppIcon';

export function AppIconItem({
  app,
  index,
  isEditing,
  sharedWobbleAnim,
  onPress,
  onLongPress,
  onRemove,
}: AppIconProps) {
  const pressScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.88,
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

  const direction = (index % 2 === 0 ? 1 : -1) * (1 + (index % 3) * 0.15);
  const rotation = sharedWobbleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [`${-2.4 * direction}deg`, `${2.4 * direction}deg`],
  });

  const translationY = sharedWobbleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [
      -1.2 * (index % 2 === 0 ? 1 : -1),
      1.2 * (index % 2 === 0 ? 1 : -1),
    ],
  });

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onPress(app.packageName)}
      onLongPress={onLongPress}
      delayLongPress={350}
    >
      <View style={styles.appItem}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [
                { scale: pressScale },
                ...(isEditing
                  ? [{ rotate: rotation }, { translateY: translationY }]
                  : []),
              ],
            },
          ]}
        >
          {/* iOS-style squircle icon — covers system apps with authentic look */}
          <IOSAppIcon app={app} />

          {/* iOS Minus Badge shown in edit mode */}
          {isEditing && (
            <TouchableOpacity
              style={styles.jiggleBadge}
              activeOpacity={0.8}
              onPress={() => onRemove(app)}
            >
              <Text style={styles.jiggleBadgeText}>−</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <Text style={styles.appLabel} numberOfLines={1} ellipsizeMode="tail">
          {app.label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  appItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    marginBottom: 14,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jiggleBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(80, 80, 85, 0.95)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
  },
  jiggleBadgeText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 17,
  },
  appLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 5,
    textAlign: 'center',
    width: ITEM_WIDTH - 6,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
