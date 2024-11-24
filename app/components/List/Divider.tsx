// src/components/List/Divider.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontSizes, Spacing, BorderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

/**
 * Props for the Divider component.
 */
interface DividerProps {
  /** Indicates if completed items are currently expanded */
  isExpanded: boolean;
  /** Callback to toggle the expand/minimize state */
  onToggleExpand: () => void;
  /** Callback to clear all completed items */
  onClearCompleted: () => void;
  /** Number of completed items */
  completedCount: number;
}

/**
 * A divider component that separates incompleted and completed items.
 * Includes expand/minimize and clear buttons.
 * @param isExpanded - Whether completed items are expanded.
 * @param onToggleExpand - Function to toggle expansion.
 * @param onClearCompleted - Function to clear completed items.
 * @param completedCount - Number of completed items.
 * @returns A React functional component.
 */
const Divider: React.FC<DividerProps> = ({
                                           isExpanded,
                                           onToggleExpand,
                                           onClearCompleted,
                                           completedCount,
                                         }) => {
  const { theme } = useTheme();

  /**
   * Generates styles based on the current theme.
   * @param theme - The current theme object.
   * @returns A StyleSheet object.
   */
  const getStyles = (theme: any) =>
    StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.small,
        borderBottomWidth: 1,
        borderColor: theme.gray[700],
        marginVertical: Spacing.medium,
      } as ViewStyle,
      leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
      } as ViewStyle,
      toggleButton: {
        flexDirection: 'row', // Ensure horizontal alignment
        alignItems: 'center',
      } as ViewStyle,
      title: {
        fontSize: FontSizes.large,
        fontWeight: 'bold',
        color: theme.text,
        marginRight: Spacing.small,
      } as TextStyle,
      button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.tiny,
        borderRadius: BorderRadius.small,
        backgroundColor: theme.gray[800],
      } as ViewStyle,
      buttonText: {
        fontSize: FontSizes.medium,
        color: theme.text,
        marginLeft: Spacing.tiny,
      } as TextStyle,
      countText: {
        fontSize: FontSizes.small,
        color: theme.gray[400],
        marginLeft: Spacing.tiny,
      } as TextStyle,
    });

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={onToggleExpand}
          style={styles.toggleButton} // Apply the new style here
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={
            isExpanded ? 'Minimize completed items' : 'Expand completed items'
          }
          accessibilityHint={
            isExpanded ? 'Hides completed items' : 'Shows completed items'
          }
        >
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.text}
          />
          <Text style={styles.title}>Completed Items</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={onClearCompleted}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Clear completed items"
        accessibilityHint="Deletes all completed items"
      >
        <Ionicons name="trash-outline" size={20} color={theme.text} />
      </TouchableOpacity>
    </View>
  );
};

export default Divider;
