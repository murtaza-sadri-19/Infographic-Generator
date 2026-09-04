import React, { useRef, useState, useEffect } from 'react';
import { PlaybackProvider, usePlayback } from './PlaybackContext';
import { PlaybackControls } from './PlaybackControls';
import type { VisualizationProps, Dataset } from '../../types';

// Mock dataset for preview until data layer is connected
const sampleDataset: Dataset = {
  title: 'Quarterly Revenue Growth',
  subtitle: 'Comparison across key regions (in millions)',
  unit: 'M',
  points: [
    { id: '1', label: 'North America', value: 125, color: '#3b82f6' },
    { id: '2', label: 'Europe', value: 94, color: '#10b981' },
    { id: '3', label: 'Asia Pacific', value: 156, color: '#f59e0b' },
    { id: '4', label: 'Latin America', value: 42, color: '#ef4444' }
  ]
};

interface PresentationCanvasProps {
  visualizationComponent: React.ComponentType<VisualizationProps>;
  dataset?: Dataset;
}

const CanvasInner: React.FC<PresentationCanvasProps> = ({ visualizationComponent: Visualization, dataset = sampleDataset }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isPlaying, onAnimationComplete } = usePlayback();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
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

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center bg-white dark:bg-slate-950 transition-all ${
        isFullscreen ? 'w-screen h-screen' : 'w-full aspect-[16/9] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden'
      }`}
    >
      <div className="w-full h-full p-8 md:p-12">
        <Visualization
          dataset={dataset}
          isPlaying={isPlaying}
          onAnimationComplete={onAnimationComplete}
        />
      </div>
      
      {/* Controls fade out when playing and mouse is not moving, but for MVP just show/hide smartly or keep visible */}
      <PlaybackControls onFullscreen={toggleFullscreen} />
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
