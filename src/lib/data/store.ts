import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Dataset } from '../../types/data';
import { SAMPLE_DATASETS } from './datasets';

interface DataState {
  datasets: Record<string, Dataset>;
  activeDatasetId: string | null;
  addDataset: (dataset: Dataset) => void;
  updateDataset: (id: string, updates: Partial<Dataset>) => void;
  deleteDataset: (id: string) => void;
  setActiveDataset: (id: string) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      datasets: { ...SAMPLE_DATASETS },
      activeDatasetId: 'tech-growth',
      
      addDataset: (dataset) => set((state) => ({
        datasets: { ...state.datasets, [dataset.id]: dataset },
        activeDatasetId: dataset.id
      })),
      
      updateDataset: (id, updates) => set((state) => ({
        datasets: {
          ...state.datasets,
          [id]: { ...state.datasets[id], ...updates, updatedAt: Date.now() }
        }
      })),
      
      deleteDataset: (id) => set((state) => {
        const newDatasets = { ...state.datasets };
        delete newDatasets[id];
        return {
          datasets: newDatasets,
          activeDatasetId: state.activeDatasetId === id ? null : state.activeDatasetId
        };
      }),
      
      setActiveDataset: (id) => set({ activeDatasetId: id })
    }),
    {
      name: 'infographic-data-store'
    }
  )
);
