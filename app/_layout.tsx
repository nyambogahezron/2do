import { useState } from 'react';
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
import { ThemeProvider } from '@/context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
		<ThemeProvider>
			<GestureHandlerRootView>
				<Provider store={store}>
					<Stack>
						<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
						<Stack.Screen name='settings' />
					</Stack>
				</Provider>
			</GestureHandlerRootView>
		</ThemeProvider>
	);
};

export default App;
