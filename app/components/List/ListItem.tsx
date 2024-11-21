import React, { memo, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  View,
  Vibration,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontSizes, Spacing, BorderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

/**
 * Props for the ListItem component.
 */
interface ListItemProps extends Omit<TouchableOpacityProps, 'onPress'> {
  /** The text content of the list item */
  text: string;
  /** Indicates if the item is completed */
  completed?: boolean;
  /** Indicates if the item is being dragged */
  dragging?: boolean;
  /** Callback function invoked when the item is pressed */
  onPress?: () => void;
}

/**
 * A list item component that can be toggled and dragged.
 * @param text - The text of the list item.
 * @param completed - Whether the item is completed.
 * @param dragging - Whether the item is being dragged.
 * @param onPress - Function to handle press events.
 * @param style - Optional custom styles for the item.
 * @param props - Additional TouchableOpacity props.
 * @returns A React functional component.
 */
const ListItem: React.FC<ListItemProps> = ({
                                             text,
                                             completed = false,
                                             dragging,
                                             onPress,
                                             style,
                                             ...props
                                           }) => {
  const { theme } = useTheme();

  const handlePress = useCallback(() => {
    Vibration.vibrate(50);
    if (onPress) {
      onPress();
    }
  }, [onPress]);

  const styles = StyleSheet.create({
    container: {
      marginBottom: Spacing.small,
      flexDirection: 'row',
      alignItems: 'center',
      opacity: dragging ? 0.7 : 1,
    },
    icon: {
      marginRight: Spacing.small,
    },
    content: {
      flex: 1,
      padding: Spacing.medium,
      borderRadius: BorderRadius.large,
      backgroundColor: completed ? theme.gray[700] : theme.gray[800],
    },
    text: {
      fontSize: FontSizes.medium,
      color: completed ? theme.gray[500] : theme.text,
      textDecorationLine: completed ? 'line-through' : 'none',
    },
  });

  return (
    <TouchableOpacity
      {...props}
      onPress={handlePress}
      style={[styles.container, style]}
      accessibilityRole="button"
      accessibilityLabel={`${text} ${completed ? 'completed' : 'not completed'}`}
      accessibilityHint="Toggles the completion state of this item"
    >
      <Ionicons
        name={completed ? 'checkbox' : 'square-outline'}
        size={24}
        color={completed ? theme.primary : theme.text}
        style={styles.icon}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ListItem);
