import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 
  | 'light'
  | 'dark'
  | 'ocean-blue'
  | 'soft-pink'
  | 'forest-green'
  | 'high-contrast'
  | 'galaxy'
  | 'retro-console'
  | 'neon-purple'
  | 'cyberpunk'
  | 'hacker-matrix'
  | 'adventure-nature'
  | 'gradient-rainbow';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeConfig: ThemeConfig;
}

interface ThemeConfig {
  name: string;
  emoji: string;
  background: string;
  text: string;
  accent: string;
  card: string;
  border: string;
  animation?: string;
  customStyles?: string;
}

const themeConfigs: Record<Theme, ThemeConfig> = {
  'light': {
    name: 'Light',
    emoji: '🌞',
    background: 'bg-white',
    text: 'text-gray-900',
    accent: 'text-blue-600',
    card: 'bg-gray-50',
    border: 'border-gray-200'
  },
  'dark': {
    name: 'Dark',
    emoji: '🌙',
    background: 'bg-gray-900',
    text: 'text-white',
    accent: 'text-blue-400',
    card: 'bg-gray-800',
    border: 'border-gray-700'
  },
  'ocean-blue': {
    name: 'Ocean Blue',
    emoji: '🌊',
    background: 'bg-blue-50',
    text: 'text-blue-900',
    accent: 'text-blue-600',
    card: 'bg-blue-100/50',
    border: 'border-blue-200',
    animation: 'ocean-ripple',
    customStyles: 'bg-ocean-ripple'
  },
  'soft-pink': {
    name: 'Soft Pink',
    emoji: '🌸',
    background: 'bg-pink-50',
    text: 'text-pink-900',
    accent: 'text-pink-600',
    card: 'bg-pink-100/50',
    border: 'border-pink-200',
    animation: 'petals'
  },
  'forest-green': {
    name: 'Forest Green',
    emoji: '🌲',
    background: 'bg-green-50',
    text: 'text-green-900',
    accent: 'text-green-600',
    card: 'bg-green-100/50',
    border: 'border-green-200',
    animation: 'float',
    customStyles: 'bg-forest-gradient'
  },
  'high-contrast': {
    name: 'High Contrast',
    emoji: '⚡',
    background: 'bg-white',
    text: 'text-black',
    accent: 'text-black',
    card: 'bg-white',
    border: 'border-black'
  },
  'galaxy': {
    name: 'Galaxy',
    emoji: '🌌',
    background: 'bg-black',
    text: 'text-white',
    accent: 'text-yellow-300',
    card: 'bg-gray-900/80',
    border: 'border-gray-800',
    animation: 'twinkle'
  },
  'retro-console': {
    name: 'Retro Console',
    emoji: '🕹',
    background: 'bg-black',
    text: 'text-green-400',
    accent: 'text-green-300',
    card: 'bg-gray-900',
    border: 'border-green-800',
    animation: 'flicker'
  },
  'neon-purple': {
    name: 'Neon Purple',
    emoji: '🟣',
    background: 'bg-purple-900',
    text: 'text-purple-100',
    accent: 'text-purple-300',
    card: 'bg-purple-800/50',
    border: 'border-purple-500',
    animation: 'pulse-glow'
  },
  'cyberpunk': {
    name: 'Cyberpunk',
    emoji: '🏙',
    background: 'bg-gray-900',
    text: 'text-cyan-300',
    accent: 'text-pink-400',
    card: 'bg-gray-800/80',
    border: 'border-cyan-500',
    animation: 'gradient-shift',
    customStyles: 'bg-cyberpunk-gradient'
  },
  'hacker-matrix': {
    name: 'Hacker Matrix',
    emoji: '👾',
    background: 'bg-black',
    text: 'text-green-400',
    accent: 'text-green-300',
    card: 'bg-gray-900/90',
    border: 'border-green-600',
    animation: 'matrix-rain'
  },
  'adventure-nature': {
    name: 'Adventure Nature',
    emoji: '🏞',
    background: 'bg-amber-50',
    text: 'text-amber-900',
    accent: 'text-amber-700',
    card: 'bg-amber-100/50',
    border: 'border-amber-300',
    animation: 'float'
  },
  'gradient-rainbow': {
    name: 'Gradient Rainbow',
    emoji: '🎨',
    background: 'bg-white',
    text: 'text-gray-900',
    accent: 'text-gray-900',
    card: 'bg-white/80',
    border: 'border-gray-200',
    animation: 'rainbow-wave',
    customStyles: 'bg-rainbow-gradient'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('autodefense_theme') as Theme;
    if (savedTheme && themeConfigs[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('autodefense_theme', theme);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    themeConfig: themeConfigs[theme]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};





