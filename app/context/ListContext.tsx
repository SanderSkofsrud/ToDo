// app/context/ListContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { saveData, loadData, deleteData } from '../../utils/storage';

// Interfaces
export interface Item {
  id: string;
  text: string;
  completed: boolean;
}

export interface List {
  id: string;
  name: string;
}

// Context Props
interface ListContextProps {
  lists: List[];
  listData: Record<string, Item[]>;
  addList: (name: string) => Promise<string>;
  removeList: (id: string) => Promise<void>;
  updateListName: (id: string, newName: string) => Promise<void>;
  addItem: (listId: string, text: string) => Promise<void>;
  toggleItem: (listId: string, itemId: string) => Promise<void>;
  reorderItems: (listId: string, reorderedItems: Item[]) => Promise<void>;
  loadLists: () => Promise<void>;
  loadListItems: () => Promise<void>;
}

// Create Context
export const ListContext = createContext<ListContextProps | undefined>(
  undefined
);

// Provider Component
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

  // Generate Unique ID
  const generateUniqueId = () => {
    return (
      Date.now().toString() + Math.random().toString(36).substring(2, 15)
    );
  };

  // Load Lists from Storage
  const loadLists = useCallback(async () => {
    try {
      const storedLists = await loadData<List[]>('lists');
      const initialLists =
        storedLists || [{ id: generateUniqueId(), name: '' }]; // Initialize with empty name
      setLists(initialLists);
    } catch (e) {
      console.error('Error loading lists:', e);
    }
  }, []);

  // Load Items for All Lists
  const loadListItems = useCallback(async () => {
    const data: Record<string, Item[]> = {};
    for (const list of lists) {
      try {
        const items = await loadData<Item[]>(list.id);
        data[list.id] = items || [];
      } catch (e) {
        console.error(`Error loading items for list "${list.name}":`, e);
      }
    }
    setListData(data);
  }, [lists]);

  // Save Lists to Storage
  const saveLists = useCallback(async (newLists: List[]) => {
    try {
      await saveData('lists', newLists);
      setLists(newLists);
    } catch (e) {
      console.error('Error saving lists:', e);
    }
  }, []);

  // Add a New List
  const addList = useCallback(
    async (name: string): Promise<string> => {
      const newListId = generateUniqueId();
      const newList: List = { id: newListId, name };
      const newLists = [...lists, newList];
      await saveLists(newLists);
      return newListId;
    },
    [lists, saveLists]
  );

  // Remove a List
  const removeList = useCallback(
    async (listId: string) => {
      const newLists = lists.filter((l) => l.id !== listId);
      await saveLists(newLists);
      await deleteData(listId);
      setListData((prevData) => {
        const newData = { ...prevData };
        delete newData[listId];
        return newData;
      });
    },
    [lists, saveLists]
  );

  // Update List Name
  const updateListName = useCallback(
    async (listId: string, newName: string) => {
      const updatedLists = lists.map((list) =>
        list.id === listId ? { ...list, name: newName } : list
      );
      await saveLists(updatedLists);
    },
    [lists, saveLists]
  );

  // Add an Item to a List
  const addItem = useCallback(
    async (listId: string, text: string) => {
      const newItem: Item = { id: generateUniqueId(), text, completed: false };
      const updatedItems = [newItem, ...(listData[listId] || [])];
      await saveData(listId, updatedItems);
      setListData((prevData) => ({
        ...prevData,
        [listId]: updatedItems,
      }));
    },
    [listData]
  );

  // Toggle Item Completion
  const toggleItem = useCallback(
    async (listId: string, itemId: string) => {
      const currentItems = listData[listId] || [];
      const updatedItems = currentItems.map((item) =>
        item.id === itemId
          ? { ...item, completed: !item.completed }
          : item
      );
      await saveData(listId, updatedItems);
      setListData((prevData) => ({
        ...prevData,
        [listId]: updatedItems,
      }));
    },
    [listData]
  );

  // Reorder Items in a List
  const reorderItems = useCallback(
    async (listId: string, reorderedItems: Item[]) => {
      await saveData(listId, reorderedItems);
      setListData((prevData) => ({
        ...prevData,
        [listId]: reorderedItems,
      }));
    },
    []
  );

  return (
    <ListContext.Provider
      value={{
        lists,
        listData,
        addList,
        removeList,
        updateListName,
        addItem,
        toggleItem,
        reorderItems,
        loadLists,
        loadListItems,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
