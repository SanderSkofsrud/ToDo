// app/styles/commonStyles.ts

import { StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from './theme';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.medium,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    marginTop: Spacing.medium,
  },
  buttonText: {
    color: Colors.text,
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: 'rgba(31, 31, 31, 0.5)',
    borderWidth: 1,
    borderColor: Colors.gray[700],
    borderRadius: BorderRadius.medium,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    fontSize: FontSizes.medium,
    color: Colors.text,
  },
  // Add more reusable styles as needed
});
