# iOS 26 & iOS 27 Liquid Glass Launcher - Master Roadmap

## Vision
Transform Liquid Glass Launcher on Android into an authentic, ultra-premium iOS 26 / iOS 27 experience. Every detail—from squircle icon geometry and live ticking clocks to hardware-accelerated frosted glass blur and fluid spring physics—is engineered to mirror Apple's flagship interface.

---

## Phases & Milestones

### 📱 Phase 1: iOS 26 Icon System & Squircle Geometry (Current Milestone)
- **Squircle Super-Ellipse Geometry**:
  - Exact Apple continuous corner curve (~22.5% radius, 13.5dp on 60dp size).
  - Subtle 0.5px glass border highlight (`rgba(255, 255, 255, 0.45)`) and realistic iOS drop shadow (`shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }`).
- **Live Dynamic Icons**:
  - **Clock Icon**: Crisp white dial with live, real-time rotating hour, minute, and orange ticking second hand.
  - **Calendar Icon**: Authentic Apple calendar tile with red top banner (`MON`) and bold current day number (`7`).
- **Core System iOS Icon Pack**:
  - Authentic vector/SVG styling for key system apps:
    - **Phone**: Vibrant Apple green (`#34C759`) with angled white telephone handset.
    - **Messages**: Apple green (`#34C759`) with white speech bubble.
    - **Safari / Chrome**: Deep blue compass with white/red needle or sleek web globe.
    - **Camera**: Metallic light grey with dark 35mm optical lens and yellow flash sensor.
    - **Photos / Gallery**: Pure white tile with iconic 8-petal spectrum flower.
    - **Settings**: Apple metallic grey gradient with multi-tooth mechanical gear.
    - **Calculator**: Dark slate (`#2C2C2E`) with orange and grey circular keypad layout.
    - **Music**: Vibrant red-pink gradient with white double-note.
    - **Notes**: Yellow leather header with ruled memo lines.
    - **Weather**: Sky blue gradient with cloud and glowing sun.
    - **Mail / Gmail**: Blue/white envelope with gradient fold.
- **Full-Bleed Masking & Normalization**:
  - Eliminates awkward circular Android letterbox margins by cropping and scaling 3rd-party app icons seamlessly into full-bleed iOS squircles.
- **Future Icon Pack Support**:
  - Architecture ready to load standard Play Store iOS icon pack APKs via `appfilter.xml`.

---

### 🪟 Phase 2: Liquid Glass Control Center & Android 15 Hardware Blur
- **Native Hardware Blur**:
  - Implement Android 15 native `RenderEffect.createBlurEffect(50f, 50f)` on the full-screen canvas so the launcher wallpaper glows through the glass like real iOS.
- **Specular Glass Borders & Lighting**:
  - 4-column layout matching iOS 26.5 / 27 reference screenshot.
  - Interactive dual vertical capsule sliders (Brightness & Volume) with haptic detents.
  - Clean SF Symbol toggles for Connectivity and Quick Utilities.

---

### 🏝️ Phase 3: Interactive Dynamic Island / Notch
- Floating top pill that smoothly expands for:
  - Active media playback (track title, animated mini equalizer, play/pause).
  - Countdown timers.
  - Battery charging animation & percentage.
  - Volume HUD indicator.

---

### 🔒 Phase 4: iOS 26 Lock Screen & Notification Center
- Iconic bold Apple clock typography with customizable weights and soft depth shadows.
- Date pill and security lock glyph.
- Circular bottom shortcuts: Flashlight and Camera with haptic feedback.
- Fluid swipe-up-to-unlock gesture with spring physics.
- Stacked liquid glass notification platters.

---

### 🔍 Phase 5: Spotlight Search & App Library
- Mid-screen pull-down gesture to reveal frosted Spotlight Search with instant fuzzy search.
- Categorized App Library (Social, Productivity, Utilities, Games) past the final home screen page.
