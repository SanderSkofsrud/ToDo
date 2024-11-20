// app/list/[listId].tsx

import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, TextInput, Alert } from 'react-native';
import Input, { InputRef } from '../../app/components/Input'; // Import InputRef
import ListItem from '../../app/components/ListItem';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ListContext, Item } from '@/app/context/ListContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListScreen = () => {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const [listName, setListName] = useState('');
  const inputRef = useRef<InputRef>(null); // Update ref type to InputRef
  const router = useRouter();
  const { lists, updateListName, addItem, loadLists, loadListItems, listData } = useContext(ListContext)!;

  useEffect(() => {
    if (listId) {
      loadList();
    } else {
      console.error('listId is undefined');
      Alert.alert('Error', 'Invalid list ID.');
      router.back();
    }
  }, [listId]);

  const loadList = async () => {
    try {
      const list = lists.find((l) => l.id === listId);
      if (list) {
        setListName(list.name);
      } else {
        console.error(`List with id ${listId} not found.`);
        Alert.alert('Error', 'List not found.');
        router.back();
      }
    } catch (e) {
      console.error('Error loading list:', e);
    }
  };

  const handleListNameChange = async (newName: string) => {
    setListName(newName);
    await updateListName(listId, newName);
    await loadLists();
    await loadListItems();
  };

  const handleAddItem = async (event: { nativeEvent: { text: string } }) => {
    const text = event.nativeEvent.text;
    if (text.trim().length === 0) return;
    await addItem(listId, text);
    // Clear the input field and refocus
    if (inputRef.current) {
      inputRef.current.clear();
      inputRef.current.focus();
    }
  };

  const toggleItem = async (itemId: string) => {
    const currentItems = listData[listId] || [];
    const newItems = currentItems.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    try {
      await AsyncStorage.setItem(listId, JSON.stringify(newItems));
      await loadListItems();
    } catch (e) {
      console.error('Error saving items:', e);
    }
  };

  const handleDragEnd = async ({ data }: { data: Item[] }) => {
    try {
      await AsyncStorage.setItem(listId, JSON.stringify(data));
      await loadListItems();
    } catch (e) {
      console.error('Error saving reordered items:', e);
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => (
    <ListItem
      text={item.text}
      completed={item.completed}
      onPress={() => toggleItem(item.id)} // Toggle completion on press
      onLongPress={drag}
      dragging={isActive}
    />
  );

  const currentItems = listData[listId] || [];
  const uncompletedItems = currentItems.filter((item) => !item.completed);
  const completedItems = currentItems.filter((item) => item.completed);
  const combinedItems = [...uncompletedItems, ...completedItems];

  return (
    <View className="flex-1 pt-12 px-4 bg-black">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <TextInput
              value={listName}
              onChangeText={handleListNameChange}
              placeholder="List Name"
              placeholderTextColor="#A6A6A6"
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                width: '100%',
                paddingVertical: 4,
              }}
            />
          ),
          headerTintColor: 'white',
          headerStyle: { backgroundColor: 'black' },
          headerLeft: () => (
            <Ionicons
              name="arrow-back"
              size={24}
              color="white"
              onPress={() => router.back()}
              style={{ marginLeft: 16 }}
            />
          ),
        }}
      />
      <Input
        ref={inputRef} // Pass the ref correctly
        placeholder="Legg til nytt element"
        onSubmitEditing={handleAddItem}
        autoFocus
        returnKeyType="done"
        blurOnSubmit={false}
      />
      <DraggableFlatList
        data={combinedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onDragEnd={handleDragEnd}
        activationDistance={10}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />
    </View>
  );
};

export default ListScreen;
