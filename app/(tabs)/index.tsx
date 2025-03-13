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

// The text input component to add a new todo.
const NewTodo = () => {
	const nowDate = new Date().toISOString();
	const itemId = useGenerateId();
	const [text, setText] = useState('');
	const [priority, setPriority] = useState('low');
	const [done, setDone] = useState(false);
	const [dueDate, setDueDate] = useState('');
	const [createdAt, setCreatedAt] = useState(nowDate);
	const [updatedAt, setUpdatedAt] = useState(nowDate);

	const handleSubmitEditing = useAddRowCallback(
		TODO_TABLE,
		({
			nativeEvent: { id, text, done, priority, dueDate, createdAt, updatedAt },
		}: {
			nativeEvent: {
				id: string;
				text: string;
				done: boolean;
				priority: string;
				dueDate: string;
				createdAt: string;
				updatedAt: string;
			};
		}) => {
			// if (!text.trim()) {
			// 	return Alert.alert('Error', 'Please enter a todo');
			// }
			setText('');

			return {
				[ID_CELL]: id,
				[TEXT_CELL]: text,
				[DONE_CELL]: done,
				[PRIORITY_CELL]: priority,
				[DUE_DATE_CELL]: dueDate,
				[CREATED_AT_CELL]: createdAt,
				[UPDATED_AT_CELL]: updatedAt,
			};
		}
	);
	return (
		<View>
			<TextInput
				value={text}
				onChangeText={(text) => setText(text)}
				placeholder='What do you want to do today?'
				style={styles.input}
			/>

			<TouchableOpacity
				style={{
					backgroundColor: '#333',
					padding: 10,
					borderRadius: 5,
					margin: 10,
				}}
				onPress={() =>
					handleSubmitEditing({
						nativeEvent: {
							id: itemId,
							text,
							done,
							priority,
							dueDate,
							createdAt,
							updatedAt,
						},
					})
				}
			>
				<Text style={{}}>Add</Text>
			</TouchableOpacity>
		</View>
	);
};

// A single todo component, either 'not done' or 'done': press to toggle.

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
			<StatusBar style={theme.dark ? 'light' : 'dark'} />
			<PaperProvider>
				<Portal>
					<Stack.Screen
						options={{
							headerShown: true,
							headerTitle: '',
							headerStyle: {
								backgroundColor: theme.colors.surface,
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
								backgroundColor: theme.dark ? '#000' : '#fff',
							},
						]}
					>
						<FlatList
							data={useSortedRowIds(TODO_TABLE, DONE_CELL)}
							renderItem={renderItem}
							style={styles.todos}
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
	todos: {
		flex: 1,
		marginTop: 10,
	},

	input: {
		borderColor: '#999',
		borderRadius: 8,
		borderWidth: 2,
		flex: 0,
		height: 64,
		marginTop: 16,
		padding: 16,
		fontSize: 20,
	},

	clearTodos: {
		margin: 16,
		flex: 0,
		textAlign: 'center',
		fontSize: 16,
	},

	icon: {
		color: '#fff',
		fontSize: 20,
	},
	searchContainer: {
		paddingHorizontal: 20,
		marginTop: 10,
	},
	searchInput: {
		backgroundColor: '#222',
		color: '#fff',
		paddingHorizontal: 15,
		paddingVertical: 15,
		borderRadius: 8,
		marginBottom: 10,
	},
	scrollView: {
		paddingHorizontal: 20,
		marginTop: 10,
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

	navItem: {
		alignItems: 'center',
	},
	navText: {
		color: 'gray',
		fontSize: 14,
	},
	navActive: {
		color: 'yellow',
	},
});
