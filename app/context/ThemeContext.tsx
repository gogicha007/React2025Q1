import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../../app/hooks/useLocalStorage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [lsTheme, setLsTheme] = useLocalStorage<Theme>('theme', 'light');
  const [theme, setTheme] = useState<Theme>(lsTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setLsTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
