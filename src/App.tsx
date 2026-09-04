import { useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { useThemeStore } from './lib/theme';
import './App.css';

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <AppShell />;
}

export default App;
