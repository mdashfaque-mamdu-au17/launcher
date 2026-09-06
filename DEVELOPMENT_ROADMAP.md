# Liquid Glass Launcher: Development Roadmap & Live Testing Guide

This document outlines the step-by-step development process and live testing strategy for the iOS-inspired "Liquid Glass" Android Launcher and Control Center.

---

## 1. How Live Testing & Fast Refresh Works

### Can we use standard "Expo Go" (App Store QR Scanner)?

**No, standard Expo Go cannot be used as an Android Launcher.**

- **Why?** An Android launcher requires native OS-level registration:
  - Adding `<category android:name="android.intent.category.HOME" />` in `AndroidManifest.xml`.
  - Adding the `QUERY_ALL_PACKAGES` permission to discover installed phone apps.
  - Making the activity window translucent to show the underlying system wallpaper.
  - Calling Android `PackageManager` and `Intent.ACTION_MAIN` to launch apps.
- Standard Expo Go is a sandboxed app from Google Play that cannot modify its manifest or take over your phone's home screen.

### The Solution: Live Reload via Expo Dev Client or Bare React Native

You do **not** need to rebuild an APK every time you change code.

1. **One-Time Native Build**: We compile and install the debug launcher on your phone **once**.
2. **Instant Live Fast Refresh**:
   - The launcher on your phone connects to your PC's Metro bundler over **USB** (or Wi-Fi).
   - Every time we edit React components, Skia shaders, Control Center sliders, or layouts, your phone updates **in ~200 milliseconds** via Fast Refresh!
   - You can also scan a QR code with the **Expo Dev Client** to connect directly to the dev server.
3. Rebuilding the APK is only required if we change native Kotlin code or add new Android manifest permissions. 90% of our visual and interaction work will be 100% live.

---

## 2. Testable Milestones & Verification Criteria

```
+-------------------------------------------------------------------------+
| Milestone 1: Base Launcher Setup & Home Registration                    |
| - Verify: Phone prompts "Use Liquid Glass Launcher as Home"             |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| Milestone 2: Native App Bridge & Launcher Mechanics                     |
| - Verify: Real phone apps list & icons display; tapping launches them   |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| Milestone 3: Liquid Glass Materials, App Grid & Dock                    |
| - Verify: Frosted glass dock, squircle grid, spring physics, jiggle mode|
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| Milestone 4: iOS Control Center with Liquid Sliders                     |
| - Verify: Swipe down reveals CC; volume, brightness, torch all function |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| Milestone 5: Spotlight Search & App Library                             |
| - Verify: Instant fuzzy search & categorized smart folders              |
+-------------------------------------------------------------------------+
```

---

### Milestone 1: Project Scaffolding & Launcher Registration

- **Goal**: Get the barebones launcher installed and recognized as a Home App by Android.
- **Tasks**:
  1. Initialize the project with modern React Native & TypeScript.
  2. Configure `AndroidManifest.xml` with:
     - `<category android:name="android.intent.category.HOME" />`
     - `<category android:name="android.intent.category.DEFAULT" />`
     - `android:theme="@android:style/Theme.Wallpaper.NoTitleBar"` (to reveal system wallpaper).
  3. Set up ADB connection for live development.
- **User Verification Checklist**:
  - [ ] App builds and installs onto the phone.
  - [ ] Pressing the Android Home button triggers the system prompt asking to choose the default Home App.
  - [ ] Selecting the launcher shows the initial placeholder screen over the system wallpaper.

---

### Milestone 2: Native App Bridge & Launcher Mechanics

- **Goal**: Retrieve the user's actual phone apps and launch them.
- **Tasks**:
  1. Create a lightweight Kotlin native module (`LauncherBridgeModule`).
  2. Implement `getInstalledApps()`:
     - Query `PackageManager.queryIntentActivities(...)` for `ACTION_MAIN` + `CATEGORY_LAUNCHER`.
     - Extract app label, package name, and adaptive icon (as base64 or cached URI).
  3. Implement `launchApp(packageName)`:
     - Fire native intent to open target application.
  4. Render a basic list in React Native to verify app loading.
- **User Verification Checklist**:
  - [ ] Installed apps (WhatsApp, YouTube, Camera, Settings, etc.) appear with their real icons.
  - [ ] Tapping any app opens it immediately.
  - [ ] Exiting an app returns directly to the launcher.

---

### Milestone 3: Liquid Glass Materials, App Grid & Floating Dock

- **Goal**: Build the signature iOS visual aesthetics and gesture physics.
- **Tasks**:
  1. Integrate `@shopify/react-native-skia`, `react-native-reanimated`, and `react-native-gesture-handler`.
  2. Build the **Liquid Glass Material** component:
     - Semi-transparent tinted frosted glass.
     - 1px continuous specular highlight border with angle gradient.
     - Continuous squircle curvature (Apple superellipse).
  3. Build the **App Grid**:
     - 4x6 icon layout with iOS-proportioned typography and badges.
     - Paginated horizontal swipe with spring physics.
     - Dynamic pill page indicator dots.
  4. Build the **Floating Glass Dock**:
     - Pinned bottom glass capsule with 4 primary apps (Phone, Messages, Browser, Camera).
     - Reactive touch-down scale animation.
  5. Build **Jiggle / Edit Mode**:
     - Long-press to activate wobbling icons with randomized spring phase offsets.
- **User Verification Checklist**:
  - [ ] Glass dock and icons render smoothly over your wallpaper.
  - [ ] Swiping between pages feels fluid (60/120 FPS).
  - [ ] Long-pressing starts the jiggle animation.

---

### Milestone 4: iOS Control Center Overlay & Liquid Sliders

- **Goal**: Full-featured iOS Control Center with real Android system integration.
- **Tasks**:
  1. Top-right corner downward pan gesture to slide in the Control Center sheet.
  2. Platter layout:
     - 2x2 Connectivity platter (Wi-Fi, Bluetooth, Airplane Mode, Mobile Data).
     - Now Playing media card.
     - 1x1 Quick action tiles (Flashlight, Calculator, Camera).
  3. **Liquid Vertical Sliders**:
     - **Brightness Slider**: Dragging adjusts device screen brightness (`android.permission.WRITE_SETTINGS`).
     - **Volume Slider**: Dragging adjusts Android media volume via `AudioManager`.
     - Dynamic fluid fill effect and reactive icons.
  4. Haptic feedback integration on slider bounds and toggles.
- **User Verification Checklist**:
  - [ ] Swiping down from top-right opens the Control Center smoothly.
  - [ ] Dragging the Volume slider changes real phone media volume.
  - [ ] Dragging the Brightness slider changes actual screen brightness.
  - [ ] Tapping Flashlight toggles the physical torch on/off.

---

### Milestone 5: Spotlight Search & App Library

- **Goal**: Quick-launch search and organized app collection.
- **Tasks**:
  1. Swipe down from center of home screen to open Spotlight Search.
  2. Instant fuzzy search filtering across all installed apps.
  3. Swipe to rightmost page to open the iOS App Library (smart categories like Social, Utilities, Games, Productivity).
- **User Verification Checklist**:
  - [ ] Pull-down search opens with blurred backdrop.
  - [ ] Typing an app name filters instantaneously and pressing Enter launches it.
  - [ ] App Library shows categorized folders.

---

## 3. Recommended Workflow for Testing

1. Connect Android phone to PC with a USB cable.
2. Enable **USB Debugging** in your phone's Developer Options.
3. We run the development server (`npx react-native start`).
4. We build and push the app once to your phone.
5. From that point onward, every change we make will hot-reload live on your phone screen!
