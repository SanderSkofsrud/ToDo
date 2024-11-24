// src/context/ThemeContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native'; // Removed AppearancePreferences
import { lightTheme, darkTheme, Theme } from '../styles/theme';
import { loadData, saveData, THEME_KEY } from '@/utils/storage';

/**
 * Interface for the Theme Context.
 */
interface ThemeContextProps {
  theme: Theme;
  colorScheme: ColorSchemeName;
  toggleTheme: () => void;
  isThemeLoaded: boolean;
  isThemeManuallySet: boolean;
  setSystemTheme: () => void;
}

/**
 * Create Theme Context with default values.
 */
const ThemeContext = createContext<ThemeContextProps>({
  theme: darkTheme,
  colorScheme: 'dark',
  toggleTheme: () => {},
  isThemeLoaded: false,
  isThemeManuallySet: false,
  setSystemTheme: () => {},
});

/**
 * ThemeProvider component that provides theme-related values and functionalities.
 * @param children - React children nodes.
 * @returns A React functional component.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = Appearance.getColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(systemColorScheme || 'dark');
  const [isThemeLoaded, setIsThemeLoaded] = useState<boolean>(false);
  const [isManual, setIsManual] = useState<boolean>(false);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const savedTheme = await loadData<string>(THEME_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setColorScheme(savedTheme);
          setIsManual(true);
        } else if (savedTheme === 'system' || savedTheme === null) {
          setColorScheme(systemColorScheme || 'dark');
          setIsManual(false);
        }
      } catch (e) {
        console.error('Error loading theme:', e);
        // Fallback to system preference
        setColorScheme(systemColorScheme || 'dark');
        setIsManual(false);
      } finally {
        setIsThemeLoaded(true);
      }
    };

    initializeTheme();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => { // Removed AppearancePreferences
      if (!isManual) {
        // If user hasn't manually set the theme, follow system changes
        setColorScheme(colorScheme || 'dark');
      }
    });

    return () => subscription.remove();
  }, [systemColorScheme, isManual]);

  /**
   * Toggles between light and dark themes.
   * If currently using system theme, toggles to 'dark'.
   */
  const toggleTheme = () => {
    let newScheme: ColorSchemeName;
    if (isManual) {
      newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    } else {
      // If not manually set, default to 'dark'
      newScheme = 'dark';
      setIsManual(true);
    }
    setColorScheme(newScheme);
    setIsManual(true);
    saveData<string>(THEME_KEY, newScheme)
      .then(() => {
        console.log(`Theme set to ${newScheme}`);
      })
      .catch((e) => {
        console.error('Error saving theme:', e);
      });
  };

  /**
   * Sets the theme to follow the system preference.
   */
  const setSystemTheme = () => {
    const systemScheme = Appearance.getColorScheme() || 'dark';
    setColorScheme(systemScheme);
    setIsManual(false);
    saveData<string>(THEME_KEY, 'system')
      .then(() => {
        console.log('Theme set to follow system');
      })
      .catch((e) => {
        console.error('Error saving system theme preference:', e);
      });
  };

  const theme = useMemo(() => (colorScheme === 'dark' ? darkTheme : lightTheme), [colorScheme]);

  const contextValue = useMemo(
    () => ({
      theme,
      colorScheme,
      toggleTheme,
      isThemeLoaded,
      isThemeManuallySet: isManual,
      setSystemTheme,
    }),
    [theme, colorScheme, toggleTheme, isThemeLoaded, isManual, setSystemTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

/**
 * Custom hook to use the Theme Context.
 * @returns ThemeContextProps
 */
export const useTheme = () => useContext(ThemeContext);
