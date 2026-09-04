# Data Contract

## Canonical Entities

```ts
export interface DataPoint {
  id: string;      // Stable UUID or generated ID (e.g., via ulid/nanoid) for reliable React keys
  label: string;   // Display name of the category/point
  value: number;   // Numeric value for visualization
  color?: string;  // Optional specific color for this data point
}

export interface Dataset {
  title: string;
  subtitle?: string;
  unit?: string;   // e.g., '$', '%', 'users'
  points: DataPoint[];
}
```

## Rules
- IDs are stable for editable rows to ensure smooth React rendering and Framer Motion layout transitions.
- `value` is finite numeric data.
- Validation happens before visualization. The UI should prevent submitting invalid types.
- Visualizations do not parse CSV or localStorage. They strictly consume the `Dataset` object.

Replace/extend only through an explicit architecture decision.
