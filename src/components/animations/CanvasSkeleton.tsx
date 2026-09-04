import React from 'react';

export const CanvasSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full p-8 md:p-12 flex flex-col justify-between animate-pulse">
      {/* Title & subtitle skeleton */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-72 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
      </div>

      {/* Chart bars skeleton */}
      <div className="flex-1 flex items-end justify-center gap-6 px-4 pb-8">
        <div className="w-12 h-32 bg-slate-200 dark:bg-slate-800 rounded-t-lg" />
        <div className="w-12 h-48 bg-slate-200 dark:bg-slate-800 rounded-t-lg" />
        <div className="w-12 h-64 bg-slate-200 dark:bg-slate-800 rounded-t-lg" />
        <div className="w-12 h-40 bg-slate-200 dark:bg-slate-800 rounded-t-lg" />
        <div className="w-12 h-52 bg-slate-200 dark:bg-slate-800 rounded-t-lg" />
      </div>

      {/* Bottom control skeleton */}
      <div className="flex justify-center">
        <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
    </div>
  );
};
