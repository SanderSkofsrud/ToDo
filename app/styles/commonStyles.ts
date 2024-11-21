import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FontSizes, Spacing, BorderRadius } from './theme';

/**
 * Generates common styles based on the current theme.
 * @returns StyleSheet
 */
export const useCommonStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: Spacing.medium,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.medium,
      borderRadius: BorderRadius.medium,
      alignItems: 'center',
      marginTop: Spacing.medium,
    },
    buttonText: {
      color: theme.text,
      fontSize: FontSizes.medium,
      fontWeight: '600',
    },
    textInput: {
      backgroundColor: 'rgba(31, 31, 31, 0.5)',
      borderWidth: 1,
      borderColor: theme.gray[700],
      borderRadius: BorderRadius.medium,
      paddingVertical: Spacing.small,
      paddingHorizontal: Spacing.medium,
      fontSize: FontSizes.medium,
      color: theme.text,
    },
    // Additional reusable styles can be added here
  });
};
