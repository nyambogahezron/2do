import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { createStore } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';
import {
	Provider,
	useCreatePersister,
	useCreateStore,
} from 'tinybase/ui-react';
import { Stack } from 'expo-router';

// The main app.
const App = () => {
	// Initialize the (memoized) TinyBase store and persist it.
	const store = useCreateStore(createStore);

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

	return (
		<Provider store={store}>
			<Stack>
				<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
			</Stack>
		</Provider>
	);
};

export default App;
