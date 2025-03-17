import { Store } from 'tinybase';
import {
	useAddRowCallback,
	useDelRowCallback,
	useDelTableCallback,
	useHasTable,
	useRow,
	useSetCellCallback,
	useSortedRowIds,
} from 'tinybase/ui-react';
import { useStore } from 'tinybase/ui-react';
import React from 'react';
// Schema constants
export const TODO_TABLE = 'todo';
export const ID_CELL = 'id';
export const TEXT_CELL = 'text';
export const DONE_CELL = 'done';
export const PRIORITY_CELL = 'priority';
export const DUE_DATE_CELL = 'dueDate';
export const CREATED_AT_CELL = 'createdAt';
export const UPDATED_AT_CELL = 'updatedAt';

// Todo type definition to be used across the app
export type Todo = {
	id: string;
	text: string;
	done: boolean;
	priority: 'low' | 'medium' | 'high';
	dueDate: string;
	createdAt: string;
	updatedAt: string;
};

// Schema definition
export const todoTableSchema = {
	[ID_CELL]: { type: 'string' as const },
	[TEXT_CELL]: { type: 'string' as const },
	[DONE_CELL]: { type: 'boolean' as const, default: false },
	[PRIORITY_CELL]: { type: 'string' as const, default: 'medium' },
	[DUE_DATE_CELL]: { type: 'string' as const, default: '' },
	[CREATED_AT_CELL]: { type: 'string' as const, default: '' },
	[UPDATED_AT_CELL]: { type: 'string' as const, default: '' },
};

// Initialize or access the todos table
export const setupTodoTable = (store: Store): void => {
	if (!store.hasTable(TODO_TABLE)) {
		store.setTable(TODO_TABLE, {});
	}
};

// Direct store manipulation functions
export const addTodo = (
	store: Store,
	todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
): string => {
	const id = Date.now().toString(); // Ensure ID is a string
	const now = new Date().toISOString();

	// Log the todo being added
	console.log('Adding todo with ID:', id, todoData);

	store.setRow(TODO_TABLE, id, {
		id,
		...todoData,
		createdAt: now,
		updatedAt: now,
	});

	return id;
};

export const updateTodo = (
	store: Store,
	id: string,
	updates: Partial<Omit<Todo, 'id' | 'createdAt'>>
): void => {
	// Convert id to string to ensure consistent format
	const stringId = String(id);
	
	console.log('Updating todo with ID:', stringId, updates);
	
	// Check if the store has this row
	if (!store.hasRow(TODO_TABLE, stringId)) {
		console.error('Cannot find todo with ID:', stringId);
		console.log('Available IDs:', Object.keys(store.getTable(TODO_TABLE) || {}));
		return;
	}
	
	const todo = store.getRow(TODO_TABLE, stringId);
	if (todo) {
		const now = new Date().toISOString();
		store.setPartialRow(TODO_TABLE, stringId, {
			...updates,
			updatedAt: now,
		});
	}
};

export const deleteTodo = (store: Store, id: string): void => {
	store.delRow(TODO_TABLE, id);
};

// React hooks for components
export const useTodo = (id: string): Todo => {
	// Use the built-in useRow hook which already handles subscriptions correctly
	const row = useRow(TODO_TABLE, String(id));
	
	// Convert any non-object response to an empty object
	return (row && typeof row === 'object') ? row as Todo : {} as Todo;
};

export const useAddTodo = () => {
	return useAddRowCallback(
		TODO_TABLE,
		(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
			const id = Date.now().toString();
			const now = new Date().toISOString();

			// Ensure data isn't empty and has default values - use the explicit properties
			return {
				id,
				text: todoData.text || '',
				done: todoData.done === true, // Explicitly convert to boolean
				priority: todoData.priority || 'medium',
				dueDate: todoData.dueDate || '',
				createdAt: now,
				updatedAt: now,
			};
		}
	);
};

export const useUpdateTodoCallback = (id: string) => {
	return useSetCellCallback(TODO_TABLE, id, UPDATED_AT_CELL, () =>
		new Date().toISOString()
	);
};

export const useToggleTodoDone = (id: string) => {
	const store = useStore();

	return () => {
		if (store && id) {
			try {
				const currentValue = store.getCell(
					TODO_TABLE,
					id,
					DONE_CELL
				) as boolean;
				store.setCell(TODO_TABLE, id, DONE_CELL, !currentValue);
				store.setCell(
					TODO_TABLE,
					id,
					UPDATED_AT_CELL,
					new Date().toISOString()
				);
			} catch (err) {
				console.error('Error toggling todo:', err);
			}
		}
	};
};

export const useDeleteTodo = (id: string) => {
	return useDelRowCallback(TODO_TABLE, id);
};

export const useSortedTodos = () => {
	// Sort by done status - undone first
	return useSortedRowIds(TODO_TABLE, DONE_CELL);
};

// Filter functions
export const getTodosByPriority = (
	store: Store,
	priority: 'low' | 'medium' | 'high'
): Record<string, Todo> => {
	const todos = store.getTable(TODO_TABLE);
	if (!todos) return {};

	return Object.entries(todos).reduce((filtered, [id, todo]) => {
		if (todo[PRIORITY_CELL] === priority) {
			filtered[id] = todo as Todo;
		}
		return filtered;
	}, {} as Record<string, Todo>);
};

export const getDoneTodos = (store: Store): Record<string, Todo> => {
	const todos = store.getTable(TODO_TABLE);
	if (!todos) return {};

	return Object.entries(todos).reduce((filtered, [id, todo]) => {
		if (todo[DONE_CELL]) {
			filtered[id] = todo as Todo;
		}
		return filtered;
	}, {} as Record<string, Todo>);
};

export const getUndoneTodos = (store: Store): Record<string, Todo> => {
	const todos = store.getTable(TODO_TABLE);
	if (!todos) return {};

	return Object.entries(todos).reduce((filtered, [id, todo]) => {
		if (!todo[DONE_CELL]) {
			filtered[id] = todo as Todo;
		}
		return filtered;
	}, {} as Record<string, Todo>);
};

export const getOverdueTodos = (store: Store): Record<string, Todo> => {
	const todos = store.getTable(TODO_TABLE);
	if (!todos) return {};

	const now = new Date().toISOString();
	return Object.entries(todos).reduce((filtered, [id, todo]) => {
		if (!todo[DONE_CELL] && todo[DUE_DATE_CELL] && todo[DUE_DATE_CELL] < now) {
			filtered[id] = todo as Todo;
		}
		return filtered;
	}, {} as Record<string, Todo>);
};

export const getTodoById = (id: string): Todo | null => {
	const store = useStore();
	if (!store) return null;

	const todo = store.getRow(TODO_TABLE, id);
	console.log('Todo from store:', todo);

	return todo as Todo;
};

export const ClearTodos = () => {
	if (!useHasTable(TODO_TABLE)) return null;

	return useDelTableCallback(TODO_TABLE);
};

// Re-export useStore
export { useStore } from 'tinybase/ui-react';
