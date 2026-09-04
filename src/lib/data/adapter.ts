import type { Dataset as GenericDataset } from '../../types/data';
import type { Dataset as VisualizationDataset, DataPoint as VisualizationPoint } from '../../types/index';

const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export function adaptDataset(generic: GenericDataset): VisualizationDataset {
  if (!generic) {
    return { title: 'No Data', points: [] };
  }

  const labelCol = generic.columns.find(c => c.type === 'string') || generic.columns[0];
  const valueCol = generic.columns.find(c => c.type === 'number') || generic.columns[1] || generic.columns[0];
  
  if (!labelCol || !valueCol) {
    return { title: generic.name, points: [] };
  }

  const points: VisualizationPoint[] = generic.data.map((row, idx) => ({
    id: row.id || String(idx),
    label: String(row[labelCol.id] ?? `Item ${idx}`),
    value: Number(row[valueCol.id] ?? 0),
    color: defaultColors[idx % defaultColors.length]
  }));

  return {
    title: generic.name,
    points
  };
}
