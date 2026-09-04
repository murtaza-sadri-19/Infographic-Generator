import type { Dataset, DataColumn, DataPoint } from '../../types/data';
import { logger } from '../logger';

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'id_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Parses a single CSV line into columns, handling double quotes and escaped quotes.
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentValue += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  values.push(currentValue.trim());
  return values;
}

export function parseCSV(csvContent: string, name: string = 'Imported Data'): Dataset {
  if (!csvContent || !csvContent.trim()) {
    throw new Error('CSV input is empty. Please provide comma-separated data.');
  }

  // Normalize line breaks
  const normalized = csvContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rawLines = normalized.split('\n');
  const lines = rawLines.map(l => l.trim()).filter(l => l.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.');
  }

  const headers = parseCSVLine(lines[0]).map((h, i) => h.replace(/^["']|["']$/g, '').trim() || `Column_${i + 1}`);

  if (headers.length === 0) {
    throw new Error('CSV header row has no detectable columns.');
  }

  // Type inference based on non-empty values in first data rows
  const columns: DataColumn[] = headers.map((header, index) => {
    // Check first few data rows to infer type
    let isNumber = true;
    let hasNumericSample = false;

    for (let r = 1; r < Math.min(lines.length, 6); r++) {
      const rowVals = parseCSVLine(lines[r]);
      const cell = rowVals[index];
      if (cell !== undefined && cell !== '') {
        const cleanVal = cell.replace(/[$,%]/g, '');
        if (isNaN(Number(cleanVal))) {
          isNumber = false;
          break;
        } else {
          hasNumericSample = true;
        }
      }
    }

    const type: 'number' | 'string' = isNumber && hasNumericSample ? 'number' : 'string';
    const id = header.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '') || `col_${index}`;

    return {
      id: `${id}_${index}`,
      name: header,
      type
    };
  });

  const data: DataPoint[] = [];
  let skippedRows = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && values[0] === '')) {
      continue;
    }

    const point: DataPoint = { id: generateId() };
    columns.forEach((col, colIndex) => {
      const val = values[colIndex] ?? '';
      if (col.type === 'number') {
        const cleanNum = String(val).replace(/[$,%]/g, '');
        point[col.id] = cleanNum !== '' && !isNaN(Number(cleanNum)) ? Number(cleanNum) : 0;
      } else {
        point[col.id] = val;
      }
    });

    data.push(point);
  }

  if (data.length === 0) {
    throw new Error('Could not parse any valid data rows from CSV.');
  }

  logger.info(`Successfully parsed CSV dataset "${name}" with ${columns.length} columns and ${data.length} rows (skipped ${skippedRows})`, {
    context: 'CSV'
  });

  return {
    id: generateId(),
    name,
    columns,
    data,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
