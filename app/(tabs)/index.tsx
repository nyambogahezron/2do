import { router, Stack } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	Alert,
} from 'react-native';
import {
	useAddRowCallback,
	useDelRowCallback,
	useDelTableCallback,
	useHasTable,
	useRow,
	useSetCellCallback,
	useSortedRowIds,
} from 'tinybase/ui-react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, Portal, useTheme } from 'react-native-paper';
import useGenerateId from '@/utils/generateId';
import Menu from '@/components/ui/Menu';
import CustomHeader from '@/components/ui/CustomHeader';
import EmptyState from '@/components/ui/EmptyState';
import TodoItem from '@/components/todos/TodoItem';
import AddTodoModel from '@/components/todos/AddTodoModel';

export type Todo = {
	id: string;
	text: string;
	done: boolean;
	priority: 'low' | 'medium' | 'high';
	dueDate: string;
	createdAt: string;
	updatedAt: string;
};

// The TinyBase table contains the todos, with 'text' and 'done' cells.
const TODO_TABLE = 'todo';
const ID_CELL = 'id';
const TEXT_CELL = 'text';
const DONE_CELL = 'done';
const PRIORITY_CELL = 'priority';
const DUE_DATE_CELL = 'dueDate';
const CREATED_AT_CELL = 'createdAt';
const UPDATED_AT_CELL = 'updatedAt';

// A button component to delete all the todos, only shows when there are some.
export const ClearTodos = () => {
	const handlePress = useDelTableCallback(TODO_TABLE);
	return useHasTable(TODO_TABLE) ? (
		<TouchableOpacity onPress={handlePress}>
			<Text style={styles.clearTodos}>Clear all</Text>
		</TouchableOpacity>
	) : null;
};

export default function TodosScreen() {
	const [menuVisible, setMenuVisible] = React.useState(false);
	const [isModalVisible, setModalVisible] = useState(false);
	const theme = useTheme();
	const renderItem = ({ item: id }: any) => <TodoItem id={id} />;

	return (
		<SafeAreaProvider>
			<StatusBar
				style={theme.dark ? 'dark' : 'light'}
				backgroundColor={theme.colors.background}
			/>
			<PaperProvider>
				<Portal>
					<Stack.Screen
						options={{
							headerShown: true,
							headerTitle: '',
							headerStyle: {
								backgroundColor: theme.colors.background,
							},

							header: () => (
								<CustomHeader
									menuVisible={menuVisible}
									title='Todos'
									setMenuVisible={setMenuVisible}
								/>
							),
						}}
					/>
					<SafeAreaView
						style={[
							styles.container,
							{
								backgroundColor: theme.colors.background,
							},
						]}
					>
						<FlatList
							data={useSortedRowIds(TODO_TABLE, DONE_CELL)}
							renderItem={renderItem}
							style={[styles.container, { marginTop: 10 }]}
							keyExtractor={(id) => id}
							ListEmptyComponent={() => <EmptyState />}
						/>

						{/* Floating Add Button */}
						<TouchableOpacity
							style={styles.addButton}
							onPress={() => setModalVisible(true)}
						>
							<Plus color={'yellow'} />
						</TouchableOpacity>
						<AddTodoModel
							visible={isModalVisible}
							setVisible={setModalVisible}
						/>
					</SafeAreaView>
				</Portal>
			</PaperProvider>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	clearTodos: {
		margin: 16,
		flex: 0,
		textAlign: 'center',
		fontSize: 16,
	},

	addButton: {
		position: 'absolute',
		bottom: 25,
		right: 20,
		backgroundColor: '#333',
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
