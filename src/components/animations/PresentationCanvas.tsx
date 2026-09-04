import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { PlaybackProvider } from './PlaybackContext';
import { usePlayback } from './usePlayback';
import { PlaybackControls } from './PlaybackControls';
import { CanvasSkeleton } from './CanvasSkeleton';
import { useStudioStore } from '../../lib/studioStore';
import { useToast } from '../common/useToast';
import { logger } from '../../lib/logger';
import type { VisualizationProps, Dataset } from '../../types';

const sampleDataset: Dataset = {
  title: 'Quarterly Revenue Growth',
  subtitle: 'Comparison across key regions (in millions)',
  unit: 'M',
  points: [
    { id: '1', label: 'North America', value: 125, color: '#6366f1' },
    { id: '2', label: 'Europe', value: 94, color: '#06b6d4' },
    { id: '3', label: 'Asia Pacific', value: 156, color: '#ec4899' },
    { id: '4', label: 'Latin America', value: 42, color: '#10b981' }
  ]
};

interface PresentationCanvasProps {
  visualizationComponent: React.ComponentType<VisualizationProps>;
  dataset?: Dataset;
  isLoading?: boolean;
}

const CanvasInner: React.FC<PresentationCanvasProps> = ({
  visualizationComponent: Visualization,
  dataset = sampleDataset,
  isLoading = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const captureNodeRef = useRef<HTMLDivElement>(null);

  const { isPlaying, playbackKey, onAnimationComplete } = usePlayback();
  const { activeBackdrop, aspectRatio, showWatermark } = useStudioStore();
  const toast = useToast();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        logger.error(`Fullscreen request failed: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleExportPNG = async () => {
    if (!captureNodeRef.current || isExporting) return;
    try {
      setIsExporting(true);
      logger.info('Starting PNG export of infographic...', { context: 'Export' });
      
      const dataUrl = await toPng(captureNodeRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: activeBackdrop === 'minimal' ? '#ffffff' : '#020617'
      });

      const fileName = `${(dataset.title || 'infographic').toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      toast.success('Infographic Exported', `Saved ${fileName} in high resolution!`);
      logger.info(`Exported PNG successfully as ${fileName}`, { context: 'Export' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Export failed';
      logger.error('Failed to export PNG', err, { context: 'Export' });
      toast.error('Export Failed', msg);
    } finally {
      setIsExporting(false);
    }
  };

  // Determine aspect ratio class
  const getAspectClass = () => {
    if (isFullscreen) return 'w-screen h-screen max-w-none max-h-none rounded-none border-0';
    switch (aspectRatio) {
      case '1:1':
        return 'w-full max-w-[620px] aspect-square rounded-3xl shadow-2xl';
      case '4:3':
        return 'w-full max-w-[760px] aspect-[4/3] rounded-3xl shadow-2xl';
      case '16:9':
      default:
        return 'w-full aspect-[16/9] rounded-3xl shadow-2xl';
    }
  };

  // Determine backdrop styling
  const getBackdropStyles = () => {
    switch (activeBackdrop) {
      case 'sunset':
        return 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border-slate-800/80';
      case 'grid':
        return 'bg-slate-950 text-white border-slate-800';
      case 'minimal':
        return 'bg-slate-50/90 dark:bg-[#0e121a] text-slate-900 dark:text-white border-slate-200/80 dark:border-slate-800/80 shadow-xs';
      case 'obsidian':
      default:
        return 'bg-slate-950 text-white border-slate-800/90';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center transition-all duration-300 mx-auto ${getAspectClass()}`}
    >
      {/* Captured Node Container (for PNG Export) */}
      <div
        ref={captureNodeRef}
        className={`w-full h-full relative overflow-hidden border transition-all duration-300 flex flex-col justify-between rounded-3xl ${getBackdropStyles()}`}
      >
        {/* Ambient Backlight for Obsidian */}
        {activeBackdrop === 'obsidian' && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/18 via-purple-600/8 to-transparent pointer-events-none" />
        )}

        {/* Ambient Warm Backlight for Sunset */}
        {activeBackdrop === 'sunset' && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-rose-600/18 via-amber-600/10 to-transparent pointer-events-none" />
        )}

        {/* Technical Dot Grid Overlay for Grid */}
        {activeBackdrop === 'grid' && (
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
        )}

        {/* Infographic Main Content */}
        <div className="w-full h-full p-6 sm:p-8 md:p-10 z-10 relative flex flex-col">
          {isLoading ? (
            <CanvasSkeleton />
          ) : (
            <Visualization
              dataset={dataset}
              isPlaying={isPlaying}
              playbackKey={playbackKey}
              onAnimationComplete={onAnimationComplete}
            />
          )}
        </div>

        {/* Studio Branding / Watermark */}
        {showWatermark && !isLoading && (
          <div className="absolute top-4 right-5 z-10 flex items-center gap-1.5 opacity-40 hover:opacity-80 transition-opacity pointer-events-none select-none">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              ✦ Infographik Studio
            </span>
          </div>
        )}
      </div>

      {/* Floating Presentation & Export HUD */}
      {!isLoading && (
        <PlaybackControls 
          onFullscreen={toggleFullscreen} 
          onExport={handleExportPNG}
          isExporting={isExporting}
        />
      )}
    </div>
  );
};

export const PresentationCanvas: React.FC<PresentationCanvasProps> = (props) => {
  return (
    <PlaybackProvider>
      <CanvasInner {...props} />
    </PlaybackProvider>
  );
};
