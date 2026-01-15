import * as React from 'react';
import { StyleSheet, View } from 'react-native'
import { Modal, IconButton, Text } from 'react-native-paper';
import TodoForm from './TodoForm'
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
			visible={visible}
			onDismiss={hideModal}
			contentContainerStyle={[
				styles.containerStyle,
				{ backgroundColor: themeClrs.colors.surface },
			]}
			style={styles.modal}
		>
			<View style={styles.sheetContent}>
				{/* Header with title and close button */}
				<View style={styles.header}>
					<Text style={[styles.title, { color: themeClrs.colors.text }]}>
						Edit Task
					</Text>
					<IconButton
						icon='close'
						iconColor={themeClrs.colors.textMuted}
						size={20}
						onPress={hideModal}
						style={styles.closeButton}
					/>
				</View>

				{/* Todo form in update mode */}
				<TodoForm
					initialData={todoData}
					onCancel={hideModal}
					isEditing={true}
				/>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	containerStyle: {
		backgroundColor: 'white',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 40, // Extra padding for bottom safe area
		width: '100%',
	},
	sheetContent: {
		width: '100%',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		letterSpacing: 0.5,
	},
	closeButton: {
		margin: 0,
	},
}) 