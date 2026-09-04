import type { Dataset } from '../../types/data';

export function validateDataset(dataset: Partial<Dataset>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!dataset.name || typeof dataset.name !== 'string') {
    errors.push('Dataset must have a valid name');
  }

  if (!Array.isArray(dataset.columns) || dataset.columns.length === 0) {
    errors.push('Dataset must have at least one column');
  }

  if (!Array.isArray(dataset.data)) {
    errors.push('Dataset data must be an array');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
