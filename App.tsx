import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Dimensions,
  FlatList,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LogBox,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LauncherBridge } from './src/services/LauncherBridge';
import { AppItem } from './src/types/launcher';
import { width, height, APPS_PER_PAGE } from './src/constants/layout';
import { IOS_PALETTES } from './src/constants/theme';

import { Clock } from './src/components/Clock';
import { AppIconItem } from './src/components/AppIconItem';
import { PageIndicator } from './src/components/PageIndicator';
import { Dock } from './src/components/Dock';
import { ControlCenterOverlay } from './src/components/ControlCenter/ControlCenterOverlay';

LogBox.ignoreAllLogs();

// Module-level cache so returning home is INSTANTANEOUS (0ms delay)
let memoryAppCache: AppItem[] = [];

function LauncherContent() {
  const insets = useSafeAreaInsets();
  const [apps, setApps] = useState<AppItem[]>(memoryAppCache);
  const [hiddenPackages, setHiddenPackages] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showControlCenter, setShowControlCenter] = useState(false);

  const slideAnim = useRef(new Animated.Value(-height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleOpenControlCenter = useCallback(() => {
    LauncherBridge?.triggerHaptic?.('tick');
    setShowControlCenter(true);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 10, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, fadeAnim]);

  const topSwipeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          gestureState.dy > 10 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.2
        );
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return (
          gestureState.dy > 10 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.2
        );
      },
      onPanResponderGrant: () => {
        setShowControlCenter(true);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(-height + gestureState.dy);
          fadeAnim.setValue(Math.min(1, gestureState.dy / 250));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 70 || gestureState.vy > 0.35) {
          LauncherBridge?.triggerHaptic?.('tick');
          Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
          ]).start();
        } else {
          Animated.parallel([
            Animated.timing(slideAnim, { toValue: -height, duration: 200, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
          ]).start(() => setShowControlCenter(false));
        }
      },
    }),
  ).current;

  const loadApps = useCallback(async () => {
    try {
      const rawApps = await LauncherBridge.getInstalledApps();
      const list = Array.isArray(rawApps) ? rawApps : [];
      const sorted = [...list].sort((a, b) => a.label.localeCompare(b.label));
      memoryAppCache = sorted;
      setApps(sorted);
    } catch (e) {
      console.error('Failed to load apps', e);
    }
  }, []);

  useEffect(() => {
    if (memoryAppCache.length === 0) {
      loadApps();
    }
    const interval = setInterval(() => {
      if (memoryAppCache.length === 0) loadApps();
    }, 2000);
    return () => clearInterval(interval);
  }, [loadApps]);

  const visibleApps = useMemo(() => {
    return apps.filter(a => !hiddenPackages.has(a.packageName));
  }, [apps, hiddenPackages]);

  const dockApps = useMemo(() => {
    const defaultPkgs = ['dialer', 'message', 'chrome', 'camera'];
    const found: AppItem[] = [];
    for (const dp of defaultPkgs) {
      const match = visibleApps.find(
        a => a.packageName.toLowerCase().includes(dp) || a.label.toLowerCase().includes(dp)
      );
      if (match && !found.includes(match)) {
        found.push(match);
      }
    }
    const remaining = visibleApps.filter(a => !found.includes(a));
    while (found.length < 4 && remaining.length > 0) {
      found.push(remaining.shift()!);
    }
    return found.slice(0, 4);
  }, [visibleApps]);

  const gridApps = useMemo(() => {
    return visibleApps.filter(a => !dockApps.includes(a));
  }, [visibleApps, dockApps]);

  const pages = useMemo(() => {
    const p = [];
    for (let i = 0; i < gridApps.length; i += APPS_PER_PAGE) {
      p.push(gridApps.slice(i, i + APPS_PER_PAGE));
    }
    return p.length > 0 ? p : [[]];
  }, [gridApps]);

  const handleLaunchApp = useCallback((pkg: string) => {
    LauncherBridge.triggerHaptic('click');
    if (LauncherBridge.launchApp) {
      LauncherBridge.launchApp(pkg).catch((e: any) => console.error(e));
    }
  }, []);

  const handleLongPress = useCallback(() => {
    LauncherBridge.triggerHaptic('heavy');
    setIsEditing(true);
  }, []);

  const handleRemoveApp = useCallback((app: AppItem) => {
    LauncherBridge.triggerHaptic('tick');
    setHiddenPackages(prev => {
      const next = new Set(prev);
      next.add(app.packageName);
      return next;
    });
  }, []);

  const handleDoneEditing = useCallback(() => {
    LauncherBridge.triggerHaptic('click');
    setIsEditing(false);
  }, []);

  const handleCloseControlCenter = useCallback(() => {
    LauncherBridge.triggerHaptic('tick');
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -height, duration: 220, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setShowControlCenter(false));
  }, [slideAnim, fadeAnim]);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const p = Math.round(x / width);
    if (p !== currentPage) setCurrentPage(p);
  }, [currentPage]);

  const sharedWobbleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isEditing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(sharedWobbleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
          Animated.timing(sharedWobbleAnim, { toValue: -1, duration: 120, useNativeDriver: true }),
          Animated.timing(sharedWobbleAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
        ])
      ).start();
    } else {
      sharedWobbleAnim.setValue(0);
      sharedWobbleAnim.stopAnimation();
    }
  }, [isEditing, sharedWobbleAnim]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.topSwipeZone, { top: insets.top + 2 }]} {...topSwipeResponder.panHandlers}>
        <TouchableOpacity
          style={styles.ccPullIndicatorWrapper}
          onPress={handleOpenControlCenter}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 16, left: 20, right: 20 }}
        >
          <View style={styles.ccPullIndicator} />
        </TouchableOpacity>
      </View>

      <Clock isEditing={isEditing} onDone={handleDoneEditing} />

      <View style={styles.pagesWrapper}>
        <FlatList
          data={pages}
          keyExtractor={(_, index) => `page-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={styles.pagesList}
          renderItem={({ item: pageApps }) => (
            <View style={styles.pageContainer}>
              <View style={styles.gridContainer}>
                {pageApps.map((app, i) => (
                  <AppIconItem
                    key={`${app.packageName}-${i}`}
                    app={app}
                    index={i}
                    isEditing={isEditing}
                    sharedWobbleAnim={sharedWobbleAnim}
                    onPress={handleLaunchApp}
                    onLongPress={handleLongPress}
                    onRemove={handleRemoveApp}
                  />
                ))}
              </View>
            </View>
          )}
        />
        <PageIndicator total={pages.length} current={currentPage} />
      </View>

      <Dock
        apps={dockApps}
        onPressApp={handleLaunchApp}
        onLongPressApp={handleLongPress}
      />

      <ControlCenterOverlay
        visible={showControlCenter}
        slideAnim={slideAnim}
        fadeAnim={fadeAnim}
        onClose={handleCloseControlCenter}
        apps={apps}
      />
    </View>
  );
}

export default function App() {
  useEffect(() => {
    (StatusBar as any).setBarStyle?.('light-content', true);
    (StatusBar as any).setBackgroundColor?.('transparent', true);
    (StatusBar as any).setTranslucent?.(true);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <LauncherContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topSwipeZone: {
    position: 'absolute',
    right: 0,
    width: width * 0.85,
    height: 160,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  ccPullIndicatorWrapper: {
    paddingTop: 4,
    paddingHorizontal: 10,
    paddingBottom: 14,
  },
  ccPullIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  pagesWrapper: {
    flex: 1,
    width: width,
    justifyContent: 'center',
  },
  pagesList: {
    flex: 1,
    width: width,
  },
  pageContainer: {
    width: width,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
});
