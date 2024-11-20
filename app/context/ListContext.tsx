// context/ListContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Export the interfaces
export interface Item {
  id: string;
  text: string;
  completed: boolean;
}

export interface List {
  id: string;
  name: string;
}

// 2. Update the context props to include loadLists and loadListItems
interface ListContextProps {
  lists: List[];
  listData: Record<string, Item[]>;
  addList: (name?: string) => Promise<string>; // Returns new list ID
  removeList: (id: string) => Promise<void>;
  updateListName: (id: string, newName: string) => Promise<void>;
  addItem: (listId: string, text: string) => Promise<void>;
  loadLists: () => Promise<void>;
  loadListItems: () => Promise<void>;
  // Add more functions as needed
}

export const ListContext = createContext<ListContextProps | undefined>(undefined);

export const ListProvider = ({ children }: { children: ReactNode }) => {
  const [lists, setLists] = useState<List[]>([]);
  const [listData, setListData] = useState<Record<string, Item[]>>({});

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    if (lists.length > 0) {
      loadListItems();
    }
  }, [lists]);

  const generateUniqueId = () => {
    return Date.now().toString() + Math.random().toString(36).substring(2, 15);
  };

  const loadLists = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('lists');
      const storedLists: List[] = jsonValue
        ? JSON.parse(jsonValue)
        : [{ id: generateUniqueId(), name: 'Dagligvarer' }];
      setLists(storedLists);
    } catch (e) {
      console.error('Error loading lists:', e);
    }
  };

  const loadListItems = async () => {
    const data: Record<string, Item[]> = {};
    for (const list of lists) {
      try {
        const jsonValue = await AsyncStorage.getItem(list.id);
        data[list.id] = jsonValue ? JSON.parse(jsonValue) : [];
      } catch (e) {
        console.error(`Error loading items for list ${list.name}:`, e);
      }
    }
    setListData(data);
  };

  const saveLists = async (newLists: List[]) => {
    try {
      await AsyncStorage.setItem('lists', JSON.stringify(newLists));
      setLists(newLists);
    } catch (e) {
      console.error('Error saving lists:', e);
    }
  };

  // 3. Modify addList to return the new list ID
  const addList = async (name?: string): Promise<string> => {
    const newListId = generateUniqueId();
    const newList: List = { id: newListId, name: name || '' }; // Empty name if not provided
    const newLists = [...lists, newList];
    await saveLists(newLists);
    return newListId;
  };

  const removeList = async (listId: string) => {
    const newLists = lists.filter((l) => l.id !== listId);
    await saveLists(newLists);
    await AsyncStorage.removeItem(listId);
    setListData((prevData) => {
      const newData = { ...prevData };
      delete newData[listId];
      return newData;
    });
  };

  const updateListName = async (listId: string, newName: string) => {
    const updatedLists = lists.map((list) =>
      list.id === listId ? { ...list, name: newName } : list
    );
    await saveLists(updatedLists);
  };

  const addItem = async (listId: string, text: string) => {
    const newItem: Item = { id: generateUniqueId(), text, completed: false };
    const updatedItems = [newItem, ...(listData[listId] || [])];
    try {
      await AsyncStorage.setItem(listId, JSON.stringify(updatedItems));
      setListData((prevData) => ({
        ...prevData,
        [listId]: updatedItems,
      }));
    } catch (e) {
      console.error('Error adding item:', e);
    }
  };

  // Add more functions as needed (e.g., toggleItem, reorderItems)

  return (
    <ListContext.Provider
      value={{
        lists,
        listData,
        addList,
        removeList,
        updateListName,
        addItem,
        loadLists,
        loadListItems,
        // Add more functions here
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
