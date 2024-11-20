// components/ListItem.tsx

import React, { memo } from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  View,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ListItemProps extends Omit<TouchableOpacityProps, 'onPress'> {
  text: string;
  completed?: boolean;
  dragging?: boolean;
  onPress?: () => void; // Redefine onPress without event
}

const ListItem: React.FC<ListItemProps> = ({
                                             text,
                                             completed = false,
                                             dragging,
                                             onPress, // Destructure onPress
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
      onPress={handlePress} // Use the custom handler
      className={`mb-2 flex-row items-center ${
        dragging ? 'opacity-70' : 'opacity-100'
      }`}
      accessibilityRole="button"
      accessibilityLabel={`${text} ${completed ? 'completed' : 'not completed'}`}
      accessibilityHint="Toggles the completion state of this item"
    >
      {/* Checkbox Icon */}
      <Ionicons
        name={completed ? 'checkbox' : 'square-outline'}
        size={24}
        color={completed ? '#2563EB' : 'white'}
        style={{ marginRight: 12 }}
        accessibilityIgnoresInvertColors
      />

      {/* Item Content */}
      <View
        className={`flex-1 p-4 rounded-lg ${
          completed ? 'bg-gray-700' : 'bg-gray-800'
        }`}
      >
        <Text
          className={`text-base ${
            completed ? 'line-through text-gray-500' : 'text-white'
          }`}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ListItem);
