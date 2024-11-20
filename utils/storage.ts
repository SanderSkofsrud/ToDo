// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key: string, data: never): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error(`Error saving data for key ${key}:`, e);
    }
};

export const loadData = async (key: string): Promise<never | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error(`Error loading data for key ${key}:`, e);
        return null;
    }
};

export const deleteData = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.error(`Error deleting data for key ${key}:`, e);
    }
};
