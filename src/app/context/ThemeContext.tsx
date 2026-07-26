import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'midnight' | 'forest';

export interface ThemeInfo {
  id: Theme;
  label: string;
  emoji: string;
  description: string;
  preview: { bg: string; accent: string; card: string };
}

export const THEMES: ThemeInfo[] = [
  {
    id: 'dark',
    label: 'Dark',
    emoji: '🌑',
    description: 'Navy hacker — default',
    preview: { bg: '#0a192f', accent: '#00ff9f', card: '#112240' },
  },
  {
    id: 'light',
    label: 'Light',
    emoji: '☀️',
    description: 'Clean & minimal',
    preview: { bg: '#f8fafc', accent: '#059669', card: '#ffffff' },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    emoji: '🔮',
    description: 'Deep purple galaxy',
    preview: { bg: '#0d0d1a', accent: '#a78bfa', card: '#16162a' },
  },
  {
    id: 'forest',
    label: 'Forest',
    emoji: '🌿',
    description: 'Earthy dark green',
    preview: { bg: '#0a1a0f', accent: '#4ade80', card: '#122018' },
  },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeInfo: ThemeInfo;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  themeInfo: THEMES[0],
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('portfolio-theme') as Theme;
    return saved && THEMES.find((t) => t.id === saved) ? saved : 'dark';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  };

  // Apply data-theme attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const themeInfo = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeInfo }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
