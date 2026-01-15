import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { priorityColors } from '@/lib/utils';
import { Bell, Circle, CircleCheckBig } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useDeleteTodo, useTodo, useToggleTodoDone, type Todo } from '@/store/todo';
import SwipeableRow from '../ui/SwipeableRow';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated'

interface TodoItemProps {
	id: string
	onEdit?: (todoData: Todo) => void
	index?: number
}

export default function TodoItem({ id, onEdit, index = 0 }: TodoItemProps) {
	// Early return if no id
	if (!id) {
		return null
	}

	const { themeClrs } = useTheme()
	const { todo: todoData, loading } = useTodo(id)
	const navigation = useNavigation<NavigationProp<any>>()

	const toggleTodoDone = useToggleTodoDone(id)
	const { deleteTodo } = useDeleteTodo()

	const handlePress = async () => {
		if (todoData) {
			await toggleTodoDone()
		}
	}

	const handleDelete = async () => {
		try {
			await deleteTodo(id)
		} catch (error) {
			console.error('Error deleting todo:', error)
		}
	}

	// Don't render anything while loading or if no data
	if (loading || !todoData) {
		return null
	}

	const { text, done, priority, dueDate } = todoData
	const color = priorityColors[priority as 'low' | 'medium' | 'high']

	//show due date month/day when curren year is same as due date year
	const currentDate = new Date() // 1/1/2022 12:00:00
	const currentYear = currentDate.getFullYear() // 2022
	const dueDateYear = dueDate
		? new Date(dueDate).getFullYear()
		: new Date().getFullYear()

	const getDueDate = () => {
		if (!dueDate) {
			return ''
		}

		if (currentYear === dueDateYear && dueDate) {
			return new Date(dueDate).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
			})
		}
		if (currentYear !== dueDateYear && dueDate) {
			return new Date(dueDate).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			})
		}
	}
	const showDueDate = getDueDate()

	const styles = createStyles(themeClrs)

	// Handle edit when todo item is pressed
	const handleEditPress = () => {
		navigation.navigate('EditTodo', { id: todoData.id })
	}

	return (
		<Animated.View
			entering={FadeInDown.delay(index * 50).springify()}
			layout={Layout.springify()}
			style={{ marginBottom: 12 }}
		>
			<SwipeableRow onSwipe={handleDelete}>
				<View style={styles.container}>
					{/* toggle icon  */}
					<TouchableOpacity onPress={handlePress} style={styles.iconsWrapper}>
						{done ? (
							<CircleCheckBig
								style={[styles.icon, styles.doneIcon]}
								size={24}
							/>
						) : (
							<Circle style={styles.icon} color={color} size={24} />
						)}
					</TouchableOpacity>

					<TouchableOpacity
						key={id}
						style={styles.todo}
						onPress={handleEditPress}
						activeOpacity={0.7}
					>
						<Text
							style={[styles.todoText, done ? styles.done : null]}
							numberOfLines={2}
						>
							{text}
						</Text>

						<View style={styles.action}>
							{priority !== 'low' && (
								<View
									style={[
										styles.priorityBadge,
										{ backgroundColor: color + '20' },
									]}
								>
									<Text style={[styles.priorityText, { color: color }]}>
										{priority}
									</Text>
								</View>
							)}
							{!done && showDueDate && (
								<View style={styles.dateContainer}>
									<Bell color={themeClrs.colors.textGrey} size={12} />
									<Text style={styles.date}>{showDueDate}</Text>
								</View>
							)}
						</View>
					</TouchableOpacity>
				</View>
			</SwipeableRow>
		</Animated.View>
	)
}

const createStyles = (themeClrs: ReturnType<typeof useTheme>['themeClrs']) =>
	StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: 'row',
			width: '100%',
			minHeight: 72,
			backgroundColor: themeClrs.colors.surface,
			alignItems: 'center',
			justifyContent: 'flex-start',
			overflow: 'hidden',
			borderRadius: 16,
			paddingHorizontal: 8,
			borderWidth: 1,
			borderColor: themeClrs.colors.border,
			// Shadow for iOS
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.05,
			shadowRadius: 3.84,
			// Elevation for Android
			elevation: 2,
		},
		iconsWrapper: {
			padding: 8,
			justifyContent: 'center',
			alignItems: 'center',
		},
		icon: {
			color: themeClrs.colors.textGrey,
		},
		todo: {
			flex: 1,
			marginLeft: 4,
			paddingVertical: 12,
			paddingRight: 12,
			justifyContent: 'center',
		},
		action: {
			flexDirection: 'row',
			marginTop: 6,
			gap: 8,
			alignItems: 'center',
		},
		dateContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 4,
		},
		date: {
			fontSize: 12,
			color: themeClrs.colors.textMuted,
			fontWeight: '500',
		},
		priorityBadge: {
			paddingHorizontal: 6,
			paddingVertical: 2,
			borderRadius: 4,
		},
		priorityText: {
			fontSize: 10,
			fontWeight: 'bold',
			textTransform: 'uppercase',
		},
		done: {
			textDecorationLine: 'line-through',
			color: themeClrs.colors.textMuted,
			opacity: 0.6,
		},
		doneIcon: {
			color: themeClrs.colors.primary, // Checkmark uses primary color when done
		},
		todoText: {
			fontSize: 16,
			color: themeClrs.colors.text,
			fontWeight: '500',
			lineHeight: 22,
		},
	})
