import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

// Body part emoji mapping for fallback
const BODY_PART_EMOJIS: Record<string, string> = {
  neck: '🦒',
  shoulders: '💪',
  upper_back: '🔙',
  lower_back: '🦴',
  wrists: '🖐️',
  hips: '🦵',
  eyes: '👁️',
  general: '🧘',
};

interface ExerciseVideoProps {
  videoUrl: string;
  thumbnailUrl?: string;
  bodyPart: string;
  isPlaying: boolean;
  loop?: boolean;
}

export function ExerciseVideo({
  videoUrl,
  thumbnailUrl,
  bodyPart,
  isPlaying,
  loop = true,
}: ExerciseVideoProps) {
  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isPlaying]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const emoji = BODY_PART_EMOJIS[bodyPart] || '🧘';

  // Show fallback if video fails to load
  if (hasError) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackEmoji}>{emoji}</Text>
          <Text style={styles.fallbackText}>Sleduj pokyny níže</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Načítám video...</Text>
        </View>
      )}

      <Video
        ref={videoRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={loop}
        shouldPlay={isPlaying}
        isMuted={true} // Videos are muted, audio cues are separate
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={handleError}
        posterSource={thumbnailUrl ? { uri: thumbnailUrl } : undefined}
        usePoster={!!thumbnailUrl}
        posterStyle={styles.poster}
      />

      {/* Fallback shown behind video */}
      <View style={styles.fallbackBehind}>
        <Text style={styles.fallbackEmoji}>{emoji}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
  },
  poster: {
    resizeMode: 'cover',
  },
  loadingOverlay: {
    position: 'absolute',
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: '100%',
    height: '100%',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 14,
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fallbackBehind: {
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackEmoji: {
    fontSize: 100,
    marginBottom: 16,
  },
  fallbackText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
});

export default ExerciseVideo;
