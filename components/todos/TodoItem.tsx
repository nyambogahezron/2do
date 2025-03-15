import { useTheme } from '@/context/ThemeContext';
import { priorityColors } from '@/lib/utils';
import { Circle, CircleCheckBig } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useDeleteTodo, useTodo, useToggleTodoDone } from '@/store/todo';
import SwipeableRow from '../ui/SwipeableRow';
import React from 'react';

interface TodoItemProps {
	id: string;
	onEdit?: (todoData: any) => void;
}

export default function TodoItem({ id, onEdit }: TodoItemProps) {
	const { themeClrs } = useTheme();
	const todoData = useTodo(id);

	const { id: todoId, text, done, priority, dueDate } = todoData;

	const handlePress = useToggleTodoDone(id);
	const handleDelete = useDeleteTodo(id);
	const color = priorityColors[priority as 'low' | 'medium' | 'high'];

	//show due date month/day when curren year is same as due date year
	const currentDate = new Date(); // 1/1/2022 12:00:00
	const currentYear = currentDate.getFullYear(); // 2022
	const dueDateYear = new Date(dueDate).getFullYear();

	const getDueDate = () => {
		if (!dueDate) {
			return '';
		}

		if (currentYear === dueDateYear && dueDate) {
			return new Date(dueDate).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
			});
		}
		if (currentYear !== dueDateYear && dueDate) {
			return new Date(dueDate).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
		}
	};
	const showDueDate = getDueDate();

	const styles = createStyles(themeClrs);

	// Handle edit when todo item is pressed
	const handleEditPress = () => {
		if (onEdit) {
			onEdit(todoData);
		}
	};

	return (
		<SwipeableRow onSwipe={handleDelete} key={id}>
			<View style={styles.container}>
				{/* toggle icon  */}
				<TouchableOpacity onPress={handlePress} style={styles.iconsWrapper}>
					{done ? (
						<CircleCheckBig style={[styles.icon, styles.doneIcon]} size={22} />
					) : (
						<Circle style={styles.icon} size={22} />
					)}
				</TouchableOpacity>

				<TouchableOpacity
					key={id}
					style={styles.todo}
					onPress={handleEditPress}
					activeOpacity={0.7}
				>
					<Text style={[styles.todoText, done ? styles.done : null]}>
						{text}
					</Text>

					<View style={styles.action}>
						{!done && showDueDate && (
							<>
								<Text style={styles.date}>{showDueDate}</Text>

								<View style={styles.priorityWrapper}>
									<View
										style={[styles.priorityCircle, { backgroundColor: color }]}
									/>
								</View>
							</>
						)}
					</View>
				</TouchableOpacity>
			</View>
		</SwipeableRow>
	);
}

const createStyles = (themeClrs: any) =>
	StyleSheet.create({
		container: {
			flex: 1,
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
			minHeight: 65,
			backgroundColor: themeClrs.colors.surface,
			alignItems: 'center',
			justifyContent: 'flex-start',
			overflow: 'hidden',
			borderRadius: 8,
		},
		iconsWrapper: {
			flexDirection: 'row',
		},
		icon: {
			marginRight: 8,
			marginLeft: 10,
			color: themeClrs.colors.text,
		},

		todo: {
			flex: 1,
			marginLeft: 8,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			width: '100%',
			paddingRight: 10,
		},
		action: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		date: {
			marginTop: 8,
			fontSize: 12,
			color: themeClrs.colors.text,
		},
		priorityWrapper: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'flex-end',
			alignSelf: 'flex-end',
		},
		priorityCircle: {
			width: 10,
			height: 10,
			borderRadius: 5,
			backgroundColor: '#f00',
			marginRight: 4,
		},

		done: {
			textDecorationStyle: 'solid',
			textDecorationLine: 'line-through',
			color: themeClrs.colors.accent,
			opacity: 0.8,
		},
		doneIcon: {
			color: themeClrs.colors.accent,
			opacity: 0.8,
		},
		todoText: {
			fontSize: 18,
			color: themeClrs.colors.text,
		},
	});
