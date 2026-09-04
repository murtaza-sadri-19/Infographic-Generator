import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COLOR_PALETTES, type BackdropTheme, type AspectRatioType } from './palettes';

interface StudioState {
  activePaletteId: string;
  activeBackdrop: BackdropTheme;
  aspectRatio: AspectRatioType;
  activeChart: 'bar' | 'counter' | 'donut';
  showWatermark: boolean;
  setPalette: (id: string) => void;
  setBackdrop: (backdrop: BackdropTheme) => void;
  setAspectRatio: (ratio: AspectRatioType) => void;
  setActiveChart: (chart: 'bar' | 'counter' | 'donut') => void;
  toggleWatermark: () => void;
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set) => ({
      activePaletteId: 'indigo',
      activeBackdrop: 'minimal',
      aspectRatio: '16:9',
      activeChart: 'bar',
      showWatermark: true,

      setPalette: (id: string) => {
        if (COLOR_PALETTES[id]) {
          set({ activePaletteId: id });
        }
      },
      setBackdrop: (backdrop: BackdropTheme) => set({ activeBackdrop: backdrop }),
      setAspectRatio: (ratio: AspectRatioType) => set({ aspectRatio: ratio }),
      setActiveChart: (chart: 'bar' | 'counter' | 'donut') => set({ activeChart: chart }),
      toggleWatermark: () => set((state) => ({ showWatermark: !state.showWatermark }))
    }),
    {
      name: 'infographik-studio-store'
    }
  )
);
