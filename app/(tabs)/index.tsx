import { router } from 'expo-router';
import { CircleCheckBig, List, Plus, Settings } from 'lucide-react-native';
import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	FlatList,
} from 'react-native';
import {
	useAddRowCallback,
	useDelTableCallback,
	useHasTable,
	useRow,
	useSetCellCallback,
	useSortedRowIds,
} from 'tinybase/ui-react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from 'react-native-paper';

// The TinyBase table contains the todos, with 'text' and 'done' cells.
const TODO_TABLE = 'todo';
const TEXT_CELL = 'text';
const DONE_CELL = 'done';

// Emojis to decorate each todo.
const NOT_DONE_ICON = String.fromCodePoint(0x1f7e0);
const DONE_ICON = String.fromCodePoint(0x2705);

// The text input component to add a new todo.
const NewTodo = () => {
	const [text, setText] = useState('');
	const handleSubmitEditing = useAddRowCallback(
		TODO_TABLE,
		({ nativeEvent: { text } }: { nativeEvent: { text: string } }) => {
			setText('');
			return { [TEXT_CELL]: text, [DONE_CELL]: false };
		}
	);
	return (
		<TextInput
			value={text}
			onChangeText={(text) => setText(text)}
			onSubmitEditing={handleSubmitEditing}
			placeholder='What do you want to do today?'
			style={styles.input}
		/>
	);
};

// A single todo component, either 'not done' or 'done': press to toggle.
const Todo = ({ id }: { id: any }) => {
	const { text, done } = useRow(TODO_TABLE, id);
	const handlePress = useSetCellCallback(
		TODO_TABLE,
		id,
		DONE_CELL,
		() => (done) => !done
	);
	return (
		<TouchableOpacity
			key={id}
			onPress={handlePress}
			style={[styles.todo, done ? styles.done : null]}
		>
			<Text style={styles.todoText}>
				{done ? DONE_ICON : NOT_DONE_ICON} {text}
			</Text>
		</TouchableOpacity>
	);
};

// A list component to show all the todos.
const Todos = () => {
	const renderItem = ({ item: id }: any) => <Todo id={id} />;
	return (
		<FlatList
			data={useSortedRowIds(TODO_TABLE, DONE_CELL)}
			renderItem={renderItem}
			style={styles.todos}
		/>
	);
};

// A button component to delete all the todos, only shows when there are some.
const ClearTodos = () => {
	const handlePress = useDelTableCallback(TODO_TABLE);
	return useHasTable(TODO_TABLE) ? (
		<TouchableOpacity onPress={handlePress}>
			<Text style={styles.clearTodos}>Clear all</Text>
		</TouchableOpacity>
	) : null;
};

export default function NotepadScreen() {
	const [menuVisible, setMenuVisible] = React.useState(false);
	const theme = useTheme();
	return (
		<SafeAreaProvider>
			<StatusBar style={theme.dark ? 'light' : 'dark'} />
			<SafeAreaView
				style={[
					styles.container,
					{
						backgroundColor: theme.dark ? '#000' : '#fff',
					},
				]}
			>
				{/* Header */}
				<View style={styles.header}>
					<Text
						style={[
							styles.headerText,
							{
								color: theme.colors.primary,
							},
						]}
					>
						Todos
					</Text>
					<View style={styles.iconContainer}>
						<TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
							<List color={theme.dark ? '#fff' : '#000'} size={22} />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => router.push('settings')}>
							<Settings color={theme.dark ? '#fff' : '#000'} size={22} />
						</TouchableOpacity>
					</View>
				</View>

				{menuVisible && (
					<View style={styles.popupMenu}>
						<TouchableOpacity style={styles.menuItem}>
							<Text style={[styles.menuText, styles.menuActive]}>
								☰ List View
							</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.menuItem}>
							<Text style={styles.menuText}>▭ Card View</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.menuItem}>
							<Text style={styles.menuText}>▦ Grid View</Text>
						</TouchableOpacity>
					</View>
				)}

				{/* Search Bar */}
				{useHasTable(TODO_TABLE) && (
					<View style={styles.searchContainer}>
						<TextInput
							style={styles.searchInput}
							placeholder='Search'
							placeholderTextColor='gray'
						/>
					</View>
				)}

				{!useHasTable(TODO_TABLE) && (
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: -100,
						}}
					>
						<CircleCheckBig size={80} color={'#555'} />
						<Text style={{ color: '#444', margin: 10 }}>No data</Text>
					</View>
				)}

				<NewTodo />
				<Todos />
				<ClearTodos />

				{/* Floating Add Button */}
				<TouchableOpacity style={styles.addButton}>
					<Plus color={'yellow'} />
				</TouchableOpacity>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 10,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingBottom: 10,
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
	todos: {
		flex: 1,
		marginTop: 16,
	},
	todo: {
		borderRadius: 8,
		marginBottom: 16,
		padding: 16,
		backgroundColor: '#ffd',
	},
	done: {
		backgroundColor: '#dfd',
	},
	todoText: {
		fontSize: 20,
	},
	clearTodos: {
		margin: 16,
		flex: 0,
		textAlign: 'center',
		fontSize: 16,
	},
	headerText: {
		color: '#fff',
		fontSize: 28,
		fontWeight: 'bold',
	},
	iconContainer: {
		flexDirection: 'row',
		gap: 20,
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
	popupMenu: {
		position: 'absolute',
		top: 50,
		right: 50,
		backgroundColor: '#222',
		padding: 10,
		borderRadius: 10,
		shadowColor: '#000',
		shadowOpacity: 0.3,
		shadowRadius: 5,
		shadowOffset: { width: 0, height: 2 },
		zIndex: 10,
	},
	menuItem: {
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	menuText: {
		color: '#fff',
		fontSize: 16,
	},
	menuActive: {
		color: 'yellow',
	},
});
