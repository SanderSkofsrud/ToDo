// components/Button.tsx

import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

const Button: React.FC<ButtonProps> = ({ title, ...props }) => (
  <TouchableOpacity
    className="bg-blue-600 py-3 px-4 rounded-md mt-4"
    {...props}
  >
    <Text className="text-white text-center text-base font-semibold">{title}</Text>
  </TouchableOpacity>
);

export default Button;
