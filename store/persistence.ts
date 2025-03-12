// Initialize the (memoized) TinyBase store and persist it.

import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';
import { useCreatePersister } from 'tinybase/ui-react';

const AppPersister = (store: any) =>
	// Persist store to Expo SQLite or local storage; load once, then auto-save.
	useCreatePersister(
		store,
		(store) =>
			Platform.OS === 'web'
				? createLocalPersister(store, 'todos')
				: createExpoSqlitePersister(store, SQLite.openDatabaseSync('todos.db')),
		[],
		(persister) =>
			persister.load().then(() => {
				console.log('Loaded store from persistence');
				persister.startAutoSave();
				return;
			})
	);

export default AppPersister;
