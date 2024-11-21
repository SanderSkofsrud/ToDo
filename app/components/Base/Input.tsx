import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

/**
 * Interface for input reference methods.
 */
export interface InputRef {
  /** Clears the input field */
  clear: () => void;
  /** Focuses the input field */
  focus: () => void;
}

/**
 * Props for the CustomTextInput component.
 */
interface CustomTextInputProps extends TextInputProps {
  /** Optional custom styles for the input */
  style?: object;
}

/**
 * A customizable TextInput component with exposed clear and focus methods.
 * @param props - TextInput properties.
 * @param ref - Reference to access clear and focus methods.
 * @returns A React functional component.
 */
const Input = forwardRef<InputRef, CustomTextInputProps>((props, ref) => {
  const inputRef = useRef<TextInput>(null);
  const { theme } = useTheme();

  useImperativeHandle(ref, () => ({
    clear: () => {
      inputRef.current?.clear();
    },
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const styles = StyleSheet.create({
    input: {
      backgroundColor: 'rgba(31, 31, 31, 0.5)',
      borderWidth: 1,
      borderColor: theme.gray[700],
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: 16,
      color: theme.text,
    },
  });

  return (
    <TextInput
      ref={inputRef}
      style={[styles.input, props.style]}
      placeholderTextColor={theme.gray[100]}
      {...props}
      accessible={true}
      accessibilityLabel={props.placeholder || 'Input Field'}
    />
  );
});

export default React.memo(Input);
