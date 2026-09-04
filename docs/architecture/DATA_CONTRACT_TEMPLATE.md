# Data Contract

## Canonical entities

```ts
export interface DataPoint {
  id: string;
  label: string;
  value: number;
}

export interface Dataset {
  title: string;
  subtitle?: string;
  unit?: string;
  points: DataPoint[];
}
```

## Rules
- IDs are stable for editable rows.
- `value` is finite numeric data.
- Validation happens before visualization.
- Visualizations do not parse CSV or localStorage.

Replace/extend only through an explicit architecture decision.
