
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeVariant } from '../components/notes/types';

// Define theme context type
interface ThemeContextType {
  theme: ThemeVariant;
  setTheme: (theme: ThemeVariant) => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  spacing: 'compact' | 'normal' | 'wide';
  setSpacing: (spacing: 'compact' | 'normal' | 'wide') => void;
  roundedCorners: boolean;
  setRoundedCorners: (rounded: boolean) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use localStorage to persist theme preferences
  const [theme, setTheme] = useState<ThemeVariant>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeVariant) || 'win98';
  });

  // Font size preference
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>(() => {
    const savedSize = localStorage.getItem('fontSize');
    return (savedSize as 'sm' | 'md' | 'lg') || 'md';
  });

  // Spacing preference
  const [spacing, setSpacing] = useState<'compact' | 'normal' | 'wide'>(() => {
    const savedSpacing = localStorage.getItem('spacing');
    return (savedSpacing as 'compact' | 'normal' | 'wide') || 'normal';
  });

  // Rounded corners preference
  const [roundedCorners, setRoundedCorners] = useState<boolean>(() => {
    const savedRounded = localStorage.getItem('roundedCorners');
    return savedRounded ? savedRounded === 'true' : false;
  });

  // Animations preference
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
    const savedAnimations = localStorage.getItem('animationsEnabled');
    return savedAnimations ? savedAnimations === 'true' : true;
  });

  // Update localStorage and document when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Update localStorage when font size changes
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  // Update localStorage when spacing changes
  useEffect(() => {
    localStorage.setItem('spacing', spacing);
    document.documentElement.setAttribute('data-spacing', spacing);
  }, [spacing]);

  // Update localStorage when rounded corners preference changes
  useEffect(() => {
    localStorage.setItem('roundedCorners', roundedCorners.toString());
    document.documentElement.setAttribute('data-rounded', roundedCorners.toString());
  }, [roundedCorners]);

  // Update localStorage when animations preference changes
  useEffect(() => {
    localStorage.setItem('animationsEnabled', animationsEnabled.toString());
    document.documentElement.setAttribute('data-animations', animationsEnabled.toString());
  }, [animationsEnabled]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme,
      fontSize,
      setFontSize,
      spacing,
      setSpacing,
      roundedCorners,
      setRoundedCorners,
      animationsEnabled,
      setAnimationsEnabled
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
