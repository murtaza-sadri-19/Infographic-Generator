import React from 'react';
import { usePlayback } from './usePlayback';
import { Play, Pause, RotateCcw, Maximize, Download, Loader2 } from 'lucide-react';

interface PlaybackControlsProps {
  onFullscreen?: () => void;
  onExport?: () => void;
  isExporting?: boolean;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({ 
  onFullscreen, 
  onExport,
  isExporting = false
}) => {
  const { isPlaying, play, pause, replay, isReducedMotion } = usePlayback();

  if (isReducedMotion) {
    return (
      <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/80 dark:border-slate-800/80 shadow-lg flex items-center gap-2 text-xs text-slate-500">
        Reduced motion active
        {onExport && (
          <button
            onClick={onExport}
            disabled={isExporting}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors ml-1"
            title="Export PNG"
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          </button>
        )}
        {onFullscreen && (
          <button
            onClick={onFullscreen}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors ml-1"
            title="Fullscreen"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/85 dark:bg-slate-950/85 backdrop-blur-xl px-2 py-1.5 rounded-full border border-white/15 dark:border-slate-700/50 shadow-2xl flex items-center gap-1.5 z-20 text-white transition-all hover:bg-slate-900/95">
      {isPlaying ? (
        <button
          onClick={pause}
          className="p-2 hover:bg-white/15 rounded-full transition-all text-slate-200 hover:text-white"
          title="Pause animation"
        >
          <Pause className="w-4 h-4 fill-current" />
        </button>
      ) : (
        <button
          onClick={play}
          className="p-2 hover:bg-white/15 rounded-full transition-all text-slate-200 hover:text-white"
          title="Play animation"
        >
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </button>
      )}
      
      <button
        onClick={replay}
        className="p-2 hover:bg-white/15 rounded-full transition-all text-slate-200 hover:text-white"
        title="Replay from start"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {onExport && (
        <>
          <div className="w-px h-4 bg-white/20 mx-0.5" />
          <button
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/20 rounded-full transition-all text-xs font-bold text-slate-100 disabled:opacity-50"
            title="Export high-resolution PNG"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Export</span>
          </button>
        </>
      )}

      {onFullscreen && (
        <>
          <div className="w-px h-4 bg-white/20 mx-0.5" />
          <button
            onClick={onFullscreen}
            className="p-2 hover:bg-white/15 rounded-full transition-all text-slate-200 hover:text-white"
            title="Toggle fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};
