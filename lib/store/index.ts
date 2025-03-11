import { createStore, Store } from 'tinybase';
import { createId } from '../utils';

export interface Todo {
	id: string;
	title: string;
	completed: boolean;
	dueDate?: string;
	priority: 'low' | 'medium' | 'high';
	category?: string;
	createdAt: string;
}

export interface ShoppingList {
	id: string;
	name: string;
	createdAt: string;
}

export interface ShoppingItem {
	id: string;
	listId: string;
	name: string;
	quantity: number;
	unit?: string;
	price?: number;
	purchased: boolean;
	createdAt: string;
}

export interface Note {
	id: string;
	title: string;
	content: string;
	tags: string[];
	attachments: string[];
	createdAt: string;
	updatedAt: string;
}

export const store = createStore()
	.setTable('todos', {})
	.setTable('shoppingLists', {})
	.setTable('shoppingItems', {})
	.setTable('notes', {});

export const addTodo = (todo: Omit<Todo, 'id' | 'createdAt'>) => {
	const id = createId();
	store.setRow('todos', id, {
		...todo,
		id,
		createdAt: new Date().toISOString(),
	});
	return id;
};

export const toggleTodo = (id: string) => {
	const todo = store.getRow('todos', id);
	if (todo) {
		store.setCell('todos', id, 'completed', !todo.completed);
	}
};

export const deleteTodo = (id: string) => {
	store.delRow('todos', id);
};

export const addShoppingList = (name: string) => {
	const id = createId();
	store.setRow('shoppingLists', id, {
		id,
		name,
		createdAt: new Date().toISOString(),
	});
	return id;
};

export const addShoppingItem = (
	item: Omit<ShoppingItem, 'id' | 'createdAt'>
) => {
	const id = createId();
	store.setRow('shoppingItems', id, {
		...item,
		id,
		createdAt: new Date().toISOString(),
	});
	return id;
};

export const toggleShoppingItem = (id: string) => {
	const item = store.getRow('shoppingItems', id);
	if (item) {
		store.setCell('shoppingItems', id, 'purchased', !item.purchased);
	}
};

export const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
	const id = createId();
	const now = new Date().toISOString();
	store.setRow('notes', id, {
		...note,
		id,
		createdAt: now,
		updatedAt: now,
	});
	return id;
};

export const updateNote = (id: string, note: Partial<Note>) => {
	store.setRow('notes', id, {
		...store.getRow('notes', id),
		...note,
		updatedAt: new Date().toISOString(),
	});
};
