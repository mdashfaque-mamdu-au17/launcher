import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Animated,
  NativeModules,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LogBox,
  Linking,
  PanResponder,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

LogBox.ignoreAllLogs();

const { width, height } = Dimensions.get('window');
const { LauncherBridge } = NativeModules;

const APPS_PER_PAGE = 20; // 4 columns x 5 rows
const COLUMN_COUNT = 4;
const ICON_SIZE = 58;
const GRID_PADDING_H = 16;
const AVAILABLE_WIDTH = width - GRID_PADDING_H * 2;
const ITEM_WIDTH = AVAILABLE_WIDTH / COLUMN_COUNT;

interface AppItem {
  label: string;
  packageName: string;
  icon: string;
}

// Module-level cache so returning home is INSTANTANEOUS (0ms delay, no empty screen)
let memoryAppCache: AppItem[] = [];

// Curated iOS Color Gradients for staple apps
const IOS_PALETTES: Record<string, { bg: string; border: string }> = {
  phone: { bg: '#34C759', border: '#4CD964' },
  dialer: { bg: '#34C759', border: '#4CD964' },
  message: { bg: '#30D158', border: '#34C759' },
  whatsapp: { bg: '#25D366', border: '#2EE572' },
  camera: { bg: '#8E8E93', border: '#A2A2A7' },
  chrome: { bg: '#007AFF', border: '#5856D6' },
  browser: { bg: '#007AFF', border: '#34AADC' },
  settings: { bg: '#8E8E93', border: '#AEAEB2' },
  calc: { bg: '#FF9500', border: '#FFA726' },
  music: { bg: '#FA2D48', border: '#FF3B30' },
  photo: { bg: '#5856D6', border: '#AF52DE' },
  youtube: { bg: '#FF0000', border: '#FF3333' },
};

function Clock({
  isEditing,
  onDone,
  onOpenControlCenter,
}: {
  isEditing: boolean;
  onDone: () => void;
  onOpenControlCenter: () => void;
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.clockRow}>
      <View style={styles.clockTextCol}>
        <Text style={styles.dateText}>{dateStr}</Text>
        <Text style={styles.timeText}>{`${hours}:${minutes}`}</Text>
      </View>
      {isEditing ? (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={onDone}
          activeOpacity={0.8}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.controlPill}
          onPress={() => {
            console.log('Control Center Pill Pressed!');
            onOpenControlCenter();
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text style={styles.controlPillGlyph}>🎛</Text>
          <View style={styles.controlPillBar} />
        </TouchableOpacity>
      )}
    </View>
  );
}

interface AppIconProps {
  app: AppItem;
  index: number;
  isEditing: boolean;
  sharedWobbleAnim: Animated.Value;
  onPress: (pkg: string) => void;
  onLongPress: () => void;
  onRemove: (app: AppItem) => void;
}

function AppIconItem({
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

interface SliderProps {
  icon: string;
  label: string;
  value: number;
  onValueChange: (val: number) => void;
}

function LiquidCapsuleSlider({
  icon,
  label,
  value,
  onValueChange,
}: SliderProps) {
  const sliderHeight = 146;
  const currentRatioRef = useRef(value);
  currentRatioRef.current = value;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const y = evt.nativeEvent.locationY;
        const clampedY = Math.max(0, Math.min(sliderHeight, y));
        const ratio = Math.round((1 - clampedY / sliderHeight) * 100) / 100;
        onValueChange(ratio);
      },
      onPanResponderMove: evt => {
        const y = evt.nativeEvent.locationY;
        const clampedY = Math.max(0, Math.min(sliderHeight, y));
        const ratio = Math.round((1 - clampedY / sliderHeight) * 100) / 100;
        onValueChange(ratio);
      },
    }),
  ).current;

  const fillPercent = Math.max(0, Math.min(100, Math.round(value * 100)));
  const isHigh = fillPercent > 32;

  return (
    <View style={styles.sliderCapsule} {...panResponder.panHandlers}>
      {/* Liquid white glass fill level */}
      <View style={[styles.sliderFill, { height: `${fillPercent}%` }]} />
      {/* Dynamic Specular Highlights */}
      <View style={styles.sliderSpecularHighlight} pointerEvents="none" />
      {/* Icon & Label indicator */}
      <View style={styles.sliderContent} pointerEvents="none">
        <Text
          style={[
            styles.sliderIcon,
            { color: isHigh ? '#1c1c1e' : '#ffffff' },
          ]}
        >
          {icon}
        </Text>
        <Text
          style={[
            styles.sliderPercent,
            { color: isHigh ? '#1c1c1e' : 'rgba(255, 255, 255, 0.75)' },
          ]}
        >
          {`${fillPercent}%`}
        </Text>
      </View>
    </View>
  );
}

