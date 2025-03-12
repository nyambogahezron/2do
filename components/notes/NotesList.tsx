import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { formatDate } from '../../utils/dateUtils';
import { Note } from '../../store/models';

interface NotesListProps {
	notes: Note[];
	onPress: (id: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onPress }) => {
	const theme = useTheme();

	const renderNoteItem = ({ item }: { item: Note }) => {
		// Strip HTML tags for preview
		const contentPreview =
			item.content
				.replace(/<[^>]*>/g, ' ')
				.replace(/\s+/g, ' ')
				.trim()
				.substring(0, 100) + (item.content.length > 100 ? '...' : '');

		return (
			<Card style={styles.card} onPress={() => onPress(item.id)}>
				<Card.Content>
					<Text style={styles.noteTitle} numberOfLines={1}>
						{item.title}
					</Text>

					<Text style={styles.notePreview} numberOfLines={2}>
						{contentPreview}
					</Text>

					<View style={styles.noteFooter}>
						<Text style={styles.noteDate}>{formatDate(item.updatedAt)}</Text>

						{item.tags && item.tags.length > 0 && (
							<View style={styles.tagsContainer}>
								{item.tags.slice(0, 2).map((tag, index) => (
									<Chip
										key={index}
										style={styles.tag}
										textStyle={styles.tagText}
										compact
									>
										{tag}
									</Chip>
								))}
								{item.tags.length > 2 && (
									<Text style={styles.moreTags}>+{item.tags.length - 2}</Text>
								)}
							</View>
						)}
					</View>
				</Card.Content>
			</Card>
		);
	};

	return (
		<FlatList
			data={notes}
			renderItem={renderNoteItem}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.listContainer}
			ItemSeparatorComponent={() => <View style={styles.separator} />}
		/>
	);
};

const styles = StyleSheet.create({
	listContainer: {
		paddingBottom: 80, // Space for FAB
	},
	card: {
		marginBottom: 8,
	},
	noteTitle: {
		fontSize: 18,
		fontWeight: '500',
		marginBottom: 4,
	},
	notePreview: {
		fontSize: 14,
		opacity: 0.7,
		marginBottom: 8,
	},
	noteFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	noteDate: {
		fontSize: 12,
		opacity: 0.6,
	},
	tagsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	tag: {
		marginLeft: 4,
		height: 24,
	},
	tagText: {
		fontSize: 10,
	},
	moreTags: {
		fontSize: 10,
		opacity: 0.7,
		marginLeft: 4,
	},
	separator: {
		height: 8,
	},
});

export default NotesList;
