import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
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
}

/**
 * A search bar component with an icon and input field.
 * @param value - Current search text.
 * @param onChangeText - Function to handle text changes.
 * @returns A React functional component.
 */
const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.gray[800],
      borderWidth: 1,
      borderColor: theme.gray[700],
      borderRadius: BorderRadius.medium,
      marginBottom: Spacing.medium,
      paddingHorizontal: Spacing.medium,
      paddingVertical: Spacing.small,
    },
    input: {
      flex: 1,
      color: theme.text,
      marginLeft: Spacing.small,
      fontSize: FontSizes.medium,
    },
  });

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default React.memo(SearchBar);
