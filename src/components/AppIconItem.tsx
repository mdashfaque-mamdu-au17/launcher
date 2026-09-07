import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { AppIconProps } from '../types/launcher';
import { ICON_SIZE, ITEM_WIDTH } from '../constants/layout';

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
          {/* iOS Liquid Glass Rim Container */}
          <View style={styles.liquidGlassRim}>
            <View style={styles.iconWrapper}>
              {app.icon ? (
                <Image
                  source={{ uri: app.icon }}
                  style={styles.appIcon}
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
            {/* Top specular highlight shine */}
            <View style={styles.specularShine} />
          </View>

          {/* iOS Minus Badge */}
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
  iconWrapper: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  appIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  placeholderIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  placeholderText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
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
