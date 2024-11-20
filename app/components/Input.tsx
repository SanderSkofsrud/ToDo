// components/Input.tsx

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';

export interface InputRef {
  clear: () => void;
  focus: () => void;
}

const Input = forwardRef<InputRef, TextInputProps>((props, ref) => {
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
      className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-md py-2 px-3 text-base text-white placeholder-gray-400"
      placeholderTextColor="#A6A6A6"
      {...props}
    />
  );
});

export default Input;