interface ControlCenterProps {
  visible: boolean;
  onClose: () => void;
  apps: AppItem[];
}

function ControlCenterOverlay({ visible, onClose, apps }: ControlCenterProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [brightness, setBrightness] = useState(0.65);
  const [volume, setVolume] = useState(0.5);
  const [torchOn, setTorchOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wifiActive, setWifiActive] = useState(true);
  const [btActive, setBtActive] = useState(true);
  const [airplaneActive, setAirplaneActive] = useState(false);

  // Initial read of system brightness and volume
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
    }
  }, [visible]);

  // Entrance & Exit animation
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -height,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  // Handle Brightness Slider Drag
  const handleBrightnessChange = useCallback((val: number) => {
    setBrightness(val);
    if (LauncherBridge?.setBrightness) {
      LauncherBridge.setBrightness(val).catch(() => {});
    }
  }, []);

  // Handle Volume Slider Drag
  const handleVolumeChange = useCallback((val: number) => {
    setVolume(val);
    if (LauncherBridge?.setVolume) {
      LauncherBridge.setVolume(val).catch(() => {});
    }
  }, []);

  // Handle Torch Toggle
  const handleToggleTorch = useCallback(async () => {
    try {
      const next = !torchOn;
      setTorchOn(next);
      if (LauncherBridge?.toggleTorch) {
        await LauncherBridge.toggleTorch(next);
      }
    } catch (e: any) {
      Alert.alert('Flashlight', e?.message || 'Could not toggle flashlight');
    }
  }, [torchOn]);

  // Launch Utilities
  const handleLaunchCalculator = useCallback(() => {
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

  // Volume icon logic
  const volumeIcon = volume === 0 ? '🔇' : volume < 0.35 ? '🔈' : volume < 0.7 ? '🔉' : '🔊';

  if (!visible) return null;

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: 9990 }]}
      pointerEvents="box-none"
    >
      {/* Blurred / Translucent Backdrop */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.controlCenterBackdrop,
          { opacity: fadeAnim },
        ]}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Sliding Control Center Sheet */}
      <Animated.View
        style={[
          styles.controlCenterSheet,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 12,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Top Handle / Dismiss Indicator */}
        <View style={styles.topHandleBarContainer}>
          <View style={styles.topHandleBar} />
        </View>

        {/* Status Row */}
        <View style={styles.ccStatusRow}>
          <Text style={styles.ccStatusText}>Control Center</Text>
          <TouchableOpacity onPress={onClose} style={styles.ccCloseButton}>
            <Text style={styles.ccCloseButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Row 1: Connectivity Platter + Media Player Platter */}
        <View style={styles.ccRow}>
          {/* 2x2 Network Connectivity Platter */}
          <View style={styles.ccPlatterSquare}>
            <View style={styles.networkGrid}>
              <TouchableOpacity
                style={[
                  styles.networkButton,
                  airplaneActive && styles.networkButtonOrange,
                ]}
                onPress={() => {
                  setAirplaneActive(!airplaneActive);
                  LauncherBridge?.openAirplaneSettings?.();
                }}
              >
                <Text style={styles.networkGlyph}>✈️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.networkButton, styles.networkButtonGreen]}
                onPress={() => Alert.alert('Cellular', 'Mobile Data Active')}
              >
                <Text style={styles.networkGlyph}>📶</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.networkButton,
                  wifiActive && styles.networkButtonBlue,
                ]}
                onPress={() => {
                  setWifiActive(!wifiActive);
                  LauncherBridge?.openWifiSettings?.();
                }}
              >
                <Text style={styles.networkGlyph}>ᯤ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.networkButton,
                  btActive && styles.networkButtonBlue,
                ]}
                onPress={() => {
                  setBtActive(!btActive);
                  LauncherBridge?.openBluetoothSettings?.();
                }}
              >
                <Text style={styles.networkGlyph}>ᛒ</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Media Player Platter */}
          <View style={styles.ccPlatterSquare}>
            <View style={styles.mediaContainer}>
              <Text style={styles.mediaSubtitle}>NOW PLAYING</Text>
              <Text style={styles.mediaTitle} numberOfLines={1}>
                {isPlaying ? 'Liquid Glass Grooves' : 'Not Playing'}
              </Text>
              <View style={styles.mediaControlsRow}>
                <TouchableOpacity
                  style={styles.mediaBtn}
                  onPress={() => Alert.alert('Music', 'Previous track')}
                >
                  <Text style={styles.mediaBtnText}>⏮</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.mediaBtn, styles.mediaPlayBtn]}
                  onPress={() => setIsPlaying(!isPlaying)}
                >
                  <Text style={styles.mediaPlayBtnText}>
                    {isPlaying ? '⏸' : '▶'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.mediaBtn}
                  onPress={() => Alert.alert('Music', 'Next track')}
                >
                  <Text style={styles.mediaBtnText}>⏭</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Row 2: Sliders & Lock/Mirroring Cards */}
        <View style={styles.ccRow}>
          {/* Dual Sliders: Brightness & Volume */}
          <View style={styles.ccSlidersContainer}>
            <LiquidCapsuleSlider
              icon="☀️"
              label="Brightness"
              value={brightness}
              onValueChange={handleBrightnessChange}
            />
            <LiquidCapsuleSlider
              icon={volumeIcon}
              label="Volume"
              value={volume}
              onValueChange={handleVolumeChange}
            />
          </View>

          {/* Auxiliary Platter: Rotation Lock & Screen Mirroring */}
          <View style={styles.auxCol}>
            <TouchableOpacity
              style={styles.auxCard}
              onPress={() => Alert.alert('Orientation', 'Rotation Lock toggled')}
            >
              <Text style={styles.auxCardIcon}>🔒</Text>
              <Text style={styles.auxCardLabel}>Portrait Lock</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.auxCard}
              onPress={() => LauncherBridge?.openDefaultAppsSettings?.()}
            >
              <Text style={styles.auxCardIcon}>⚙️</Text>
              <Text style={styles.auxCardLabel}>Default Home</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 3: Quick Action Utilities (Torch, Calculator, Camera, Settings) */}
        <View style={styles.ccQuickRow}>
          <TouchableOpacity
            style={[
              styles.quickUtilityBtn,
              torchOn && styles.quickUtilityBtnActive,
            ]}
            onPress={handleToggleTorch}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.quickUtilityIcon,
                torchOn && styles.quickUtilityIconActive,
              ]}
            >
              🔦
            </Text>
            <Text
              style={[
                styles.quickUtilityLabel,
                torchOn && styles.quickUtilityLabelActive,
              ]}
            >
              Torch
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickUtilityBtn}
            onPress={handleLaunchCalculator}
            activeOpacity={0.8}
          >
            <Text style={styles.quickUtilityIcon}>🧮</Text>
            <Text style={styles.quickUtilityLabel}>Calc</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickUtilityBtn}
            onPress={handleLaunchCamera}
            activeOpacity={0.8}
          >
            <Text style={styles.quickUtilityIcon}>📷</Text>
            <Text style={styles.quickUtilityLabel}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickUtilityBtn}
            onPress={() => {
              onClose();
              Linking.openSettings().catch(() => {});
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.quickUtilityIcon}>⚙️</Text>
            <Text style={styles.quickUtilityLabel}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Swipe up dismissal handle */}
        <TouchableOpacity
          style={styles.bottomDismissGrabber}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <View style={styles.bottomGrabberPill} />
          <Text style={styles.bottomDismissText}>Swipe up to close</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function LauncherContent() {
  const insets = useSafeAreaInsets();
  const [apps, setApps] = useState<AppItem[]>(memoryAppCache);
  const [hiddenPackages, setHiddenPackages] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showControlCenter, setShowControlCenter] = useState(false);

  const sharedWobbleAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  // 120Hz native jiggle loop
  useEffect(() => {
    if (isEditing) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(sharedWobbleAnim, {
            toValue: 1,
            duration: 115,
            useNativeDriver: true,
          }),
          Animated.timing(sharedWobbleAnim, {
            toValue: -1,
            duration: 115,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      return () => {
        loop.stop();
        sharedWobbleAnim.setValue(0);
      };
    } else {
      sharedWobbleAnim.setValue(0);
    }
  }, [isEditing, sharedWobbleAnim]);

  // Background fetch (never shows empty screen on resume!)
  const fetchApps = useCallback(async () => {
    if (!LauncherBridge || !LauncherBridge.getInstalledApps) {
      return;
    }
    try {
      const installed: AppItem[] = await LauncherBridge.getInstalledApps();
      memoryAppCache = installed;
      setApps(installed);
    } catch (err: any) {
      console.warn('Failed to fetch installed apps', err);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleLaunchApp = useCallback(
    async (packageName: string) => {
      if (isEditing) {
        setIsEditing(false);
        return;
      }
      try {
        await LauncherBridge.launchApp(packageName);
      } catch (err: any) {
        Alert.alert(
          'Launch Failed',
          'Could not open app: ' + (err?.message || ''),
        );
      }
    },
    [isEditing],
  );

  const handleLongPress = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleRemoveApp = useCallback((app: AppItem) => {
    Alert.alert(
      `Remove "${app.label}"?`,
      'Choose an action for this app:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Hide from Home',
          onPress: () => {
            setHiddenPackages(prev => new Set(prev).add(app.packageName));
          },
        },
        {
          text: 'App Info / Settings',
          onPress: () => {
            Linking.openSettings().catch(() => {});
          },
        },
      ],
      { cancelable: true },
    );
  }, []);

  const visibleApps = useMemo(() => {
    return apps.filter(a => !hiddenPackages.has(a.packageName));
  }, [apps, hiddenPackages]);

  const pages = useMemo(() => {
    if (visibleApps.length === 0) return [];
    const chunks: AppItem[][] = [];
    for (let i = 0; i < visibleApps.length; i += APPS_PER_PAGE) {
      chunks.push(visibleApps.slice(i, i + APPS_PER_PAGE));
    }
    return chunks;
  }, [visibleApps]);

  // Guaranteed 4 unique dock apps
  const dockApps = useMemo(() => {
    const priorityKeywords = [
      'phone',
      'dialer',
      'contact',
      'message',
      'whatsapp',
      'chrome',
      'browser',
      'camera',
    ];
    const selected: AppItem[] = [];
    const usedPackages = new Set<string>();

    for (const kw of priorityKeywords) {
      const match = visibleApps.find(
        a =>
          a.packageName.toLowerCase().includes(kw) &&
          !usedPackages.has(a.packageName),
      );
      if (match) {
        selected.push(match);
        usedPackages.add(match.packageName);
      }
      if (selected.length >= 4) break;
    }

    if (selected.length < 4) {
      for (const a of visibleApps) {
        if (!usedPackages.has(a.packageName)) {
          selected.push(a);
          usedPackages.add(a.packageName);
        }
        if (selected.length >= 4) break;
      }
    }
    return selected;
  }, [visibleApps]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const pageIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentPage(pageIndex);
  };

  const renderPage = ({
    item: pageApps,
  }: {
    item: AppItem[];
    index: number;
  }) => {
    return (
      <View style={styles.pageContainer}>
        <View style={styles.gridContainer}>
          {pageApps.map((app, itemIdx) => (
            <AppIconItem
              key={`${app.packageName}-${itemIdx}`}
              app={app}
              index={itemIdx}
              isEditing={isEditing}
              sharedWobbleAnim={sharedWobbleAnim}
              onPress={handleLaunchApp}
              onLongPress={handleLongPress}
              onRemove={handleRemoveApp}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 6 },
      ]}
    >
      {/* Clock & Header with Control Center Pill */}
      <Clock
        isEditing={isEditing}
        onDone={() => setIsEditing(false)}
        onOpenControlCenter={() => setShowControlCenter(true)}
      />

      {/* Paginated Home Screens with Native Snapping Physics */}
      <View style={styles.pagesWrapper}>
        {pages.length > 0 && (
          <FlatList
            ref={flatListRef}
            data={pages}
            keyExtractor={(_, index) => `page-${index}`}
            renderItem={renderPage}
            horizontal
            pagingEnabled={false} // Disable rigid default paging
            snapToInterval={width} // Accurate physical width snapping
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum={true} // Prevents jumping multiple pages!
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            onMomentumScrollEnd={onMomentumScrollEnd}
            scrollEventThrottle={16}
            style={styles.pagesList}
            removeClippedSubviews={false}
            initialNumToRender={2}
            windowSize={3}
          />
        )}
      </View>

      {/* Liquid Page Indicator Dots */}
      <View style={styles.pageIndicatorContainer}>
        <View style={styles.pageIndicatorPill}>
          {pages.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

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
          })}
        </View>
      </View>

      {/* Floating Liquid Glass Dock */}
      <View style={styles.dockContainer}>
        <View style={styles.glassDock}>
          {dockApps.map((app, index) => (
            <DockIconItem
              key={`dock-${app.packageName}-${index}`}
              app={app}
              onPress={handleLaunchApp}
              onLongPress={handleLongPress}
            />
          ))}
        </View>
      </View>

      {/* iOS Liquid Control Center Overlay */}
      <ControlCenterOverlay
        visible={showControlCenter}
        onClose={() => setShowControlCenter(false)}
        apps={apps}
      />
    </View>
  );
}

