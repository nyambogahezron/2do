import { Store } from 'tinybase';
import { ShoppingList, ShoppingItem } from './models';

export const setupShoppingListModel = (store: Store): void => {
  // Ensure shopping lists table exists
  if (!store.getTable('shoppingLists')) {
    store.setTable('shoppingLists', {});
  }

  // Ensure shopping items table exists
  if (!store.getTable('shoppingItems')) {
    store.setTable('shoppingItems', {});
  }
};

// Shopping List Operations
export const addShoppingList = (
  store: Store,
  name: string
): string => {
  const id = Date.now().toString();
  const timestamp = Date.now();

  store.setRow('shoppingLists', id, {
    id,
    name,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return id;
};

export const updateShoppingList = (
  store: Store,
  id: string,
  updates: Partial<Omit<ShoppingList, 'id' | 'createdAt'>>
): void => {
  const list = store.getRow('shoppingLists', id);
  if (list) {
    store.setPartialRow('shoppingLists', id, {
      ...updates,
      updatedAt: Date.now(),
    });
  }
};

export const deleteShoppingList = (store: Store, id: string): void => {
  // Delete all items in this list first
  const items = getItemsByList(store, id);
  Object.keys(items).forEach(itemId => {
    store.delRow('shoppingItems', itemId);
  });

  // Delete the list
  store.delRow('shoppingLists', id);
};

// Shopping Item Operations
export const addShoppingItem = (
  store: Store,
  item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>
): string => {
  const id = Date.now().toString();
  const timestamp = Date.now();

  store.setRow('shoppingItems', id, {
    id,
    ...item,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return id;
};

export const updateShoppingItem = (
  store: Store,
  id: string,
  updates: Partial<Omit<ShoppingItem, 'id' | 'listId' | 'createdAt'>>
): void => {
  const item = store.getRow('shoppingItems', id);
  if (item) {
    store.setPartialRow('shoppingItems', id, {
      ...updates,
      updatedAt: Date.now(),
    });
  }
};

export const deleteShoppingItem = (store: Store, id: string): void => {
  store.delRow('shoppingItems', id);
};

export const toggleItemPurchased = (store: Store, id: string): void => {
  const item = store.getRow('shoppingItems', id);
  if (item) {
    store.setPartialRow('shoppingItems', id, {
      purchased: !item.purchased,
      updatedAt: Date.now(),
    });
  }
};

// Query Operations
export const getItemsByList = (store: Store, listId: string): Record<string, ShoppingItem> => {
  const items = store.getTable('shoppingItems');
  if (!items) return {};

  return Object.entries(items).reduce((filtered, [id, item]) => {
    if (item.listId === listId) {
      filtered[id] = item as ShoppingItem;
    }
    return filtered;
  }, {} as Record<string, ShoppingItem>);
};

export const getPurchasedItems = (store: Store, listId: string): Record<string, ShoppingItem> => {
  const items = getItemsByList(store, listId);
  
  return Object.entries(items).reduce((filtered, [id, item]) => {
    if (item.purchased) {
      filtered[id] = item;
    }
    return filtered;
  }, {} as Record<string, ShoppingItem>);
};

export const getUnpurchasedItems = (store: Store, listId: string): Record<string, ShoppingItem> => {
  const items = getItemsByList(store, listId);
  
  return Object.entries(items).reduce((filtered, [id, item]) => {
    if (!item.purchased) {
      filtered[id] = item;
    }
    return filtered;
  }, {} as Record<string, ShoppingItem>);
};

export const getTotalPrice = (store: Store, listId: string): number => {
  const items = getItemsByList(store, listId);
  
  return Object.values(items).reduce((total, item) => {
    return total + (item.price || 0) * item.quantity;
  }, 0);
};
