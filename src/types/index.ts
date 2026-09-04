export interface DataPoint {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export interface Dataset {
  title: string;
  subtitle?: string;
  unit?: string;
  points: DataPoint[];
}

export interface VisualizationProps {
  dataset: Dataset;
  theme?: string;
  isPlaying: boolean;
  onAnimationComplete?: () => void;
}
