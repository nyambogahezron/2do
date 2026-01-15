import { useState, useEffect } from 'react';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'expo-crypto';
import {
  shoppingLists,
  shoppingItems,
  ShoppingList,
  ShoppingItem,
  InsertShoppingList,
  InsertShoppingItem,
} from '@/db/schema';
import { db } from '@/db/connect';

export const getAllShoppingLists = async (): Promise<ShoppingList[]> => {
  try {
    const lists = await db.select()
      .from(shoppingLists)
      .orderBy(desc(shoppingLists.updatedAt));
    return lists;
  } catch (error) {
    console.error('Error fetching shopping lists:', error);
    throw error;
  }
};

export const getShoppingListById = async (id: string): Promise<ShoppingList | null> => {
  try {
    const result = await db.select()
      .from(shoppingLists)
      .where(eq(shoppingLists.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    throw error;
  }
};

export const getShoppingItems = async (listId: string): Promise<ShoppingItem[]> => {
  try {
    const items = await db.select()
      .from(shoppingItems)
      .where(eq(shoppingItems.listId, listId));
    return items;
  } catch (error) {
    console.error('Error fetching shopping items:', error);
    throw error;
  }
};

export const addShoppingList = async (
  listData: Omit<InsertShoppingList, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const now = Date.now();
  const id = randomUUID();

  try {
    await db.insert(shoppingLists).values({
      id,
      title: listData.title,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  } catch (error) {
    console.error('Error adding shopping list:', error);
    throw error;
  }
};

export const updateShoppingList = async (
  id: string,
  updates: Partial<Omit<ShoppingList, 'id' | 'createdAt'>>
): Promise<void> => {
  const now = Date.now();

  try {
    await db.update(shoppingLists)
      .set({
        ...updates,
        updatedAt: now,
      })
      .where(eq(shoppingLists.id, id));
  } catch (error) {
    console.error('Error updating shopping list:', error);
    throw error;
  }
};

export const deleteShoppingList = async (id: string): Promise<void> => {
  try {
    await db.delete(shoppingLists)
      .where(eq(shoppingLists.id, id));
  } catch (error) {
    console.error('Error deleting shopping list:', error);
    throw error;
  }
};

export const addShoppingItem = async (
  itemData: Omit<InsertShoppingItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const now = Date.now();
  const id = randomUUID();

  try {
    await db.insert(shoppingItems).values({
      id,
      listId: itemData.listId,
      name: itemData.name,
      quantity: itemData.quantity ?? 1,
      price: itemData.price ?? 0,
      checked: itemData.checked ?? false,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  } catch (error) {
    console.error('Error adding shopping item:', error);
    throw error;
  }
};

export const updateShoppingItem = async (
  id: string,
  updates: Partial<Omit<ShoppingItem, 'id' | 'createdAt'>>
): Promise<void> => {
  const now = Date.now();

  try {
    await db.update(shoppingItems)
      .set({
        ...updates,
        updatedAt: now,
      })
      .where(eq(shoppingItems.id, id));
  } catch (error) {
    console.error('Error updating shopping item:', error);
    throw error;
  }
};

export const toggleShoppingItem = async (id: string): Promise<void> => {
  try {
    const result = await db.select()
      .from(shoppingItems)
      .where(eq(shoppingItems.id, id))
      .limit(1);
    
    const item = result[0];
    if (item) {
      await updateShoppingItem(id, { checked: !item.checked });
    }
  } catch (error) {
    console.error('Error toggling shopping item:', error);
    throw error;
  }
};

export const deleteShoppingItem = async (id: string): Promise<void> => {
  try {
    await db.delete(shoppingItems)
      .where(eq(shoppingItems.id, id));
  } catch (error) {
    console.error('Error deleting shopping item:', error);
    throw error;
  }
};

export const useShoppingLists = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setLoading(true);
      const allLists = await getAllShoppingLists();
      setLists(allLists);
    } catch (error) {
      console.error('Error refreshing shopping lists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    lists,
    loading,
    refresh,
  };
};

export const useShoppingList = (id: string | null) => {
  const [list, setList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!id) {
      setList(null);
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [fetchedList, fetchedItems] = await Promise.all([
        getShoppingListById(id),
        getShoppingItems(id),
      ]);
      setList(fetchedList);
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  return {
    list,
    items,
    loading,
    refresh,
  };
};

export const useShoppingItems = (listId: string | null) => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!listId) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedItems = await getShoppingItems(listId);
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching shopping items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [listId]);

  return {
    items,
    loading,
    refresh,
  };
};

export const createShoppingList = addShoppingList;
export const createShoppingItem = addShoppingItem;

export const getTotalItems = (items: ShoppingItem[]): number => {
  return items.length;
};

export const getTotalPrice = (items: ShoppingItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

