import React, { useState } from 'react';
import { PresentationCanvas } from '../animations/PresentationCanvas';
import { AnimatedBarChart } from '../visualizations/AnimatedBarChart';
import { AnimatedCounter } from '../visualizations/AnimatedCounter';
import { AnimatedDonutChart } from '../visualizations/AnimatedDonutChart';
import type { VisualizationProps } from '../../types';
import { useDataStore } from '../../lib/data/store';
import { adaptDataset } from '../../lib/data/adapter';
import { parseCSV } from '../../lib/data/csv';

export function EditorSplit() {
  const [activeChart, setActiveChart] = useState<'bar' | 'counter' | 'donut'>('bar');
  const [csvInput, setCsvInput] = useState('');
  
  const { datasets, activeDatasetId, setActiveDataset, addDataset, updateDataset } = useDataStore();
  const genericDataset = activeDatasetId ? datasets[activeDatasetId] : null;
  const visDataset = genericDataset ? adaptDataset(genericDataset) : { title: '', points: [] };

  const getChartComponent = (): React.ComponentType<VisualizationProps> => {
    switch (activeChart) {
      case 'counter':
        return AnimatedCounter;
      case 'donut':
        return AnimatedDonutChart;
      case 'bar':
      default:
        return AnimatedBarChart;
    }
  };

  const handleImportCsv = () => {
    try {
      if (!csvInput.trim()) return;
      const newDataset = parseCSV(csvInput, 'Imported Dataset ' + Math.floor(Math.random()*1000));
      addDataset(newDataset);
      setCsvInput('');
    } catch (e: any) {
      alert('Error parsing CSV: ' + e.message);
    }
  };

  const handleRowChange = (rowId: string, colId: string, value: string) => {
    if (!genericDataset) return;
    const newData = genericDataset.data.map(row => {
      if (row.id === rowId) {
        const colDef = genericDataset.columns.find(c => c.id === colId);
        const parsedVal = colDef?.type === 'number' ? Number(value) : value;
        return { ...row, [colId]: parsedVal };
      }
      return row;
    });
    updateDataset(genericDataset.id, { data: newData });
  };

  return (
    <div className="flex flex-col md:flex-row h-full max-h-[calc(100vh-73px)]">
      {/* Editor Panel (Left) */}
      <div className="w-full md:w-1/3 md:min-w-[320px] md:max-w-md border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Data Editor
          </h2>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-6">
          
          {/* Dataset Selector */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Dataset</h3>
            <select 
              className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
              value={activeDatasetId || ''}
              onChange={(e) => setActiveDataset(e.target.value)}
            >
              {Object.values(datasets).map(ds => (
                <option key={ds.id} value={ds.id}>{ds.name}</option>
              ))}
            </select>
          </div>

          {/* Simple Table Editor */}
          {genericDataset && (
            <div className="overflow-x-auto">
              <h3 className="text-sm font-semibold mb-2">Values</h3>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b dark:border-slate-800">
                    {genericDataset.columns.map(c => (
                      <th key={c.id} className="pb-2 font-medium">{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {genericDataset.data.map(row => (
                    <tr key={row.id} className="border-b dark:border-slate-800 last:border-0">
                      {genericDataset.columns.map(c => (
                        <td key={c.id} className="py-2 pr-2">
                          <input 
                            type={c.type === 'number' ? 'number' : 'text'}
                            value={row[c.id] !== undefined ? row[c.id] : ''}
                            onChange={(e) => handleRowChange(row.id, c.id, e.target.value)}
                            className="w-full p-1 border rounded dark:bg-slate-900 dark:border-slate-700"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CSV Import */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Import CSV</h3>
            <textarea 
              className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 text-sm font-mono h-24"
              placeholder="Label,Value\nItem 1,10\nItem 2,20"
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
            />
            <button 
              onClick={handleImportCsv}
              className="mt-2 w-full py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md text-sm font-medium transition-colors"
            >
              Import Data
            </button>
          </div>
          
          <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold mb-2">Visualization Type</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveChart('bar')}
                className={`flex-1 py-1.5 rounded-md text-sm transition-colors ${activeChart === 'bar' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                Bar
              </button>
              <button 
                onClick={() => setActiveChart('counter')}
                className={`flex-1 py-1.5 rounded-md text-sm transition-colors ${activeChart === 'counter' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                Counter
              </button>
              <button 
                onClick={() => setActiveChart('donut')}
                className={`flex-1 py-1.5 rounded-md text-sm transition-colors ${activeChart === 'donut' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                Donut
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel (Right) */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-900 relative overflow-hidden flex flex-col p-4 md:p-8">
        <PresentationCanvas 
          visualizationComponent={getChartComponent()} 
          dataset={visDataset} 
        />
      </div>
    </div>
  );
}
