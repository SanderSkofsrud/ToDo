import React, { createContext, useState, useEffect, ReactNode, useContext, useMemo } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { lightTheme, darkTheme, Theme } from '../styles/theme';

/**
 * Interface for the Theme Context.
 */
interface ThemeContextProps {
  theme: Theme;
  colorScheme: ColorSchemeName;
  toggleTheme: () => void;
}

/**
 * Create Theme Context with default values.
 */
const ThemeContext = createContext<ThemeContextProps>({
  theme: darkTheme,
  colorScheme: 'dark',
  toggleTheme: () => {},
});

/**
 * ThemeProvider component that provides theme-related values and functionalities.
 * @param children - React children nodes.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorSchemePreference = Appearance.getColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(colorSchemePreference || 'dark');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setColorScheme(colorScheme);
      }
    });
    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setColorScheme((prevScheme) => (prevScheme === 'dark' ? 'light' : 'dark'));
  };

  const theme = useMemo(() => (colorScheme === 'dark' ? darkTheme : lightTheme), [colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the Theme Context.
 * @returns ThemeContextProps
 */
export const useTheme = () => useContext(ThemeContext);
