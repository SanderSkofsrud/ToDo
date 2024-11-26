import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FontSizes, Spacing, BorderRadius, Theme } from './theme';
import { useMemo } from 'react';

/**
 * Generates common styles based on the current theme.
 * @returns An object containing common styles.
 */
export const useCommonStyles = () => {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background,
          padding: Spacing.medium,
        } as ViewStyle,
        button: {
          backgroundColor: theme.primary,
          paddingVertical: Spacing.small,
          paddingHorizontal: Spacing.medium,
          borderRadius: BorderRadius.medium,
          alignItems: 'center',
          marginTop: Spacing.medium,
        } as ViewStyle,
        buttonText: {
          color: theme.text,
          fontSize: FontSizes.medium,
          fontWeight: '600',
        } as TextStyle,
        textInput: {
          backgroundColor: 'rgba(31, 31, 31, 0.5)',
          borderRadius: BorderRadius.medium,
          paddingVertical: Spacing.small,
          paddingHorizontal: Spacing.medium,
          fontSize: FontSizes.medium,
          color: theme.text,
        } as TextStyle,
      }),
    [theme]
  );

  return styles;
};
