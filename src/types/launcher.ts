import { Animated } from 'react-native';

export interface AppItem {
  label: string;
  packageName: string;
  icon: string;
}

export interface BatteryStatus {
  level: number;
  isCharging: boolean;
}

export interface SliderProps {
  type: 'brightness' | 'volume';
  label: string;
  value: number;
  onValueChange: (val: number) => void;
}

export interface AppIconProps {
  app: AppItem;
  index: number;
  isEditing: boolean;
  sharedWobbleAnim: Animated.Value;
  onPress: (pkg: string) => void;
  onLongPress: () => void;
  onRemove: (app: AppItem) => void;
}

export interface DockIconProps {
  app: AppItem;
  onPress: (pkg: string) => void;
  onLongPress: () => void;
}

export interface ControlCenterProps {
  visible: boolean;
  slideAnim: Animated.Value;
  fadeAnim: Animated.Value;
  onClose: () => void;
  apps: AppItem[];
}
