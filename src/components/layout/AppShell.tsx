import React, { useState } from 'react';
import { SidebarRail } from './SidebarRail';
import { Header } from './Header';
import { EditorSplit } from './EditorSplit';

export function AppShell() {
  const [activeSection, setActiveSection] = useState<'data' | 'appearance'>('data');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#eef2f6] dark:bg-[#090c12] text-slate-900 dark:text-slate-50 transition-colors select-none">
      {/* Left Slim Icon Dock (from reference) */}
      <SidebarRail
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onOpenHelp={() => {
          // Trigger guide modal via event or direct state if needed
          window.dispatchEvent(new CustomEvent('infographik:open-guide'));
        }}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />
        <main className="flex-1 min-h-0 overflow-hidden flex">
          <EditorSplit activeSection={activeSection} />
        </main>
      </div>
    </div>
  );
}
