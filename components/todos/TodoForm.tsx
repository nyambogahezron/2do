import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
	TextInput,
	Button,
	HelperText,
	Subheading,
	RadioButton,
	Text,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { validateTodoForm } from '@/utils/validation';
import { Todo } from '@/app/(tabs)';
import useGenerateId from '@/utils/generateId';
import { useAddRowCallback } from 'tinybase/ui-react';
import { useTheme } from '@/context/ThemeContext';

const TODO_TABLE = 'todo';
const ID_CELL = 'id';
const TEXT_CELL = 'text';
const DONE_CELL = 'done';
const PRIORITY_CELL = 'priority';
const DUE_DATE_CELL = 'dueDate';
const CREATED_AT_CELL = 'createdAt';
const UPDATED_AT_CELL = 'updatedAt';

type TodoFormProps = {
	initialData?: Partial<Todo>;
	onCancel: () => void;
};

export default function TodoForm({ initialData, onCancel }: TodoFormProps) {
	const { themeClrs } = useTheme();
	const nowDate = new Date().toISOString();
	const itemId = useGenerateId();

	const [title, setTitle] = useState(initialData?.text || '');
	const [priority, setPriority] = useState<Todo['priority']>(
		initialData?.priority || 'medium'
	);
	const [dueDate, setDueDate] = useState<Date | null>(
		initialData?.dueDate ? new Date(initialData.dueDate) : null
	);
	const [text, setText] = useState('');
	const [done, setDone] = useState(false);
	const [createdAt, setCreatedAt] = useState(nowDate);
	const [updatedAt, setUpdatedAt] = useState(nowDate);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

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

	const handleSubmit = () => {
		const errors = validateTodoForm({ title });

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			return;
		}

		// If the form is valid, submit the data
		handleSubmitEditing({
			nativeEvent: {
				id: itemId,
				text: title,
				done,
				priority,
				dueDate: dueDate?.toISOString() || '',
				createdAt,
				updatedAt,
			},
		});

		// create the todo
		onCancel();
		setTitle('');
		setPriority('medium');
		setDueDate(null);
	};

	const handleDateChange = (event: any, selectedDate?: Date) => {
		setShowDatePicker(false);
		if (selectedDate) {
			setDueDate(selectedDate);
		}
	};

	return (
		<View
			style={[styles.container, { backgroundColor: themeClrs.colors.card }]}
		>
			<TextInput
				label='Title'
				value={title}
				onChangeText={(text) => {
					setTitle(text);
					if (formErrors.title) {
						const newErrors = { ...formErrors };
						delete newErrors.title;
						setFormErrors(newErrors);
					}
				}}
				mode='outlined'
				error={!!formErrors.title}
				style={[
					styles.input,
					{
						backgroundColor: themeClrs.colors.surface,
						color: themeClrs.colors.text,
					},
				]}
				placeholderTextColor={themeClrs.colors.text}
			/>
			{/* Show the error message if the title is invalid */}
			{formErrors.title && (
				<HelperText type='error' visible={!!formErrors.title}>
					{formErrors.title}
				</HelperText>
			)}

			<Subheading
				style={[styles.sectionTitle, { color: themeClrs.colors.text }]}
			>
				Priority
			</Subheading>
			<View style={styles.priorityContainer}>
				<View style={styles.priorityOption}>
					<RadioButton
						color={themeClrs.colors.onBackground}
						value='low'
						status={priority === 'low' ? 'checked' : 'unchecked'}
						onPress={() => setPriority('low')}
					/>
					<Text style={{ color: themeClrs.colors.text }}>Low</Text>
				</View>

				<View style={styles.priorityOption}>
					<RadioButton
						value='medium'
						status={priority === 'medium' ? 'checked' : 'unchecked'}
						onPress={() => setPriority('medium')}
					/>
					<Text style={{ color: themeClrs.colors.text }}>Medium</Text>
				</View>

				<View style={styles.priorityOption}>
					<RadioButton
						value='high'
						status={priority === 'high' ? 'checked' : 'unchecked'}
						onPress={() => setPriority('high')}
					/>
					<Text style={{ color: themeClrs.colors.text }}>High</Text>
				</View>
			</View>

			<Subheading
				style={[styles.sectionTitle, { color: themeClrs.colors.text }]}
			>
				Due Date
			</Subheading>
			<Button
				mode='outlined'
				onPress={() => setShowDatePicker(true)}
				style={styles.dateButton}
			>
				{dueDate ? dueDate.toLocaleDateString() : 'Set due date'}
			</Button>
			{dueDate && (
				<Button
					mode='text'
					onPress={() => setDueDate(null)}
					style={styles.clearButton}
				>
					Clear date
				</Button>
			)}

			{showDatePicker && (
				<DateTimePicker
					value={dueDate || new Date()}
					mode='date'
					display='default'
					onChange={handleDateChange}
				/>
			)}

			<View style={styles.buttonsContainer}>
				<Button mode='contained' onPress={handleSubmit} style={styles.button}>
					{initialData?.id ? 'Update' : 'Create'}
				</Button>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 'auto',
		width: '100%',
		borderRadius: 8,
		padding: 16,
	},
	input: {
		marginBottom: 16,
	},
	sectionTitle: {
		marginBottom: 8,
	},
	priorityContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	priorityOption: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	dateButton: {
		marginBottom: 8,
	},
	clearButton: {
		marginBottom: 16,
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 16,
	},
	button: {
		flex: 1,
		marginHorizontal: 4,
	},
});
