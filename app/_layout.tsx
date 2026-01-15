import React from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { createDrawerNavigator } from '@react-navigation/drawer'
import SCREENS from './navigation/screens'
import DrawerContent from './navigation/Drawer'
import migrations from '@/drizzle/migrations'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { db } from '@/db/connect'

const Drawer = createDrawerNavigator()

export default function App() {
	const { success, error } = useMigrations(db, migrations)
	useDrizzleStudio(db.$client)

	if (!success) {
		return null
	}
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeProvider>
				<Drawer.Navigator
					drawerContent={(props) => <DrawerContent {...props} />}
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
				>
					<Drawer.Screen
						name='Home'
						component={SCREENS.TodosScreen}
						options={{ headerShown: false }}
					/>
					<Drawer.Screen name='Notes' component={SCREENS.Notes} />
					<Drawer.Screen name='ShoppingList' component={SCREENS.ShoppingList} />
					<Drawer.Screen name='Theme' component={SCREENS.Theme} />

					<Drawer.Screen name='Settings' component={SCREENS.SettingsScreen} />
					<Drawer.Screen name='EditTodo' component={SCREENS.EditTodoScreen} />
				</Drawer.Navigator>
			</ThemeProvider>
		</GestureHandlerRootView>
	)
}
