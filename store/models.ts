
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

export interface Category {
  id: string;
  name: string;
  color: string;
}
