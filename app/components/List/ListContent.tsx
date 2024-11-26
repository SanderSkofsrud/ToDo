import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import ListItem from './ListItem';
import Divider from './Divider';
import { Item } from '../../context/ListContext';
import { useTheme } from '../../context/ThemeContext';
import { FontSizes, Spacing, BorderRadius } from '../../styles/theme';

interface ListContentProps {
  activeListId: string;
  incompleteItems: Item[];
  completedItems: Item[];
  showCompleted: boolean;
  toggleShowCompleted: () => void;
  clearCompletedItems: () => void;
  handleToggleItem: (itemId: string) => void;
  handleUpdateItemName: (itemId: string, newName: string) => void;
  reorderItems: (newOrder: Item[]) => Promise<void>;
}

const ListContent: React.FC<ListContentProps> = ({
                                                   activeListId,
                                                   incompleteItems,
                                                   completedItems,
                                                   showCompleted,
                                                   toggleShowCompleted,
                                                   clearCompletedItems,
                                                   handleToggleItem,
                                                   handleUpdateItemName,
                                                   reorderItems,
                                                 }) => {
  const { theme } = useTheme();

  /**
   * Combines incomplete items, divider, and completed items based on showCompleted state.
   */
  const combinedData = useMemo(() => {
    let data: Item[] = [...incompleteItems];
    const hasCompleted = completedItems.length > 0;

    if (incompleteItems.length > 0 && hasCompleted) {
      data.push({
        id: 'divider',
        text: '',
        completed: false,
      });
    }

    if (showCompleted && hasCompleted) {
      data = data.concat(completedItems);
    }

    return data;
  }, [incompleteItems, completedItems, showCompleted]);

  /**
   * Renders each item in the DraggableFlatList.
   * Handles rendering of the divider.
   * @param param0 - Render item parameters.
   * @returns A ListItem or Divider component.
   */
  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => {
      if (item.id === 'divider') {
        return (
          <Divider
            isExpanded={showCompleted}
            onToggleExpand={toggleShowCompleted}
            onClearCompleted={clearCompletedItems}
            completedCount={completedItems.length}
          />
        );
      }
      return (
        <ListItem
          text={item.text}
          completed={item.completed}
          onPress={() => handleToggleItem(item.id)}
          onLongPress={drag}
          dragging={isActive}
          onDrag={drag}
          onUpdateName={(newName: string) => handleUpdateItemName(item.id, newName)}
        />
      );
    },
    [
      showCompleted,
      completedItems.length,
      handleToggleItem,
      handleUpdateItemName,
      toggleShowCompleted,
      clearCompletedItems
    ]
  );

  /**
   * Handler to end the drag and reorder items.
   */
  const handleDragEnd = useCallback(
    async ({ data }: { data: Item[] }) => {
      const filteredData = data.filter(item => item.id !== 'divider');
      await reorderItems(filteredData);
    },
    [reorderItems]
  );

  /**
   * Key extractor to handle divider
   */
  const keyExtractor = useCallback((item: Item) => item.id, []);

  return (
    <View style={{ flex: 1}}>
      <DraggableFlatList
      data={combinedData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
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
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: Spacing.large,
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
    color: '#888',
    marginBottom: Spacing.medium,
  },
});

export default React.memo(ListContent);
