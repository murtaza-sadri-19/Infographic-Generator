import type { FC, ComponentType } from 'react';
import { 
  Plus, 
  Trash2, 
  Palette, 
  Table2 
} from 'lucide-react';
import { PresentationCanvas } from '../animations/PresentationCanvas';
import { AnimatedBarChart } from '../visualizations/AnimatedBarChart';
import { AnimatedCounter } from '../visualizations/AnimatedCounter';
import { AnimatedDonutChart } from '../visualizations/AnimatedDonutChart';
import { CSVUploader } from '../common/CSVUploader';
import { useToast } from '../common/useToast';
import { useDataStore } from '../../lib/data/store';
import { useStudioStore } from '../../lib/studioStore';
import { 
  COLOR_PALETTES,
  getPalette,
  STUDIO_BACKDROPS, 
  ASPECT_RATIOS, 
  type BackdropTheme, 
  type AspectRatioType 
} from '../../lib/palettes';
import { adaptDataset } from '../../lib/data/adapter';
import { logger } from '../../lib/logger';
import type { VisualizationProps } from '../../types';
import type { Dataset as GenericDataset, DataPoint as GenericDataPoint } from '../../types/data';

interface EditorSplitProps {
  activeSection: 'data' | 'appearance';
  mobileView: 'stage' | 'data' | 'appearance';
}

