import { useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { useThemeStore } from './lib/theme';
import { useDataStore } from './lib/data/store';
import { ToastProvider } from './components/common/ToastContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { logger } from './lib/logger';

function App() {
  const theme = useThemeStore((state) => state.theme);
  const activeDatasetId = useDataStore((state) => state.activeDatasetId);
  const datasets = useDataStore((state) => state.datasets);

  // Synchronize Dark / Light Theme
  useEffect(() => {
    logger.info(`Applying theme: ${theme}`, { context: 'App' });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  // Dynamic Document Title based on Active Dataset
  useEffect(() => {
    const activeDs = activeDatasetId ? datasets[activeDatasetId] : null;
    if (activeDs?.name) {
      document.title = `Infographik — ${activeDs.name}`;
    } else {
      document.title = 'Infographik — Animated Infographic Generator';
    }
  }, [activeDatasetId, datasets]);

  return (
    <ErrorBoundary fallbackTitle="Application Error">
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
