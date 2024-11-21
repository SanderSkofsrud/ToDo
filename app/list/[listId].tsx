// app/list/[listId].tsx
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from 'react';
import { View, Alert, StyleSheet, Keyboard } from 'react-native';
import Input, { InputRef } from '../components/Base/Input';
import ListItem from '../components/List/ListItem';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ListContext, Item } from '../context/ListContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../styles/theme';
import { Pressable, Text } from 'react-native';
import ListHeader from '../components/List/ListHeader';
import debounce from 'lodash.debounce'; // Import debounce

const ListScreen = () => {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const [listName, setListName] = useState('');
  const addItemInputRef = useRef<InputRef>(null); // Ref for "Add New Element" input
  const focusListNameInput = useRef<(() => void) | null>(null); // Callback ref for ListHeader's input
  const router = useRouter();
  const {
    lists,
    updateListName,
    addItem,
    loadLists,
    loadListItems,
    listData,
    toggleItem,
    reorderItems,
  } = useContext(ListContext)!;

  /**
   * Load the current list details based on listId.
   */
  const loadList = useCallback(async () => {
    try {
      const list = lists.find((l) => l.id === listId);
      if (list) {
        setListName(list.name);
        if (list.name === '') {
          // If name is empty, focus the list name input field
          setTimeout(() => {
            if (focusListNameInput.current) {
              focusListNameInput.current();
            }
          }, 100); // Slight delay to ensure the component is mounted
        }
      } else {
        console.error(`List with id "${listId}" not found.`);
        Alert.alert('Error', 'List not found.');
        router.back();
      }
    } catch (e) {
      console.error('Error loading list:', e);
      Alert.alert('Error', 'Failed to load the list.');
    }
  }, [listId, lists, router]);

  /**
   * useEffect hook to load the list when the component mounts or listId changes.
   */
  useEffect(() => {
    if (listId) {
      loadList();
    } else {
      console.error('listId is undefined');
      Alert.alert('Error', 'Invalid list ID.');
      router.back();
    }
  }, [listId, loadList]);

  /**
   * Debounced handler to update the list name.
   */
  const debouncedUpdateListName = useCallback(
    debounce(async (newName: string) => {
      try {
        await updateListName(listId, newName);
        // Removed loadLists and loadListItems to prevent excessive re-renders
      } catch (e) {
        console.error('Error updating list name:', e);
        Alert.alert('Error', 'Failed to update the list name.');
      }
    }, 300), // 300ms debounce
    [listId, updateListName]
  );

  /**
   * Handler to update the list name with debouncing.
   */
  const handleListNameChange = useCallback(
    (newName: string) => {
      setListName(newName);
      debouncedUpdateListName(newName);
    },
    [debouncedUpdateListName]
  );

  /**
   * Handler to finalize the list name update.
   */
  const handleFinalizeListName = useCallback(() => {
    // Flush any pending debounced updates
    debouncedUpdateListName.flush();
  }, [debouncedUpdateListName]);

  /**
   * Handler to add a new item to the list.
   */
  const handleAddItem = useCallback(
    async (event: { nativeEvent: { text: string } }) => {
      const text = event.nativeEvent.text;
      if (text.trim().length === 0) return;
      try {
        await addItem(listId, text);
        // Clear the input field and refocus
        if (addItemInputRef.current) {
          addItemInputRef.current.clear();
          addItemInputRef.current.focus();
        }
      } catch (e) {
        console.error('Error adding item:', e);
        Alert.alert('Error', 'Failed to add the item.');
      }
    },
    [addItem, listId]
  );

  /**
   * Handler to toggle the completion status of an item.
   */
  const handleToggleItem = useCallback(
    async (itemId: string) => {
      try {
        await toggleItem(listId, itemId);
      } catch (e) {
        console.error('Error toggling item:', e);
        Alert.alert('Error', 'Failed to toggle the item.');
      }
    },
    [toggleItem, listId]
  );

  /**
   * Handler to reorder items in the list.
   */
  const handleDragEnd = useCallback(
    async ({ data }: { data: Item[] }) => {
      try {
        await reorderItems(listId, data);
      } catch (e) {
        console.error('Error saving reordered items:', e);
        Alert.alert('Error', 'Failed to reorder items.');
      }
    },
    [reorderItems, listId]
  );

  /**
   * Renders each item in the DraggableFlatList.
   */
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => (
      <ListItem
        text={item.text}
        completed={item.completed}
        onPress={() => handleToggleItem(item.id)}
        onLongPress={drag}
        dragging={isActive}
      />
    ),
    [handleToggleItem]
  );

  // Separate uncompleted and completed items
  const currentItems = listData[listId] || [];
  const uncompletedItems = currentItems.filter((item) => !item.completed);
  const completedItems = currentItems.filter((item) => item.completed);
  const combinedItems = [...uncompletedItems, ...completedItems];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <ListHeader
              listName={listName}
              onChangeName={handleListNameChange}
              onSubmit={handleFinalizeListName}
              focusRef={(focus: () => void) => {
                focusListNameInput.current = focus;
              }}
            />
          ),
          headerTintColor: Colors.text,
          headerStyle: styles.headerStyle,
          headerLeft: () => (
            <Pressable
              onPress={() => {
                Keyboard.dismiss(); // Dismiss keyboard if open
                router.back();
              }}
              style={styles.headerLeftIcon}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </Pressable>
          ),
        }}
      />
      <Input
        ref={addItemInputRef} // Ref for "Add New Element" input
        placeholder="Legg til nytt element"
        onSubmitEditing={handleAddItem}
        returnKeyType="done"
        blurOnSubmit={false} // Keeps keyboard open
      />
      <DraggableFlatList
        data={combinedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onDragEnd={handleDragEnd}
        activationDistance={10}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.large,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.background,
  },
  headerStyle: {
    backgroundColor: Colors.background,
  },
  headerLeftIcon: {
    marginLeft: Spacing.medium,
    padding: 12,
  },
  flatListContent: {
    paddingBottom: 100,
    paddingTop: 20,
  },
});

export default ListScreen;
