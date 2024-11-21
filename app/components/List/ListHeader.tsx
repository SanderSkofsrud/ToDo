import React, { forwardRef, useRef, useEffect } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { FontSizes, Spacing } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

/**
 * Props for the ListHeader component.
 */
interface ListHeaderProps extends TextInputProps {
  /** The current name of the list */
  listName: string;
  /** Callback function invoked when the list name changes */
  onChangeName: (newName: string) => void;
  /** Callback function invoked when submitting the list name */
  onSubmit: () => void;
  /** Function to set focus on the input field */
  focusRef?: (focus: () => void) => void;
}

/**
 * A header component for the list screen that allows editing the list name.
 * @param listName - Current name of the list.
 * @param onChangeName - Function to handle name changes.
 * @param onSubmit - Function to handle submission of the name.
 * @param focusRef - Function to set focus on the input.
 * @param props - Additional TextInput props.
 * @param ref - Reference to the TextInput.
 * @returns A React functional component.
 */
const ListHeader = forwardRef<TextInput, ListHeaderProps>(
  ({ listName, onChangeName, onSubmit, focusRef, ...props }, ref) => {
    const inputRef = useRef<TextInput>(null);
    const { theme } = useTheme();

    useEffect(() => {
      if (focusRef) {
        focusRef(() => {
          inputRef.current?.focus();
        });
      }
    }, [focusRef]);

    const styles = StyleSheet.create({
      headerTitle: {
        color: theme.text,
        fontSize: FontSizes.large,
        fontWeight: 'bold',
        flex: 1,
        paddingVertical: Spacing.tiny,
        paddingRight: 40, // Prevent overlapping with other header elements
      },
    });

    return (
      <TextInput
        ref={inputRef}
        value={listName}
        onChangeText={onChangeName}
        onSubmitEditing={onSubmit}
        onBlur={onSubmit}
        placeholder="List Name"
        placeholderTextColor={theme.gray[100]}
        style={styles.headerTitle}
        accessible={true}
        accessibilityLabel="List Name Input"
        accessibilityHint="Enter the name of the list"
        {...props}
      />
    );
  }
);

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ListHeader);
