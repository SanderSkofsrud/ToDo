import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input, { InputRef } from '../../components/Base/Input';
import ListContent from '../../components/List/ListContent';
import { Item, List, ListContext } from '../../context/ListContext';
import { useTheme } from '../../context/ThemeContext';
import ListHeader from '../../components/List/ListHeader';
import ListTabs from '../../components/List/ListTabs';
import ConfirmationDialog from '../../components/Base/ConfirmationDialog';
import debounce from 'lodash.debounce';
import { BorderRadius, FontSizes, Spacing } from '../../styles/theme';

/**
 * Screen component for displaying and managing a specific list.
 */
const ListScreen = () => {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const [listName, setListName] = useState('');
  const [activeListId, setActiveListId] = useState<string>(listId);
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [isClearCompletedDialogVisible, setClearCompletedDialogVisible] = useState<boolean>(false);
  const addItemInputRef = useRef<InputRef>(null);
  const focusListNameInput = useRef<InputRef>(null);
  const router = useRouter();
  const navigation = useNavigation();
  const {
    lists,
    updateListName,
    addItem,
    listData,
    toggleItem,
    updateItemName,
    reorderItems,
    addList,
    removeList,
  } = useContext(ListContext)!;
  const { theme } = useTheme();

  /**
   * State to manage the visibility of completed items.
   */
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

  /**
   * Loads the current list details based on activeListId.
   */
  const loadList = useCallback(async () => {
    try {
      const list = lists.find((l) => l.id === activeListId);
      if (list) {
        setListName(list.name);
        if (list.name === '') {
          setTimeout(() => {
            focusListNameInput.current?.focus();
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
    addItemInputRef.current?.focus();
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
        Vibration.vibrate(30);
      } catch (e) {
        console.error('Error toggling item:', e);
        Alert.alert('Error', 'Failed to toggle the item.');
      }
    },
    [toggleItem, activeListId]
  );

  /**
   * Handler to update the name of an item.
   * @param itemId - The ID of the item.
   * @param newName - The new name for the item.
   */
  const handleUpdateItemName = useCallback(
    async (itemId: string, newName: string) => {
      try {
        await updateItemName(activeListId, itemId, newName);
      } catch (e) {
        console.error('Error updating item name:', e);
        Alert.alert('Error', 'Failed to update the item name.');
      }
    },
    [updateItemName, activeListId]
  );

  /**
   * Handler to add a new list via the tabs.
   */
  const handleAddListTab = useCallback(async () => {
    try {
      const newListId = await addList('');
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

  const tabs = useMemo(
    () =>
      lists.map((list: List) => ({
        label: list.name || 'Unnamed',
        key: list.id,
      })),
    [lists]
  );

  /**
   * Handler to clear all completed items.
   */
  const clearCompletedItems = useCallback(() => {
    setClearCompletedDialogVisible(true);
  }, []);

  /**
   * Handler to confirm clearing completed items.
   */
  const confirmClearCompletedItems = useCallback(async () => {
    try {
      const currentItems = listData[activeListId] || [];
      const filteredItems = currentItems.filter((item) => !item.completed);
      await reorderItems(activeListId, filteredItems);
      setClearCompletedDialogVisible(false);
    } catch (e) {
      console.error('Error clearing completed items:', e);
      Alert.alert('Error', 'Failed to clear completed items.');
    }
  }, [listData, activeListId, reorderItems]);

  /**
   * Handler to cancel clearing completed items.
   */
  const cancelClearCompletedItems = useCallback(() => {
    setClearCompletedDialogVisible(false);
  }, []);

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
      tabsContainer: {
        marginTop: Spacing.small,
      },
      listNameContainer: {
        marginBottom: Spacing.medium,
      },
      listNameInput: {
        fontSize: FontSizes.xlarge,
        color: theme.text,
        borderWidth: 0,
        paddingVertical: Spacing.medium,
        paddingHorizontal: Spacing.medium,
        backgroundColor: theme.activeTabBackground,
        borderBottomLeftRadius: BorderRadius.medium,
        borderBottomRightRadius: BorderRadius.medium,
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
  ]);

  /**
   * Separate incomplete and completed items.
   */
  const incompleteItems = useMemo(() => {
    const items = listData[activeListId] || [];
    return items.filter((item) => !item.completed);
  }, [listData, activeListId]);

  const completedItems = useMemo(() => {
    const items = listData[activeListId] || [];
    return items.filter((item) => item.completed);
  }, [listData, activeListId]);

  /**
   * Determine if the divider should be shown.
   * Only show if there are both incompleted and completed items.
   */
  const showDivider = useMemo(() => incompleteItems.length > 0 && completedItems.length > 0, [incompleteItems, completedItems]);

  /**
   * Handler to toggle the visibility of completed items.
   */
  const toggleShowCompleted = useCallback(() => {
    setShowCompleted((prev) => !prev);
  }, []);

  /**
   * Define a handler for reorderItems that matches the expected signature.
   */
  const handleReorderItems = useCallback(
    async (newOrder: Item[]) => {
      try {
        await reorderItems(activeListId, newOrder);
      } catch (e) {
        console.error('Error reordering items:', e);
        Alert.alert('Error', 'Failed to reorder items.');
      }
    },
    [reorderItems, activeListId]
  );

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
          ref={focusListNameInput}
          blurOnSubmit={false}
        />
      </View>

      {/* Add Item Input */}
      <Input
        ref={addItemInputRef}
        placeholder="Add new item"
        onSubmitEditing={handleAddItem}
        returnKeyType="done"
        blurOnSubmit={false}
        accessible={true}
        accessibilityLabel="Add new item input"
        accessibilityHint="Enter text to add a new item to the list"
      />

      {/* List Content */}
      <ListContent
        activeListId={activeListId}
        incompleteItems={incompleteItems}
        completedItems={completedItems}
        showCompleted={showCompleted}
        toggleShowCompleted={toggleShowCompleted}
        clearCompletedItems={clearCompletedItems}
        handleToggleItem={handleToggleItem}
        handleUpdateItemName={handleUpdateItemName}
        reorderItems={handleReorderItems}
      />

      {/* Confirmation Dialog for Clearing Completed Items */}
      <ConfirmationDialog
        visible={isClearCompletedDialogVisible}
        title="Confirm Clear"
        message="Are you sure you want to delete all completed items?"
        onConfirm={confirmClearCompletedItems}
        onCancel={cancelClearCompletedItems}
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
