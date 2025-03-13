import React, { useCallback } from 'react';
import { randomUUID } from 'expo-crypto';
import * as UiReact from 'tinybase/ui-react/with-schemas';
import { createMergeableStore, NoValuesSchema } from 'tinybase/with-schemas';
import { useCreateClientPersisterAndStart } from './persistence/useCreateClientPersisterAndStart';

const STORE_ID_PREFIX = 'todos-';

const TABLES_SCHEMA = {
	todos: {
		id: { type: 'string' },
		title: { type: 'string' },
		description: { type: 'string' },
		completed: { type: 'boolean', default: false },
		dueDate: { type: 'string', default: '' },
		priority: { type: 'string', default: 'low' },
		createdAt: { type: 'string', default: new Date().toISOString() },
		updatedAt: { type: 'string', default: new Date().toISOString() },
	},
} as const;

const {
	useCell,
	useCreateMergeableStore,
	useDelRowCallback,
	useProvideStore,
	useRowIds,
	useSetCellCallback,
	useSortedRowIds,
	useStore,
	useTable,
} = UiReact as UiReact.WithSchemas<[typeof TABLES_SCHEMA, NoValuesSchema]>;

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
			priority: string
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
			priority: string
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
export const useDeleteTodo = (todoId: string) =>
	useDelRowCallback('todos', useTodoId(todoId));

// Return a callback that marks a todo as completed
export const useMarkTodoAsDone = (todoId: string) => {
	const store = useStore(useTodoId(todoId));

	return useCallback(
		(id: string) => {
			store?.setCell('todos', id, 'completed', true);
		},
		[store, todoId]
	);
};

// Return a function that retrieves all todos
export const useGetAllTodos = (todoId: string) => {
	const store = useStore(useTodoId(todoId));

	return useCallback(() => {
		return store?.getTable('todos') || {};
	}, [store, todoId]);
};

// Create and persist a store containing todos
export default function TodoStore({ todoId }: { todoId: string }) {
	const storeId = useTodoId(todoId);
	const store = useCreateMergeableStore(() =>
		createMergeableStore().setTablesSchema(TABLES_SCHEMA)
	);

	useCreateClientPersisterAndStart(
		storeId,
		store,
		JSON.stringify(initialTodos)
	);
	useProvideStore(storeId, store);

	return null;
}

const initialTodos = [
	{
		id: '1',
		title: 'Welcome to 2do!',
		description: 'This is your first todo.',
		completed: false,
		dueDate: '',
		priority: 'low',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: '2',
		title: 'Add more todos',
		description: 'Click the add button to create new todos.',
		completed: false,
		dueDate: '',
		priority: 'medium',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: '3',
		title: 'Mark todos as done',
		description: 'Click the checkbox to mark todos as completed.',
		completed: false,
		dueDate: '',
		priority: 'high',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];
