import { useCallback } from 'react';
import { randomUUID } from 'expo-crypto';
import { useRemoteRowId } from 'tinybase/ui-react';
import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
	Cell,
	createMergeableStore,
	createRelationships,
	Value,
} from 'tinybase/with-schemas';
import { useCreateClientPersisterAndStart } from './persistence/useCreateClientPersisterAndStart';

const STORE_ID_PREFIX = 'todos-';
enum CATEGORIES {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
}

const TABLES_SCHEMA = {
	todos: {
		id: { type: 'string' },
		title: { type: 'string' },
		description: { type: 'string' },
		completed: { type: 'boolean', default: false },
		dueDate: { type: 'string', default: null },
		priority: { type: CATEGORIES, default: CATEGORIES.LOW },
		createdAt: { type: 'string', default: new Date().toISOString() },
		updatedAt: { type: 'string', default: new Date().toISOString() },
	},
} as const;

type Schemas = [typeof TABLES_SCHEMA];
type TodoCellId = keyof (typeof TABLES_SCHEMA)['todos'];

const {
	useCell,
	useCreateMergeableStore,
	useDelRowCallback,
	useProvideRelationships,
	useProvideStore,
	useRowCount,
	useSetCellCallback,
	useSetValueCallback,
	useSortedRowIds,
	useStore,
	useCreateRelationships,
	useTable,
	useValue,
	useValuesListener,
} = UiReact as UiReact.WithSchemas<Schemas>;

const useTodoId = (id: string) => STORE_ID_PREFIX + id;

// Return a callback that creates a new todo

export const useCreateTodo = (todoId: string) => {
	const store = useStore(useTodoId(todoId));

	return useCallback(
		(
			title: string,
			description: string,
			completed: boolean,
			dueDate: string,
			priority: CATEGORIES
		) => {
			const id = randomUUID();

			store?.setRow('todos', id, {
				id,
				title,
				description,
				completed,
				dueDate,
				priority,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			});

			return id;
		},
		[store, todoId]
	);
};

// Return a callback that updates a todo

export const useUpdateTodo = (todoId: string) => {
	const store = useStore(useTodoId(todoId));

	return useCallback(
		(
			id: string,
			title: string,
			description: string,
			completed: boolean,
			dueDate: string,
			priority: CATEGORIES
		) => {
			store?.setRow('todos', id, {
				id,
				title,
				description,
				completed,
				dueDate,
				priority,
				updatedAt: new Date().toISOString(),
			});
		},
		[store, todoId]
	);
};

// Return a callback that deletes a todo

export const useDeleteTodo = (todoId: string) => {
	const store = useStore(useTodoId(todoId));

	return useCallback(
		(id: string) => {
			store?.delRow('todos', id);
		},
		[store, todoId]
	);
};

// Return a callback that marks a todo as completed
