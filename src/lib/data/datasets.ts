import type { Dataset } from '../../types/data';

export const SAMPLE_DATASETS: Record<string, Dataset> = {
  'tech-growth': {
    id: 'tech-growth',
    name: 'Tech Adoption (2018-2023)',
    subtitle: 'Smartphone vs Smartwatch household penetration',
    unit: '%',
    columns: [
      { id: 'year', name: 'Year', type: 'string' },
      { id: 'smartphones', name: 'Smartphones (%)', type: 'number' },
      { id: 'smartwatches', name: 'Smartwatches (%)', type: 'number' },
    ],
    data: [
      { id: '1', year: '2018', smartphones: 65, smartwatches: 10 },
      { id: '2', year: '2019', smartphones: 72, smartwatches: 15 },
      { id: '3', year: '2020', smartphones: 78, smartwatches: 22 },
      { id: '4', year: '2021', smartphones: 83, smartwatches: 31 },
      { id: '5', year: '2022', smartphones: 87, smartwatches: 42 },
      { id: '6', year: '2023', smartphones: 92, smartwatches: 55 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  'browser-market': {
    id: 'browser-market',
    name: 'Browser Market Share',
    subtitle: 'Global desktop & mobile usage share',
    unit: '%',
    columns: [
      { id: 'browser', name: 'Browser', type: 'string' },
      { id: 'share', name: 'Market Share (%)', type: 'number' },
    ],
    data: [
      { id: '1', browser: 'Chrome', share: 65.2 },
      { id: '2', browser: 'Safari', share: 18.5 },
      { id: '3', browser: 'Edge', share: 5.2 },
      { id: '4', browser: 'Firefox', share: 3.1 },
      { id: '5', browser: 'Other', share: 8.0 },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
};
