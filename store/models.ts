/**
 * Re-export types from the database schema for backwards compatibility
 * 
 * Note: This file exists for compatibility with existing imports.
 * Prefer importing types directly from '@/db/schema' in new code.
 */

export type {
  Todo,
  InsertTodo,
  Note,
  InsertNote,
  ShoppingList,
  InsertShoppingList,
  ShoppingItem,
  InsertShoppingItem,
} from '@/db/schema';

// Additional types that may be used in the app
export interface Category {
  id: string;
  name: string;
  color: string;
}