export const EditorSplit: FC<EditorSplitProps> = ({ activeSection, mobileView }) => {
  const toast = useToast();
  const { datasets, activeDatasetId, addDataset, updateDataset } = useDataStore();
  const { 
    activeChart,
    activePaletteId, 
    activeBackdrop, 
    aspectRatio, 
    showWatermark,
    setPalette, 
    setBackdrop, 
    setAspectRatio, 
    toggleWatermark 
  } = useStudioStore();
  
  const activePalette = getPalette(activePaletteId);
  const genericDataset = activeDatasetId ? datasets[activeDatasetId] : null;
  const visDataset = genericDataset 
    ? adaptDataset(genericDataset, activePalette.colors) 
    : { title: '', points: [] };

  const getChartComponent = (): ComponentType<VisualizationProps> => {
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

  const handleDatasetLoaded = (dataset: GenericDataset) => {
    addDataset(dataset);
    logger.info(`Loaded uploaded dataset "${dataset.name}"`, { context: 'EditorSplit' });
  };

  const handleRowChange = (rowId: string, colId: string, value: string) => {
    if (!genericDataset) return;
    const newData = genericDataset.data.map((row) => {
      if (row.id === rowId) {
        const colDef = genericDataset.columns.find((c) => c.id === colId);
        const parsedVal = colDef?.type === 'number' ? (value === '' ? 0 : Number(value)) : value;
        return { ...row, [colId]: parsedVal };
      }
      return row;
    });
    updateDataset(genericDataset.id, { data: newData });
  };

  const handleAddRow = () => {
    if (!genericDataset) return;
    const newRowId = 'row_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newRow: GenericDataPoint = { id: newRowId };
    
    genericDataset.columns.forEach((col) => {
      if (col.type === 'number') {
        newRow[col.id] = Math.round(Math.random() * 50 + 20);
      } else {
        newRow[col.id] = `Item ${genericDataset.data.length + 1}`;
      }
    });

    updateDataset(genericDataset.id, {
      data: [...genericDataset.data, newRow]
    });
    toast.success('Row added');
  };

  const handleDeleteRow = (rowId: string) => {
    if (!genericDataset) return;
    const newData = genericDataset.data.filter((r) => r.id !== rowId);
    updateDataset(genericDataset.id, { data: newData });
    toast.info('Row removed');
  };

  const sectionToDisplay = mobileView !== 'stage' ? mobileView : activeSection;

  return (
    <div className="flex-1 w-full h-full p-3 sm:p-5 md:p-6 lg:p-7 gap-4 lg:gap-6 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Modular Card: Studio Inspector */}
      <div className={`w-full lg:w-[440px] xl:w-[460px] bg-white dark:bg-[#11151f] rounded-[24px] sm:rounded-[30px] shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-slate-200/70 dark:border-slate-800/80 p-4 sm:p-6 flex-col h-full overflow-y-auto shrink-0 transition-colors ${
        mobileView === 'stage' ? 'hidden lg:flex' : 'flex'
      }`}>
        
        {sectionToDisplay === 'data' ? (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                  <Table2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Data & CSV Source
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Upload file or edit tabular values
                  </p>
                </div>
              </div>
            </div>

            {/* CSV Dropzone */}
            <CSVUploader onDatasetLoaded={handleDatasetLoaded} />

            {/* Dataset Information Pills */}
            {genericDataset && (
              <div className="p-4 bg-slate-50/70 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Chart Title & Metadata
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={genericDataset.name}
                    placeholder="e.g., Global Customer Journeys"
                    onChange={(e) => updateDataset(genericDataset.id, { name: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={genericDataset.subtitle || ''}
                      placeholder="e.g., Regional resolution time"
                      onChange={(e) => updateDataset(genericDataset.id, { subtitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={genericDataset.unit || ''}
                      placeholder="%, $, min"
                      onChange={(e) => updateDataset(genericDataset.id, { unit: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Data Table Rows */}
            {genericDataset && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Values ({genericDataset.data.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {genericDataset.data.map((row, idx) => {
                    const swatch = activePalette.colors[idx % activePalette.colors.length];
                    const labelCol = genericDataset.columns[0];
                    const valCol = genericDataset.columns[1] || genericDataset.columns[0];

                    return (
                      <div
                        key={row.id}
                        className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-100/60 dark:hover:bg-slate-900/80 transition-all"
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs ml-1"
                          style={{ backgroundColor: swatch }}
                        />
                        <input
                          type="text"
                          value={row[labelCol.id] !== undefined ? row[labelCol.id] : ''}
                          placeholder="Label"
                          onChange={(e) => handleRowChange(row.id, labelCol.id, e.target.value)}
                          className="flex-1 min-w-0 px-2 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
                        />
                        <input
                          type="number"
                          value={row[valCol.id] !== undefined ? row[valCol.id] : ''}
                          placeholder="Value"
                          onChange={(e) => handleRowChange(row.id, valCol.id, e.target.value)}
                          className="w-20 px-2 py-1 text-xs font-mono font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white text-right"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* APPEARANCE & STYLING SECTION */
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Styling & Theme
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Curated human designer palettes
                  </p>
                </div>
              </div>
            </div>

            {/* Designer Palettes */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Color Harmony
              </span>
              <div className="space-y-2">
                {Object.values(COLOR_PALETTES).map((pal) => {
                  const isSelected = activePaletteId === pal.id;
                  return (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setPalette(pal.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-900/80 ring-1 ring-slate-900 dark:ring-white'
                          : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 hover:bg-slate-50/70'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {pal.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {pal.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                        {pal.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Canvas Stage Backdrops */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Stage Backdrop
              </span>
              <div className="grid grid-cols-2 gap-2">
                {STUDIO_BACKDROPS.map((bd) => {
                  const isSelected = activeBackdrop === bd.id;
                  return (
                    <button
                      key={bd.id}
                      type="button"
                      onClick={() => setBackdrop(bd.id as BackdropTheme)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-900/80 ring-1 ring-slate-900 dark:ring-white'
                          : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 hover:bg-slate-50/70'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white block mb-2">
                        {bd.name}
                      </span>
                      <div className={`w-full h-3 rounded-lg border border-slate-200 dark:border-slate-700 ${bd.previewBg}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Aspect Ratio
              </span>
              <div className="grid grid-cols-3 gap-2">
                {ASPECT_RATIOS.map((ar) => {
                  const isSelected = aspectRatio === ar.id;
                  return (
                    <button
                      key={ar.id}
                      type="button"
                      onClick={() => setAspectRatio(ar.id as AspectRatioType)}
                      className={`py-2 rounded-xl border text-center text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800'
                      }`}
                    >
                      {ar.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Watermark Toggle */}
            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Studio Badge
                </p>
                <p className="text-[10px] text-slate-400">
                  Subtle corner attribution mark
                </p>
              </div>
              <button
                type="button"
                onClick={toggleWatermark}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  showWatermark ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full transition-transform ${
                    showWatermark
                      ? 'translate-x-5 bg-white dark:bg-slate-950'
                      : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Modular Card: Presentation Stage */}
      <div className={`flex-1 min-w-0 bg-white dark:bg-[#11151f] rounded-[24px] sm:rounded-[32px] shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-slate-200/70 dark:border-slate-800/80 p-3 sm:p-6 md:p-8 flex-col items-center justify-center relative overflow-y-auto transition-colors ${
        mobileView !== 'stage' ? 'hidden lg:flex' : 'flex'
      }`}>
        <div className="w-full max-w-4xl h-full flex items-center justify-center">
          <PresentationCanvas
            visualizationComponent={getChartComponent()}
            dataset={visDataset}
          />
        </div>
      </div>
    </div>
  );
};
