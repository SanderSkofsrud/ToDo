import React, { useState, useRef, useCallback, memo } from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  View,
  StyleSheet,
  TextInput,
  GestureResponderEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontSizes, Spacing, BorderRadius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

/**
 * Props for the ListItem component.
 */
interface ListItemProps extends TouchableOpacityProps {
  /** The text content of the list item */
  text: string;
  /** Indicates if the item is completed */
  completed?: boolean;
  /** Indicates if the item is being dragged */
  dragging?: boolean;
  /** Callback function invoked when the item is pressed */
  onPress?: () => void;
  /** Callback function to initiate drag */
  onDrag?: () => void;
  /** Callback function to update item name */
  onUpdateName?: (newName: string) => void;
}

/**
 * A list item component that can be toggled, edited, and dragged.
 * @param text - The text of the list item.
 * @param completed - Whether the item is completed.
 * @param dragging - Whether the item is being dragged.
 * @param onPress - Function to handle press events.
 * @param onDrag - Function to initiate dragging.
 * @param onUpdateName - Function to update the item's name.
 * @param style - Optional custom styles for the item.
 * @param props - Additional TouchableOpacity props.
 * @returns A React functional component.
 */
const ListItem: React.FC<ListItemProps> = ({
                                             text,
                                             completed = false,
                                             dragging,
                                             onPress,
                                             onDrag,
                                             onUpdateName,
                                             style,
                                             ...props
                                           }) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>(text);
  const inputRef = useRef<TextInput>(null);

  /**
   * Handler to start editing the item name.
   */
  const startEditing = useCallback(() => {
    setIsEditing(true);
    setEditedText(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [text]);

  /**
   * Handler to submit the edited name.
   */
  const submitEdit = useCallback(() => {
    setIsEditing(false);
    if (editedText.trim() !== text && onUpdateName) {
      onUpdateName(editedText.trim());
    }
  }, [editedText, text, onUpdateName]);

  /**
   * Handler to cancel editing.
   */
  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedText(text);
  }, [text]);

  /**
   * Generates styles based on the current theme and dragging state.
   * @param theme - The current theme object.
   * @param dragging - Whether the item is being dragged.
   * @returns A StyleSheet object.
   */
  const getStyles = (theme: any, dragging: boolean) =>
    StyleSheet.create({
      container: {
        marginBottom: Spacing.small,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: dragging ? 0.7 : 1,
      },
      checkboxIcon: {
        marginRight: Spacing.small,
      },
      content: {
        flex: 1,
        padding: Spacing.medium,
        borderRadius: BorderRadius.large,
        backgroundColor: completed ? theme.gray[700] : theme.gray[800],
        flexDirection: 'row',
        alignItems: 'center',
      },
      text: {
        fontSize: FontSizes.medium,
        color: completed ? theme.gray[500] : theme.text,
        textDecorationLine: completed ? 'line-through' : 'none',
        flex: 1,
      },
      editIcon: {
        marginLeft: Spacing.tiny,
      },
      textInput: {
        flex: 1,
        fontSize: FontSizes.medium,
        color: theme.text,
        borderBottomWidth: 1,
        borderBottomColor: theme.primary,
        paddingVertical: 0,
      },
    });

  const styles = getStyles(theme, !!dragging);

  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      onLongPress={onDrag}
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${text} ${completed ? 'completed' : 'not completed'}`}
      accessibilityHint="Toggles the completion state of this item. Long press to move."
    >
      {/* Checkbox Icon */}
      <Ionicons
        name={completed ? 'checkbox' : 'square-outline'}
        size={24}
        color={completed ? theme.primary : theme.text}
        style={styles.checkboxIcon}
        accessibilityIgnoresInvertColors
      />

      {/* Item Content */}
      <View style={styles.content}>
        {isEditing ? (
          <TextInput
            ref={inputRef}
            value={editedText}
            onChangeText={setEditedText}
            onSubmitEditing={submitEdit}
            onBlur={cancelEdit}
            style={styles.textInput}
            placeholder="Edit item name"
            placeholderTextColor={theme.gray[400]}
            accessible={true}
            accessibilityLabel="Edit item name input"
            accessibilityHint="Edit the name of the item"
          />
        ) : (
          <Text style={styles.text}>{text}</Text>
        )}

        {/* Edit Icon */}
        <TouchableOpacity
          onPress={isEditing ? submitEdit : startEditing}
          style={styles.editIcon}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isEditing ? "Submit edit" : "Edit item name"}
          accessibilityHint={isEditing ? "Submits the edited item name" : "Starts editing the item name"}
        >
          <Ionicons
            name={isEditing ? 'checkmark' : 'create-outline'}
            size={20}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ListItem);
