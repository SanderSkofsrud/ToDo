import React from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useCommonStyles } from '../../styles/commonStyles';

/**
 * Props for the Button component.
 */
interface ButtonProps extends TouchableOpacityProps {
  /** The text to display on the button */
  title: string;
  /** Optional style to override the button's container */
  style?: ViewStyle;
  /** Optional style to override the button's text */
  textStyle?: TextStyle;
}

/**
 * A customizable button component with accessibility support.
 * @param title - The text displayed on the button.
 * @param style - Optional custom styles for the button container.
 * @param textStyle - Optional custom styles for the button text.
 * @param props - Additional TouchableOpacity props.
 * @returns A React functional component.
 */
const Button: React.FC<ButtonProps> = ({
                                         title,
                                         style,
                                         textStyle,
                                         ...props
                                       }) => {
  const commonStyles = useCommonStyles();

  return (
    <TouchableOpacity
      style={[commonStyles.button, style]}
      {...props}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={[commonStyles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(Button);
