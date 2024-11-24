// src/screens/ListScreen.tsx

import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  Text,
} from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input, { InputRef } from '../components/Base/Input';
import ListItem from '../components/List/ListItem';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { ListContext, Item, List } from '../context/ListContext';
import { useTheme } from '../context/ThemeContext';
import ListHeader from '../components/List/ListHeader';
import ListTabs from '../components/List/ListTabs';
import ConfirmationDialog from '../components/Base/ConfirmationDialog';
import debounce from 'lodash.debounce';
import { FontSizes, Spacing, BorderRadius } from '../styles/theme';

/**
 * Screen component for displaying and managing multiple lists with tabs.
 * Implements header configuration.
 */
const ListScreen = () => {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const [listName, setListName] = useState('');
  const [activeListId, setActiveListId] = useState<string>(listId);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const addItemInputRef = useRef<InputRef>(null);
  const focusListNameInput = useRef<InputRef>(null); // Corrected ref type
  const router = useRouter();
  const navigation = useNavigation();
  const {
    lists,
    updateListName,
    addItem,
    listData,
    toggleItem,
    reorderItems,
    addList,
    removeList,
  } = useContext(ListContext)!;
  const { theme } = useTheme();

  /**
   * Loads the current list details based on activeListId.
   */
  const loadList = useCallback(async () => {
    try {
      const list = lists.find((l) => l.id === activeListId);
      if (list) {
        setListName(list.name);
        if (list.name === '') {
          // Focus the list name input field if name is empty
          setTimeout(() => {
            focusListNameInput.current?.focus(); // Updated method call
          }, 100);
        }
      } else {
        console.error(`List with id "${activeListId}" not found.`);
        Alert.alert('Error', 'List not found.');
        router.back();
      }
    } catch (e) {
      console.error('Error loading list:', e);
      Alert.alert('Error', 'Failed to load the list.');
    }
  }, [activeListId, lists, router]);

  useEffect(() => {
    if (activeListId) {
      loadList();
    } else {
      console.error('activeListId is undefined');
      Alert.alert('Error', 'Invalid list ID.');
      router.back();
    }
  }, [activeListId, loadList, router]);

  /**
   * Debounced handler to update the list name.
   */
  const debouncedUpdateListName = useMemo(
    () =>
      debounce(async (newName: string) => {
        try {
          await updateListName(activeListId, newName);
        } catch (e) {
          console.error('Error updating list name:', e);
          Alert.alert('Error', 'Failed to update the list name.');
        }
      }, 300),
    [activeListId, updateListName]
  );

  /**
   * Handler to update the list name with debouncing.
   * @param newName - The new name of the list.
   */
  const handleListNameChange = useCallback(
    (newName: string) => {
      setListName(newName);
      debouncedUpdateListName(newName);
    },
    [debouncedUpdateListName]
  );

  /**
   * Handler to finalize the list name update and focus the add item input.
   */
  const handleFinalizeListName = useCallback(() => {
    debouncedUpdateListName.flush();
    addItemInputRef.current?.focus(); // Focus the add item input
  }, [debouncedUpdateListName]);

  /**
   * Handler to finalize the list name update without shifting focus.
   * This is called when the input loses focus without submitting.
   */
  const handleBlurListName = useCallback(() => {
    debouncedUpdateListName.flush();
  }, [debouncedUpdateListName]);

  /**
   * Handler to add a new item to the active list.
   * @param event - The native event containing the text.
   */
  const handleAddItem = useCallback(
    async (event: { nativeEvent: { text: string } }) => {
      const text = event.nativeEvent.text;
      if (text.trim().length === 0) return;
      try {
        await addItem(activeListId, text);
        if (addItemInputRef.current) {
          addItemInputRef.current.clear();
          addItemInputRef.current.focus();
        }
      } catch (e) {
        console.error('Error adding item:', e);
        Alert.alert('Error', 'Failed to add the item.');
      }
    },
    [addItem, activeListId]
  );

  /**
   * Handler to toggle the completion status of an item.
   * @param itemId - The ID of the item to toggle.
   */
  const handleToggleItem = useCallback(
    async (itemId: string) => {
      try {
        await toggleItem(activeListId, itemId);
      } catch (e) {
        console.error('Error toggling item:', e);
        Alert.alert('Error', 'Failed to toggle the item.');
      }
    },
    [toggleItem, activeListId]
  );

  /**
   * Handler to reorder items in the active list.
   * @param data - The reordered items array.
   */
  const handleDragEnd = useCallback(
    async ({ data }: { data: Item[] }) => {
      try {
        await reorderItems(activeListId, data);
      } catch (e) {
        console.error('Error saving reordered items:', e);
        Alert.alert('Error', 'Failed to reorder items.');
      }
    },
    [reorderItems, activeListId]
  );

  /**
   * Renders each item in the DraggableFlatList.
   * @param param0 - Render item parameters.
   * @returns A ListItem component.
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

  /**
   * Handler to add a new list via the tabs.
   */
  const handleAddListTab = useCallback(async () => {
    try {
      const newListId = await addList(''); // Create a list with an empty name
      setActiveListId(newListId);
    } catch (e) {
      console.error('Error adding new list:', e);
      Alert.alert('Error', 'Failed to create a new list.');
    }
  }, [addList]);

  /**
   * Handler when a tab (list) is pressed.
   * @param key - The ID of the selected list.
   */
  const handleTabPress = useCallback((key: string) => {
    setActiveListId(key);
  }, []);

  /**
   * Handler to initiate deletion of a list.
   * @param key - The ID of the list to delete.
   */
  const handleDeleteTab = useCallback((key: string) => {
    if (key === activeListId) {
      Alert.alert('Cannot Delete', 'You cannot delete the active list.');
      return;
    }
    setListToDelete(key);
    setDeleteDialogVisible(true);
  }, [activeListId]);

  /**
   * Handler to confirm deletion.
   */
  const confirmDeleteTab = useCallback(async () => {
    if (!listToDelete) return;
    try {
      await removeList(listToDelete);
      setDeleteDialogVisible(false);
      setListToDelete(null);
      // Optionally, set activeListId to another list
      if (lists.length > 1) {
        const remainingLists = lists.filter((l) => l.id !== listToDelete);
        setActiveListId(remainingLists[0].id);
      }
    } catch (e) {
      console.error('Error deleting list:', e);
      Alert.alert('Error', 'Failed to delete the list.');
    }
  }, [listToDelete, removeList, lists]);

  /**
   * Handler to cancel deletion.
   */
  const cancelDeleteTab = useCallback(() => {
    setDeleteDialogVisible(false);
    setListToDelete(null);
  }, []);

  // Get all tabs from the lists context
  const tabs = useMemo(
    () =>
      lists.map((list: List) => ({
        label: list.name || 'Unnamed',
        key: list.id,
      })),
    [lists]
  );

  /**
   * Generates styles based on the current theme.
   * @param theme - The current theme object.
   * @returns A StyleSheet object.
   */
  const getStyles = (theme: any) =>
    StyleSheet.create({
      container: {
        flex: 1,
        paddingTop: Spacing.large,
        paddingHorizontal: Spacing.medium,
        backgroundColor: theme.background,
      },
      headerLeftIcon: {
        padding: 8, // Increase touchable area
        zIndex: 10, // Ensure it's on top
      },
      tabsContainer: {
        marginTop: Spacing.small,
        // Removed any border or padding that might introduce space
      },
      // Removed the divider style as it's no longer needed
      // divider: {
      //   height: 1,
      //   backgroundColor: theme.gray[700],
      // },
      listNameContainer: {
        marginBottom: Spacing.medium,
      },
      listNameInput: {
        fontSize: FontSizes.xlarge, // Increased text size
        color: theme.text,
        borderWidth: 0, // Ensure no border
        paddingVertical: Spacing.medium, // Increased height
        paddingHorizontal: Spacing.medium,
        backgroundColor: theme.activeTabBackground, // Matches active tab background
        borderBottomLeftRadius: BorderRadius.medium,
        borderBottomRightRadius: BorderRadius.medium,
      },
      flatListContent: {
        paddingBottom: Spacing.large, // Adjusted padding
        paddingTop: 20,
      },
      emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.large,
      },
      emptyText: {
        fontSize: FontSizes.large,
        color: theme.text,
        marginBottom: Spacing.medium,
      },
      emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.primary,
        paddingVertical: Spacing.small,
        paddingHorizontal: Spacing.medium,
        borderRadius: BorderRadius.medium,
      },
      emptyButtonText: {
        color: theme.text,
        fontSize: FontSizes.medium,
        marginLeft: Spacing.small,
      },
    });

  const styles = useMemo(() => getStyles(theme), [theme]);

  /**
   * Configures the header using useLayoutEffect.
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <ListHeader onBackPress={() => router.back()} />
      ),
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
    });
  }, [
    navigation,
    router,
    theme,
    styles.headerLeftIcon,
  ]);

  /**
   * Get items for the active list
   * Sort them so that incomplete items come first, followed by completed items.
   * Maintain original order within each group.
   */
  const currentItems = useMemo(() => {
    const items = listData[activeListId] || [];
    return items.slice().sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  }, [listData, activeListId]);

  /**
   * Handle the case when there are no lists.
   */
  if (lists.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No lists available.</Text>
        <TouchableOpacity
          onPress={handleAddListTab}
          style={styles.emptyButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Add new list"
          accessibilityHint="Creates a new list"
        >
          <Ionicons name="add" size={20} color={theme.text} />
          <Text style={styles.emptyButtonText}>Add a new list</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs Component */}
      <View style={styles.tabsContainer}>
        <ListTabs
          tabs={tabs}
          activeTab={activeListId}
          onTabPress={handleTabPress}
          onAddTab={handleAddListTab}
          onDeleteTab={handleDeleteTab}
        />
        {/* Removed the divider to eliminate space and border */}
        {/* <View style={styles.divider} /> */}
      </View>

      {/* Editable List Name */}
      <View style={styles.listNameContainer}>
        <Input
          value={listName}
          onChangeText={handleListNameChange}
          onSubmitEditing={handleFinalizeListName}
          onBlur={handleBlurListName}
          placeholder="List Name"
          placeholderTextColor={theme.gray[400]}
          style={styles.listNameInput}
          accessible={true}
          accessibilityLabel="List Name Input"
          accessibilityHint="Enter the name of the list"
          ref={focusListNameInput} // Correctly typed ref
          blurOnSubmit={false} // Prevent automatic blur on submit
        />
      </View>

      {/* Add Item Input */}
      <Input
        ref={addItemInputRef} // Assigning ref to Add Item Input
        placeholder="Add new item"
        onSubmitEditing={handleAddItem}
        returnKeyType="done"
        blurOnSubmit={false}
        accessible={true}
        accessibilityLabel="Add new item input"
        accessibilityHint="Enter text to add a new item to the list"
      />

      {/* Draggable FlatList with Active List Items */}
      <DraggableFlatList
        data={currentItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onDragEnd={handleDragEnd}
        activationDistance={10}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items in this list.</Text>
          </View>
        }
        accessible={true}
        accessibilityLabel="List items"
        accessibilityHint="Displays the items of the active list"
      />

      {/* Confirmation Dialog for Deletion */}
      <ConfirmationDialog
        visible={isDeleteDialogVisible}
        title="Confirm Deletion"
        message="Are you sure you want to delete this list?"
        onConfirm={confirmDeleteTab}
        onCancel={cancelDeleteTab}
      />
    </View>
  );
};

export default ListScreen;
