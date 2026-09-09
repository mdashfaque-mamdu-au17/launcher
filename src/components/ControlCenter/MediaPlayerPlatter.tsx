import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Music, Play, Pause, FastForward, Rewind, Airplay } from 'lucide-react-native';

interface MediaPlayerProps {
  size: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function MediaPlayerPlatter({
  size,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
}: MediaPlayerProps) {
  return (
    <LinearGradient
      colors={['rgba(45, 45, 50, 0.65)', 'rgba(25, 25, 30, 0.65)']}
      start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
      style={[styles.platterCard, { width: size, height: size }]}
    >
      {/* Top: Album Art Thumbnail & AirPlay glyph */}
      <View style={styles.topRow}>
        <View style={styles.albumArtSquare}>
          <Music size={20} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
        </View>
        <View style={styles.airplayPill}>
          <Airplay size={14} color="rgba(255,255,255,0.7)" strokeWidth={2.5} />
        </View>
      </View>

      {/* Middle: Title & Artist */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {isPlaying ? 'hate that i made you' : 'Not Playing'}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {isPlaying ? 'Ariana Grande' : 'Tap to Play'}
        </Text>
      </View>

      {/* Bottom: Transport Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={styles.transportBtn}
          onPress={onPrev}
          activeOpacity={0.7}
        >
          <Rewind size={20} color="#ffffff" fill="#ffffff" strokeWidth={0} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playPauseBtn}
          onPress={onPlayPause}
          activeOpacity={0.7}
        >
          {isPlaying ? (
            <Pause size={24} color="#ffffff" fill="#ffffff" strokeWidth={0} />
          ) : (
            <Play size={24} color="#ffffff" fill="#ffffff" strokeWidth={0} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.transportBtn}
          onPress={onNext}
          activeOpacity={0.7}
        >
          <FastForward size={20} color="#ffffff" fill="#ffffff" strokeWidth={0} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  platterCard: {
    borderRadius: 36,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightColor: 'rgba(255, 255, 255, 0.12)',
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
    padding: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  albumArtSquare: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumArtIcon: {
    fontSize: 18,
  },
  airplayPill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  airplayGlyph: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  trackInfo: {
    marginVertical: 4,
  },
  trackTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  trackArtist: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.55)',
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  transportBtn: {
    padding: 6,
  },
  transportIcon: {
    fontSize: 16,
    color: '#ffffff',
  },
  playPauseBtn: {
    padding: 6,
  },
  playPauseIcon: {
    fontSize: 18,
    color: '#ffffff',
  },
});
