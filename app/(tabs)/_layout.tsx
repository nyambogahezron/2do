import { Tabs } from 'expo-router';
import { ListTodo, NotebookText, ShoppingCart } from 'lucide-react-native';

export default function TabLayout() {
	return (
		<Tabs
			initialRouteName='index'
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: '#000',
					shadowColor: 'transparent',
					height: 55,
					borderWidth: 0,
					borderColor: 'transparent',
				},
				tabBarActiveTintColor: '#FFD700',
				tabBarLabelStyle: {
					fontSize: 10,
					fontWeight: 'bold',
				},
				tabBarIconStyle: {
					padding: 5,
				},
				tabBarItemStyle: {
					paddingVertical: 2,
				},
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Todos',
					tabBarIcon: ({ color, size }) => <ListTodo size={20} color={color} />,
				}}
			/>
			<Tabs.Screen
				name='shopping'
				options={{
					title: 'Shopping',
					tabBarIcon: ({ color, size }) => (
						<ShoppingCart size={20} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='notes'
				options={{
					title: 'Notes',
					tabBarIcon: ({ color, size }) => (
						<NotebookText size={20} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
