import type { FC } from 'react';
import { 
  Table2, 
  Palette, 
  HelpCircle, 
  Moon, 
  Sun,
  Layers
} from 'lucide-react';
import { useThemeStore } from '../../lib/theme';

interface SidebarRailProps {
  activeSection: 'data' | 'appearance';
  onSelectSection: (section: 'data' | 'appearance') => void;
  onOpenHelp: () => void;
}

export const SidebarRail: FC<SidebarRailProps> = ({
  activeSection,
  onSelectSection,
  onOpenHelp
}) => {
  const { theme, setTheme } = useThemeStore();

  return (
    <aside className="hidden md:flex w-16 sm:w-[72px] bg-white dark:bg-[#10141d] border-r border-slate-200/80 dark:border-slate-800/80 flex-col items-center justify-between py-5 shrink-0 z-20 transition-colors">
      {/* Top Brand Mark */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-10 h-10 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-sm">
          <Layers className="w-5 h-5" />
        </div>

        {/* Primary Navigation Icons */}
        <nav className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectSection('data')}
            title="Data Studio & Table"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              activeSection === 'data'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Table2 className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('appearance')}
            title="Themes & Palettes"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              activeSection === 'appearance'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onOpenHelp}
            title="CSV Guide & Info"
            className="w-11 h-11 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center transition-all"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Bottom Utilities */}
      <div className="flex flex-col items-center gap-3">
        <a
          href="https://github.com/AdityaDRathore/Infographic-Generator"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Repository"
          className="w-10 h-10 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center transition-all"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>

        {/* Theme Toggle Pill */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-all border border-slate-200/80 dark:border-slate-800"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </div>
    </aside>
  );
};
