// app/components/List/ListHeader.tsx
import React, { forwardRef, useRef, useEffect } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing } from '../../styles/theme';

interface ListHeaderProps extends TextInputProps {
  listName: string;
  onChangeName: (newName: string) => void;
  onSubmit: () => void;
  focusRef?: (focus: () => void) => void; // Corrected type
}

const ListHeader = forwardRef<TextInput, ListHeaderProps>(
  ({ listName, onChangeName, onSubmit, focusRef, ...props }, ref) => {
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
      if (focusRef) {
        focusRef(() => {
          inputRef.current?.focus();
        });
      }
    }, [focusRef]);

    return (
      <TextInput
        ref={inputRef}
        value={listName}
        onChangeText={onChangeName}
        onSubmitEditing={onSubmit}
        onBlur={onSubmit}
        placeholder="Liste Navn"
        placeholderTextColor={Colors.gray[100]}
        style={styles.headerTitle}
        accessible={true}
        accessibilityLabel="Liste Navn Input"
        accessibilityHint="Skriv inn navnet på listen"
        {...props}
      />
    );
  }
);

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ListHeader);

const styles = StyleSheet.create({
  headerTitle: {
    color: Colors.text,
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    flex: 1,
    paddingVertical: Spacing.tiny,
    paddingRight: 40, // To prevent overlapping with other header elements
  },
});