function DockIconItem({
  app,
  onPress,
  onLongPress,
}: {
  app: AppItem;
  onPress: (pkg: string) => void;
  onLongPress: () => void;
}) {
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

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        {...({ translucent: true } as any)}
      />
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
  clockRow: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clockTextCol: {
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.88)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 56,
    fontWeight: '200',
    color: '#ffffff',
    letterSpacing: -1,
  },
  doneButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  doneButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
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
    paddingHorizontal: GRID_PADDING_H,
    justifyContent: 'flex-start',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
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
    // Multi-stop liquid glass specular highlight borders
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
    borderRightColor: 'rgba(255, 255, 255, 0.4)',
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
  // Top Control Pill
  controlPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  controlPillGlyph: {
    fontSize: 16,
    color: '#ffffff',
  },
  controlPillBar: {
    width: 14,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 2,
    marginLeft: 6,
  },
  // Control Center Overlay & Sheet
  controlCenterBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    zIndex: 9998,
  },
  controlCenterSheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20, 20, 26, 0.92)',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 50,
    zIndex: 9999,
  },
  topHandleBarContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },
  topHandleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  ccStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  ccStatusText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  ccCloseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ccCloseButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  ccRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  ccPlatterSquare: {
    width: (width - 36 - 12) / 2,
    height: 146,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkGrid: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  networkButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  networkButtonOrange: {
    backgroundColor: '#FF9500',
    borderColor: '#FFA726',
  },
  networkButtonGreen: {
    backgroundColor: '#34C759',
    borderColor: '#4CD964',
  },
  networkButtonBlue: {
    backgroundColor: '#007AFF',
    borderColor: '#5856D6',
  },
  networkGlyph: {
    fontSize: 20,
    color: '#ffffff',
  },
  mediaContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  mediaSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.55)',
    letterSpacing: 0.8,
  },
  mediaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginVertical: 4,
  },
  mediaControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mediaBtn: {
    padding: 6,
  },
  mediaPlayBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaBtnText: {
    fontSize: 18,
    color: '#ffffff',
  },
  mediaPlayBtnText: {
    fontSize: 18,
    color: '#ffffff',
  },
  // Liquid Sliders
  ccSlidersContainer: {
    width: (width - 36 - 12) / 2,
    height: 146,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderCapsule: {
    width: ((width - 36 - 12) / 2 - 10) / 2,
    height: 146,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  sliderSpecularHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sliderContent: {
    position: 'absolute',
    bottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  sliderIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  sliderPercent: {
    fontSize: 11,
    fontWeight: '700',
  },
  // Auxiliary Column
  auxCol: {
    width: (width - 36 - 12) / 2,
    height: 146,
    justifyContent: 'space-between',
  },
  auxCard: {
    height: 68,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  auxCardIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  auxCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Quick Utilities Row
  ccQuickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickUtilityBtn: {
    flex: 1,
    height: 72,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  quickUtilityBtnActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  quickUtilityIcon: {
    fontSize: 22,
    marginBottom: 3,
  },
  quickUtilityIconActive: {
    color: '#1c1c1e',
  },
  quickUtilityLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  quickUtilityLabelActive: {
    color: '#1c1c1e',
  },
  // Bottom Dismiss Handle
  bottomDismissGrabber: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  bottomGrabberPill: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginBottom: 4,
  },
  bottomDismissText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.45)',
    fontWeight: '500',
  },
});
