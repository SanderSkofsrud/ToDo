// src/screens/HomeScreen.tsx

import React, { useContext, useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
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
import StaggeredList from '@mindinventory/react-native-stagger-view'; // Import the library

const { width } = Dimensions.get('window');
const CARD_MARGIN = Spacing.small;
const NUM_COLUMNS = 2; // Number of columns in the grid

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
   * Generates styles based on the current theme.
   * @param theme - The current theme object.
   * @returns A StyleSheet object.
   */
  const getStyles = (theme: any) =>
    StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: theme.background,
      },
      container: {
        flex: 1,
        paddingHorizontal: Spacing.medium,
        paddingTop: Spacing.large,
        backgroundColor: theme.background,
      },
      card: {
        padding: Spacing.medium,
        borderRadius: BorderRadius.xlarge,
        borderColor: theme.gray[700],
        borderWidth: 3,
        backgroundColor: theme.activeTabBackground,
        margin: CARD_MARGIN / 2, // Adjusted margin for grid spacing
        // Optional: Add shadow or elevation for better visual
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      },
      cardTitle: {
        color: theme.text,
        fontSize: FontSizes.xlarge,
        fontWeight: 'bold',
        marginBottom: Spacing.small,
        // Ensure the text doesn't wrap by setting flex properties
        flexShrink: 1,
      },
      cardItemText: {
        color: theme.gray[300],
        fontSize: FontSizes.medium,
      },
      cardMoreText: {
        color: theme.gray[400],
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
      activityIndicatorWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      img: {
        width: '100%',
        height: '100%',
        borderRadius: BorderRadius.medium,
      },
      avatarImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    });

  const styles = useMemo(() => getStyles(theme), [theme]);

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

  const filteredLists = useMemo(() => filterLists(), [filterLists]);

  /**
   * Handles adding a new list and navigating to it.
   */
  const handleAddList = useCallback(async () => {
    try {
      const newListId = await addList(''); // Create list with empty name
      router.push(`/screens/list/${newListId}`);
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
   * Renders each list card.
   * @param list - The list to render.
   * @returns A JSX element representing the list card.
   */
  const renderCard = useCallback(
    (list: List) => {
      const items = listData[list.id] || [];
      const uncompletedItems = items.filter((i) => !i.completed);
      const remainingItemsCount = uncompletedItems.length - 5;

      return (
        <TouchableOpacity
          key={list.id}
          onPress={() => router.push(`/screens/list/${list.id}`)}
          onLongPress={() => confirmDeleteList(list)}
          style={styles.card} // Removed dynamic height
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`List: ${list.name || 'Unnamed'}`}
          accessibilityHint="Tap to open the list, long press to delete"
        >
          <Text
            style={styles.cardTitle}
            numberOfLines={1} // Ensures the text is limited to one line
            ellipsizeMode="tail" // Adds '...' at the end if the text is too long
          >
            {list.name || 'Unnamed'}
          </Text>
          {uncompletedItems.slice(0, 5).map((listItem) => (
            <Text key={listItem.id} style={styles.cardItemText}>
              {listItem.text}
            </Text>
          ))}
          {remainingItemsCount > 0 && (
            <Text style={styles.cardMoreText}>
              + {remainingItemsCount} more item{remainingItemsCount > 1 ? 's' : ''}
            </Text>
          )}
        </TouchableOpacity>
      );
    },
    [confirmDeleteList, listData, router, styles.card, styles.cardItemText, styles.cardMoreText, styles.cardTitle]
  );


  /**
   * Renders each item in the StaggeredList.
   * @param param0 - The item data.
   * @returns A JSX element representing the list card.
   */
  const renderItem = useCallback(
    ({ item }: { item: List }) => renderCard(item),
    [renderCard]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.container}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          style={{ marginBottom: Spacing.medium }}
        >
          <TouchableOpacity
            onPress={toggleTheme}
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
        </SearchBar>

        {filteredLists.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No lists available</Text>
          </View>
        ) : (
          <StaggeredList
            data={filteredLists}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            animationType={'FADE_IN_FAST'}
            contentContainerStyle={{ paddingBottom: Spacing.large }}
            LoadingView={
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator color={'black'} size={'large'} />
              </View>
            }
            containerStyle={{ flex: 1 }}
            numColumns={NUM_COLUMNS}
          />
        )}

        <TouchableOpacity
          onPress={handleAddList}
          style={styles.floatingButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Add new list"
          accessibilityHint="Creates a new list"
        >
          <Ionicons name="add" size={32} color={"#FFFFFF"} />
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
