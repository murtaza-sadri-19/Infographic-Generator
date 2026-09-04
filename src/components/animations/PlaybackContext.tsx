import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface PlaybackContextType {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  replay: () => void;
  reset: () => void;
  onAnimationComplete: () => void;
  isReducedMotion: boolean;
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const playTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const clearTimers = useCallback(() => {
    if (playTimeoutRef.current !== null) {
      window.clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  const play = useCallback(() => {
    clearTimers();
    setIsPlaying(true);
  }, [clearTimers]);

  const pause = useCallback(() => {
    clearTimers();
    setIsPlaying(false);
  }, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setIsPlaying(false);
  }, [clearTimers]);

  const replay = useCallback(() => {
    reset();
    // Use a tiny timeout to ensure React processes the 'false' state
    // before turning it back to 'true' to trigger re-renders/animations
    playTimeoutRef.current = window.setTimeout(() => {
      setIsPlaying(true);
    }, 50);
  }, [reset]);

  const onAnimationComplete = useCallback(() => {
    // When animation completes, we can choose to keep it in "played" state
    // but typically we don't automatically pause unless we want to allow re-trigger.
    // For now, we do nothing or could fire an event if needed.
  }, []);

  return (
    <PlaybackContext.Provider
      value={{
        isPlaying: isReducedMotion ? true : isPlaying,
        play,
        pause,
        replay,
        reset,
        onAnimationComplete,
        isReducedMotion
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};
