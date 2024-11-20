// app/index.tsx

import React, { useContext, useEffect, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from './components/SearchBar';
import { ListContext, List } from '@/app/context/ListContext';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const { lists, listData, addList, removeList, loadLists, loadListItems } = useContext(ListContext)!;
  const [searchText, setSearchText] = React.useState('');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadLists();
      loadListItems();
    }, [loadLists, loadListItems])
  );

  const filterLists = () => {
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
  };

  const filteredLists = filterLists();

  const handleAddList = async () => {
    try {
      const newListId = await addList();
      router.push(`/list/${newListId}`);
    } catch (e) {
      console.error('Error adding list:', e);
    }
  };

  const confirmDeleteList = (listId: string, listName: string) => {
    Alert.alert(
      'Bekreft sletting',
      `Er du sikker på at du vil slette listen "${listName}"?`,
      [
        {
          text: 'Avbryt',
          style: 'cancel',
        },
        {
          text: 'Slett',
          style: 'destructive',
          onPress: () => handleDeleteList(listId),
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await removeList(listId);
      // Optionally, show a success message
      Alert.alert('Suksess', 'Listen ble slettet.');
    } catch (e) {
      console.error('Error deleting list:', e);
      Alert.alert('Feil', 'Noe gikk galt under sletting av listen.');
    }
  };

  const renderCard = ({ item }: { item: List }) => {
    const items = listData[item.id] || [];
    const uncompletedItems = items.filter((i) => !i.completed);

    return (
      <TouchableOpacity
        onPress={() => router.push(`/list/${item.id}`)}
        onLongPress={() => confirmDeleteList(item.id, item.name || 'Uten navn')}
        className="p-4 rounded-2xl"
        style={{
          width: '48%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: '#4A4A4A',
          borderWidth: 1,
          marginBottom: 16,
        }}
      >
        <Text className="text-white text-xl font-semibold mb-2">
          {item.name || 'Uten navn'}
        </Text>
        {uncompletedItems.slice(0, 5).map((listItem) => (
          <Text key={listItem.id} className="text-gray-300 text-base">
            • {listItem.text}
          </Text>
        ))}
        {uncompletedItems.length > 5 && (
          <Text className="text-gray-500 text-sm mt-1">+ flere elementer...</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
      <View className="flex-1">
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <FlatList
          data={filteredLists}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{
            paddingBottom: 100,
            paddingTop: 20,
            paddingHorizontal: 16,
          }}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
        />
        <TouchableOpacity
          onPress={handleAddList}
          style={{
            position: 'absolute',
            bottom: 32,
            right: 32,
            backgroundColor: '#2563EB',
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
