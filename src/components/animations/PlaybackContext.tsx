import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PlaybackContext } from './usePlayback';
import { logger } from '../../lib/logger';

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackKey, setPlaybackKey] = useState(1);
  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const playTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
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
    logger.info('Playback: Play', { context: 'Playback' });
    setPlaybackKey((k) => k + 1);
    setIsPlaying(true);
  }, [clearTimers]);

  const pause = useCallback(() => {
    clearTimers();
    logger.info('Playback: Pause', { context: 'Playback' });
    setIsPlaying(false);
  }, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    logger.info('Playback: Reset', { context: 'Playback' });
    setIsPlaying(false);
  }, [clearTimers]);

  const replay = useCallback(() => {
    reset();
    logger.info('Playback: Replay', { context: 'Playback' });
    setPlaybackKey((k) => k + 1);
    playTimeoutRef.current = window.setTimeout(() => {
      setIsPlaying(true);
    }, 50);
  }, [reset]);

  const onAnimationComplete = useCallback(() => {
    logger.debug('Playback: Animation cycle finished', { context: 'Playback' });
  }, []);

  return (
    <PlaybackContext.Provider
      value={{
        isPlaying: isReducedMotion ? true : isPlaying,
        playbackKey,
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
