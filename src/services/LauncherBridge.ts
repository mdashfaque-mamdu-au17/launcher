import { NativeModules } from 'react-native';
import { AppItem, BatteryStatus } from '../types/launcher';

const LauncherBridgeNative = NativeModules.LauncherBridge;

export const NativeLauncher = {
  getInstalledApps: async (): Promise<AppItem[]> => {
    if (!LauncherBridgeNative?.getInstalledApps) return [];
    try {
      const res = await LauncherBridgeNative.getInstalledApps();
      if (typeof res === 'string') {
        return JSON.parse(res);
      }
      return res || [];
    } catch {
      return [];
    }
  },

  getApps: async (): Promise<AppItem[]> => {
    return NativeLauncher.getInstalledApps();
  },

  launchApp: async (packageName: string): Promise<boolean> => {
    if (!LauncherBridgeNative?.launchApp) return false;
    return LauncherBridgeNative.launchApp(packageName);
  },

  getVolume: async (): Promise<number> => {
    if (!LauncherBridgeNative?.getVolume) return 0.5;
    return LauncherBridgeNative.getVolume();
  },

  setVolume: async (ratio: number): Promise<boolean> => {
    if (!LauncherBridgeNative?.setVolume) return false;
    return LauncherBridgeNative.setVolume(ratio);
  },

  getBrightness: async (): Promise<number> => {
    if (!LauncherBridgeNative?.getBrightness) return 0.5;
    return LauncherBridgeNative.getBrightness();
  },

  setBrightness: async (ratio: number): Promise<boolean> => {
    if (!LauncherBridgeNative?.setBrightness) return false;
    return LauncherBridgeNative.setBrightness(ratio);
  },

  toggleTorch: async (enable: boolean): Promise<boolean> => {
    if (!LauncherBridgeNative?.toggleTorch) return false;
    return LauncherBridgeNative.toggleTorch(enable);
  },

  sendMediaKeyEvent: async (keyCode: number): Promise<boolean> => {
    if (!LauncherBridgeNative?.sendMediaKeyEvent) return false;
    return LauncherBridgeNative.sendMediaKeyEvent(keyCode);
  },

  isMusicActive: async (): Promise<boolean> => {
    if (!LauncherBridgeNative?.isMusicActive) return false;
    return LauncherBridgeNative.isMusicActive();
  },

  openInternetPanel: async (): Promise<boolean> => {
    if (!LauncherBridgeNative?.openInternetPanel) return false;
    return LauncherBridgeNative.openInternetPanel();
  },

  openBluetoothSettings: async (): Promise<boolean> => {
    if (!LauncherBridgeNative?.openBluetoothSettings) return false;
    return LauncherBridgeNative.openBluetoothSettings();
  },

  openAirplaneSettings: async (): Promise<boolean> => {
    if (!LauncherBridgeNative?.openAirplaneSettings) return false;
    return LauncherBridgeNative.openAirplaneSettings();
  },

  openBatterySettings: async (): Promise<boolean> => {
    if (!LauncherBridgeNative?.openBatterySettings) return false;
    return LauncherBridgeNative.openBatterySettings();
  },

  openDefaultAppsSettings: async (): Promise<boolean> => {
    if (!LauncherBridgeNative?.openDefaultAppsSettings) return false;
    return LauncherBridgeNative.openDefaultAppsSettings();
  },

  triggerHaptic: async (type: 'click' | 'tick' | 'heavy' = 'click'): Promise<boolean> => {
    if (!LauncherBridgeNative?.triggerHaptic) return false;
    return LauncherBridgeNative.triggerHaptic(type);
  },

  getBatteryStatus: async (): Promise<BatteryStatus> => {
    if (!LauncherBridgeNative?.getBatteryStatus) {
      return { level: 85, isCharging: false };
    }
    return LauncherBridgeNative.getBatteryStatus();
  },
};

export const LauncherBridge = NativeLauncher;
