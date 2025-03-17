import React from 'react';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
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
import { 
	SHOPPING_LISTS_TABLE, 
	SHOPPING_ITEMS_TABLE,
	shoppingListsTableSchema, 
	shoppingItemsTableSchema,
	setupShoppingTables 
} from '@/store/shopping';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SCREENS from './navigation/screens';
import DrawerContent from './navigation/Drawer';

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
			[SHOPPING_LISTS_TABLE]: shoppingListsTableSchema,
			[SHOPPING_ITEMS_TABLE]: shoppingItemsTableSchema
		});
		
		// Initialize the todo table
		setupTodoTable(newStore);
		
		// Initialize shopping tables
		setupShoppingTables(newStore);

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
							component={SCREENS.TodosScreen}
							options={{ headerShown: false }}
						/>
						<Drawer.Screen name='Notes' component={SCREENS.Notes} />
						<Drawer.Screen
							name='ShoppingList'
							component={SCREENS.ShoppingList}
						/>
						<Drawer.Screen name='Theme' component={SCREENS.Theme} />
						<Drawer.Screen name='Widget' component={SCREENS.Widget} />
						<Drawer.Screen name='Donate' component={SCREENS.Donate} />
						<Drawer.Screen name='Profile' component={SCREENS.Profile} />
						<Drawer.Screen name='Settings' component={SCREENS.SettingsScreen} />

						<Drawer.Screen name='EditTodo' component={SCREENS.EditTodoScreen} />
					</Drawer.Navigator>
				</Provider>
			</GestureHandlerRootView>
		</ThemeProvider>
	);
}
