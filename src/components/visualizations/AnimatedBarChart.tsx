import React, { useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { VisualizationProps } from '../../types';

export const AnimatedBarChart: React.FC<VisualizationProps> = ({
  dataset,
  isPlaying,
  playbackKey = 1,
  onAnimationComplete,
}) => {
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        onAnimationComplete?.();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, playbackKey, onAnimationComplete]);

  if (!dataset || !dataset.points || dataset.points.length === 0) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center text-slate-400 dark:text-slate-500 p-6 text-center">
        <div className="p-4 bg-indigo-500/10 rounded-2xl mb-3 border border-indigo-500/20">
          <BarChart3 className="w-9 h-9 text-indigo-500" />
        </div>
        <p className="font-bold text-base text-slate-800 dark:text-slate-100">No data points to display</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
          Add data rows in the editor or paste CSV content on the left to bring this chart to life.
        </p>
      </div>
    );
  }

  const animationKey = `bar-${playbackKey}-${dataset.points.length}`;

  // Custom renderer for top value labels
  const renderCustomValueLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (value === undefined || value === null) return null;
    const formatted = dataset.unit ? `${value}${dataset.unit}` : value;

    return (
      <g>
        <rect
          x={x + width / 2 - 20}
          y={y - 24}
          width={40}
          height={18}
          rx={5}
          fill="rgba(15, 23, 42, 0.75)"
          className="dark:fill-slate-900/90"
        />
        <text
          x={x + width / 2}
          y={y - 12}
          fill="#ffffff"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fontWeight={700}
          letterSpacing="-0.02em"
        >
          {formatted}
        </text>
      </g>
    );
  };

  return (
    <div className="h-full w-full min-h-[300px] flex flex-col justify-between select-none">
      {/* Chart Title Header */}
      <div className="text-center mb-3">
        {dataset.title && (
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {dataset.title}
          </h3>
        )}
        {dataset.subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            {dataset.subtitle}
          </p>
        )}
      </div>

      <div className="flex-1 w-full relative min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            key={animationKey}
            data={dataset.points}
            margin={{ top: 28, right: 24, left: 16, bottom: 20 }}
          >
            {/* Defs for gradients */}
            <defs>
              {dataset.points.map((entry, index) => {
                const baseColor = entry.color || '#6366f1';
                return (
                  <linearGradient
                    key={`bar-gradient-${entry.id || index}`}
                    id={`barGrad-${entry.id || index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={baseColor} stopOpacity={1} />
                    <stop offset="100%" stopColor={baseColor} stopOpacity={0.65} />
                  </linearGradient>
                );
              })}
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.12} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
              dy={8}
            />
            <YAxis
              tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              unit={dataset.unit ? ` ${dataset.unit}` : undefined}
            />
            <Tooltip
              cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
              formatter={(val: any) => [
                dataset.unit ? `${val} ${dataset.unit}` : val,
                'Value'
              ]}
              contentStyle={{
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.35)',
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 500,
                padding: '10px 14px'
              }}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              isAnimationActive={isPlaying}
              animationBegin={0}
              animationDuration={1400}
              animationEasing="ease-out"
            >
              <LabelList dataKey="value" content={renderCustomValueLabel} />
              {dataset.points.map((entry, index) => (
                <Cell
                  key={`cell-${entry.id || index}`}
                  fill={`url(#barGrad-${entry.id || index})`}
                  className="transition-all hover:opacity-90 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
