// components/List/ListTabs.tsx

import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { FontSizes, Spacing, BorderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * Interface for each tab.
 */
interface Tab {
  label: string;
  key: string;
}

/**
 * Props for the ListTabs component.
 */
interface ListTabsProps {
  /** Array of tabs representing different lists */
  tabs: Tab[];
  /** Currently active tab key */
  activeTab: string;
  /** Callback when a tab is pressed */
  onTabPress: (key: string) => void;
  /** Optional callback for adding a new list */
  onAddTab?: () => void;
  /** Optional callback for deleting a list */
  onDeleteTab?: (key: string) => void;
}

/**
 * A customizable Tabs component styled like browser tabs for switching between lists.
 * @param tabs - Array of tab objects representing different lists.
 * @param activeTab - The key of the currently active tab.
 * @param onTabPress - Function to handle tab presses.
 * @param onAddTab - Optional function to handle adding a new tab.
 * @param onDeleteTab - Optional function to handle deleting a tab.
 * @returns A React functional component.
 */
const ListTabs: React.FC<ListTabsProps> = ({
                                             tabs,
                                             activeTab,
                                             onTabPress,
                                             onAddTab,
                                             onDeleteTab,
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
        backgroundColor: theme.background,
        paddingHorizontal: Spacing.small,
      } as ViewStyle,
      tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.small,
        paddingHorizontal: Spacing.medium,
        borderTopLeftRadius: BorderRadius.medium,
        borderTopRightRadius: BorderRadius.medium,
        marginRight: Spacing.small,
        backgroundColor: theme.background, // Inactive tabs blend with background
      } as ViewStyle,
      activeTab: {
        backgroundColor: theme.activeTabBackground, // Active tab background
      } as ViewStyle,
      tabText: {
        fontSize: FontSizes.medium,
        color: theme.text,
        marginRight: Spacing.tiny,
      } as TextStyle,
      activeTabText: {
        color: theme.text,
        fontWeight: 'bold',
      } as TextStyle,
      closeIcon: {
        marginLeft: Spacing.tiny,
      },
      addButton: {
        paddingVertical: Spacing.small,
        paddingHorizontal: Spacing.medium,
        borderRadius: BorderRadius.medium,
        backgroundColor: theme.activeTabBackground, // Consistent with active tab
      } as ViewStyle,
      addButtonText: {
        fontSize: FontSizes.large,
        color: theme.text,
      } as TextStyle,
    });

  const styles = getStyles(theme);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: 'row',
        alignItems: 'flex-start', // Changed from 'center' to 'flex-start'
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabPress(tab.key)}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Tab ${tab.label || 'Unnamed'}`}
            accessibilityHint="Tap to switch to this list. Long press to delete."
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label || 'Unnamed'}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Optional Add Tab Button */}
      {onAddTab && (
        <TouchableOpacity
          onPress={onAddTab}
          style={styles.addButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Add new list"
          accessibilityHint="Creates a new list"
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default React.memo(ListTabs);
