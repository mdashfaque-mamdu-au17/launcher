# Liquid Glass Launcher — Product Execution Plan

## Purpose

This document turns the high-level vision in `ROADMAP.md` into a practical build order. It is a living reference for decisions about scope, sequencing, and completion criteria.

The product is an Android home-screen launcher with a premium iOS 26/27-inspired liquid-glass visual language. It should be useful as an Android launcher in its own right, rather than only a visual replica.

## Guiding build order

Build each major feature in this order:

```text
Visual design system
        ↓
Interaction and customization
        ↓
Native Android capability
```

This keeps visual work fast, avoids coupling layout to Android permissions, and lets each surface reach a polished mockup state before system integrations are added.

## Phase 0 — Shared Liquid Glass Design System

Create reusable primitives before expanding the product surface area.

- Liquid-glass card: tint, blur, rim highlight, soft shadow, internal glow, and optional texture/noise.
- Standard tile sizes: small (1×1), wide (2×1), large (2×2), and tall (1×2).
- Shared interaction behavior: press compression, specular shift, spring release, and haptic feedback.
- Consistent rules for corner geometry, spacing, type, icon strokes, light/dark contrast, and wallpaper adaptation.
- A background treatment that makes glass feel integrated with the active wallpaper.

**Done when:** the same primitives can build a Control Center tile, folder, dock, Dynamic Island card, and notification card without visual drift.


### First implementation milestone — Wallpaper-Adaptive Home Materials

This is the first visual improvement to make before expanding the Control Center further. The current launcher structure, grid, custom icon treatment, clock, and dock are already a credible foundation. The most visible quality gap is that some glass surfaces use a fixed tint instead of feeling derived from the wallpaper beneath them.

- Make the floating dock sample or visually inherit the wallpaper behind it, rather than relying on a fixed cyan or neutral glass color.
- Give the dock a restrained background tint, blur/frosting, rim highlight, soft shadow, and contrast adjustment that changes with light, dark, warm, cool, busy, and low-contrast wallpapers.
- Redesign the page indicator as a quieter, wallpaper-aware material: it should remain readable without becoming a separate brightly coloured pill.
- Keep icon borders subtle and consistent. Avoid applying a strong glass effect to every icon; the icons should stay crisp while the dock, folders, indicators, and overlays provide the glass depth.
- Verify the result on a small wallpaper set: near-black, bright/white, blue/cyan, warm/red, high-detail photo, and low-detail gradient.

**Done when:** the dock and page indicator look naturally embedded in each test wallpaper, maintain legibility, and no longer read as a fixed overlay colour.

## Phase 1 — Control Center: Visual Completion

Finish the Control Center as a high-fidelity mockup before expanding native functionality.

- Improve material depth through layered blur, translucency, edge lighting, and subtle specular/noise treatments.
- Refine the status/header area and top-to-bottom spacing.
- Upgrade media: album art, metadata, playback state, waveform/equalizer treatment, scrubber, and output route affordance.
- Complete the base control catalogue: connectivity, Focus, flashlight, timer, calculator, camera, screen recording, orientation, music recognition, and device/remote controls.
- Support expandable control groups or additional Control Center pages as needed.
- Tune opening, interactive dragging, dismissal, and outside-tap behavior.

**Done when:** a screen recording looks intentional and complete even if controls still use mock state.

## Phase 2 — Customizable Control Center

Build Control Center as a user-configurable layout rather than hard-coded rows.

### Model

```text
Control registry
  └─ id, title, icon, supported size(s), availability/capability rules

User layout
  └─ page → ordered grid positions → chosen control → size → settings
```

### User experience

1. Long-press Control Center to enter edit mode.
2. Controls enter a subtle jiggle/edit state.
3. Drag controls to reorder them.
4. Drop controls into valid positions.
5. Resize controls that support more than one shape.
6. Remove a control or open an “Add a Control” catalogue.
7. Save changes automatically and restore them at launch.

