import type { Dataset, DataColumn, DataPoint } from '../../types/data';

export function parseCSV(csvContent: string, name: string = 'Imported Data'): Dataset {
  const lines = csvContent.trim().split('\\n');
  if (lines.length < 2) {
    throw new Error('CSV must contain headers and at least one row of data');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  
  // Basic type inference from first data row
  const firstDataRow = lines[1].split(',').map(cell => cell.trim());
  const columns: DataColumn[] = headers.map((header, index) => {
    const val = firstDataRow[index];
    let type: 'number' | 'string' = 'string';
    if (val !== undefined && val !== '' && !isNaN(Number(val))) {
      type = 'number';
    }
    return {
      id: header.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      name: header,
      type
    };
  });

  const data: DataPoint[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue; // skip malformed rows

    const point: DataPoint = { id: crypto.randomUUID() };
    columns.forEach((col, index) => {
      const val = values[index];
      point[col.id] = col.type === 'number' ? Number(val) : val;
    });
    data.push(point);
  }

  return {
    id: crypto.randomUUID(),
    name,
    columns,
    data,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
