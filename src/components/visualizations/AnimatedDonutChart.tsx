import React, { useEffect, useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import type { VisualizationProps } from '../../types';

export const AnimatedDonutChart: React.FC<VisualizationProps> = ({
  dataset,
  isPlaying,
  playbackKey = 1,
  onAnimationComplete,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<{ label: string; value: number; percent: number } | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        onAnimationComplete?.();
      }, 1300);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, playbackKey, onAnimationComplete]);

  const totalValue = useMemo(() => {
    if (!dataset?.points) return 0;
    return dataset.points.reduce((sum, p) => sum + (Number(p.value) || 0), 0);
  }, [dataset]);

  if (!dataset || !dataset.points || dataset.points.length === 0) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center text-slate-400 dark:text-slate-500 p-6 text-center">
        <div className="p-4 bg-indigo-500/10 rounded-2xl mb-3 border border-indigo-500/20">
          <PieIcon className="w-9 h-9 text-indigo-500" />
        </div>
        <p className="font-bold text-base text-slate-800 dark:text-slate-100">No data points to display</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
          Add data rows in the editor or paste CSV content on the left to generate the donut chart.
        </p>
      </div>
    );
  }

  const animationKey = `donut-${playbackKey}-${dataset.points.length}`;

  const centerDisplay = hoveredSlice
    ? {
        main: `${hoveredSlice.percent.toFixed(1)}%`,
        sub: hoveredSlice.label,
        subExtra: dataset.unit ? `${hoveredSlice.value} ${dataset.unit}` : String(hoveredSlice.value)
      }
    : {
        main: dataset.unit ? `${totalValue.toLocaleString()} ${dataset.unit}` : totalValue.toLocaleString(),
        sub: 'Total',
        subExtra: `${dataset.points.length} categories`
      };

  return (
    <div className="h-full w-full min-h-[300px] flex flex-col justify-between select-none">
      {/* Header */}
      <div className="text-center mb-1">
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
      
      <div className="flex-1 w-full relative min-h-[240px] flex items-center justify-center">
        {/* Center Hero Metric */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm transition-all duration-200">
            {centerDisplay.main}
          </span>
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 max-w-[130px] truncate text-center transition-all duration-200">
            {centerDisplay.sub}
          </span>
          {centerDisplay.subExtra && (
            <span className="text-[10px] text-indigo-500 font-mono font-medium">
              {centerDisplay.subExtra}
            </span>
          )}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart key={animationKey}>
            <Pie
              data={dataset.points}
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={3}
              dataKey="value"
              nameKey="label"
              isAnimationActive={isPlaying}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
              onMouseEnter={(data: any) => {
                const val = Number(data.value) || 0;
                const pct = totalValue > 0 ? (val / totalValue) * 100 : 0;
                const label = String(data.label || data.name || data.payload?.label || 'Item');
                setHoveredSlice({ label, value: val, percent: pct });
              }}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              {dataset.points.map((entry, index) => (
                <Cell 
                  key={`cell-${entry.id || index}`} 
                  fill={entry.color || '#6366f1'} 
                  stroke="transparent"
                  className="transition-all hover:opacity-85 cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any, name: any) => {
                const num = Number(value) || 0;
                const pct = totalValue > 0 ? ((num / totalValue) * 100).toFixed(1) : 0;
                const displayVal = dataset.unit ? `${num} ${dataset.unit}` : num;
                return [`${displayVal} (${pct}%)`, name];
              }}
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
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', fontWeight: 500, paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
