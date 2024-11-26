import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontSizes, Spacing, BorderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

/**
 * Props for the SearchBar component.
 */
interface SearchBarProps {
  /** The current value of the search input */
  value: string;
  /** Callback function invoked when the search text changes */
  onChangeText: (text: string) => void;
  /** Optional style to override the SearchBar's container */
  style?: ViewStyle;
  /** Optional children to render inside the SearchBar */
  children?: React.ReactNode;
}

/**
 * A search bar component with an icon, input field, and optional children.
 * @param value - Current search text.
 * @param onChangeText - Function to handle text changes.
 * @param style - Optional custom styles for the container.
 * @param children - Optional React nodes to render inside the SearchBar.
 * @returns A React functional component.
 */
const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, style, children }) => {
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
        backgroundColor: theme.gray[800],
        borderWidth: 1,
        borderColor: theme.gray[700],
        borderRadius: BorderRadius.medium,
        paddingHorizontal: Spacing.medium,
        paddingVertical: Spacing.small,
      },
      input: {
        flex: 1,
        color: theme.text,
        marginLeft: Spacing.small,
        fontSize: FontSizes.medium,
      },
      toggleButton: {
        padding: 8,
        marginLeft: Spacing.small,
      },
    });

  const styles = React.useMemo(() => getStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={20} color={theme.gray[100]} />
      <TextInput
        placeholder="Search lists"
        placeholderTextColor={theme.gray[100]}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        returnKeyType="search"
        accessible={true}
        accessibilityLabel="Search in lists"
        accessibilityHint="Search through your lists"
      />
      {children}
    </View>
  );
};

export default React.memo(SearchBar);
