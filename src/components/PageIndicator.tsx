import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { SCREEN_WIDTH } from '../constants/layout';

interface PageIndicatorProps {
  pageCount?: number;
  total?: number;
  current?: number;
  scrollX?: Animated.Value;
}

export function PageIndicator({ pageCount, total, current = 0, scrollX }: PageIndicatorProps) {
  const count = total ?? pageCount ?? 0;
  if (count <= 1) return null;

  return (
    <View style={styles.pageIndicatorContainer}>
      <View style={styles.pageIndicatorPill}>
        {Array.from({ length: count }).map((_, i) => {
          if (scrollX) {
            const inputRange = [
              (i - 1) * SCREEN_WIDTH,
              i * SCREEN_WIDTH,
              (i + 1) * SCREEN_WIDTH,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [7, 20, 7],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.38, 1, 0.38],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={`dot-${i}`}
                style={[
                  styles.pageDot,
                  {
                    width: dotWidth,
                    opacity,
                  },
                ]}
              />
            );
          }

          const isActive = i === current;
          return (
            <View
              key={`dot-${i}`}
              style={[
                styles.pageDot,
                {
                  width: isActive ? 20 : 7,
                  opacity: isActive ? 1 : 0.38,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
    marginBottom: 6,
  },
  pageIndicatorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  pageDot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    marginHorizontal: 3.5,
  },
});
