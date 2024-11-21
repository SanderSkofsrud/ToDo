/**
 * Interface defining the structure of a Theme.
 */
export interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  background: string;
  text: string;
  gray: {
    [key: number]: string;
  };
}

/**
 * Light theme color palette.
 */
export const lightTheme: Theme = {
  mode: 'light',
  primary: '#2563EB',
  background: '#FFFFFF',
  text: '#000000',
  gray: {
    900: '#E0E0E0',
    800: '#CCCCCC',
    700: '#B3B3B3',
    600: '#999999',
    500: '#808080',
    400: '#666666',
    300: '#4D4D4D',
    200: '#333333',
    100: '#1A1A1A',
    50: '#0D0D0D',
  },
};

/**
 * Dark theme color palette.
 */
export const darkTheme: Theme = {
  mode: 'dark',
  primary: '#2563EB',
  background: '#121212',
  text: '#FFFFFF',
  gray: {
    900: '#121212',
    800: '#1E1E1E',
    700: '#2C2C2C',
    600: '#383838',
    500: '#4A4A4A',
    400: '#5C5C5C',
    300: '#6E6E6E',
    200: '#8A8A8A',
    100: '#A6A6A6',
    50: '#C2C2C2',
  },
};

export const FontSizes = {
  small: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
};

export const Spacing = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

export const BorderRadius = {
  small: 4,
  medium: 8,
  large: 16,
  xlarge: 24,
};
