export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: string[];
  gradient: string;
  accent: string;
}

export const COLOR_PALETTES: Record<string, ColorPalette> = {
  indigo: {
    id: 'indigo',
    name: 'Nordic Indigo',
    description: 'Crisp deep navy, royal indigo, and electric sky',
    colors: ['#3b82f6', '#4f46e5', '#06b6d4', '#10b981', '#f59e0b'],
    gradient: 'from-blue-600 to-indigo-600',
    accent: '#3b82f6'
  },
  emerald: {
    id: 'emerald',
    name: 'Sage & Forest',
    description: 'Calm Scandinavian greens, deep teal, and mint',
    colors: ['#0f766e', '#059669', '#10b981', '#34d399', '#0284c7'],
    gradient: 'from-teal-700 to-emerald-500',
    accent: '#059669'
  },
  terracotta: {
    id: 'terracotta',
    name: 'Warm Terracotta',
    description: 'Earthy clay, roasted orange, and amber gold',
    colors: ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#fbbf24'],
    gradient: 'from-amber-700 to-orange-500',
    accent: '#ea580c'
  },
  sunset: {
    id: 'sunset',
    name: 'Dusk Rose',
    description: 'Rich rose, sunset coral, and soft lavender',
    colors: ['#e11d48', '#f43f5e', '#fb7185', '#a855f7', '#38bdf8'],
    gradient: 'from-rose-600 to-pink-500',
    accent: '#e11d48'
  },
  monochrome: {
    id: 'monochrome',
    name: 'Carbon & Platinum',
    description: 'High-contrast studio graphite, charcoal, and silver',
    colors: ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'],
    gradient: 'from-slate-800 to-slate-500',
    accent: '#0f172a'
  }
};

export type BackdropTheme = 'obsidian' | 'sunset' | 'grid' | 'minimal';

export interface StudioBackdrop {
  id: BackdropTheme;
  name: string;
  previewBg: string;
}

export const STUDIO_BACKDROPS: StudioBackdrop[] = [
  { id: 'minimal', name: 'Studio Minimal', previewBg: 'bg-slate-100 dark:bg-slate-900' },
  { id: 'obsidian', name: 'Deep Graphite', previewBg: 'bg-slate-950' },
  { id: 'sunset', name: 'Soft Horizon', previewBg: 'bg-gradient-to-br from-slate-900 to-slate-950' },
  { id: 'grid', name: 'Precision Grid', previewBg: 'bg-slate-900' }
];

export type AspectRatioType = '16:9' | '1:1' | '4:3';

export interface AspectRatioOption {
  id: AspectRatioType;
  label: string;
  description: string;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: '16:9', label: '16:9 Slide', description: 'Widescreen presentation' },
  { id: '1:1', label: '1:1 Square', description: 'Social & reports' },
  { id: '4:3', label: '4:3 Classic', description: 'Keynote & deck slide' }
];
