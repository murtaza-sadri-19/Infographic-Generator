import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { VisualizationProps } from '../../types';

const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AnimatedBarChart: React.FC<VisualizationProps> = ({
  dataset,
  isPlaying,
  onAnimationComplete,
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((prev) => prev + 1);
      // Rough estimate of Recharts animation duration (1500ms default)
      const timer = setTimeout(() => {
        onAnimationComplete?.();
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, onAnimationComplete]);

  if (!dataset || !dataset.points || dataset.points.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-[300px] flex flex-col">
      {dataset.title && (
        <h3 className="text-xl font-bold text-center mb-1">{dataset.title}</h3>
      )}
      {dataset.subtitle && (
        <p className="text-sm text-gray-500 text-center mb-4">{dataset.subtitle}</p>
      )}
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            key={animationKey}
            data={dataset.points}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'currentColor' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: 'currentColor' }} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              isAnimationActive={isPlaying}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {dataset.points.map((entry, index) => (
                <Cell
                  key={`cell-${entry.id || index}`}
                  fill={entry.color || defaultColors[index % defaultColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
