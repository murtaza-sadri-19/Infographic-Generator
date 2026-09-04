import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { VisualizationProps } from '../../types';

const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export const AnimatedDonutChart: React.FC<VisualizationProps> = ({
  dataset,
  isPlaying,
  onAnimationComplete,
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      setAnimationKey((prev) => prev + 1);
      const timer = setTimeout(() => {
        onAnimationComplete?.();
      }, 1500);
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
      
      <div className="flex-1 w-full relative min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart key={animationKey}>
            <Pie
              data={dataset.points}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
              nameKey="label"
              isAnimationActive={isPlaying}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {dataset.points.map((entry, index) => (
                <Cell 
                  key={`cell-${entry.id || index}`} 
                  fill={entry.color || defaultColors[index % defaultColors.length]} 
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => [
                dataset.unit ? `${value}${dataset.unit}` : value, 
                ''
              ]}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
