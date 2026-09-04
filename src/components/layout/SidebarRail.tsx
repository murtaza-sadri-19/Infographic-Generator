import React from 'react';
import { 
  Table2, 
  Palette, 
  HelpCircle, 
  Moon, 
  Sun,
  Layers,
  Github
} from 'lucide-react';
import { useThemeStore } from '../../lib/theme';

interface SidebarRailProps {
  activeSection: 'data' | 'appearance';
  onSelectSection: (section: 'data' | 'appearance') => void;
  onOpenHelp: () => void;
}

export const SidebarRail: React.FC<SidebarRailProps> = ({
  activeSection,
  onSelectSection,
  onOpenHelp
}) => {
  const { theme, setTheme } = useThemeStore();

  return (
    <aside className="w-16 sm:w-[72px] bg-white dark:bg-[#10141d] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center justify-between py-5 shrink-0 z-20 transition-colors">
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
          <Github className="w-4 h-4" />
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
