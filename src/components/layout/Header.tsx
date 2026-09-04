import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Hash, 
  HelpCircle, 
  X, 
  Plus
} from 'lucide-react';
import { useStudioStore } from '../../lib/studioStore';
import { useDataStore } from '../../lib/data/store';
import { useToast } from '../common/useToast';
import type { Dataset as GenericDataset } from '../../types/data';

export function Header() {
  const [showHelp, setShowHelp] = useState(false);
  const { activeChart, setActiveChart } = useStudioStore();
  const { datasets, activeDatasetId, setActiveDataset, addDataset } = useDataStore();
  const toast = useToast();

  React.useEffect(() => {
    const handleOpen = () => setShowHelp(true);
    window.addEventListener('infographik:open-guide', handleOpen);
    return () => window.removeEventListener('infographik:open-guide', handleOpen);
  }, []);

  const handleCreateNew = () => {
    const id = 'custom_' + Date.now().toString(36);
    const newDs: GenericDataset = {
      id,
      name: 'New Infographic',
      subtitle: 'Key data metrics',
      unit: '',
      columns: [
        { id: 'label', name: 'Item', type: 'string' },
        { id: 'value', name: 'Value', type: 'number' }
      ],
      data: [
        { id: '1', label: 'Item 1', value: 65 },
        { id: '2', label: 'Item 2', value: 42 },
        { id: '3', label: 'Item 3', value: 89 }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    addDataset(newDs);
    toast.success('Created new dataset');
  };

  return (
    <>
      <header className="h-16 px-6 bg-white dark:bg-[#10141d] border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shrink-0 z-20 transition-colors">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
              infographik
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              Studio
            </span>
          </div>
        </div>

        {/* Center: Dribbble-Style Pill Navigation */}
        <nav className="hidden md:flex items-center p-1 bg-slate-100/90 dark:bg-slate-900/80 rounded-full border border-slate-200/60 dark:border-slate-800/60">
          <button
            type="button"
            onClick={() => setActiveChart('bar')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeChart === 'bar'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Bar Chart
          </button>

          <button
            type="button"
            onClick={() => setActiveChart('donut')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeChart === 'donut'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Donut Chart
          </button>

          <button
            type="button"
            onClick={() => setActiveChart('counter')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeChart === 'counter'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            Counter Stat
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dataset Selector Pill */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 rounded-full p-1 border border-slate-200/60 dark:border-slate-800/60">
            <select
              value={activeDatasetId || ''}
              onChange={(e) => setActiveDataset(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              {Object.values(datasets).map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleCreateNew}
              title="Create new dataset"
              className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="w-9 h-9 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all"
            title="Guide & CSV Info"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Guide Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                Infographik Guide
              </h3>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                  1. Drag & Drop CSV File
                </h4>
                <p className="text-slate-500 dark:text-slate-400 mb-2">
                  Drop any standard `.csv` file onto the upload zone or paste comma-separated text:
                </p>
                <pre className="bg-slate-100 dark:bg-slate-950 p-3 rounded-2xl font-mono text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 overflow-x-auto">
{`Category,Value
"Smartphones, Global",92
"Laptops & PCs",78
Tablets,45`}
                </pre>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                  2. Visualization Templates
                </h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Switch between <strong>Bar Chart</strong>, <strong>Donut Chart</strong>, and <strong>Counter Stat</strong> using the pill tabs at the top of the screen.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                  3. Export & Presentation
                </h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Click the <strong>Export</strong> button in the floating HUD below the canvas to download a 2x resolution PNG image.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-950 rounded-full font-bold text-xs transition-all shadow-sm"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
