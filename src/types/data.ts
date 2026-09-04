export type DataType = 'number' | 'string' | 'date';

export interface DataColumn {
  id: string;
  name: string;
  type: DataType;
}

export interface DataPoint {
  id: string;
  [key: string]: any;
}

export interface Dataset {
  id: string;
  name: string;
  columns: DataColumn[];
  data: DataPoint[];
  createdAt: number;
  updatedAt: number;
}
