import { createContext, useContext } from 'react';

export interface PlaybackContextType {
  isPlaying: boolean;
  playbackKey: number;
  play: () => void;
  pause: () => void;
  replay: () => void;
  reset: () => void;
  onAnimationComplete: () => void;
  isReducedMotion: boolean;
}

export const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export const usePlayback = (): PlaybackContextType => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};
