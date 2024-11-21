// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Saves data to AsyncStorage under the specified key.
 * @param key - The storage key.
 * @param data - The data to store.
 */
export const saveData = async <T>(key: string, data: T): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error(`Error saving data for key "${key}":`, e);
    }
};

/**
 * Loads data from AsyncStorage for the specified key.
 * @param key - The storage key.
 * @returns The parsed data or null if not found.
 */
export const loadData = async <T>(key: string): Promise<T | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
    } catch (e) {
        console.error(`Error loading data for key "${key}":`, e);
        return null;
    }
};

/**
 * Deletes data from AsyncStorage for the specified key.
 * @param key - The storage key.
 */
export const deleteData = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.error(`Error deleting data for key "${key}":`, e);
    }
};
