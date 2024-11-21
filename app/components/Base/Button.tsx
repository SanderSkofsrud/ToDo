// app/components/Base/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { commonStyles } from '../../styles/commonStyles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
                                         title,
                                         style,
                                         textStyle,
                                         ...props
                                       }) => (
  <TouchableOpacity
    style={[commonStyles.button, style]} // Allow overriding styles via props
    {...props}
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={title}
  >
    <Text style={[commonStyles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

export default Button;
