// app/components/Base/Input.tsx
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSizes } from '../../styles/theme';

export interface InputRef {
  clear: () => void;
  focus: () => void;
}

interface CustomTextInputProps extends TextInputProps {
  style?: object;
}

const Input = forwardRef<InputRef, CustomTextInputProps>((props, ref) => {
  const inputRef = useRef<TextInput>(null);

  // Expose the clear and focus methods to the parent component
  useImperativeHandle(ref, () => ({
    clear: () => {
      inputRef.current?.clear();
    },
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  return (
    <TextInput
      ref={inputRef}
      style={[styles.input, props.style]}
      placeholderTextColor={Colors.gray[100]}
      {...props}
      accessible={true}
      accessibilityLabel={props.placeholder || 'Input Field'}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(31, 31, 31, 0.5)', // Equivalent to bg-gray-800 bg-opacity-50
    borderWidth: 1, // Equivalent to border
    borderColor: Colors.gray[700], // Equivalent to border-gray-700
    borderRadius: BorderRadius.medium, // Equivalent to rounded-md
    paddingVertical: Spacing.small, // Equivalent to py-2
    paddingHorizontal: Spacing.medium, // Equivalent to px-3
    fontSize: FontSizes.medium, // Equivalent to text-base
    color: Colors.text, // Equivalent to text-white
  },
});

export default Input;
