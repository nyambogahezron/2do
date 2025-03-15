import React from 'react';
import * as SQLite from 'expo-sqlite';
import { Platform, StatusBar } from 'react-native';
import { createStore, Store } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';
import {
	Provider,
	useCreatePersister,
	useCreateStore,
} from 'tinybase/ui-react';
import { ThemeProvider } from '@/context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TODO_TABLE, todoTableSchema, setupTodoTable } from '@/store/todo';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import TodosScreen from './todo';
import SettingsScreen from './settings';
import DrawerContent from './naviagtion/Drawer';
import Notes from './notes';
import ShoppingList from './shoppingList';

// Add global type definition for the store
declare global {
	interface Window {
		tinybaseStore: Store;
	}
}

const Drawer = createDrawerNavigator();

// The main app.
export default function App() {
	// Initialize the (memoized) TinyBase store and persist it.
	const store = useCreateStore(() => {
		const newStore = createStore().setTablesSchema({
			[TODO_TABLE]: todoTableSchema,
		});
		// Initialize the todo table
		setupTodoTable(newStore);

		// Make store globally accessible
		if (typeof window !== 'undefined') {
			window.tinybaseStore = newStore;
		}

		return newStore;
	});

	const useAndStartPersister = (store: Store) =>
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
					<Drawer.Navigator
						screenOptions={{
							headerShown: false,
							drawerStyle: {
								borderRadius: 0,
								marginTop: 0,
								borderBottomRightRadius: 0,
								borderTopRightRadius: 0,
								zIndex: 999,
								backgroundColor: '#f4f4f4',
							},
							headerStyle: { backgroundColor: 'tomato' },
							sceneStyle: { borderRadius: 0 },
							drawerStatusBarAnimation: 'slide',
							drawerActiveTintColor: 'yellow',
							drawerInactiveTintColor: 'black',
						}}
						initialRouteName='Home'
						drawerContent={(props) => <DrawerContent {...props} />}
					>
						<Drawer.Screen
							name='Home'
							component={TodosScreen}
							options={{ headerShown: false }}
						/>
						<Drawer.Screen name='Settings' component={SettingsScreen} />
						<Drawer.Screen name='Notes' component={Notes} />
						<Drawer.Screen name='ShoppingList' component={ShoppingList} />
					</Drawer.Navigator>
				</Provider>
			</GestureHandlerRootView>
		</ThemeProvider>
	);
}

export type RootStackParamList = {
	Home: undefined;
	Settings: undefined;
	Notes: undefined;
	ShoppingList: undefined;
};
