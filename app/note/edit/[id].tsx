import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { LoadingIndicator } from '../../../components/ui/LoadingIndicator';
import { getStore } from '../../../store';
import { Note } from '../../../store/models';
import { TABLES } from '../../../lib/Tables';
import NoteEditor from '../../../components/notes/NoteEditor';

export default function EditNoteScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const store = getStore();
	const theme = useTheme();

	const [note, setNote] = useState<Note | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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
				setError('Note not found');
				return;
			}

			setNote({ ...noteData, id });
		} catch (error) {
			console.error('Error fetching note:', error);
			setError('Failed to load note');
		} finally {
			setLoading(false);
		}
	}, [store, id]);

	const handleUpdateNote = (formData: any) => {
		if (!store || !note) {
			setError('Store is not initialized or note not found');
			return;
		}

		try {
			const notesTable = store.getTable(TABLES.NOTES);
			if (!notesTable) {
				setError('Notes table not found');
				return;
			}

			notesTable[id] = {
				...note,
				title: formData.title,
				content: formData.content,
				tags: formData.tags || [],
				updatedAt: new Date().toISOString(),
			};

			// Navigate back to the note detail
			router.back();
		} catch (error) {
			console.error('Error updating note:', error);
			setError('Failed to update note');
		}
	};

	if (loading) {
		return <LoadingIndicator message='Loading note...' />;
	}

	if (error) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<Card style={styles.card}>
				<Card.Content>
					<Text variant='titleLarge' style={styles.title}>
						Edit Note
					</Text>

					{error && <Text style={styles.errorText}>{error}</Text>}

					{note && <NoteEditor note={note} onSave={handleUpdateNote} />}
				</Card.Content>
			</Card>
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
	title: {
		fontWeight: 'bold',
		marginBottom: 16,
	},
	errorText: {
		color: 'red',
		marginBottom: 16,
	},
});
