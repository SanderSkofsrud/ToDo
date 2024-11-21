// app/components/List/ListItem.tsx
import React, { memo } from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  View,
  Vibration,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, FontSizes } from '../../styles/theme';

interface ListItemProps extends Omit<TouchableOpacityProps, 'onPress'> {
  text: string;
  completed?: boolean;
  dragging?: boolean;
  onPress?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
                                             text,
                                             completed = false,
                                             dragging,
                                             onPress,
                                             style,
                                             ...props
                                           }) => {
  const handlePress = () => {
    Vibration.vibrate(50);
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      {...props}
      onPress={handlePress}
      style={[
        styles.container,
        dragging ? styles.dragging : styles.notDragging,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${text} ${completed ? 'completed' : 'not completed'}`}
      accessibilityHint="Toggles the completion state of this item"
    >
      {/* Checkbox Icon */}
      <Ionicons
        name={completed ? 'checkbox' : 'square-outline'}
        size={24}
        color={completed ? Colors.primary : Colors.text}
        style={styles.icon}
        accessibilityIgnoresInvertColors
      />

      {/* Item Content */}
      <View
        style={[
          styles.content,
          completed ? styles.completedBackground : styles.incompleteBackground,
        ]}
      >
        <Text
          style={[
            styles.text,
            completed ? styles.completedText : styles.incompleteText,
          ]}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.small, // mb-2
    flexDirection: 'row', // flex-row
    alignItems: 'center', // items-center
    opacity: 1,
  },
  dragging: {
    opacity: 0.7, // opacity-70
  },
  notDragging: {
    opacity: 1, // opacity-100
  },
  icon: {
    marginRight: Spacing.small, // mr-3
  },
  content: {
    flex: 1, // flex-1
    padding: Spacing.medium, // p-4
    borderRadius: BorderRadius.large, // rounded-lg
  },
  completedBackground: {
    backgroundColor: Colors.gray[700],
  },
  incompleteBackground: {
    backgroundColor: Colors.gray[800],
  },
  text: {
    fontSize: FontSizes.medium, // text-base
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.gray[500],
  },
  incompleteText: {
    color: Colors.text,
  },
});

export default memo(ListItem);