Start with one fixed-grid page. Add multiple pages and presets only after drag/drop, collision handling, resizing, and persistence are reliable.

**Done when:** a user can create and retain their own practical first-page Control Center.

## Phase 3 — Native Android Capability

Attach real behavior control by control, while keeping the UI graceful on unsupported devices and without permissions.

| Area | Product approach |
| --- | --- |
| Volume, media, flashlight, battery | Direct native integration |
| Brightness | Immediate launcher-window adjustment; request special permission for system-wide persistence |
| Internet, Wi-Fi, Bluetooth | Prefer official Android panels/settings where direct control is restricted |
| Calculator, camera, installed apps | Launch the matching application |
| Focus / Do Not Disturb | Permission-gated Android integration |
| Screen record, casting, device controls | Use approved Android system flows; expose availability clearly |
| Airplane mode | Settings shortcut/state display, not a promised direct toggle |

**Done when:** each visible control either performs its intended action, opens the appropriate Android system panel, or clearly communicates why it is unavailable.

## Phase 4 — Home Screen Completion

Bring the same quality bar to the launcher surface.

- Reliable iOS-inspired icon normalization and custom system icon treatment.
- Persisted app arrangement, hidden apps, dock configuration, folders, labels, and badges.
- Jiggle/edit mode with drag-to-reorder and drag-to-dock.
- Glass folder expansion transitions.
- App Library as the final home-screen page, using useful categories.
- Wallpaper selection and adaptive label/glass contrast.

**Done when:** the launcher is pleasant to use daily, not merely a visual demo.

## Phase 5 — Spotlight Search

- Pull-down gesture from the main home surface.
- Frosted search layer with fast fuzzy matching across installed apps.
- Recent apps, suggestions, and quick launch behavior.
- Launching an app should be immediate and return naturally to the launcher afterward.

**Done when:** search is faster than manually finding an app in the grid.

## Phase 6 — Dynamic Island

Treat this as a compact activity surface rather than a decorative pill.

- Collapsed resting state.
- Media playback: artwork, track details, playback action, and equalizer.
- Timer/countdown.
- Charging/battery state.
- Volume indication.
- Notification preview where platform access permits it.
- Spring transitions: pill → compact bubble → expanded card → dismissal/resting pill.

**Done when:** transitions are smooth and every shown state is backed by meaningful state rather than random animation.

## Phase 7 — Lock-Screen-Style Experience

- Launcher-owned visual lock-screen surface with a large clock/date, wallpaper depth, flashlight/camera shortcuts, and notification-style cards.
- Swipe-up transition into the launcher.
- Keep the distinction clear: this is a launcher experience, not a replacement for Android’s secure system lock screen unless system-level privileges are deliberately pursued later.

## Phase 8 — Product Hardening

- Test across Android versions, OEM skins, screen sizes, refresh rates, and dark/light wallpapers.
- Measure startup speed, memory use, battery behavior, animation smoothness, and icon-loading performance.
- Add accessibility labels, sensible focus order, reduced-motion behavior, and graceful permission fallbacks.
- Review Play distribution requirements and permissions before any public release.

## Priority Order

1. Wallpaper-adaptive home materials: dock, page indicator, and shared liquid-glass rules.
2. Control Center visual polish and motion, using those shared material rules.
3. Control Center edit mode, tile registry, drag/drop, resizing, and persistence.
4. Safe native Control Center capabilities.
5. Home-screen editing, folders, dock, and App Library.
6. Spotlight.
7. Dynamic Island.
8. Lock-screen-style experience.
9. Performance, accessibility, and device testing.

## Scope Guardrails

- Do not let native permissions block visual or interaction progress.
- Do not represent restricted Android system settings as if the launcher can always toggle them directly.
- Build reusable surfaces and state models before adding more one-off components.
- Prefer a smaller, polished, daily-usable first release over an unfinished imitation of every iOS surface.
