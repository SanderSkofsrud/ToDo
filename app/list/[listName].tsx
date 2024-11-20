// app/list/[listName].tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    NativeSyntheticEvent,
    TextInputSubmitEditingEventData,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams } from 'expo-router';

type Item = {
    id: string;
    text: string;
    completed: boolean;
};

const ListScreen = () => {
    const { listName } = useLocalSearchParams<{ listName: string }>();
    const [items, setItems] = useState<Item[]>([]);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (listName) {
            loadItems();
        }
    }, [listName]);

    const loadItems = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(listName);
            if (jsonValue != null) {
                setItems(JSON.parse(jsonValue));
            } else {
                setItems([]);
            }
        } catch (e) {
            console.error('Error loading items:', e);
        }
    };

    const saveItems = async (newItems: Item[]) => {
        try {
            const jsonValue = JSON.stringify(newItems);
            await AsyncStorage.setItem(listName, jsonValue);
        } catch (e) {
            console.error('Error saving items:', e);
        }
    };

    const addItem = (text: string) => {
        if (text.trim().length === 0) return;
        const newItem = { id: Date.now().toString(), text, completed: false };
        const newItems = [newItem, ...items];
        setItems(newItems);
        saveItems(newItems);
    };

    const handleAddItem = (
        event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
    ) => {
        addItem(event.nativeEvent.text);
        inputRef.current?.clear();
        inputRef.current?.focus();
    };

    const toggleItem = (itemId: string) => {
        const newItems = items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        setItems(newItems);
        saveItems(newItems);
    };

    const renderItem = ({ item }: { item: Item }) => (
        <TouchableOpacity
            onPress={() => toggleItem(item.id)}
            style={styles.itemContainer}
        >
            <Text style={item.completed ? styles.completedItemText : styles.itemText}>
                {item.text}
            </Text>
        </TouchableOpacity>
    );

    // Organize items: uncompleted at the top, completed at the bottom
    const uncompletedItems = items.filter((item) => !item.completed);
    const completedItems = items.filter((item) => item.completed);
    const combinedItems = [...uncompletedItems, ...completedItems];

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: listName || 'List' }} />
            <TextInput
                ref={inputRef}
                placeholder="Add new item"
                onSubmitEditing={handleAddItem}
                style={styles.input}
                autoFocus
                returnKeyType="done"
                blurOnSubmit={false}
            />
            <FlatList
                data={combinedItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
            />
        </View>
    );
};

export default ListScreen;

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 10, paddingHorizontal: 16 },
    input: { borderBottomWidth: 1, marginBottom: 16, padding: 8 },
    itemContainer: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
    },
    itemText: { fontSize: 16 },
    completedItemText: {
        fontSize: 16,
        textDecorationLine: 'line-through',
        color: '#999',
    },
});
