import { priorityColors } from '@/lib/utils';
import { Circle, CircleCheckBig } from 'lucide-react-native';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	Dimensions,
} from 'react-native';
import {
	useDelRowCallback,
	useRow,
	useSetCellCallback,
} from 'tinybase/ui-react';

const TODO_TABLE = 'todo';
const DONE_CELL = 'done';

const width = Dimensions.get('window').width;

export default function TodoItem({ id }: { id: string }) {
	const {
		id: todoId,
		text,
		done,
		priority,
		dueDate,
		createdAt,
		updatedAt,
	} = useRow(TODO_TABLE, id) as {
		id: string;
		text: string;
		done: boolean;
		priority: 'low' | 'medium' | 'high';
		dueDate: string;
		createdAt: string;
		updatedAt: string;
	};
	const handlePress = useSetCellCallback(
		TODO_TABLE,
		id,
		DONE_CELL,
		() => (done) => !done
	);
	const handleDelete = useDelRowCallback(TODO_TABLE, id);
	const color = priorityColors[priority as 'low' | 'medium' | 'high'];

	//show due date month/day when curren year is same as due date year
	const currentDate = new Date(); // 1/1/2022 12:00:00
	const currentYear = currentDate.getFullYear(); // 2022
	const dueDateYear = new Date(dueDate).getFullYear();

	const getDueDate = () => {
		if (currentYear === dueDateYear && dueDate !== null) {
			return new Date(dueDate).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
			});
		}
		if (currentYear !== dueDateYear && dueDate !== null) {
			return new Date(dueDate).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
		}

		if (dueDate === null || dueDate === '' || dueDate === undefined) {
			return '';
		}
	};
	const showDueDate = getDueDate();

	return (
		<View style={styles.container}>
			{/* toggle icon  */}
			<TouchableOpacity onPress={handlePress} style={styles.iconsWrapper}>
				{done ? (
					<CircleCheckBig style={styles.icon} size={25} />
				) : (
					<Circle style={styles.icon} size={25} />
				)}
			</TouchableOpacity>

			<TouchableOpacity key={id} style={styles.todo}>
				<Text style={[styles.todoText, done ? styles.done : null]}>{text}</Text>

				<View style={styles.action}>
					{!done && (
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
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: '#f9f9f9',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: width - 20,
		paddingVertical: 16,
		paddingHorizontal: 8,
		borderRadius: 8,
		marginBottom: 5,
		marginHorizontal: 'auto',
		height: 80,
	},
	iconsWrapper: {
		flexDirection: 'row',
	},
	icon: {
		marginRight: 8,
		marginLeft: 3,
		color: '#000',
	},
	todos: {
		marginTop: -10,
	},
	todo: {
		flex: 1,
		marginLeft: 8,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		width: '100%',
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
		color: '#a9a9a9',
	},
	priorityWrapper: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
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
		color: '#a9a9a9',
	},
	todoText: {
		fontSize: 20,
	},
});
