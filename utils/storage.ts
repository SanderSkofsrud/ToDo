// src/utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { List, Item } from '@/app/context/ListContext';

// Define a directory for storing lists
const listsDir = FileSystem.documentDirectory + 'lists/';

// Ensure the directory exists
const ensureListsDirExists = async () => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(listsDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(listsDir, { intermediates: true });
        }
    } catch (e) {
        console.error('Error ensuring lists directory exists:', e);
    }
};

/**
 * Existing AsyncStorage functions for settings
 */

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

/**
 * New File-Based Storage Functions for Lists and Items
 */

/**
 * Returns the file path for the lists.json file.
 */
const getListsFilePath = () => `${listsDir}lists.json`;

/**
 * Returns the file path for a specific list's JSON file.
 * @param listId - The ID of the list.
 */
const getListFilePath = (listId: string) => `${listsDir}list_${listId}.json`;

/**
 * Saves the lists array to lists.json
 * @param lists - Array of lists
 */
export const saveListsToFile = async (lists: List[]): Promise<void> => {
    try {
        await ensureListsDirExists();
        const jsonValue = JSON.stringify(lists);
        await FileSystem.writeAsStringAsync(getListsFilePath(), jsonValue);
    } catch (e) {
        console.error(`Error saving lists to file:`, e);
    }
};

/**
 * Loads the lists array from lists.json
 * @returns Array of lists or empty array
 */
export const loadListsFromFile = async (): Promise<List[]> => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(getListsFilePath());
        if (!fileInfo.exists) {
            return [];
        }
        const jsonValue = await FileSystem.readAsStringAsync(getListsFilePath());
        return JSON.parse(jsonValue);
    } catch (e) {
        console.error(`Error loading lists from file:`, e);
        return [];
    }
};

/**
 * Saves the items array to list_<id>.json
 * @param listId - The ID of the list
 * @param items - Array of items
 */
export const saveItemsToFile = async (listId: string, items: Item[]): Promise<void> => {
    try {
        await ensureListsDirExists();
        const jsonValue = JSON.stringify(items);
        await FileSystem.writeAsStringAsync(getListFilePath(listId), jsonValue);
    } catch (e) {
        console.error(`Error saving items for list "${listId}":`, e);
    }
};

/**
 * Loads the items array from list_<id>.json
 * @param listId - The ID of the list
 * @returns Array of items or empty array
 */
export const loadItemsFromFile = async (listId: string): Promise<Item[]> => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(getListFilePath(listId));
        if (!fileInfo.exists) {
            return [];
        }
        const jsonValue = await FileSystem.readAsStringAsync(getListFilePath(listId));
        return JSON.parse(jsonValue);
    } catch (e) {
        console.error(`Error loading items for list "${listId}":`, e);
        return [];
    }
};

/**
 * Deletes the list_<id>.json file
 * @param listId - The ID of the list
 */
export const deleteListFile = async (listId: string): Promise<void> => {
    try {
        const filePath = getListFilePath(listId);
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists) {
            await FileSystem.deleteAsync(filePath);
        }
    } catch (e) {
        console.error(`Error deleting list file "${listId}":`, e);
    }
};
