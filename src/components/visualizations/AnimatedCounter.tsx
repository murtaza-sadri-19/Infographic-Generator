import React, { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { Hash } from 'lucide-react';
import type { VisualizationProps } from '../../types';

export const AnimatedCounter: React.FC<VisualizationProps> = ({
  dataset,
  isPlaying,
  playbackKey = 1,
  onAnimationComplete,
}) => {
  if (!dataset || !dataset.points || dataset.points.length === 0) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center text-slate-400 dark:text-slate-500 p-6 text-center">
        <div className="p-4 bg-indigo-500/10 rounded-2xl mb-3 border border-indigo-500/20">
          <Hash className="w-9 h-9 text-indigo-500" />
        </div>
        <p className="font-bold text-base text-slate-800 dark:text-slate-100">No data points to display</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
          Add data rows in the editor or paste CSV content on the left to show the animated counter.
        </p>
      </div>
    );
  }

  const totalValue = dataset.points.reduce((sum, point) => sum + (Number(point.value) || 0), 0);
  const animationKey = `counter-${playbackKey}-${dataset.points.length}`;

  return (
    <div className="h-full w-full min-h-[300px] flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background Ambient Glow Halo */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-pink-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      {dataset.title && (
        <motion.h3
          key={`title-${animationKey}`}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center mb-1 text-slate-900 dark:text-white tracking-tight leading-tight z-10"
        >
          {dataset.title}
        </motion.h3>
      )}
      
      {dataset.subtitle && (
        <motion.p
          key={`sub-${animationKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center mb-6 font-medium z-10"
        >
          {dataset.subtitle}
        </motion.p>
      )}

      {/* Hero Counter Value */}
      <div className="relative z-10 my-2">
        <CounterValue 
          value={totalValue} 
          unit={dataset.unit}
          isPlaying={isPlaying} 
          animationKey={animationKey}
          onComplete={onAnimationComplete}
        />
      </div>
      
      {/* Category Breakdown Cards with Proportion Progress Bars */}
      <motion.div 
        key={`cards-${animationKey}`}
        className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 w-full max-w-2xl z-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.3 }
          }
        }}
      >
        {dataset.points.map((point) => {
          const num = Number(point.value) || 0;
          const pct = totalValue > 0 ? (num / totalValue) * 100 : 0;
          const pointColor = point.color || '#6366f1';

          return (
            <motion.div
              key={point.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 12 },
                visible: { opacity: 1, scale: 1, y: 0 }
              }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-2.5 rounded-xl shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span 
                    className="w-2 h-2 rounded-full shrink-0 shadow-sm" 
                    style={{ backgroundColor: pointColor }} 
                  />
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                    {point.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {pct.toFixed(0)}%
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {num.toLocaleString()}{dataset.unit ? ` ${dataset.unit}` : ''}
                </span>
              </div>

              {/* Proportion Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: pointColor }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

const CounterValue = ({ 
  value, 
  unit, 
  isPlaying, 
  animationKey,
  onComplete 
}: { 
  value: number; 
  unit?: string; 
  isPlaying: boolean; 
  animationKey: string;
  onComplete?: () => void;
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const formatted = Math.round(latest).toLocaleString();
    return unit ? `${formatted} ${unit}` : formatted;
  });

  useEffect(() => {
    if (isPlaying) {
      count.set(0);
      const controls = animate(count, value, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        onComplete: () => {
          onComplete?.();
        }
      });
      return controls.stop;
    } else {
      count.set(value);
    }
  }, [value, isPlaying, animationKey, count, onComplete]);

  return (
    <motion.div 
      key={`counter-display-${animationKey}`}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-center py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm"
    >
      <motion.span>{rounded}</motion.span>
    </motion.div>
  );
};
