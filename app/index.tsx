// app/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import NewListModal from '../app/components/NewListModal';

const ListOverviewScreen = () => {
    const [lists, setLists] = useState<string[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
    const router = useRouter();

    const loadLists = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('lists');
            if (jsonValue != null) {
                setLists(JSON.parse(jsonValue));
            } else {
                // Initialize with a default list if none exist
                setLists(['Groceries']);
                await AsyncStorage.setItem('lists', JSON.stringify(['Groceries']));
            }
        } catch (e) {
            console.error('Error loading lists:', e);
        }
    };

    useEffect(() => {
        loadLists();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadLists();
        }, [])
    );

    const saveLists = async (newLists: string[]) => {
        try {
            const jsonValue = JSON.stringify(newLists);
            await AsyncStorage.setItem('lists', jsonValue);
        } catch (e) {
            console.error('Error saving lists:', e);
        }
    };

    const addList = () => {
        setIsModalVisible(true); // Show the modal
    };

    const handleCreateList = async (newListName: string) => {
        if (lists.includes(newListName)) {
            Alert.alert('List already exists', 'Please choose a different name.');
            return;
        }
        const newLists = [...lists, newListName];
        setLists(newLists);
        await saveLists(newLists);
        setIsModalVisible(false);
        router.push({
            pathname: '/list/[listName]',
            params: { listName: newListName },
        });
    };

    const removeList = async (listName: string) => {
        Alert.alert(
            'Delete List',
            `Are you sure you want to delete the list "${listName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const newLists = lists.filter((name) => name !== listName);
                        setLists(newLists);
                        await saveLists(newLists);
                        await AsyncStorage.removeItem(listName);
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: string }) => (
        <Link
            href={{
                pathname: '/list/[listName]',
                params: { listName: item },
            }}
            asChild
        >
            <TouchableOpacity
                onLongPress={() => removeList(item)}
                style={styles.listItem}
            >
                <Text style={styles.listItemText}>{item}</Text>
            </TouchableOpacity>
        </Link>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={lists}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                contentContainerStyle={{ flexGrow: 1 }}
            />
            <Button title="Add New List" onPress={addList} />
            <NewListModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onCreate={handleCreateList}
            />
        </View>
    );
};

export default ListOverviewScreen;

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50, paddingHorizontal: 16 },
    listItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
    },
    listItemText: { fontSize: 18 },
});
