import { Header } from './Header';
import { EditorSplit } from './EditorSplit';

export function AppShell() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors">
      <Header />
      <main className="flex-1 overflow-hidden">
        <EditorSplit />
      </main>
    </div>
  );
}
