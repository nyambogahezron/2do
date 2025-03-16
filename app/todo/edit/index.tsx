import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import CustomHeader from '@/components/ui/CustomHeader';
import { useRoute } from '@react-navigation/native';
import { getTodoById } from '@/store/todo';

export default function EditTodoScreen() {
	const route = useRoute();

	const { id } = route.params as { id: string };
	const { themeClrs } = useTheme();
	const todoData = getTodoById(id?.toString());
	console.log('Todo data:', todoData);

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: themeClrs.colors.background },
			]}
		>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: '',
					headerStyle: {
						backgroundColor: themeClrs.colors.background,
					},
					header: () => <CustomHeader title='Edit Todo' />,
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
