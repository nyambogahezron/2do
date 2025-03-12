import { Store } from 'tinybase';

export interface Todo {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	dueDate?: number; // timestamp
	priority: 'low' | 'medium' | 'high';
	categoryId?: string;
	createdAt: number; // timestamp
	updatedAt: number; // timestamp
}

export interface ShoppingList {
	id: string;
	name: string;
	createdAt: number;
	updatedAt: number;
}

export interface ShoppingItem {
	id: string;
	listId: string;
	name: string;
	quantity: number;
	unit?: string;
	price?: number;
	purchased: boolean;
	createdAt: number;
	updatedAt: number;
}

export interface Note {
	id: string;
	title: string;
	content: string;
	categoryId?: string;
	images?: string[]; // urls or base64
	links?: string[];
	createdAt: number;
	updatedAt: number;
}

export interface Category {
	id: string;
	name: string;
	color: string;
}

export const defineStoreSchema = (store: Store): void => {
	// Define schema for todos
	store.setTablesSchema({
		todos: {
			id: { type: 'string' },
			title: { type: 'string', default: '' },
			description: { type: 'string', default: '' },
			completed: { type: 'boolean', default: false },
			dueDate: { type: 'number' },
			priority: { type: 'string', default: 'medium' },
			categoryId: { type: 'string' },
			createdAt: { type: 'number', default: Date.now() },
			updatedAt: { type: 'number', default: Date.now() },
		},
		shoppingLists: {
			id: { type: 'string' },
			name: { type: 'string', default: '' },
			createdAt: { type: 'number', default: Date.now() },
			updatedAt: { type: 'number', default: Date.now() },
		},
		shoppingItems: {
			id: { type: 'string' },
			listId: { type: 'string', default: '' },
			name: { type: 'string', default: '' },
			quantity: { type: 'number', default: 1 },
			unit: { type: 'string' },
			price: { type: 'number' },
			purchased: { type: 'boolean', default: false },
			createdAt: { type: 'number', default: Date.now() },
			updatedAt: { type: 'number', default: Date.now() },
		},
		notes: {
			id: { type: 'string' },
			title: { type: 'string', default: '' },
			content: { type: 'string', default: '' },
			categoryId: { type: 'string' },
			images: { type: 'string', default: '[]' }, // JSON string array of image urls/base64
			links: { type: 'string', default: '[]' }, // JSON string array of links
			createdAt: { type: 'number', default: Date.now() },
			updatedAt: { type: 'number', default: Date.now() },
		},
		categories: {
			id: { type: 'string' },
			name: { type: 'string', default: '' },
			color: { type: 'string', default: '' },
		},
	});
};
