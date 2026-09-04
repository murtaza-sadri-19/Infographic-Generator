import { useState } from 'react';
import { SidebarRail } from './SidebarRail';
import { Header } from './Header';
import { EditorSplit } from './EditorSplit';
import { BarChart3, Table2, Palette, HelpCircle, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../lib/theme';

export function AppShell() {
  const [activeSection, setActiveSection] = useState<'data' | 'appearance'>('data');
  const [mobileView, setMobileView] = useState<'stage' | 'data' | 'appearance'>('stage');
  const { theme, setTheme } = useThemeStore();

  const handleSelectSection = (section: 'data' | 'appearance') => {
    setActiveSection(section);
    setMobileView(section);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#eef2f6] dark:bg-[#090c12] text-slate-900 dark:text-slate-50 transition-colors select-none">
      {/* Left Slim Icon Dock (Desktop only) */}
      <SidebarRail
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onOpenHelp={() => {
          // Trigger guide modal via event
          window.dispatchEvent(new CustomEvent('infographik:open-guide'));
        }}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />
        
        <main className="flex-1 min-h-0 overflow-hidden flex">
          <EditorSplit 
            activeSection={activeSection} 
            mobileView={mobileView}
          />
        </main>

        {/* Mobile Bottom Dock (< lg) */}
        <nav className="lg:hidden flex items-center justify-around bg-white/95 dark:bg-[#10141d]/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 z-30 shrink-0">
          <button
            type="button"
            onClick={() => setMobileView('stage')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              mobileView === 'stage'
                ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800/80'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-[10px]">Preview</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileView('data');
              setActiveSection('data');
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              mobileView === 'data'
                ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800/80'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Table2 className="w-4 h-4" />
            <span className="text-[10px]">Data</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileView('appearance');
              setActiveSection('appearance');
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              mobileView === 'appearance'
                ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800/80'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span className="text-[10px]">Style</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span className="text-[10px]">Theme</span>
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('infographik:open-guide'))}
            className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            title="Guide"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-[10px]">Guide</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
