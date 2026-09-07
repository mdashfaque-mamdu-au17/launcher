import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { AppItem } from '../types/launcher';
import { ICON_SIZE } from '../constants/layout';

interface IOSAppIconProps {
  app: AppItem;
  size?: number;
}

export function IOSAppIcon({ app, size = ICON_SIZE }: IOSAppIconProps) {
  const [now, setNow] = useState(new Date());

  const pkg = (app.packageName || '').toLowerCase();
  const lbl = (app.label || '').toLowerCase();

  // Determine if app is a core system app
  const isClock = pkg === 'com.google.android.deskclock' || lbl === 'clock';
  const isCalendar = pkg === 'com.google.android.calendar' || lbl === 'calendar';
  const isPhone = pkg === 'com.google.android.dialer' || pkg === 'com.android.dialer' || lbl === 'phone';
  const isMessage = pkg === 'com.google.android.apps.messaging' || pkg === 'com.android.mms' || lbl === 'messages';
  const isCamera = pkg === 'com.google.android.GoogleCamera' || pkg === 'com.android.camera2' || lbl === 'camera';
  const isSettings = pkg === 'com.android.settings' || lbl === 'settings';
  const isPhotos = pkg === 'com.google.android.apps.photos' || pkg === 'com.android.gallery3d' || lbl === 'photos';
  const isCalc = pkg === 'com.google.android.calculator' || pkg === 'com.android.calculator2' || lbl === 'calculator';
  const isBrowser = pkg === 'com.android.chrome' || lbl === 'chrome' || lbl === 'browser';
  const isMusic = pkg === 'com.google.android.music' || lbl === 'music';
  const isStore = pkg === 'com.android.vending' || lbl === 'play store';

  // Keep live clock & calendar ticking
  useEffect(() => {
    if (!isClock && !isCalendar) return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isClock, isCalendar]);

  const cornerRadius = Math.round(size * 0.225); // iOS continuous super-ellipse ~22.5%

  // 1. DYNAMIC LIVE CLOCK
  if (isClock) {
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourAngle = hours * 30 + minutes * 0.5;
    const minAngle = minutes * 6;
    const secAngle = seconds * 6;

    return (
      <View style={[styles.squircleTile, { width: size, height: size, borderRadius: cornerRadius, backgroundColor: '#000000' }]}>
        <View style={styles.clockDial}>
          {/* Hour markers */}
          <View style={[styles.clockTick, styles.tick12]} />
          <View style={[styles.clockTick, styles.tick3]} />
          <View style={[styles.clockTick, styles.tick6]} />
          <View style={[styles.clockTick, styles.tick9]} />

          {/* Hour Hand */}
          <View
            style={[
              styles.hourHand,
              {
                height: size * 0.24,
                transform: [{ rotate: `${hourAngle}deg` }],
              },
            ]}
          />
          {/* Minute Hand */}
          <View
            style={[
              styles.minuteHand,
              {
                height: size * 0.34,
                transform: [{ rotate: `${minAngle}deg` }],
              },
            ]}
          />
          {/* Orange Second Hand */}
          <View
            style={[
              styles.secondHand,
              {
                height: size * 0.38,
                transform: [{ rotate: `${secAngle}deg` }],
              },
            ]}
          />
          {/* Center Pin */}
          <View style={styles.clockCenterPin} />
        </View>
        <View style={styles.specularShine} />
      </View>
    );
  }

  // 2. DYNAMIC LIVE CALENDAR
  if (isCalendar) {
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayName = dayNames[now.getDay()];
    const dayDate = now.getDate();

    return (
      <View style={[styles.squircleTile, { width: size, height: size, borderRadius: cornerRadius, backgroundColor: '#ffffff' }]}>
        <View style={styles.calTopBar}>
          <Text style={styles.calDayText}>{dayName}</Text>
        </View>
        <View style={styles.calBody}>
          <Text style={styles.calDateText}>{dayDate}</Text>
        </View>
        <View style={styles.specularShine} />
      </View>
    );
  }

  // 3. AUTHENTIC IOS PHONE ICON
  if (isPhone) {
    return (
      <View style={[styles.squircleTile, { width: size, height: size, borderRadius: cornerRadius, backgroundColor: '#34C759' }]}>
        <View style={styles.centeredContent}>
          <Text style={[styles.phoneHandset, { fontSize: size * 0.52 }]}>📞</Text>
        </View>
        <View style={styles.specularShine} />
      </View>
    );
  }

  // 4. AUTHENTIC IOS MESSAGES ICON
  if (isMessage) {
    return (
      <View style={[styles.squircleTile, { width: size, height: size, borderRadius: cornerRadius, backgroundColor: '#34C759' }]}>
        <View style={styles.centeredContent}>
          <View style={[styles.msgBubble, { width: size * 0.62, height: size * 0.48 }]}>
            <View style={styles.msgBubbleTail} />
          </View>
        </View>
        <View style={styles.specularShine} />
      </View>
    );
  }

  // 5. AUTHENTIC IOS CAMERA ICON
  if (isCamera) {
    return (
      <View style={[styles.squircleTile, { width: size, height: size, borderRadius: cornerRadius, backgroundColor: '#E5E5EA' }]}>
        <View style={styles.centeredContent}>
          <View style={[styles.cameraBody, { width: size * 0.68, height: size * 0.52 }]}>
            <View style={styles.cameraTopBump} />
            <View style={[styles.cameraLens, { width: size * 0.32, height: size * 0.32 }]}>
              <View style={styles.cameraLensGlass} />
            </View>
            <View style={styles.cameraFlash} />
          </View>
        </View>
        <View style={styles.specularShine} />
      </View>
    );
  }

  // 6. AUTHENTIC IOS SETTINGS ICON
  if (isSettings) {
    const gearOuter = size * 0.72;
    return (
      <View style={[styles.squircleTile, { width: size, height: size, borderRadius: cornerRadius, backgroundColor: '#2c2c2e' }]}>
        <View style={styles.centeredContent}>
          {/* Outer Gear Teeth */}
          {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((deg) => (
            <View key={deg} style={{
              position: 'absolute',
              width: gearOuter,
              height: gearOuter * 0.16,
              backgroundColor: '#a2a2a6',
              borderRadius: 1.5,
              transform: [{ rotate: `${deg}deg` }]
            }} />
          ))}
          {/* Inner Gear Core */}
          <View style={{
            position: 'absolute',
            width: gearOuter * 0.8,
            height: gearOuter * 0.8,
            backgroundColor: '#a2a2a6',
            borderRadius: 999,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Center Hole */}
            <View style={{
              width: gearOuter * 0.45,
              height: gearOuter * 0.45,
              backgroundColor: '#2c2c2e',
              borderRadius: 999
            }} />
          </View>
        </View>
        <View style={styles.specularShine} />
      </View>
    );
  }

  // 7. AUTHENTIC IOS CALCULATOR ICON
  if (isCalc) {
    return (
      <View style={[styles.squircleTile, { width: size, height: size, borderRadius: cornerRadius, backgroundColor: '#2C2C2E' }]}>
        <View style={styles.calcGrid}>
          <View style={[styles.calcBtn, { backgroundColor: '#A5A5A5' }]}>
            <Text style={styles.calcBtnText}>AC</Text>
          </View>
          <View style={[styles.calcBtn, { backgroundColor: '#FF9500' }]}>
            <Text style={[styles.calcBtnText, styles.textWhite]}>÷</Text>
          </View>
          <View style={[styles.calcBtn, { backgroundColor: '#505050' }]}>
            <Text style={[styles.calcBtnText, styles.textWhite]}>7</Text>
          </View>
          <View style={[styles.calcBtn, { backgroundColor: '#FF9500' }]}>
            <Text style={[styles.calcBtnText, styles.textWhite]}>=</Text>
          </View>
        </View>
        <View style={styles.specularShine} />
      </View>
    );
  }

  // 8. AUTHENTIC IOS PHOTOS ICON
  if (isPhotos) {
    const petalW = size * 0.38;
    const petalH = size * 0.16;
    const pRadius = petalH / 2;
    return (
      <View style={[styles.squircleTile, { width: size, height: size, borderRadius: cornerRadius, backgroundColor: '#ffffff' }]}>
        <View style={styles.centeredContent}>
          {/* Multi-layered pinwheel for iOS Photos */}
          <View style={[styles.photoPetal, { width: petalW, height: petalH, borderRadius: pRadius, backgroundColor: 'rgba(255,45,85,0.85)', transform: [{ translateX: petalW/2 - pRadius }] }]} />
          <View style={[styles.photoPetal, { width: petalW, height: petalH, borderRadius: pRadius, backgroundColor: 'rgba(255,204,0,0.85)', transform: [{ rotate: '90deg' }, { translateX: petalW/2 - pRadius }] }]} />
          <View style={[styles.photoPetal, { width: petalW, height: petalH, borderRadius: pRadius, backgroundColor: 'rgba(52,199,89,0.85)', transform: [{ rotate: '180deg' }, { translateX: petalW/2 - pRadius }] }]} />
          <View style={[styles.photoPetal, { width: petalW, height: petalH, borderRadius: pRadius, backgroundColor: 'rgba(0,122,255,0.85)', transform: [{ rotate: '270deg' }, { translateX: petalW/2 - pRadius }] }]} />
          
          <View style={[styles.photoPetal, { width: petalW, height: petalH, borderRadius: pRadius, backgroundColor: 'rgba(255,149,0,0.85)', transform: [{ rotate: '45deg' }, { translateX: petalW/2 - pRadius }] }]} />
          <View style={[styles.photoPetal, { width: petalW, height: petalH, borderRadius: pRadius, backgroundColor: 'rgba(76,217,100,0.85)', transform: [{ rotate: '135deg' }, { translateX: petalW/2 - pRadius }] }]} />
          <View style={[styles.photoPetal, { width: petalW, height: petalH, borderRadius: pRadius, backgroundColor: 'rgba(90,200,250,0.85)', transform: [{ rotate: '225deg' }, { translateX: petalW/2 - pRadius }] }]} />
          <View style={[styles.photoPetal, { width: petalW, height: petalH, borderRadius: pRadius, backgroundColor: 'rgba(88,86,214,0.85)', transform: [{ rotate: '315deg' }, { translateX: petalW/2 - pRadius }] }]} />
        </View>
        <View style={styles.specularShine} />
      </View>
    );
  }

  // 9. AUTHENTIC IOS MUSIC ICON
  if (isMusic) {
    return (
      <View style={[styles.squircleTile, { width: size, height: size, borderRadius: cornerRadius, backgroundColor: '#FA2D48' }]}>
        <View style={styles.centeredContent}>
          <Text style={[styles.musicNote, { fontSize: size * 0.54 }]}>♫</Text>
        </View>
        <View style={styles.specularShine} />
      </View>
    );
  }

  // 10. AUTHENTIC IOS SAFARI / CHROME
  if (isBrowser) {
    return (
      <View style={[styles.squircleTile, { width: size, height: size, borderRadius: cornerRadius, backgroundColor: '#007AFF' }]}>
        <View style={styles.centeredContent}>
          <View style={[styles.compassRing, { width: size * 0.62, height: size * 0.62, borderRadius: (size * 0.62) / 2 }]}>
            <View style={styles.compassNeedleRed} />
            <View style={styles.compassNeedleWhite} />
          </View>
        </View>
        <View style={styles.specularShine} />
      </View>
    );
  }

  // 11. GENERAL ANDROID 3RD-PARTY APP (Normalized Full-Bleed iOS Squircle Mask)
  return (
    <View style={[styles.squircleTile, { width: size, height: size, borderRadius: cornerRadius, backgroundColor: 'rgba(255, 255, 255, 0.08)' }]}>
      {app.icon ? (
        <Image
          source={{ uri: app.icon }}
          style={[styles.fullBleedIcon, { borderRadius: cornerRadius }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholderBox, { borderRadius: cornerRadius }]}>
          <Text style={styles.placeholderChar}>
            {(app.label || '?').charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      {/* iOS Liquid Glass Specular Edge */}
      <View style={styles.specularShine} />
    </View>
  );
}

const styles = StyleSheet.create({
  squircleTile: {
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    borderLeftWidth: 0.8,
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    borderRightWidth: 0.8,
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  specularShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  centeredContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullBleedIcon: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    width: '100%',
    height: '100%',
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderChar: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  // Clock styles
  clockDial: {
    width: '90%',
    height: '90%',
    borderRadius: 999,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  clockTick: {
    position: 'absolute',
    backgroundColor: '#1c1c1e',
    borderRadius: 0.5,
  },
  tick12: { top: 3, width: 2, height: 4 },
  tick6: { bottom: 3, width: 2, height: 4 },
  tick3: { right: 3, width: 4, height: 2 },
  tick9: { left: 3, width: 4, height: 2 },
  hourHand: {
    position: 'absolute',
    bottom: '50%',
    width: 2.5,
    backgroundColor: '#000000',
    borderRadius: 1.5,
    transformOrigin: 'bottom',
  },
  minuteHand: {
    position: 'absolute',
    bottom: '50%',
    width: 2,
    backgroundColor: '#000000',
    borderRadius: 1,
    transformOrigin: 'bottom',
  },
  secondHand: {
    position: 'absolute',
    bottom: '50%',
    width: 1,
    backgroundColor: '#FF9500',
    borderRadius: 0.5,
    transformOrigin: 'bottom',
  },
  clockCenterPin: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FF9500',
    zIndex: 10,
  },
  // Calendar styles
  calTopBar: {
    width: '100%',
    height: '32%',
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calDayText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  calBody: {
    width: '100%',
    height: '68%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calDateText: {
    fontSize: 26,
    fontWeight: '300',
    color: '#000000',
    marginTop: -2,
  },
  // Phone styles
  phoneHandset: {
    color: '#ffffff',
    transform: [{ rotate: '0deg' }],
  },
  // Messages styles
  msgBubble: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    position: 'relative',
  },
  msgBubbleTail: {
    position: 'absolute',
    bottom: -3,
    left: 6,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 4,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffffff',
  },
  // Camera styles
  cameraBody: {
    backgroundColor: '#8E8E93',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cameraTopBump: {
    position: 'absolute',
    top: -3,
    left: 8,
    width: 10,
    height: 3,
    backgroundColor: '#8E8E93',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  cameraLens: {
    borderRadius: 999,
    backgroundColor: '#1c1c1e',
    borderWidth: 2,
    borderColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraLensGlass: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
  },
  cameraFlash: {
    position: 'absolute',
    top: 3,
    right: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFD60A',
  },
  // Settings styles
  gearGlyph: {
    color: '#ffffff',
    fontWeight: '300',
  },
  // Photos styles
  photoPetal: {
    position: 'absolute',
  },
  // Calculator styles
  calcGrid: {
    width: '80%',
    height: '80%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  calcBtn: {
    width: '45%',
    height: '45%',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calcBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
  },
  textWhite: {
    color: '#ffffff',
    fontSize: 12,
  },
  musicNote: {
    color: '#ffffff',
    fontWeight: '900',
  },
  // Compass styles
  compassRing: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compassNeedleRed: {
    position: 'absolute',
    top: '12%',
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF3B30',
  },
  compassNeedleWhite: {
    position: 'absolute',
    bottom: '12%',
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#8E8E93',
  },
});
