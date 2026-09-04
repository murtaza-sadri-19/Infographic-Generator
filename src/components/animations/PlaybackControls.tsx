import React from 'react';
import { usePlayback } from './PlaybackContext';
import { Play, Pause, RotateCcw, Maximize } from 'lucide-react';

export const PlaybackControls: React.FC<{ onFullscreen?: () => void }> = ({ onFullscreen }) => {
  const { isPlaying, play, pause, replay, isReducedMotion } = usePlayback();

  if (isReducedMotion) {
    return (
      <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 text-sm text-slate-500">
        Reduced motion enabled
        {onFullscreen && (
          <button
            onClick={onFullscreen}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors ml-2"
            title="Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-lg flex items-center gap-1">
      {isPlaying ? (
        <button
          onClick={pause}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-700 dark:text-slate-300"
          title="Pause"
        >
          <Pause className="w-5 h-5 fill-current" />
        </button>
      ) : (
        <button
          onClick={play}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-700 dark:text-slate-300"
          title="Play"
        >
          <Play className="w-5 h-5 fill-current" />
        </button>
      )}
      
      <button
        onClick={replay}
        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-700 dark:text-slate-300"
        title="Replay"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      {onFullscreen && (
        <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1" />
      )}
      
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-700 dark:text-slate-300"
          title="Fullscreen"
        >
          <Maximize className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
