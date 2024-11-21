import React, { useContext, useCallback, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/Home/SearchBar';
import { ListContext, List } from '../context/ListContext';
import { FontSizes, Spacing, BorderRadius } from '../styles/theme';
import ConfirmationDialog from '../components/Base/ConfirmationDialog';
import { useTheme } from '../context/ThemeContext';

/**
 * Home screen component displaying all lists with search and add functionality.
 * @returns A React functional component.
 */
const HomeScreen = () => {
  const {
    lists,
    listData,
    addList,
    removeList,
  } = useContext(ListContext)!;
  const [searchText, setSearchText] = useState('');
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const router = useRouter();
  const { theme, toggleTheme, colorScheme } = useTheme();

  /**
   * Filters the lists based on the search text.
   * @returns An array of filtered lists.
   */
  const filterLists = useCallback(() => {
    if (searchText.trim() === '') {
      return lists;
    }
    const lowerSearchText = searchText.toLowerCase();
    return lists.filter((list: List) => {
      const lowerListName = (list.name || '').toLowerCase();
      const items = listData[list.id] || [];
      const itemMatch = items.some((item) =>
        item.text.toLowerCase().includes(lowerSearchText)
      );
      return lowerListName.includes(lowerSearchText) || itemMatch;
    });
  }, [searchText, lists, listData]);

  const filteredLists = filterLists();

  /**
   * Handles adding a new list and navigating to it.
   */
  const handleAddList = useCallback(async () => {
    try {
      const newListId = await addList(''); // Create list with empty name
      router.push(`/list/${newListId}`);
    } catch (e) {
      console.error('Error adding list:', e);
      Alert.alert('Error', 'Something went wrong while creating the list.');
    }
  }, [addList, router]);

  /**
   * Opens the confirmation dialog for deleting a list.
   * @param list - The list to be deleted.
   */
  const confirmDeleteList = useCallback((list: List) => {
    setSelectedList(list);
    setDialogVisible(true);
  }, []);

  /**
   * Handles the actual deletion after confirmation.
   */
  const handleDeleteList = useCallback(async () => {
    if (!selectedList) return;
    try {
      await removeList(selectedList.id);
      Alert.alert('Success', 'The list has been deleted.');
    } catch (e) {
      console.error('Error deleting list:', e);
      Alert.alert('Error', 'Something went wrong while deleting the list.');
    } finally {
      setDialogVisible(false);
      setSelectedList(null);
    }
  }, [removeList, selectedList]);

  /**
   * Cancels the deletion process.
   */
  const handleCancelDelete = useCallback(() => {
    setDialogVisible(false);
    setSelectedList(null);
  }, []);

  /**
   * Renders each list card in the FlatList.
   * @param param0 - The list item.
   * @returns A TouchableOpacity representing the list card.
   */
  const renderCard = useCallback(
    ({ item }: { item: List }) => {
      const items = listData[item.id] || [];
      const uncompletedItems = items.filter((i) => !i.completed);

      return (
        <TouchableOpacity
          onPress={() => router.push(`/list/${item.id}`)}
          onLongPress={() => confirmDeleteList(item)}
          style={getStyles(theme).card}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`List: ${item.name || 'Unnamed'}`}
          accessibilityHint="Tap to open the list, long press to delete"
        >
          <Text style={getStyles(theme).cardTitle}>
            {item.name || 'Unnamed'}
          </Text>
          {uncompletedItems.slice(0, 5).map((listItem) => (
            <Text key={listItem.id} style={getStyles(theme).cardItemText}>
              • {listItem.text}
            </Text>
          ))}
          {uncompletedItems.length > 5 && (
            <Text style={getStyles(theme).cardMoreText}>+ more items...</Text>
          )}
        </TouchableOpacity>
      );
    },
    [confirmDeleteList, listData, router, theme]
  );

  /**
   * Generates styles based on the current theme.
   * @param theme - The current theme object.
   * @returns A StyleSheet object.
   */
  const getStyles = (theme: any) =>
    StyleSheet.create({
      card: {
        padding: Spacing.medium,
        borderRadius: BorderRadius.xlarge,
        width: '48%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: theme.gray[700],
        borderWidth: 3,
        marginBottom: Spacing.medium,
      },
      cardTitle: {
        color: theme.text,
        fontSize: FontSizes.xlarge,
        fontWeight: 'bold',
        marginBottom: Spacing.small,
      },
      cardItemText: {
        color: theme.gray[300],
        fontSize: FontSizes.medium,
      },
      cardMoreText: {
        color: theme.gray[500],
        fontSize: FontSizes.small,
        marginTop: Spacing.small,
      },
      floatingButton: {
        position: 'absolute',
        bottom: Spacing.large,
        right: Spacing.large,
        backgroundColor: theme.primary,
        width: 64,
        height: 64,
        borderRadius: BorderRadius.large,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      },
      toggleThemeButton: {
        position: 'absolute',
        top: Spacing.large,
        right: Spacing.large,
        backgroundColor: theme.primary,
        width: 48,
        height: 48,
        borderRadius: BorderRadius.large,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      },
      container: {
        flex: 1,
        position: 'relative',
        paddingHorizontal: Spacing.medium,
        paddingTop: Spacing.large,
        backgroundColor: theme.background,
      },
      flatListContent: {
        paddingBottom: 100,
        paddingTop: 20,
      },
      columnWrapper: {
        justifyContent: 'space-between',
      },
      safeArea: {
        flex: 1,
        backgroundColor: theme.background,
      },
    });

  return (
    <SafeAreaView style={getStyles(theme).safeArea}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <View style={getStyles(theme).container}>
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <FlatList
          data={filteredLists}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={getStyles(theme).flatListContent}
          columnWrapperStyle={getStyles(theme).columnWrapper}
        />
        <TouchableOpacity
          onPress={handleAddList}
          style={getStyles(theme).floatingButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Add new list"
          accessibilityHint="Creates a new list"
        >
          <Ionicons name="add" size={32} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleTheme}
          style={getStyles(theme).toggleThemeButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Toggle theme"
          accessibilityHint="Switches between light and dark mode"
        >
          <Ionicons
            name={colorScheme === 'dark' ? 'sunny' : 'moon'}
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
        <ConfirmationDialog
          visible={isDialogVisible}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the list "${selectedList?.name || 'Unnamed'}"?`}
          onConfirm={handleDeleteList}
          onCancel={handleCancelDelete}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
