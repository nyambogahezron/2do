import { Store, createStore } from 'tinybase';
import { setupTodoModel } from './todos';
import { setupShoppingListModel } from './shoppingLists';
import { setupNoteModel } from './notes';
import { defineStoreSchema } from './models';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';
import { useCreatePersister } from 'tinybase/ui-react';

let store: Store | undefined;

export const initializeStore = async (): Promise<Store> => {
	if (store) {
		console.log('Store already initialized');
		return store;
	}

	console.log('Creating store...');
	store = createStore();

	const useAndStartPersister = (store: any) =>
		// Persist store to Expo SQLite or local storage; load once, then auto-save.
		useCreatePersister(
			store,
			(store) =>
				Platform.OS === 'web'
					? createLocalPersister(store, 'todos')
					: createExpoSqlitePersister(
							store,
							SQLite.openDatabaseSync('todos.db')
					  ),
			[],
			(persister) =>
				persister.load().then(() => {
					persister.startAutoSave();
					return;
				})
		);
	useAndStartPersister(store);

	defineStoreSchema(store);

	setupTodoModel(store);
	setupShoppingListModel(store);
	setupNoteModel(store);
	setupInitialData(store);

	return store;
};

const setupInitialData = (store: Store) => {
	console.log('Setting up initial data...');
	store.setTable('categories', {
		cat1: { id: 'cat1', name: 'Personal', color: '#4CAF50' },
		cat2: { id: 'cat2', name: 'Work', color: '#2196F3' },
		cat3: { id: 'cat3', name: 'Shopping', color: '#FF9800' },
		cat4: { id: 'cat4', name: 'Health', color: '#E91E63' },
	});

	store.setTable('todos', {
		todo1: {
			id: 'todo1',
			title: 'Buy groceries',
			categoryId: 'cat3',
			completed: false,
		},
		todo2: {
			id: 'todo2',
			title: 'Finish project',
			categoryId: 'cat2',
			completed: false,
		},
		todo3: {
			id: 'todo3',
			title: 'Go for a run',
			categoryId: 'cat4',
			completed: false,
		},
	});

	store.setTable('shoppingLists', {
		list1: { id: 'list1', name: 'Groceries', items: '' },
		list2: { id: 'list2', name: 'Hardware', items: '' },
	});
};

export const getStore = (): Store | undefined => {
	initializeStore();

	return store || undefined;
};
