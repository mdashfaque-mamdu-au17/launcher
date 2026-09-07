import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

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
    <View style={[styles.platterCard, { width: size, height: size }]}>
      {/* Top: Album Art Thumbnail & AirPlay glyph */}
      <View style={styles.topRow}>
        <View style={styles.albumArtSquare}>
          <Text style={styles.albumArtIcon}>🎵</Text>
        </View>
        <View style={styles.airplayPill}>
          <Text style={styles.airplayGlyph}>▲</Text>
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
          <Text style={styles.transportIcon}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playPauseBtn}
          onPress={onPlayPause}
          activeOpacity={0.7}
        >
          <Text style={styles.playPauseIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.transportBtn}
          onPress={onNext}
          activeOpacity={0.7}
        >
          <Text style={styles.transportIcon}>⏭</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  platterCard: {
    backgroundColor: '#1c1f2b',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    padding: 14,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  albumArtSquare: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 0.6,
    borderColor: 'rgba(255, 255, 255, 0.25)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
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
