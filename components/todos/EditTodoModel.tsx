import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Modal, IconButton, Text } from 'react-native-paper';
import TodoForm from './TodoForm';
import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Todo } from '@/store/todo';

type EditTodoModelProps = {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	todoData: Todo; 
};

export default function EditTodoModel({ visible, setVisible, todoData }: EditTodoModelProps) {
	const hideModal = () => setVisible(false);
	const { themeClrs } = useTheme();

	return (
		<Modal
			style={styles.modal}
			visible={visible}
			onDismiss={hideModal}
			contentContainerStyle={[
				styles.containerStyle,
				{ backgroundColor: themeClrs.colors.card },
			]}
		>
			{/* Header with title and close button */}
			<View style={styles.header}>
				<Text style={[styles.title, { color: themeClrs.colors.text }]}>
					Edit Todo
				</Text>
				<IconButton
					style={styles.closeButton}
					icon='close'
					onPress={hideModal}
				/>
			</View>
			
			{/* Todo form in update mode */}
			<TodoForm 
				initialData={todoData}
				onCancel={hideModal} 
				isEditing={true}
			/>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modal: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		width: '100%',
		padding: 20,
	},
	containerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 15,
		top: -20,
		width: '100%',
		borderRadius: 10,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		marginBottom: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginLeft: 10,
	},
	closeView: {
		display: 'flex',
		alignItems: 'flex-end',
		width: '100%',
	},
	closeButton: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 40,
		height: 40,
		borderRadius: 25,
	},
}); 