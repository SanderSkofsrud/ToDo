import React, { forwardRef } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * Props for the ListHeader component.
 */
interface ListHeaderProps {
  /** Callback function invoked when the back button is pressed */
  onBackPress: () => void;
}

/**
 * A header component containing only the back button.
 * @param onBackPress - Function to handle back button press.
 * @returns A React functional component.
 */
const ListHeader = forwardRef<unknown, ListHeaderProps>(
  ({ onBackPress }, ref) => {
    const { theme } = useTheme();

    /**
     * Generates styles based on the current theme.
     * @param theme - The current theme object.
     * @returns A StyleSheet object.
     */
    const styles = StyleSheet.create({
      backButton: {
        padding: 8,
      },
    });

    return (
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.backButton}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        accessibilityHint="Navigates to the previous screen"
      >
      </TouchableOpacity>
    );
  }
);

export default React.memo(ListHeader);
