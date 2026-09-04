import React, { useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import type { VisualizationProps } from '../../types';

export const AnimatedCounter: React.FC<VisualizationProps> = ({
  dataset,
  isPlaying,
  onAnimationComplete,
}) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      setKey((prev) => prev + 1);
    }
  }, [isPlaying]);

  if (!dataset || !dataset.points || dataset.points.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  // Counter generally makes the most sense with a single primary metric, or aggregating them.
  // For this infographic, we'll sum the values or just take the first one if it represents a single stat.
  // Let's sum them up to show an aggregate counter.
  const totalValue = dataset.points.reduce((sum, point) => sum + point.value, 0);

  return (
    <div className="h-full w-full min-h-[300px] flex flex-col items-center justify-center p-6">
      {dataset.title && (
        <motion.h3
          key={`title-${key}`}
          initial={{ opacity: 0, y: -20 }}
          animate={isPlaying ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-center mb-2"
        >
          {dataset.title}
        </motion.h3>
      )}
      
      {dataset.subtitle && (
        <motion.p
          key={`sub-${key}`}
          initial={{ opacity: 0 }}
          animate={isPlaying ? { opacity: 1 } : { opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-500 text-center mb-8"
        >
          {dataset.subtitle}
        </motion.p>
      )}

      <CounterValue 
        value={totalValue} 
        unit={dataset.unit}
        isPlaying={isPlaying} 
        animationKey={key}
        onComplete={onAnimationComplete}
      />
      
      <motion.div 
        key={`labels-${key}`}
        className="mt-8 flex flex-wrap justify-center gap-4"
        initial="hidden"
        animate={isPlaying ? "visible" : "visible"}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.5 }
          }
        }}
      >
        {dataset.points.map((point) => (
          <motion.div
            key={point.id}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 }
            }}
            className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full"
          >
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: point.color || '#3b82f6' }} 
            />
            <span className="font-medium">{point.label}</span>
            <span className="text-gray-500">{point.value}</span>
          </motion.div>
        ))}
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
  animationKey: number;
  onComplete?: () => void;
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    // Format with commas and max 1 decimal place if needed
    const formatted = Math.round(latest).toLocaleString();
    return unit ? `${formatted}${unit}` : formatted;
  });

  useEffect(() => {
    if (isPlaying) {
      const controls = animate(count, value, {
        duration: 2,
        ease: "easeOut",
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
      key={`counter-${animationKey}`}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={isPlaying ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="text-6xl md:text-8xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight"
    >
      <motion.span>{rounded}</motion.span>
    </motion.div>
  );
};
