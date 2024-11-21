import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { saveData, loadData, deleteData } from '../../utils/storage';

/**
 * Interface representing an individual item in a list.
 */
export interface Item {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * Interface representing a list.
 */
export interface List {
  id: string;
  name: string;
}

/**
 * Interface for the List Context properties.
 */
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

/**
 * Create List Context.
 */
export const ListContext = createContext<ListContextProps | undefined>(
  undefined
);

/**
 * Provider component for managing lists and their items.
 * @param children - React children nodes.
 * @returns A React functional component.
 */
export const ListProvider = ({ children }: { children: ReactNode }) => {
  const [lists, setLists] = useState<List[]>([]);
  const [listData, setListData] = useState<Record<string, Item[]>>({});

  /**
   * Generates a unique identifier.
   * @returns A unique string.
   */
  const generateUniqueId = () => {
    return (
      Date.now().toString() + Math.random().toString(36).substring(2, 15)
    );
  };

  /**
   * Loads lists from storage.
   */
  const loadLists = useCallback(async () => {
    try {
      const storedLists = await loadData<List[]>('lists');
      const initialLists =
        storedLists && storedLists.length > 0
          ? storedLists
          : [{ id: generateUniqueId(), name: '' }];
      setLists(initialLists);
    } catch (e) {
      console.error('Error loading lists:', e);
    }
  }, []);

  /**
   * Loads items for all lists from storage.
   */
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

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  useEffect(() => {
    if (lists.length > 0) {
      loadListItems();
    }
  }, [lists, loadListItems]);

  /**
   * Saves the lists to storage.
   * @param newLists - The updated lists.
   */
  const saveLists = useCallback(async (newLists: List[]) => {
    try {
      await saveData('lists', newLists);
      setLists(newLists);
    } catch (e) {
      console.error('Error saving lists:', e);
    }
  }, []);

  /**
   * Adds a new list.
   * @param name - The name of the new list.
   * @returns The ID of the newly created list.
   */
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

  /**
   * Removes a list.
   * @param listId - The ID of the list to remove.
   */
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

  /**
   * Updates the name of a list.
   * @param listId - The ID of the list to update.
   * @param newName - The new name for the list.
   */
  const updateListName = useCallback(
    async (listId: string, newName: string) => {
      const updatedLists = lists.map((list) =>
        list.id === listId ? { ...list, name: newName } : list
      );
      await saveLists(updatedLists);
    },
    [lists, saveLists]
  );

  /**
   * Adds a new item to a list.
   * @param listId - The ID of the list.
   * @param text - The text of the new item.
   */
  const addItem = useCallback(
    async (listId: string, text: string) => {
      const newItem: Item = { id: generateUniqueId(), text, completed: false };
      const updatedItems = [...(listData[listId] || []), newItem];
      await saveData(listId, updatedItems);
      setListData((prevData) => ({
        ...prevData,
        [listId]: updatedItems,
      }));
    },
    [listData]
  );

  /**
   * Toggles the completion status of an item.
   * @param listId - The ID of the list.
   * @param itemId - The ID of the item.
   */
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

  /**
   * Reorders items in a list.
   * @param listId - The ID of the list.
   * @param reorderedItems - The reordered items array.
   */
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
