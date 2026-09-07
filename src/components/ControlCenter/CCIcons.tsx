import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// Crisp custom iOS vector-styled glyphs without emojis

export function FlashlightIcon({ active = false, size = 20 }: { active?: boolean; size?: number }) {
  const color = active ? '#1a1a1a' : '#ffffff';
  return (
    <View style={[styles.flashlightWrapper, { width: size, height: size * 1.1 }]}>
      {/* Torch Head */}
      <View style={[styles.torchHead, { backgroundColor: color }]} />
      {/* Torch Neck */}
      <View style={[styles.torchNeck, { backgroundColor: color }]} />
      {/* Torch Body */}
      <View style={[styles.torchBody, { backgroundColor: color }]} />
    </View>
  );
}

export function ScreenRecordIcon({ active = false, size = 20 }: { active?: boolean; size?: number }) {
  return (
    <View style={[styles.recordOuterRing, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.recordInnerDot, { width: size * 0.45, height: size * 0.45, borderRadius: size * 0.225 }]} />
    </View>
  );
}

export function ScreenMirrorIcon({ size = 20 }: { size?: number }) {
  return (
    <View style={[styles.mirrorWrapper, { width: size, height: size }]}>
      <View style={styles.mirrorRectBack} />
      <View style={styles.mirrorRectFront} />
    </View>
  );
}

export function WaveformIcon({ size = 20 }: { size?: number }) {
  return (
    <View style={[styles.waveformWrapper, { width: size, height: size * 0.7 }]}>
      <View style={[styles.waveBar, { height: '35%' }]} />
      <View style={[styles.waveBar, { height: '65%' }]} />
      <View style={[styles.waveBar, { height: '100%' }]} />
      <View style={[styles.waveBar, { height: '50%' }]} />
      <View style={[styles.waveBar, { height: '85%' }]} />
      <View style={[styles.waveBar, { height: '40%' }]} />
    </View>
  );
}

export function ShazamIcon({ size = 20 }: { size?: number }) {
  return (
    <View style={[styles.shazamCircle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.shazamLetter, { fontSize: size * 0.65 }]}>S</Text>
    </View>
  );
}

export function LightbulbIcon({ active = false, size = 20 }: { active?: boolean; size?: number }) {
  const color = active ? '#FFD60A' : '#ffffff';
  return (
    <View style={[styles.bulbWrapper, { width: size, height: size }]}>
      <View style={[styles.bulbHead, { backgroundColor: color }]} />
      <View style={[styles.bulbBase, { backgroundColor: active ? '#FFD60A' : 'rgba(255,255,255,0.6)' }]} />
    </View>
  );
}

export function StopwatchIcon({ size = 20 }: { size?: number }) {
  return (
    <View style={[styles.timerWrapper, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={styles.timerTopButton} />
      <View style={styles.timerHand} />
    </View>
  );
}

export function SunGlyph({ size = 24, dark = false }: { size?: number; dark?: boolean }) {
  const color = dark ? '#14151b' : '#ffffff';
  return (
    <View style={[styles.sunContainer, { width: size, height: size }]}>
      <View style={[styles.sunCore, { width: size * 0.44, height: size * 0.44, borderRadius: size * 0.22, borderColor: color }]} />
      {/* 8 Sun Rays */}
      <View style={[styles.sunRay, styles.rayV, { backgroundColor: color }]} />
      <View style={[styles.sunRay, styles.rayH, { backgroundColor: color }]} />
      <View style={[styles.sunRay, styles.rayD1, { backgroundColor: color }]} />
      <View style={[styles.sunRay, styles.rayD2, { backgroundColor: color }]} />
    </View>
  );
}

export function SpeakerGlyph({ size = 24, dark = false, volume = 0.5 }: { size?: number; dark?: boolean; volume?: number }) {
  const color = dark ? '#14151b' : '#ffffff';
  return (
    <View style={[styles.speakerContainer, { width: size, height: size }]}>
      {/* Speaker body */}
      <View style={[styles.speakerBox, { backgroundColor: color }]} />
      <View style={[styles.speakerCone, { borderRightColor: color }]} />
      {/* Sound waves */}
      {volume > 0.1 && (
        <View style={[styles.soundWaveArc, styles.soundWaveSmall, { borderColor: color }]} />
      )}
      {volume > 0.6 && (
        <View style={[styles.soundWaveArc, styles.soundWaveLarge, { borderColor: color }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flashlightWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  torchHead: {
    width: 14,
    height: 5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  torchNeck: {
    width: 10,
    height: 4,
  },
  torchBody: {
    width: 8,
    height: 12,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  recordOuterRing: {
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordInnerDot: {
    backgroundColor: '#FF3B30',
  },
  mirrorWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mirrorRectBack: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 13,
    height: 10,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  mirrorRectFront: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 10,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    backgroundColor: '#181b24',
  },
  waveformWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  waveBar: {
    width: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  shazamCircle: {
    borderWidth: 1.5,
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shazamLetter: {
    fontWeight: '900',
    color: '#ffffff',
    fontStyle: 'italic',
    marginTop: -1,
  },
  bulbWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulbHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 1,
  },
  bulbBase: {
    width: 6,
    height: 4,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  timerWrapper: {
    borderWidth: 1.8,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  timerTopButton: {
    position: 'absolute',
    top: -3,
    width: 4,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  timerHand: {
    position: 'absolute',
    top: 3,
    right: 5,
    width: 1.5,
    height: 5,
    backgroundColor: '#ffffff',
    transform: [{ rotate: '45deg' }],
  },
  sunContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sunCore: {
    borderWidth: 2,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  sunRay: {
    position: 'absolute',
    borderRadius: 1,
  },
  rayV: {
    width: 2,
    height: '100%',
  },
  rayH: {
    height: 2,
    width: '100%',
  },
  rayD1: {
    width: 2,
    height: '92%',
    transform: [{ rotate: '45deg' }],
  },
  rayD2: {
    width: 2,
    height: '92%',
    transform: [{ rotate: '-45deg' }],
  },
  speakerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  speakerBox: {
    width: 5,
    height: 8,
    borderRadius: 1,
  },
  speakerCone: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  soundWaveArc: {
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 0,
    borderRadius: 10,
    marginLeft: 2,
  },
  soundWaveSmall: {
    width: 4,
    height: 10,
  },
  soundWaveLarge: {
    width: 5,
    height: 16,
    marginLeft: 2,
  },
});
