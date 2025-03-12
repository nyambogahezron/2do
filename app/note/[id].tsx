import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
	Text,
	Button,
	Card,
	Chip,
	useTheme,
	IconButton,
} from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
// import { TABLES, Note } from '../../src/models/schema';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { formatDateTime } from '../../utils/dateUtils';
import RenderHtml from 'react-native-render-html';
import { Dimensions } from 'react-native';
import { getStore } from '../../store';
import { Note } from '../../store/models';
import { TABLES } from '../../lib/Tables';

export default function NoteDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const store = getStore();
	const theme = useTheme();
	const { width } = Dimensions.get('window');

	const [note, setNote] = useState<Note | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!store || !id) {
			setLoading(false);
			return;
		}

		try {
			const notesTable = store.getTable(TABLES.NOTES);
			if (!notesTable) {
				router.back();
				return;
			}

			const noteData = notesTable[id] as Note | undefined;

			if (!noteData) {
				Alert.alert('Error', 'Note not found');
				router.back();
				return;
			}

			setNote({ ...noteData, id });
		} catch (error) {
			console.error('Error fetching note:', error);
			Alert.alert('Error', 'Failed to load note');
		} finally {
			setLoading(false);
		}
	}, [store, id]);

	const handleDelete = () => {
		Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Delete',
				onPress: () => {
					if (!store) return;

					try {
						const notesTable = store.getTable(TABLES.NOTES);
						if (!notesTable) return;

						delete notesTable[id];
						router.back();
					} catch (error) {
						console.error('Error deleting note:', error);
						Alert.alert('Error', 'Failed to delete note');
					}
				},
				style: 'destructive',
			},
		]);
	};

	const handleEdit = () => {
		router.push(`/note/edit/${id}`);
	};

	if (loading) {
		return <LoadingIndicator message='Loading note...' />;
	}

	if (!note) {
		return (
			<View style={styles.container}>
				<Text>Note not found</Text>
				<Button mode='contained' onPress={() => router.back()}>
					Go Back
				</Button>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<Card style={styles.card}>
				<Card.Content>
					<View style={styles.headerRow}>
						<Text variant='headlineMedium' style={styles.title}>
							{note.title}
						</Text>

						<View style={styles.actions}>
							<IconButton icon='pencil' size={20} onPress={handleEdit} />
							<IconButton
								icon='delete'
								size={20}
								iconColor={theme.colors.error}
								onPress={handleDelete}
							/>
						</View>
					</View>

					<View style={styles.tagsContainer}>
						{note.tags &&
							note.tags.map((tag, index) => (
								<Chip key={index} style={styles.tag}>
									{tag}
								</Chip>
							))}
					</View>

					<View style={styles.contentContainer}>
						{note.content && (
							<RenderHtml
								contentWidth={width - 64}
								source={{ html: note.content }}
							/>
						)}
					</View>

					<Text style={styles.dateInfo}>
						Created: {formatDateTime(note.createdAt)}
					</Text>
					<Text style={styles.dateInfo}>
						Last Updated: {formatDateTime(note.updatedAt)}
					</Text>
				</Card.Content>
			</Card>

			<Button
				mode='outlined'
				style={styles.backButton}
				onPress={() => router.back()}
			>
				Back to Notes
			</Button>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	card: {
		marginBottom: 16,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	title: {
		flex: 1,
		fontWeight: 'bold',
	},
	actions: {
		flexDirection: 'row',
	},
	tagsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 8,
		marginBottom: 16,
	},
	tag: {
		marginRight: 8,
		marginBottom: 8,
	},
	contentContainer: {
		marginBottom: 16,
	},
	dateInfo: {
		fontSize: 12,
		color: '#666',
		marginTop: 4,
	},
	backButton: {
		marginTop: 24,
	},
});
