import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ProcessingOverlayProps {
  isOpen: boolean;
  onComplete?: () => void;
  title?: string;
}

const PROGRESS_STEPS = [
  'Parsing data points & columns...',
  'Normalizing metric ranges...',
  'Aligning geometric vectors...',
  'Sprinkling motion physics...',
  'Polishing infographic layout...'
];

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  isOpen,
  title = 'Generating Infographic'
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isOpen) return;

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % PROGRESS_STEPS.length);
    }, 450);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + Math.floor(Math.random() * 15 + 10) : 95));
    }, 250);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center flex flex-col items-center"
        >
          {/* Animated Doodle Graphics */}
          <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
            {/* Pulsing glow background */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/30 rounded-full blur-xl"
            />

            {/* SVG Chart Doodle with dancing bars and rotating compass */}
            <svg
              viewBox="0 0 100 100"
              className="w-24 h-24 overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer dashed spinning ring */}
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeDasharray="6 8"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                style={{ transformOrigin: '50px 50px' }}
              />

              {/* Chart baseline */}
              <line x1="22" y1="72" x2="78" y2="72" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

              {/* Bar 1 (Blue) */}
              <motion.rect
                x="28"
                y="45"
                width="9"
                height="27"
                rx="3"
                fill="#3b82f6"
                animate={{
                  height: [12, 38, 20, 32, 12],
                  y: [60, 34, 52, 40, 60]
                }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              />

              {/* Bar 2 (Emerald) */}
              <motion.rect
                x="45"
                y="30"
                width="9"
                height="42"
                rx="3"
                fill="#10b981"
                animate={{
                  height: [42, 18, 44, 25, 42],
                  y: [30, 54, 28, 47, 30]
                }}
                transition={{ repeat: Infinity, duration: 1.4, delay: 0.2, ease: 'easeInOut' }}
              />

              {/* Bar 3 (Amber) */}
              <motion.rect
                x="62"
                y="40"
                width="9"
                height="32"
                rx="3"
                fill="#f59e0b"
                animate={{
                  height: [20, 48, 16, 40, 20],
                  y: [52, 24, 56, 32, 52]
                }}
                transition={{ repeat: Infinity, duration: 1.4, delay: 0.4, ease: 'easeInOut' }}
              />

              {/* Sparkle star doodle in top right */}
              <motion.g
                animate={{
                  scale: [0.8, 1.3, 0.8],
                  rotate: [0, 45, 0]
                }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                style={{ transformOrigin: '76px 26px' }}
              >
                <polygon
                  points="76,20 78,24 82,26 78,28 76,32 74,28 70,26 74,24"
                  fill="#ec4899"
                />
              </motion.g>
            </svg>
          </div>

          {/* Heading */}
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {title}
            </h3>
          </div>

          {/* Cycling Status Message */}
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 h-6 flex items-center justify-center transition-all">
            {PROGRESS_STEPS[stepIndex]}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3 mb-1">
            <motion.div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full"
              initial={{ width: '10%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-mono self-end">
            {progress}%
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
