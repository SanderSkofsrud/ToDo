// app/screens/HomeScreen.tsx
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
import { Colors, FontSizes, Spacing, BorderRadius } from '../styles/theme';
import ConfirmationDialog from '../components/Base/ConfirmationDialog'; // Updated import

const HomeScreen = () => {
  const {
    lists,
    listData,
    addList,
    removeList,
    loadLists,
    loadListItems,
  } = useContext(ListContext)!;
  const [searchText, setSearchText] = useState('');
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const router = useRouter();

  /**
   * Filters the lists based on the search text.
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
   * Handles adding a new list with an empty name and navigates to it.
   */
  const handleAddList = useCallback(async () => {
    try {
      const newListId = await addList(''); // Create list with empty name
      router.push(`/list/${newListId}`);
    } catch (e) {
      console.error('Error adding list:', e);
      Alert.alert('Feil', 'Noe gikk galt under opprettelse av listen.');
    }
  }, [addList, router]);

  /**
   * Opens the confirmation dialog for deleting a list.
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
      Alert.alert('Suksess', 'Listen ble slettet.');
    } catch (e) {
      console.error('Error deleting list:', e);
      Alert.alert('Feil', 'Noe gikk galt under sletting av listen.');
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
   */
  const renderCard = useCallback(
    ({ item }: { item: List }) => {
      const items = listData[item.id] || [];
      const uncompletedItems = items.filter((i) => !i.completed);

      return (
        <TouchableOpacity
          onPress={() => router.push(`/list/${item.id}`)}
          onLongPress={() => confirmDeleteList(item)}
          style={styles.card}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Liste: ${item.name || 'Uten navn'}`}
          accessibilityHint="Trykk for å åpne listen, hold nede for å slette"
        >
          <Text style={styles.cardTitle}>
            {item.name || 'Uten navn'}
          </Text>
          {uncompletedItems.slice(0, 5).map((listItem) => (
            <Text key={listItem.id} style={styles.cardItemText}>
              • {listItem.text}
            </Text>
          ))}
          {uncompletedItems.length > 5 && (
            <Text style={styles.cardMoreText}>+ flere elementer...</Text>
          )}
        </TouchableOpacity>
      );
    },
    [confirmDeleteList, listData, router]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <FlatList
          data={filteredLists}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.columnWrapper}
        />
        <TouchableOpacity
          onPress={handleAddList}
          style={styles.floatingButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Legg til ny liste"
          accessibilityHint="Oppretter en ny liste"
        >
          <Ionicons name="add" size={32} color={Colors.text} />
        </TouchableOpacity>
        <ConfirmationDialog
          visible={isDialogVisible}
          title="Bekreft Sletting"
          message={`Er du sikker på at du vil slette listen "${selectedList?.name || 'Uten navn'}"?`}
          onConfirm={handleDeleteList}
          onCancel={handleCancelDelete}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.large,
    backgroundColor: Colors.background,
  },
  flatListContent: {
    paddingBottom: 100,
    paddingTop: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.xlarge,
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: Colors.gray[700],
    borderWidth: 3,
    marginBottom: Spacing.medium,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: FontSizes.xlarge,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
  },
  cardItemText: {
    color: Colors.gray[300],
    fontSize: FontSizes.medium,
  },
  cardMoreText: {
    color: Colors.gray[500],
    fontSize: FontSizes.small,
    marginTop: Spacing.small,
  },
  floatingButton: {
    position: 'absolute',
    bottom: Spacing.large,
    right: Spacing.large,
    backgroundColor: Colors.primary,
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
});

export default HomeScreen;
